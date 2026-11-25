export type MiningMode = 'eco' | 'turbo';

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

export interface CloudNodeTier {
  id: string;
  name: string;
  badge: string;
  hashrateMH: number;
  priceMonthly: number;
  description: string;
  features: string[];
  active: boolean;
  expiresAt?: string;
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
  currentCoin: 'VRSC' | 'XMR' | 'BTC';
  coinSymbol: string;
  coinPriceUsd: number;
  
  // Hashrate
  totalHashrateMH: number;
  formattedHashrate: string;
  
  // Health & Thermal
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
  
  // Pool stats
  poolUrl: string;
  poolStatus: 'connected' | 'reconnecting' | 'paused';
  poolLatencyMs: number;
  sharesAccepted: number;
  sharesRejected: number;
  
  // Fleets
  linkedDevices: DeviceRig[];
  cloudNodes: CloudNodeTier[];
  recentPayouts: PayoutTransaction[];
  
  // Daily bonus
  dailyBonusAvailable: boolean;
  dailyBonusReward: number;
  streakDays: number;
}
