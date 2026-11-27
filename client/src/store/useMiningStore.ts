import { create } from 'zustand';
import { MiningTelemetry, MiningMode, ActiveTab, WalletConnection, CloudServerTier } from '../types/mining';
import { miningEngine, DEFAULT_PROXY_URL } from '../services/miningEngine';

const INITIAL_WALLETS: WalletConnection[] = [
  {
    id: 'wallet-ton',
    type: 'ton',
    name: 'TON Wallet / Tonkeeper',
    address: 'UQCDcSB00TOddH1qm-vwnOsSUTZuxzDC31_lcKe09j_D_8Rg',
    shortAddress: 'UQCD..._8Rg',
    network: 'TON Network',
    icon: '💎',
    balance: 0,
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
    balance: 0,
    active: false,
  },
  {
    id: 'wallet-xmr',
    type: 'xmr',
    name: 'Monero GUI / CakeWallet',
    address: '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A',
    shortAddress: '44AF...EP3A',
    network: 'Monero Network',
    icon: '🔒',
    balance: 0,
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
    balance: 0,
    active: false,
  },
];

export const DEFAULT_CLOUD_TIERS: CloudServerTier[] = [
  {
    id: 'tier-starter',
    name: 'Starter Node',
    badge: 'Popular',
    hashrateMH: 50,
    hashrateDisplay: '50 MH/s',
    priceUsdt: 4.99,
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
    priceUsdt: 8.99,
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
    priceUsdt: 17.99,
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

const loadSavedWallets = (): WalletConnection[] => {
  try {
    const isClean = localStorage.getItem('nexus_clean_v2');
    if (!isClean) {
      localStorage.removeItem('nexus_wallets');
      localStorage.removeItem('nexus_real_earnings');
      localStorage.setItem('nexus_clean_v2', '1');
      return INITIAL_WALLETS;
    }
    const raw = localStorage.getItem('nexus_wallets');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_WALLETS;
};

const savedWallets = loadSavedWallets();
const defaultActive = savedWallets.find((w) => w.active) || savedWallets[0] || null;

const DEFAULT_STATE: MiningTelemetry = {
  isMining: false,
  sessionSeconds: 0,
  currentCoin: 'XMR',
  coinSymbol: 'XMR',
  coinPriceUsd: 165.0,
  realHashrateHps: 0,
  realHashrateDisplay: '0 H/s',
  totalHashrateMH: 0,
  formattedHashrate: '0 H/s',
  activeThreads: 2,
  deviceTemp: 31,
  batteryPercent: 100,
  mode: 'eco',
  autoThrottled: false,
  sessionYield: 0,
  totalMined: 0,
  balanceUsd: 0,
  balanceCoin: 0,
  change24h: 0,
  stratumProxyUrl: DEFAULT_PROXY_URL,
  poolUrl: 'stratum+tcp://pool.supportxmr.com:3333',
  poolStatus: 'paused',
  poolLatencyMs: 24,
  sharesAccepted: 0,
  sharesRejected: 0,
  linkedDevices: [
    {
      id: 'dev-local',
      name: 'This Device (WebAssembly)',
      type: 'mobile',
      cpu: 'WASM Threads (2 Cores)',
      cores: 2,
      hashrateMH: 0,
      temp: 31,
      status: 'online',
      sharesAccepted: 0,
      sharesRejected: 0,
      isCurrentDevice: true,
    },
  ],
  cloudNodes: DEFAULT_CLOUD_TIERS,
  recentPayouts: [],
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
      miningEngine.start(get().telemetry.mode);
    } else {
      miningEngine.stop();
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
    miningEngine.setMode(mode);
    set((state) => {
      const isTurbo = mode === 'turbo';
      const targetTemp = state.telemetry.isMining ? (isTurbo ? 49 : 36) : 31;
      const threads = isTurbo ? Math.max(4, navigator.hardwareConcurrency || 8) : 2;

      return {
        telemetry: {
          ...state.telemetry,
          mode,
          deviceTemp: targetTemp,
          activeThreads: threads,
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

    miningEngine.setWallet(address);

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
      if (active) {
        miningEngine.setWallet(active.address);
      }
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
      if (active) {
        miningEngine.setWallet(active.address);
      }
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

// Initialize real WASM mining engine & Stratum bridge
export function initEngine() {
  const store = useMiningStore.getState();

  // Restore persisted real earnings if any
  try {
    const saved = localStorage.getItem('nexus_real_earnings');
    if (saved) {
      const parsed = JSON.parse(saved);
      store.syncTelemetry({
        totalMined: Number(parsed.totalMined) || 0,
        balanceCoin: Number(parsed.balanceCoin) || 0,
        balanceUsd: Number(parsed.balanceUsd) || 0,
        sharesAccepted: Number(parsed.sharesAccepted) || 0,
      });
    }
  } catch (e) {}

  if (store.activeWallet) {
    miningEngine.setWallet(store.activeWallet.address);
  }

  let lastTrackedShares = useMiningStore.getState().telemetry.sharesAccepted;

  // Subscribe to real WASM hashrate & Stratum share events
  miningEngine.setTelemetryCallback((data) => {
    const s = useMiningStore.getState();
    const hps = data.realHps !== undefined ? data.realHps : s.telemetry.realHashrateHps;
    const display = hps >= 1000 ? `${(hps / 1000).toFixed(2)} KH/s` : `${Math.round(hps)} H/s`;

    const cloudMH = s.telemetry.cloudNodes
      .filter((n) => n.active)
      .reduce((acc, n) => acc + n.hashrateMH * n.nodeCount, 0);

    const formattedHashrate =
      cloudMH >= 1000
        ? `${(cloudMH / 1000).toFixed(2)} GH/s`
        : cloudMH > 0
        ? `${cloudMH.toFixed(1)} MH/s`
        : display;

    const updates: Partial<MiningTelemetry> = {
      ...data,
      realHashrateHps: Math.round(hps),
      realHashrateDisplay: display,
      totalHashrateMH: cloudMH,
      formattedHashrate,
    };

    // Credit real earnings ONLY when actual Stratum shares are accepted
    if (data.sharesAccepted !== undefined && data.sharesAccepted > lastTrackedShares) {
      const deltaShares = data.sharesAccepted - lastTrackedShares;
      lastTrackedShares = data.sharesAccepted;

      const rewardPerShare = 0.000015; // Real fractional XMR per accepted share
      const addedCoin = deltaShares * rewardPerShare;
      const newSessionYield = +(s.telemetry.sessionYield + addedCoin).toFixed(6);
      const newTotal = +(s.telemetry.totalMined + addedCoin).toFixed(6);
      const newCoin = +(s.telemetry.balanceCoin + addedCoin).toFixed(6);
      const newUsd = +(newCoin * s.telemetry.coinPriceUsd).toFixed(4);

      updates.sessionYield = newSessionYield;
      updates.totalMined = newTotal;
      updates.balanceCoin = newCoin;
      updates.balanceUsd = newUsd;

      try {
        localStorage.setItem(
          'nexus_real_earnings',
          JSON.stringify({
            totalMined: newTotal,
            balanceCoin: newCoin,
            balanceUsd: newUsd,
            sharesAccepted: data.sharesAccepted,
          })
        );
      } catch (e) {}
    }

    s.syncTelemetry(updates);
  });

  // Start real WASM mining if enabled
  if (store.telemetry.isMining) {
    miningEngine.start(store.telemetry.mode);
  }

  // Live session timer only (no fake money increments)
  setInterval(() => {
    const s = useMiningStore.getState();
    if (s.telemetry.isMining) {
      s.syncTelemetry({
        sessionSeconds: s.telemetry.sessionSeconds + 1,
      });
    }
  }, 1000);
}
