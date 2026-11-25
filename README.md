# Nexus Mining Dashboard & Multi-Device / Cloud Rig Management Suite

A high-velocity cross-platform crypto mining dashboard & cloud rig fleet management Web App / PWA engineered for CPU-friendly cryptocurrencies (VerusCoin VRSC / Monero XMR).

Strictly crafted to match the reference visual aesthetic: obsidian dark theme (`#05070B`), dark glassmorphic surfaces (`rgba(15, 20, 32, 0.75)`), royal-blue radial ambient glows (`#14388C` / `#2E7BFF`), and an interactive glowing mining core with 3D obsidian rock & metallic pickaxe.

---

## ⚡ Tech Stack & Architecture

- **Frontend**:
  - React 18 + TypeScript + Vite
  - Tailwind CSS with custom obsidian / electric neon design system
  - Framer Motion for smooth ring glows, transitions, and drawer modals
  - Lucide Icons & Canvas Confetti for daily streak celebrations
  - Zustand state store with real-time WebSocket synchronization & offline fallback ticker

- **Backend / Mining Engine**:
  - Node.js + Express + WebSockets (`ws`)
  - Clean `IStratumProxyClient` abstraction layer ready for real Stratum pool proxying (XMRig / ccminer VerusHash)
  - 1Hz live telemetry simulation engine with dynamic hashrate jitter, realistic thermal dynamics, dynamic shares validation, and real-time yield calculation

---

## 🚀 Key Features

1. **Centerpiece Hero**:
   - Circular glowing electric blue progress ring.
   - Dark 3D metallic pickaxe leaning on an obsidian rock with pulsating cyan mineral veins.
   - Interactive Start/Stop toggle with live session timer and yield badge (`⚡ +0.0324 VRSC`).

2. **Daily Bonus & Streak**:
   - 3D gift box wrapped in cyan ribbon with a neon base ring.
   - Interactive daily claim triggering confetti celebration and streak increments.

3. **Metrics Bar**:
   - 3-column glass container: **Hash Power**, **Battery / Temp** (Eco Safe with progress bar), and **Total Mined**.

4. **Performance Modes**:
   - **TikTok Safe Mode**: Uses efficiency cores, caps device temperature at 36-37°C so users can scroll TikTok without stutter or heat.
   - **Turbo Mode**: Unlocks all CPU cores for maximum MH/s yield.

5. **Fleet & Cloud Node Management (Rigs & Cloud tab)**:
   - **Linked Devices**: 1-click pairing command generator (`curl -sL https://nexus.mine/pair... | sh`) to link PCs, servers, or Android phones.
   - **Rent Cloud Servers**:
     - *Starter Cloud Node* (+50 MH/s - $4.99/mo)
     - *Pro Cluster Rig* (+250 MH/s - $19.99/mo)
     - *Enterprise Farm Node* (+1,000 MH/s - $59.99/mo)
     - Subscribing immediately adds hashrate to the user's total Hash Power and accelerates live balance yields.

6. **Wallet & Payouts**:
   - Live USD and coin balances (VRSC, XMR, USDT).
   - Address input, minimum payout threshold validation (2.00 VRSC), and transaction history ledger.

---

## 🛠️ Quickstart

### 1. Install Dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Run Development Servers
```bash
# Terminal 1 (Backend - Port 5001)
cd server && npm run dev

# Terminal 2 (Frontend - Port 5173)
cd client && npm run dev
```

Visit `http://localhost:5173/` in your browser (responsive mobile viewport: 390x844).
