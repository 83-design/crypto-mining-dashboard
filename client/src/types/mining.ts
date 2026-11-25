export type MiningMode = 'eco' | 'turbo';

export type WalletType = 'ton' | 'vrsc' | 'xmr' | 'usdt_ton';

export interface WalletConnection {
  id: string;
  type: WalletType;
  name: string;
  address: string;
  shortAddress: string;
  network: string;
  icon: string;
  balance: number;
  active: boolean;
}

export interface DeviceRig {
  id: string;
  name: string;
  type: 'local' | 'mobile' | 'desktop' | 'server';
  cpu: string;
  cores: number;
  hashrateMH: number;
  temp: number;
  status: 'online' | 'offline' | 'throttled';
  sharesAccepted: number;
  sharesRejected: number;
  isCurrentDevice?: boolean;
}

export interface CloudServerTier {
  id: string;
  name: string;
  badge: string;
  hashrateMH: number;
  hashrateDisplay: string;
  priceUsdt: number;
  description: string;
  features: string[];
  active: boolean;
  nodeCount: number;
}

export interface PayoutTransaction {
  id: string;
  coin: 'VRSC' | 'XMR' | 'USDT';
  amount: number;
  usdValue: number;
  address: string;
  status: 'completed' | 'processing' | 'pending';
  timestamp: string;
  txHash: string;
}

export interface MiningTelemetry {
  isMining: boolean;
  sessionSeconds: number;
  currentCoin: 'VRSC' | 'XMR';
  coinSymbol: string;
  coinPriceUsd: number;
  
  // Real compute metrics
  realHashrateHps: number;
  realHashrateDisplay: string;
  totalHashrateMH: number;
  formattedHashrate: string;
  activeThreads: number;
  
  // Health & Thermal (Eco Safe)
  deviceTemp: number;
  batteryPercent: number;
  mode: MiningMode;
  autoThrottled: boolean;
  
  // Earnings
  sessionYield: number;
  totalMined: number;
  balanceUsd: number;
  balanceCoin: number;
  change24h: number;
  
  // Pool stats & Stratum proxy
  stratumProxyUrl: string;
  poolUrl: string;
  poolStatus: 'connected' | 'reconnecting' | 'paused';
  poolLatencyMs: number;
  sharesAccepted: number;
  sharesRejected: number;
  
  // Fleet & Cloud
  linkedDevices: DeviceRig[];
  cloudNodes: CloudServerTier[];
  recentPayouts: PayoutTransaction[];
  
  // Referral bonus boost
  referralBoostPercent: number;
  hasClaimedBonus: boolean;
}

export type ActiveTab = 'home' | 'rigs' | 'rewards' | 'settings';
