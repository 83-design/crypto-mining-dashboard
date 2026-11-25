import { create } from 'zustand';
import { MiningTelemetry, MiningMode, ActiveTab } from '../types/mining';

interface MiningStore {
  telemetry: MiningTelemetry;
  activeTab: ActiveTab;
  isWalletOpen: boolean;
  isCloudModalOpen: boolean;
  isPairingModalOpen: boolean;
  wsConnected: boolean;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setWalletOpen: (open: boolean) => void;
  setCloudModalOpen: (open: boolean) => void;
  setPairingModalOpen: (open: boolean) => void;
  toggleMining: () => void;
  setMode: (mode: MiningMode) => void;
  activateCloudTier: (tierId: string) => void;
  cancelCloudTier: (tierId: string) => void;
  claimDailyBonus: () => void;
  linkDevice: (name: string, type: 'desktop' | 'mobile' | 'server', cpu: string, hashrate: number) => void;
  removeDevice: (id: string) => void;
  requestPayout: (amount: number, address: string) => Promise<{ success: boolean; error?: string }>;
  syncTelemetry: (data: Partial<MiningTelemetry>) => void;
}

const DEFAULT_STATE: MiningTelemetry = {
  isMining: true,
  sessionSeconds: 767, // 12m 47s matching reference screenshot
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
  linkedDevices: [
    {
      id: 'dev-local',
      name: 'This Device (PWA Native)',
      type: 'mobile',
      cpu: 'Apple A17 Pro (6 Cores / Neural Engine)',
      cores: 6,
      hashrateMH: 6.2,
      temp: 36,
      status: 'online',
      sharesAccepted: 48,
      sharesRejected: 0,
      isCurrentDevice: true
    },
    {
      id: 'dev-desktop-1',
      name: 'Home Rig — Ryzen 9 7950X',
      type: 'desktop',
      cpu: 'AMD Ryzen 9 7950X 16-Core Processor',
      cores: 32,
      hashrateMH: 48.5,
      temp: 54,
      status: 'online',
      sharesAccepted: 412,
      sharesRejected: 2,
      isCurrentDevice: false
    },
    {
      id: 'dev-phone-2',
      name: 'Spare Pixel 7 Pro',
      type: 'mobile',
      cpu: 'Google Tensor G2 (Eco Cluster)',
      cores: 8,
      hashrateMH: 4.8,
      temp: 37,
      status: 'online',
      sharesAccepted: 39,
      sharesRejected: 1,
      isCurrentDevice: false
    }
  ],
  cloudNodes: [
    {
      id: 'tier-starter',
      name: 'Starter Cloud Node',
      badge: 'Popular',
      hashrateMH: 50,
      priceMonthly: 4.99,
      description: 'Dedicated cloud CPU thread in Iceland datacenters (100% renewable geothermal power).',
      features: ['+50 MH/s Instant Power', 'Zero Phone Battery Drain', '99.98% Guaranteed Uptime', 'VerusHash 2.2b Optimized'],
      active: false,
      nodeCount: 0
    },
    {
      id: 'tier-pro',
      name: 'Pro Cluster Rig',
      badge: 'High Yield',
      hashrateMH: 250,
      priceMonthly: 19.99,
      description: 'High-density EPYC 9654 Zen4 virtualized cluster. Best hashrate-to-price ratio for daily VRSC yields.',
      features: ['+250 MH/s Dedicated Power', 'Auto Profit-Switching Pool', 'Priority Stratum Tunneling', 'VIP Discord Rig Telemetry'],
      active: false,
      nodeCount: 0
    },
    {
      id: 'tier-enterprise',
      name: 'Enterprise Farm Node',
      badge: 'Maximum Beast',
      hashrateMH: 1000,
      priceMonthly: 59.99,
      description: 'Massive 1.0 GH/s bare-metal instance designed for serious miners. Direct Stratum proxy connection.',
      features: ['+1,000 MH/s (1.0 GH/s) Beast', 'Private Stratum Port (Zero Latency)', 'Automated Instant Daily Auto-Payout', 'Dedicated Mining DevOps Support'],
      active: false,
      nodeCount: 0
    }
  ],
  recentPayouts: [
    {
      id: 'tx-8941',
      coin: 'VRSC',
      amount: 14.500,
      usdValue: 26.82,
      address: 'R9xLw4...9Kk2',
      status: 'completed',
      timestamp: '2 hours ago',
      txHash: '0x8f2a...c891'
    },
    {
      id: 'tx-8723',
      coin: 'VRSC',
      amount: 10.250,
      usdValue: 18.96,
      address: 'R9xLw4...9Kk2',
      status: 'completed',
      timestamp: 'Yesterday',
      txHash: '0x3e1d...910a'
    }
  ],
  dailyBonusAvailable: true,
  dailyBonusReward: 0.250,
  streakDays: 4,
};

let ws: WebSocket | null = null;

function sendWS(action: string, payload?: any) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ action, payload }));
  }
}

export const useMiningStore = create<MiningStore>((set, get) => ({
  telemetry: DEFAULT_STATE,
  activeTab: 'home',
  isWalletOpen: false,
  isCloudModalOpen: false,
  isPairingModalOpen: false,
  wsConnected: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setWalletOpen: (open) => set({ isWalletOpen: open }),
  setCloudModalOpen: (open) => set({ isCloudModalOpen: open }),
  setPairingModalOpen: (open) => set({ isPairingModalOpen: open }),

  syncTelemetry: (data) =>
    set((state) => ({
      telemetry: { ...state.telemetry, ...data },
    })),

  toggleMining: () => {
    const currentState = get().telemetry.isMining;
    const newState = !currentState;
    
    // Optimistic update
    set((state) => ({
      telemetry: {
        ...state.telemetry,
        isMining: newState,
        poolStatus: newState ? 'connected' : 'paused',
      },
    }));

    sendWS('TOGGLE_MINING', { state: newState });
  },

  setMode: (mode) => {
    set((state) => {
      const localHash = mode === 'turbo' ? 14.8 : 6.2;
      const targetTemp = mode === 'turbo' ? 49 : 36;
      return {
        telemetry: {
          ...state.telemetry,
          mode,
          deviceTemp: targetTemp,
          totalHashrateMH: +(state.telemetry.totalHashrateMH + (mode === 'turbo' ? 8.6 : -8.6)).toFixed(1),
        },
      };
    });
    sendWS('SET_MODE', { mode });
  },

  activateCloudTier: (tierId) => {
    set((state) => {
      const updatedNodes = state.telemetry.cloudNodes.map((tier) => {
        if (tier.id === tierId) {
          return { ...tier, active: true, nodeCount: tier.nodeCount + 1 };
        }
        return tier;
      });
      const selectedTier = state.telemetry.cloudNodes.find((t) => t.id === tierId);
      const addedHash = selectedTier ? selectedTier.hashrateMH : 0;
      const newTotal = state.telemetry.totalHashrateMH + addedHash;

      return {
        telemetry: {
          ...state.telemetry,
          cloudNodes: updatedNodes,
          totalHashrateMH: +newTotal.toFixed(1),
          formattedHashrate: newTotal >= 1000 ? `${(newTotal / 1000).toFixed(2)} GH/s` : `${newTotal.toFixed(1)} MH/s`,
        },
      };
    });
    sendWS('ACTIVATE_CLOUD', { tierId });
  },

  cancelCloudTier: (tierId) => {
    set((state) => {
      const updatedNodes = state.telemetry.cloudNodes.map((tier) => {
        if (tier.id === tierId) {
          return { ...tier, active: false, nodeCount: 0 };
        }
        return tier;
      });
      const selectedTier = state.telemetry.cloudNodes.find((t) => t.id === tierId);
      const subHash = selectedTier ? selectedTier.hashrateMH * selectedTier.nodeCount : 0;
      const newTotal = Math.max(6.2, state.telemetry.totalHashrateMH - subHash);

      return {
        telemetry: {
          ...state.telemetry,
          cloudNodes: updatedNodes,
          totalHashrateMH: +newTotal.toFixed(1),
          formattedHashrate: newTotal >= 1000 ? `${(newTotal / 1000).toFixed(2)} GH/s` : `${newTotal.toFixed(1)} MH/s`,
        },
      };
    });
    sendWS('CANCEL_CLOUD', { tierId });
  },

  claimDailyBonus: () => {
    const { telemetry } = get();
    if (!telemetry.dailyBonusAvailable) return;

    const reward = telemetry.dailyBonusReward;
    const newCoin = +(telemetry.balanceCoin + reward).toFixed(4);
    const newUsd = +(newCoin * telemetry.coinPriceUsd).toFixed(2);

    set((state) => ({
      telemetry: {
        ...state.telemetry,
        balanceCoin: newCoin,
        balanceUsd: newUsd,
        totalMined: +(state.telemetry.totalMined + reward).toFixed(4),
        dailyBonusAvailable: false,
        streakDays: state.telemetry.streakDays + 1,
      },
    }));

    sendWS('CLAIM_BONUS');
  },

  linkDevice: (name, type, cpu, hashrate) => {
    const newDev = {
      id: `dev-${Date.now()}`,
      name,
      type,
      cpu,
      cores: type === 'desktop' ? 16 : 8,
      hashrateMH: hashrate,
      temp: 42,
      status: 'online' as const,
      sharesAccepted: 1,
      sharesRejected: 0,
      isCurrentDevice: false,
    };

    set((state) => {
      const newTotal = +(state.telemetry.totalHashrateMH + hashrate).toFixed(1);
      return {
        telemetry: {
          ...state.telemetry,
          linkedDevices: [...state.telemetry.linkedDevices, newDev],
          totalHashrateMH: newTotal,
          formattedHashrate: newTotal >= 1000 ? `${(newTotal / 1000).toFixed(2)} GH/s` : `${newTotal.toFixed(1)} MH/s`,
        },
      };
    });

    sendWS('LINK_DEVICE', { name, type, cpu, hashrateMH: hashrate });
  },

  removeDevice: (id) => {
    set((state) => {
      const dev = state.telemetry.linkedDevices.find((d) => d.id === id);
      if (!dev || dev.isCurrentDevice) return state;
      const newTotal = Math.max(6.2, +(state.telemetry.totalHashrateMH - dev.hashrateMH).toFixed(1));
      return {
        telemetry: {
          ...state.telemetry,
          linkedDevices: state.telemetry.linkedDevices.filter((d) => d.id !== id),
          totalHashrateMH: newTotal,
          formattedHashrate: newTotal >= 1000 ? `${(newTotal / 1000).toFixed(2)} GH/s` : `${newTotal.toFixed(1)} MH/s`,
        },
      };
    });

    sendWS('REMOVE_DEVICE', { id });
  },

  requestPayout: async (amount, address) => {
    const { telemetry } = get();
    if (amount <= 0 || amount > telemetry.balanceCoin) {
      return { success: false, error: 'Insufficient balance' };
    }
    if (amount < 2.0) {
      return { success: false, error: 'Minimum payout threshold is 2.00 VRSC' };
    }

    const newCoin = +(telemetry.balanceCoin - amount).toFixed(4);
    const newUsd = +(newCoin * telemetry.coinPriceUsd).toFixed(2);

    const newTx = {
      id: `tx-${Date.now()}`,
      coin: 'VRSC' as const,
      amount,
      usdValue: +(amount * telemetry.coinPriceUsd).toFixed(2),
      address: address.slice(0, 6) + '...' + address.slice(-4),
      status: 'processing' as const,
      timestamp: 'Just now',
      txHash: '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6),
    };

    set((state) => ({
      telemetry: {
        ...state.telemetry,
        balanceCoin: newCoin,
        balanceUsd: newUsd,
        recentPayouts: [newTx, ...state.telemetry.recentPayouts],
      },
    }));

    sendWS('REQUEST_PAYOUT', { amount, address, coin: 'VRSC' });
    return { success: true };
  },
}));

// Initialize WebSocket connection with auto-reconnect & local ticker fallback
export function initWebSocket() {
  const wsUrl = `ws://${window.location.hostname}:5001`;

  try {
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      useMiningStore.setState({ wsConnected: true });
      console.log('Connected to Nexus Stratum Telemetry WS');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'TELEMETRY_UPDATE' && msg.payload) {
          useMiningStore.getState().syncTelemetry(msg.payload);
        }
      } catch (e) {
        console.error('Error parsing WS message:', e);
      }
    };

    ws.onclose = () => {
      useMiningStore.setState({ wsConnected: false });
      // Retry in 3 seconds
      setTimeout(initWebSocket, 3000);
    };

    ws.onerror = () => {
      ws?.close();
    };
  } catch (err) {
    console.warn('WS connection failed, running offline telemetry simulator mode.');
  }

  // Local fallback ticker in case backend is starting or offline
  setInterval(() => {
    const store = useMiningStore.getState();
    if (!store.wsConnected && store.telemetry.isMining) {
      const yieldTick = store.telemetry.totalHashrateMH * 0.000035;
      const newSec = store.telemetry.sessionSeconds + 1;
      const newYield = +(store.telemetry.sessionYield + yieldTick).toFixed(4);
      const newTotal = +(store.telemetry.totalMined + yieldTick).toFixed(4);
      const newCoin = +(store.telemetry.balanceCoin + yieldTick).toFixed(4);
      const newUsd = +(newCoin * store.telemetry.coinPriceUsd).toFixed(2);

      store.syncTelemetry({
        sessionSeconds: newSec,
        sessionYield: newYield,
        totalMined: newTotal,
        balanceCoin: newCoin,
        balanceUsd: newUsd,
      });
    }
  }, 1000);
}
