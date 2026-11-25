import { MiningTelemetry, MiningMode, DeviceRig, CloudNodeTier, PayoutTransaction } from './types.js';
import { INITIAL_DEVICES, CLOUD_TIERS, INITIAL_PAYOUTS } from './fleetManager.js';

export interface IStratumProxyClient {
  connect(poolUrl: string, port: number): Promise<boolean>;
  authorize(wallet: string, workerName: string): Promise<boolean>;
  submitShare(jobId: string, nonce: string, result: string): Promise<boolean>;
  onNewJob(callback: (job: unknown) => void): void;
}

export class MiningEngine implements IStratumProxyClient {
  private telemetry: MiningTelemetry;
  private intervalTimer: NodeJS.Timeout | null = null;
  private listeners: Set<(state: MiningTelemetry) => void> = new Set();

  constructor() {
    this.telemetry = {
      isMining: true,
      sessionSeconds: 767, // 12m 47s initially matching reference
      currentCoin: 'VRSC',
      coinSymbol: 'VRSC',
      coinPriceUsd: 1.85,
      totalHashrateMH: 14.8,
      formattedHashrate: '14.8 MH/s',
      deviceTemp: 36,
      batteryPercent: 94,
      mode: 'eco',
      autoThrottled: false,
      sessionYield: 0.0324,
      totalMined: 12.450,
      balanceUsd: 24.67,
      balanceCoin: 13.335,
      change24h: 12.4,
      poolUrl: 'stratum+tcp://eu.vipor.net:5040',
      poolStatus: 'connected',
      poolLatencyMs: 24,
      sharesAccepted: 499,
      sharesRejected: 3,
      linkedDevices: [...INITIAL_DEVICES],
      cloudNodes: [...CLOUD_TIERS],
      recentPayouts: [...INITIAL_PAYOUTS],
      dailyBonusAvailable: true,
      dailyBonusReward: 0.250,
      streakDays: 4,
    };

    this.recalculateTotalHashrate();
    this.startLoop();
  }

  // --- Stratum Proxy Interface Realization ---
  async connect(poolUrl: string, _port: number): Promise<boolean> {
    this.telemetry.poolUrl = poolUrl;
    this.telemetry.poolStatus = 'connected';
    return true;
  }

  async authorize(_wallet: string, _workerName: string): Promise<boolean> {
    return true;
  }

  async submitShare(_jobId: string, _nonce: string, _result: string): Promise<boolean> {
    const isAccepted = Math.random() > 0.02;
    if (isAccepted) {
      this.telemetry.sharesAccepted++;
    } else {
      this.telemetry.sharesRejected++;
    }
    return isAccepted;
  }

  onNewJob(_callback: (job: unknown) => void): void {
    // Stratum job dispatch hook
  }

  // --- Engine Logic & Tick Loop ---
  private startLoop() {
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => this.tick(), 1000);
  }

  private tick() {
    if (!this.telemetry.isMining) {
      // Natural cooling when paused
      if (this.telemetry.deviceTemp > 31) {
        this.telemetry.deviceTemp = Math.max(30, +(this.telemetry.deviceTemp - 0.2).toFixed(1));
      }
      this.notify();
      return;
    }

    this.telemetry.sessionSeconds++;

    // Temperature & thermal logic based on Mode
    if (this.telemetry.mode === 'eco') {
      // TikTok Safe Mode: stays cool around 35-37°C
      const targetTemp = 36 + (Math.random() * 0.8 - 0.4);
      this.telemetry.deviceTemp = +targetTemp.toFixed(1);
      this.telemetry.autoThrottled = false;
    } else {
      // Turbo Mode: heats up to 48-55°C
      if (this.telemetry.deviceTemp < 50) {
        this.telemetry.deviceTemp = +(this.telemetry.deviceTemp + 0.3).toFixed(1);
      } else {
        const jitter = (Math.random() * 1.2 - 0.6);
        this.telemetry.deviceTemp = +(50 + jitter).toFixed(1);
      }
    }

    // Hashrate calculation with slight natural fluctuation
    const baseHash = this.calculateBaseHashrate();
    const jitterFactor = 1 + (Math.sin(this.telemetry.sessionSeconds * 0.1) * 0.02);
    this.telemetry.totalHashrateMH = +(baseHash * jitterFactor).toFixed(1);
    this.telemetry.formattedHashrate = this.formatHashrate(this.telemetry.totalHashrateMH);

    // Yield generation rate:
    // Roughly 0.000045 VRSC per MH/s per second
    const yieldPerTick = (this.telemetry.totalHashrateMH * 0.000035);
    this.telemetry.sessionYield = +(this.telemetry.sessionYield + yieldPerTick).toFixed(4);
    this.telemetry.totalMined = +(this.telemetry.totalMined + yieldPerTick).toFixed(4);
    this.telemetry.balanceCoin = +(this.telemetry.balanceCoin + yieldPerTick).toFixed(4);
    this.telemetry.balanceUsd = +(this.telemetry.balanceCoin * this.telemetry.coinPriceUsd).toFixed(2);

    // Random accepted shares emulation
    if (Math.random() < 0.25) {
      this.telemetry.sharesAccepted++;
      this.telemetry.poolLatencyMs = Math.floor(20 + Math.random() * 12);
    }

    this.notify();
  }

  private calculateBaseHashrate(): number {
    // Local device hashrate
    const localDevice = this.telemetry.linkedDevices.find(d => d.isCurrentDevice);
    let localHash = 6.2;
    if (localDevice) {
      localHash = this.telemetry.mode === 'turbo' ? 14.8 : 6.2;
      localDevice.hashrateMH = localHash;
      localDevice.temp = this.telemetry.deviceTemp;
    }

    // Other online linked devices
    const linkedHash = this.telemetry.linkedDevices
      .filter(d => !d.isCurrentDevice && d.status === 'online')
      .reduce((sum, d) => sum + d.hashrateMH, 0);

    // Active cloud subscriptions
    const cloudHash = this.telemetry.cloudNodes
      .filter(c => c.active)
      .reduce((sum, c) => sum + (c.hashrateMH * c.nodeCount), 0);

    return localHash + linkedHash + cloudHash;
  }

  private recalculateTotalHashrate() {
    const total = this.calculateBaseHashrate();
    this.telemetry.totalHashrateMH = +total.toFixed(1);
    this.telemetry.formattedHashrate = this.formatHashrate(this.telemetry.totalHashrateMH);
  }

  private formatHashrate(mh: number): string {
    if (mh >= 1000) {
      return `${(mh / 1000).toFixed(2)} GH/s`;
    }
    return `${mh.toFixed(1)} MH/s`;
  }

  // --- Public Action Methods ---
  public toggleMining(forceState?: boolean): MiningTelemetry {
    this.telemetry.isMining = forceState !== undefined ? forceState : !this.telemetry.isMining;
    this.telemetry.poolStatus = this.telemetry.isMining ? 'connected' : 'paused';
    this.notify();
    return this.getState();
  }

  public setMode(mode: MiningMode): MiningTelemetry {
    this.telemetry.mode = mode;
    this.recalculateTotalHashrate();
    this.notify();
    return this.getState();
  }

  public activateCloudTier(tierId: string): MiningTelemetry {
    const tier = this.telemetry.cloudNodes.find(t => t.id === tierId);
    if (tier) {
      tier.active = true;
      tier.nodeCount = (tier.nodeCount || 0) + 1;
      tier.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      this.recalculateTotalHashrate();
      this.notify();
    }
    return this.getState();
  }

  public cancelCloudTier(tierId: string): MiningTelemetry {
    const tier = this.telemetry.cloudNodes.find(t => t.id === tierId);
    if (tier) {
      tier.active = false;
      tier.nodeCount = 0;
      this.recalculateTotalHashrate();
      this.notify();
    }
    return this.getState();
  }

  public linkNewDevice(name: string, type: 'desktop' | 'mobile' | 'server', cpu: string, hashrateMH: number): MiningTelemetry {
    const newDevice: DeviceRig = {
      id: `dev-${Date.now()}`,
      name,
      type,
      cpu,
      cores: type === 'desktop' ? 16 : 8,
      hashrateMH,
      temp: 42,
      status: 'online',
      sharesAccepted: 1,
      sharesRejected: 0,
      isCurrentDevice: false
    };
    this.telemetry.linkedDevices.push(newDevice);
    this.recalculateTotalHashrate();
    this.notify();
    return this.getState();
  }

  public removeDevice(id: string): MiningTelemetry {
    this.telemetry.linkedDevices = this.telemetry.linkedDevices.filter(d => d.id !== id || d.isCurrentDevice);
    this.recalculateTotalHashrate();
    this.notify();
    return this.getState();
  }

  public claimDailyBonus(): { success: boolean; amount: number; state: MiningTelemetry } {
    if (!this.telemetry.dailyBonusAvailable) {
      return { success: false, amount: 0, state: this.getState() };
    }
    const reward = this.telemetry.dailyBonusReward;
    this.telemetry.balanceCoin += reward;
    this.telemetry.totalMined += reward;
    this.telemetry.balanceUsd = +(this.telemetry.balanceCoin * this.telemetry.coinPriceUsd).toFixed(2);
    this.telemetry.dailyBonusAvailable = false;
    this.telemetry.streakDays += 1;
    this.notify();
    return { success: true, amount: reward, state: this.getState() };
  }

  public requestPayout(amount: number, address: string, coin: 'VRSC' | 'XMR' | 'USDT'): { success: boolean; error?: string; state: MiningTelemetry } {
    if (amount <= 0 || amount > this.telemetry.balanceCoin) {
      return { success: false, error: 'Insufficient balance', state: this.getState() };
    }
    if (amount < 2.0) {
      return { success: false, error: 'Minimum payout threshold is 2.00 VRSC', state: this.getState() };
    }

    this.telemetry.balanceCoin -= amount;
    this.telemetry.balanceUsd = +(this.telemetry.balanceCoin * this.telemetry.coinPriceUsd).toFixed(2);

    const newTx: PayoutTransaction = {
      id: `tx-${Date.now()}`,
      coin,
      amount,
      usdValue: +(amount * this.telemetry.coinPriceUsd).toFixed(2),
      address: address.slice(0, 6) + '...' + address.slice(-4),
      status: 'processing',
      timestamp: 'Just now',
      txHash: '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6)
    };

    this.telemetry.recentPayouts.unshift(newTx);
    this.notify();
    return { success: true, state: this.getState() };
  }

  public getState(): MiningTelemetry {
    return { ...this.telemetry };
  }

  public subscribe(listener: (state: MiningTelemetry) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }
}

export const miningEngine = new MiningEngine();
