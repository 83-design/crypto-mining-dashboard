import React, { useEffect } from 'react';
import { useMiningStore, initEngine } from './store/useMiningStore';
import { StarrySky } from './components/StarrySky';
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
import { ReferralBonusModal } from './components/ReferralBonusModal';
import { ServerPurchaseModal } from './components/ServerPurchaseModal';

export const App: React.FC = () => {
  const { activeTab, selectedServerTier, setSelectedServerTier, activateCloudServer } = useMiningStore();

  useEffect(() => {
    initEngine();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#030509] flex items-center justify-center p-0 sm:p-3 overflow-hidden">
      {/* 
        Mobile Frame Viewport (375x812 to 430x932 responsive mobile-first, 100dvh, zero overflow)
      */}
      <main className="relative w-full max-w-[420px] h-[100dvh] sm:h-[860px] sm:max-h-[890px] bg-[#05070B] sm:rounded-[42px] overflow-hidden flex flex-col justify-between shadow-[0_20px_80px_rgba(0,0,0,0.95)] sm:border sm:border-[#1E293B]/60 select-none">
        
        {/* Live Animated Deep Starry Sky Canvas */}
        <StarrySky />

        {/* Top Native Status Bar (9:41, Signal, Wifi, Battery) */}
        <div className="w-full flex items-center justify-between px-7 pt-3 pb-1 text-white text-[13px] font-semibold tracking-tight z-20 flex-shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Signal */}
            <svg className="w-4 h-3 text-white fill-current" viewBox="0 0 17 12">
              <rect x="0" y="8" width="3" height="4" rx="0.5" />
              <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
              <rect x="9" y="2.5" width="3" height="9.5" rx="0.5" />
              <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
            </svg>
            {/* Wifi */}
            <svg className="w-4 h-3.5 text-white fill-current" viewBox="0 0 16 12">
              <path d="M8 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4.2-3.2a6.002 6.002 0 0 1 8.4 0 .75.75 0 0 0 1.05-1.07 7.502 7.502 0 0 0-10.5 0 .75.75 0 0 0 1.05 1.07zm-2.1-2.1a9.002 9.002 0 0 1 12.6 0 .75.75 0 0 0 1.06-1.06 10.502 10.502 0 0 0-14.72 0 .75.75 0 1 0 1.06 1.06z" />
            </svg>
            {/* Battery */}
            <div className="flex items-center gap-0.5 ml-0.5">
              <div className="w-5 h-2.5 border border-white/80 rounded-[3px] p-[1px] flex items-center">
                <div className="w-full h-full bg-white rounded-[1.5px]" />
              </div>
              <div className="w-[1px] h-1 bg-white/80 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          {activeTab === 'home' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar pb-0.5">
              {/* Header */}
              <Header />

              {/* Centerpiece Hero */}
              <div className="flex-1 flex flex-col justify-center items-center my-auto">
                <MiningRingHero />
                <SessionYield />
              </div>

              {/* Bonus Card & Metrics Row */}
              <div className="flex-shrink-0 w-full mb-0.5">
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
        <div className="flex-shrink-0 z-20">
          <BottomNav />
          {/* iOS Home Indicator Bar */}
          <div className="w-32 h-1 bg-white/25 rounded-full mx-auto -mt-2.5 mb-2" />
        </div>

        {/* Modals */}
        <WalletModal />
        <ReferralBonusModal />
        <ServerPurchaseModal
          tier={selectedServerTier}
          onClose={() => setSelectedServerTier(null)}
          onSuccess={(tier) => {
            activateCloudServer(tier);
          }}
        />
      </main>
    </div>
  );
};

export default App;
