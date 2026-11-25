import { DeviceRig, CloudNodeTier, PayoutTransaction } from './types.js';

export const INITIAL_DEVICES: DeviceRig[] = [
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
];

export const CLOUD_TIERS: CloudNodeTier[] = [
  {
    id: 'tier-starter',
    name: 'Starter Cloud Node',
    badge: 'Popular',
    hashrateMH: 50,
    priceMonthly: 4.99,
    description: 'Entry-level dedicated cloud CPU thread in Iceland datacenters (100% renewable geothermal power).',
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
    description: 'High-density EPYC 9654 Zen4 virtualized cluster. Best hashrate-to-price ratio for daily VRSC / XMR yields.',
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
];

export const INITIAL_PAYOUTS: PayoutTransaction[] = [
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
];
