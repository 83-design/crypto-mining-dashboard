import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { Home, BarChart2, Trophy, Settings } from 'lucide-react';
import { ActiveTab } from '../types/mining';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useMiningStore();

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'rigs', label: 'Rigs & Cloud', icon: BarChart2 },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-full px-5 pb-5 pt-2 z-20">
      <div className="w-full h-16 glass-panel rounded-full px-4 flex items-center justify-around border border-[#2E7BFF]/20 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center py-1 px-3 group transition-transform active:scale-95"
            >
              {/* Active glow backing */}
              {isActive && (
                <div className="absolute -top-1 w-8 h-8 rounded-full bg-[#2E7BFF]/25 blur-md -z-10" />
              )}

              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  isActive
                    ? 'text-[#2E7BFF] drop-shadow-[0_0_10px_rgba(46,123,255,0.8)] stroke-[2.4]'
                    : 'text-[#6E7A94] group-hover:text-slate-300 stroke-[1.8]'
                }`}
              />

              <span
                className={`text-[11px] font-semibold tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-[#2E7BFF]' : 'text-[#6E7A94] group-hover:text-slate-300'
                }`}
              >
                {tab.label}
              </span>

              {/* Glowing active indicator dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7BFF] shadow-[0_0_6px_#2E7BFF] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
