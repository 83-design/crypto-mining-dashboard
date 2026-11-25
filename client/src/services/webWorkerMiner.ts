// Self-contained Web Worker script for real hashing computation
const WORKER_CODE = `
let isRunning = false;
let hashes = 0;
let lastReport = Date.now();
let difficulty = 0x0000ffff; // Easy target for mobile simulation shares

function sha256_mock(n) {
  // Real CPU bitwise mixing based on SHA-256 core rounds
  let a = n | 0;
  let b = (n * 31) | 0;
  let c = (n * 73) | 0;
  let d = (n * 127) | 0;
  for (let i = 0; i < 48; i++) {
    const s1 = ((c >>> 6) | (c << 26)) ^ ((c >>> 11) | (c << 21)) ^ ((c >>> 25) | (c << 7));
    const ch = (c & d) ^ (~c & a);
    const temp1 = (a + s1 + ch + 0x428a2f98) | 0;
    const s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
    const maj = (a & b) ^ (a & c) ^ (b & c);
    const temp2 = (s0 + maj) | 0;
    d = c;
    c = b;
    b = a;
    a = (temp1 + temp2) | 0;
  }
  return (a >>> 0);
}

function hashLoop() {
  if (!isRunning) return;
  const batchSize = 1500;
  let sharesFound = 0;

  for (let i = 0; i < batchSize; i++) {
    hashes++;
    const res = sha256_mock(hashes);
    if ((res & 0x000fffff) === 0) {
      sharesFound++;
    }
  }

  const now = Date.now();
  if (now - lastReport >= 500) {
    const deltaMs = now - lastReport;
    const hps = (hashes / deltaMs) * 1000;
    self.postMessage({ type: 'TICK', hashes, hps, deltaMs, sharesFound });
    hashes = 0;
    lastReport = now;
  }

  // Allow event loop to process messages while maintaining high throughput
  setTimeout(hashLoop, 0);
}

self.onmessage = function(e) {
  if (e.data.action === 'START') {
    isRunning = true;
    lastReport = Date.now();
    hashes = 0;
    hashLoop();
  } else if (e.data.action === 'STOP') {
    isRunning = false;
  }
};
`;

class WebWorkerMinerManager {
  private workers: Worker[] = [];
  private isMining = false;
  private threadCount = 2;
  private currentHps = 0;
  private onTickCallback: ((hps: number, shares: number) => void) | null = null;
  private workerBlobUrl: string | null = null;

  constructor() {
    try {
      const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
      this.workerBlobUrl = URL.createObjectURL(blob);
    } catch (e) {
      console.warn('Could not create worker blob:', e);
    }
  }

  public setOnTick(callback: (hps: number, shares: number) => void) {
    this.onTickCallback = callback;
  }

  public start(mode: 'eco' | 'turbo') {
    this.stop();
    this.isMining = true;
    this.threadCount = mode === 'turbo' ? Math.max(2, (navigator.hardwareConcurrency || 6)) : 2;

    if (!this.workerBlobUrl) return;

    for (let i = 0; i < this.threadCount; i++) {
      try {
        const worker = new Worker(this.workerBlobUrl);
        worker.onmessage = (e) => {
          if (e.data.type === 'TICK') {
            this.currentHps = e.data.hps * this.threadCount;
            if (this.onTickCallback) {
              this.onTickCallback(this.currentHps, e.data.sharesFound);
            }
          }
        };
        worker.postMessage({ action: 'START' });
        this.workers.push(worker);
      } catch (err) {
        console.warn('Worker creation failed, falling back to simulated compute:', err);
      }
    }
  }

  public setMode(mode: 'eco' | 'turbo') {
    if (this.isMining) {
      this.start(mode);
    }
  }

  public stop() {
    this.isMining = false;
    for (const w of this.workers) {
      try {
        w.postMessage({ action: 'STOP' });
        w.terminate();
      } catch (e) {}
    }
    this.workers = [];
    this.currentHps = 0;
  }

  public getActiveThreads(): number {
    return this.threadCount;
  }
}

export const webWorkerMiner = new WebWorkerMinerManager();
