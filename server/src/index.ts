import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { miningEngine } from './miningEngine.js';

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

// Track connected WebSocket clients
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);
  // Send initial state immediately
  ws.send(JSON.stringify({ type: 'TELEMETRY_UPDATE', payload: miningEngine.getState() }));

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      handleClientMessage(ws, data);
    } catch (err) {
      console.error('Failed to parse WS message:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

function handleClientMessage(ws: WebSocket, data: { action: string; payload?: any }) {
  let updatedState;
  switch (data.action) {
    case 'TOGGLE_MINING':
      updatedState = miningEngine.toggleMining(data.payload?.state);
      break;
    case 'SET_MODE':
      updatedState = miningEngine.setMode(data.payload?.mode);
      break;
    case 'ACTIVATE_CLOUD':
      updatedState = miningEngine.activateCloudTier(data.payload?.tierId);
      break;
    case 'CANCEL_CLOUD':
      updatedState = miningEngine.cancelCloudTier(data.payload?.tierId);
      break;
    case 'CLAIM_BONUS':
      const res = miningEngine.claimDailyBonus();
      ws.send(JSON.stringify({ type: 'BONUS_CLAIMED', payload: res }));
      updatedState = res.state;
      break;
    case 'LINK_DEVICE':
      updatedState = miningEngine.linkNewDevice(
        data.payload?.name || 'Linked Rig',
        data.payload?.type || 'desktop',
        data.payload?.cpu || 'Multi-Core Processor',
        data.payload?.hashrateMH || 25.0
      );
      break;
    case 'REMOVE_DEVICE':
      updatedState = miningEngine.removeDevice(data.payload?.id);
      break;
    case 'REQUEST_PAYOUT':
      const payoutRes = miningEngine.requestPayout(
        data.payload?.amount,
        data.payload?.address,
        data.payload?.coin || 'VRSC'
      );
      ws.send(JSON.stringify({ type: 'PAYOUT_RESULT', payload: payoutRes }));
      updatedState = payoutRes.state;
      break;
    default:
      break;
  }

  if (updatedState) {
    broadcastState(updatedState);
  }
}

function broadcastState(state: any) {
  const message = JSON.stringify({ type: 'TELEMETRY_UPDATE', payload: state });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

// Push ticks to all clients
miningEngine.subscribe((state) => {
  broadcastState(state);
});

// REST API Endpoints
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/telemetry', (_req, res) => {
  res.json(miningEngine.getState());
});

app.post('/api/mining/toggle', (req, res) => {
  const state = miningEngine.toggleMining(req.body.state);
  res.json(state);
});

app.post('/api/mining/mode', (req, res) => {
  const state = miningEngine.setMode(req.body.mode);
  res.json(state);
});

app.post('/api/cloud/activate', (req, res) => {
  const state = miningEngine.activateCloudTier(req.body.tierId);
  res.json(state);
});

app.post('/api/cloud/cancel', (req, res) => {
  const state = miningEngine.cancelCloudTier(req.body.tierId);
  res.json(state);
});

app.post('/api/rewards/claim', (_req, res) => {
  const result = miningEngine.claimDailyBonus();
  res.json(result);
});

app.post('/api/wallet/payout', (req, res) => {
  const { amount, address, coin } = req.body;
  const result = miningEngine.requestPayout(amount, address, coin);
  res.json(result);
});

server.listen(port, () => {
  console.log(`Mining Telemetry Engine & Stratum Proxy running on port ${port}`);
});
