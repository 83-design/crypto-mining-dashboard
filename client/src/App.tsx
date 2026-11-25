import React, { useEffect } from 'react';
import { useMiningStore, initWebSocket } from './store/useMiningStore';
import { Header } from './components/Header';
import { MiningRingHero } from './components/MiningRingHero';
import { SessionYield } from './components/SessionYield';
import { BonusCard } from './components/BonusCard';
import { MetricsGrid } from './components/MetricsGrid';
import { BottomNav } from './components/BottomNav';
import { RigsCloudView } from './components/RigsCloudModal';
import { RewardsView } from './components/RewardsModal';
import { SettingsView } from './components/SettingsModal';
import { WalletModal } from './components/WalletModal';

export const App: React.FC = () => {
  const { activeTab } = useMiningStore();

  useEffect(() => {
    initWebSocket();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#030508] flex items-center justify-center p-0 sm:p-4">
      {/* 
        Mobile Bezel Frame Container:
        Matches exact reference aspect ratio (390 x 844 px) on desktop,
        with 100% full-screen responsive fit on mobile devices.
      */}
      <main className="relative w-full max-w-[420px] h-[100dvh] sm:h-[870px] bg-[#05070B] sm:rounded-[44px] overflow-hidden flex flex-col justify-between shadow-[0_20px_80px_rgba(0,0,0,0.95)] sm:border sm:border-[#1E293B]/60 select-none">
        
        {/* Subtle Radial Royal-Blue Ambient Glows in Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full bg-[#14388C]/20 blur-[80px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-[#2E7BFF]/10 blur-[90px] pointer-events-none -z-10" />

        {/* Top Native Status Bar (9:41, Signal, Wifi, Battery) */}
        <div className="w-full flex items-center justify-between px-7 pt-3.5 pb-1 text-white text-[14px] font-semibold tracking-tight z-20 flex-shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Cellular signal bars */}
            <svg className="w-4 h-3 text-white fill-current" viewBox="0 0 17 12">
              <rect x="0" y="8" width="3" height="4" rx="0.5" />
              <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
              <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" />
              <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
            </svg>
            {/* Wifi icon */}
            <svg className="w-4 h-3.5 text-white fill-current" viewBox="0 0 16 12">
              <path d="M8 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4.2-3.2a6.002 6.002 0 0 1 8.4 0 .75.75 0 0 0 1.05-1.07 7.502 7.502 0 0 0-10.5 0 .75.75 0 0 0 1.05 1.07zm-2.1-2.1a9.002 9.002 0 0 1 12.6 0 .75.75 0 0 0 1.06-1.06 10.502 10.502 0 0 0-14.72 0 .75.75 0 1 0 1.06 1.06z" />
            </svg>
            {/* Battery 100% */}
            <div className="flex items-center gap-0.5 ml-0.5">
              <div className="w-5 h-2.5 border border-white/80 rounded-[3px] p-[1px] flex items-center">
                <div className="w-full h-full bg-white rounded-[1.5px]" />
              </div>
              <div className="w-[1px] h-1 bg-white/80 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Dynamic Viewport by Tab */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'home' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar pb-1">
              {/* Header */}
              <Header />

              {/* Centerpiece Hero */}
              <div className="flex-1 flex flex-col justify-center items-center my-auto">
                <MiningRingHero />
                <SessionYield />
              </div>

              {/* Promo Action Card & Bottom Metrics Row */}
              <div className="flex-shrink-0 w-full mb-1">
                <BonusCard />
                <MetricsGrid />
              </div>
            </div>
          )}

          {activeTab === 'rigs' && <RigsCloudView />}
          {activeTab === 'rewards' && <RewardsView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>

        {/* Bottom Persistent Navigation Bar */}
        <div className="flex-shrink-0">
          <BottomNav />
          {/* iOS Home Indicator Bar */}
          <div className="w-32 h-1 bg-white/30 rounded-full mx-auto -mt-2 mb-2" />
        </div>

        {/* Global Wallet Drawer Overlay */}
        <WalletModal />
      </main>
    </div>
  );
};

export default App;
