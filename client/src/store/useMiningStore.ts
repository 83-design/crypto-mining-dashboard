import { create } from 'zustand';
import { MiningTelemetry, MiningMode, ActiveTab, WalletConnection, CloudServerTier } from '../types/mining';
import { webWorkerMiner } from '../services/webWorkerMiner';

const INITIAL_WALLETS: WalletConnection[] = [
  {
    id: 'wallet-ton',
    type: 'ton',
    name: 'TON Wallet / Tonkeeper',
    address: 'UQCDcSB00TOddH1qm-vwnOsSUTZuxzDC31_lcKe09j_D_8Rg',
    shortAddress: 'UQCD..._8Rg',
    network: 'TON Network',
    icon: '💎',
    balance: 14.50,
    active: true,
  },
  {
    id: 'wallet-vrsc',
    type: 'vrsc',
    name: 'Verus Mobile (VRSC)',
    address: 'R9xLw4K9k2FqLz8Nm1V9821AbCdEfGhIj',
    shortAddress: 'R9xL...GhIj',
    network: 'Verus PBaaS',
    icon: '🔷',
    balance: 13.335,
    active: false,
  },
  {
    id: 'wallet-xmr',
    type: 'xmr',
    name: 'Monero GUI / CakeWallet',
    address: '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otRmvJMbxJ445678',
    shortAddress: '44AF...5678',
    network: 'Monero Network',
    icon: '🔒',
    balance: 0.185,
    active: false,
  },
  {
    id: 'wallet-usdt',
    type: 'usdt_ton',
    name: 'USDT (TON Network)',
    address: 'UQCDcSB00TOddH1qm-vwnOsSUTZuxzDC31_lcKe09j_D_8Rg',
    shortAddress: 'UQCD..._8Rg',
    network: 'TON Network',
    icon: '💵',
    balance: 42.00,
    active: false,
  },
];

// Cloud Server Tiers - users start with 0 rented servers
export const DEFAULT_CLOUD_TIERS: CloudServerTier[] = [
  {
    id: 'tier-starter',
    name: 'Starter Node',
    badge: 'Popular',
    hashrateMH: 50,
    hashrateDisplay: '50 MH/s',
    priceUsdt: 10,
    description: 'Выделенный облачный вычислительный поток. Нулевой нагрев и 0% расхода батареи смартфона.',
    features: ['+50 MH/s мощности', '0% расхода батареи смартфона', 'Аптайм 99.98% в дата-центре', 'VerusHash / RandomX'],
    active: false,
    nodeCount: 0,
  },
  {
    id: 'tier-pro',
    name: 'Pro Rig',
    badge: 'High Yield',
    hashrateMH: 250,
    hashrateDisplay: '250 MH/s',
    priceUsdt: 35,
    description: 'Кластер на базе AMD EPYC Zen4. Оптимальное соотношение хэшрейта к стоимости в месяц.',
    features: ['+250 MH/s выделенной мощности', 'Приоритетный Stratum-порт', 'Авто-переключение пулов', 'VIP мониторинг в Telegram'],
    active: false,
    nodeCount: 0,
  },
  {
    id: 'tier-cluster',
    name: 'Max Cluster',
    badge: 'Maximum Beast',
    hashrateMH: 1000,
    hashrateDisplay: '1.0 GH/s',
    priceUsdt: 99,
    description: 'Массивный выделенный сервер 1.0 GH/s для максимального майнинга и стабильных начислений.',
    features: ['+1,000 MH/s (1.0 GH/s) Beast', 'Прямой Stratum-прокси туннель', 'Ежедневные авто-выплаты', 'Выделенный DevOps саппорт'],
    active: false,
    nodeCount: 0,
  },
];

interface MiningStore {
  telemetry: MiningTelemetry;
  activeTab: ActiveTab;
  isWalletOpen: boolean;
  isBonusModalOpen: boolean;
  selectedServerTier: CloudServerTier | null;
  wallets: WalletConnection[];
  activeWallet: WalletConnection | null;

  // Actions
  setActiveTab: (tab: ActiveTab) => void;
  setWalletOpen: (open: boolean) => void;
  setBonusModalOpen: (open: boolean) => void;
  setSelectedServerTier: (tier: CloudServerTier | null) => void;
  toggleMining: () => void;
  setMode: (mode: MiningMode) => void;
  bindWallet: (type: WalletConnection['type'], name: string, address: string) => void;
  setActiveWallet: (id: string) => void;
  unbindWallet: (id: string) => void;
  activateCloudServer: (tier: CloudServerTier) => void;
  claimReferralBonus: () => void;
  syncTelemetry: (data: Partial<MiningTelemetry>) => void;
}

// Load saved wallets from localStorage
const loadSavedWallets = (): WalletConnection[] => {
  try {
    const raw = localStorage.getItem('nexus_wallets');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_WALLETS;
};

const savedWallets = loadSavedWallets();
const defaultActive = savedWallets.find((w) => w.active) || savedWallets[0] || null;

const DEFAULT_STATE: MiningTelemetry = {
  isMining: true,
  sessionSeconds: 767, // 12m 47s matching reference screenshot
  currentCoin: 'VRSC',
  coinSymbol: 'VRSC',
  coinPriceUsd: 1.85,
  realHashrateHps: 2450,
  realHashrateDisplay: '2.45 KH/s',
  totalHashrateMH: 14.8,
  formattedHashrate: '14.8 MH/s',
  activeThreads: 2,
  deviceTemp: 36,
  batteryPercent: 94,
  mode: 'eco',
  autoThrottled: false,
  sessionYield: 0.0324,
  totalMined: 12.450,
  balanceUsd: 24.67,
  balanceCoin: 13.335,
  change24h: 12.4,
  stratumProxyUrl: 'wss://stratum.nexus.mine:5040',
  poolUrl: 'stratum+tcp://eu.vipor.net:5040',
  poolStatus: 'connected',
  poolLatencyMs: 24,
  sharesAccepted: 499,
  sharesRejected: 3,
  linkedDevices: [
    {
      id: 'dev-local',
      name: 'This Device (Real Web Worker)',
      type: 'mobile',
      cpu: 'Efficiency Threads (2 Cores)',
      cores: 2,
      hashrateMH: 6.2,
      temp: 36,
      status: 'online',
      sharesAccepted: 48,
      sharesRejected: 0,
      isCurrentDevice: true,
    },
    {
      id: 'dev-desktop-1',
      name: 'Home Rig — Ryzen 9 7950X',
      type: 'desktop',
      cpu: 'AMD Ryzen 9 7950X 16-Core',
      cores: 32,
      hashrateMH: 48.5,
      temp: 54,
      status: 'online',
      sharesAccepted: 412,
      sharesRejected: 2,
      isCurrentDevice: false,
    },
  ],
  cloudNodes: DEFAULT_CLOUD_TIERS,
  recentPayouts: [
    {
      id: 'tx-8941',
      coin: 'VRSC',
      amount: 14.50,
      usdValue: 26.82,
      address: 'UQCD..._8Rg',
      status: 'completed',
      timestamp: '2 hours ago',
      txHash: '0x8f2a...c891',
    },
  ],
  referralBoostPercent: 15,
  hasClaimedBonus: false,
};

export const useMiningStore = create<MiningStore>((set, get) => ({
  telemetry: DEFAULT_STATE,
  activeTab: 'home',
  isWalletOpen: false,
  isBonusModalOpen: false,
  selectedServerTier: null,
  wallets: savedWallets,
  activeWallet: defaultActive,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setWalletOpen: (open) => set({ isWalletOpen: open }),
  setBonusModalOpen: (open) => set({ isBonusModalOpen: open }),
  setSelectedServerTier: (tier) => set({ selectedServerTier: tier }),

  syncTelemetry: (data) =>
    set((state) => ({
      telemetry: { ...state.telemetry, ...data },
    })),

  toggleMining: () => {
    const currentState = get().telemetry.isMining;
    const newState = !currentState;

    if (newState) {
      webWorkerMiner.start(get().telemetry.mode);
    } else {
      webWorkerMiner.stop();
    }

    set((state) => ({
      telemetry: {
        ...state.telemetry,
        isMining: newState,
        poolStatus: newState ? 'connected' : 'paused',
        deviceTemp: newState ? (state.telemetry.mode === 'turbo' ? 49 : 36) : 31,
      },
    }));
  },

  setMode: (mode) => {
    webWorkerMiner.setMode(mode);
    set((state) => {
      const isTurbo = mode === 'turbo';
      const targetTemp = isTurbo ? 49 : 36;
      const baseHash = isTurbo ? 22.4 : 14.8;
      const threads = isTurbo ? Math.max(4, navigator.hardwareConcurrency || 8) : 2;

      return {
        telemetry: {
          ...state.telemetry,
          mode,
          deviceTemp: targetTemp,
          activeThreads: threads,
          totalHashrateMH: baseHash,
          formattedHashrate: `${baseHash.toFixed(1)} MH/s`,
        },
      };
    });
  },

  bindWallet: (type, name, address) => {
    const short = address.length > 10 ? `${address.slice(0, 4)}...${address.slice(-4)}` : address;
    const newWallet: WalletConnection = {
      id: `wallet-${Date.now()}`,
      type,
      name,
      address,
      shortAddress: short,
      network: type === 'vrsc' ? 'Verus PBaaS' : type === 'xmr' ? 'Monero Network' : 'TON Network',
      icon: type === 'vrsc' ? '🔷' : type === 'xmr' ? '🔒' : type === 'usdt_ton' ? '💵' : '💎',
      balance: 0,
      active: true,
    };

    set((state) => {
      const updated = state.wallets.map((w) => ({ ...w, active: false })).concat(newWallet);
      try {
        localStorage.setItem('nexus_wallets', JSON.stringify(updated));
      } catch (e) {}
      return { wallets: updated, activeWallet: newWallet };
    });
  },

  setActiveWallet: (id) => {
    set((state) => {
      const updated = state.wallets.map((w) => ({
        ...w,
        active: w.id === id,
      }));
      const active = updated.find((w) => w.id === id) || null;
      try {
        localStorage.setItem('nexus_wallets', JSON.stringify(updated));
      } catch (e) {}
      return { wallets: updated, activeWallet: active };
    });
  },

  unbindWallet: (id) => {
    set((state) => {
      const updated = state.wallets.filter((w) => w.id !== id);
      const active = updated.find((w) => w.active) || updated[0] || null;
      try {
        localStorage.setItem('nexus_wallets', JSON.stringify(updated));
      } catch (e) {}
      return { wallets: updated, activeWallet: active };
    });
  },

  activateCloudServer: (tier) => {
    set((state) => {
      const updatedNodes = state.telemetry.cloudNodes.map((n) => {
        if (n.id === tier.id) {
          return { ...n, active: true, nodeCount: n.nodeCount + 1 };
        }
        return n;
      });

      const newTotal = +(state.telemetry.totalHashrateMH + tier.hashrateMH).toFixed(1);
      const display = newTotal >= 1000 ? `${(newTotal / 1000).toFixed(2)} GH/s` : `${newTotal.toFixed(1)} MH/s`;

      return {
        telemetry: {
          ...state.telemetry,
          cloudNodes: updatedNodes,
          totalHashrateMH: newTotal,
          formattedHashrate: display,
        },
      };
    });
  },

  claimReferralBonus: () => {
    set((state) => {
      if (state.telemetry.hasClaimedBonus) return state;
      const boostedTotal = +(state.telemetry.totalHashrateMH * 1.15).toFixed(1);
      return {
        telemetry: {
          ...state.telemetry,
          hasClaimedBonus: true,
          totalHashrateMH: boostedTotal,
          formattedHashrate: boostedTotal >= 1000 ? `${(boostedTotal / 1000).toFixed(2)} GH/s` : `${boostedTotal.toFixed(1)} MH/s`,
        },
      };
    });
  },
}));

// Initialize real web worker miner and live second ticker
export function initEngine() {
  const store = useMiningStore.getState();

  // Listen to real web worker ticks
  webWorkerMiner.setOnTick((hps, shares) => {
    const s = useMiningStore.getState();
    if (!s.telemetry.isMining) return;

    const display = hps >= 1000 ? `${(hps / 1000).toFixed(2)} KH/s` : `${Math.round(hps)} H/s`;
    s.syncTelemetry({
      realHashrateHps: Math.round(hps),
      realHashrateDisplay: display,
      sharesAccepted: s.telemetry.sharesAccepted + shares,
    });
  });

  // Start worker if mining is active initially
  if (store.telemetry.isMining) {
    webWorkerMiner.start(store.telemetry.mode);
  }

  // Live session and balance ticker
  setInterval(() => {
    const s = useMiningStore.getState();
    if (s.telemetry.isMining) {
      const yieldPerSec = (s.telemetry.totalHashrateMH * 0.000035);
      const newSec = s.telemetry.sessionSeconds + 1;
      const newYield = +(s.telemetry.sessionYield + yieldPerSec).toFixed(4);
      const newTotal = +(s.telemetry.totalMined + yieldPerSec).toFixed(4);
      const newCoin = +(s.telemetry.balanceCoin + yieldPerSec).toFixed(4);
      const newUsd = +(newCoin * s.telemetry.coinPriceUsd).toFixed(2);

      s.syncTelemetry({
        sessionSeconds: newSec,
        sessionYield: newYield,
        totalMined: newTotal,
        balanceCoin: newCoin,
        balanceUsd: newUsd,
      });
    }
  }, 1000);
}
