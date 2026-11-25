import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { ArrowUpRight, Wallet } from 'lucide-react';

export const Header: React.FC = () => {
  const { telemetry, setWalletOpen, activeWallet } = useMiningStore();

  return (
    <header className="w-full flex items-center justify-between px-5 pt-2 pb-1.5 z-20 select-none">
      {/* Geometric Blue Crystal Logo + Network Badge */}
      <div className="flex items-center gap-2">
        <div className="relative group cursor-pointer">
          <div className="w-9 h-9 relative flex items-center justify-center">
            <svg viewBox="0 0 44 44" fill="none" className="w-8 h-8 drop-shadow-[0_0_12px_rgba(46,123,255,0.7)]">
              <path
                d="M22 2L41 22L22 42L3 22L22 2Z"
                fill="url(#crystalGrad1)"
                stroke="#2E7BFF"
                strokeWidth="1.5"
              />
              <path
                d="M22 2L31 22L22 36L13 22L22 2Z"
                fill="url(#crystalGrad2)"
                opacity="0.9"
              />
              <path
                d="M22 2L22 36"
                stroke="#60A5FA"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M3 22L41 22"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.8"
              />
              <defs>
                <linearGradient id="crystalGrad1" x1="3" y1="2" x2="41" y2="42" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1E40AF" />
                  <stop offset="0.5" stopColor="#2563EB" />
                  <stop offset="1" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="crystalGrad2" x1="13" y1="2" x2="31" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60A5FA" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Pill-shaped Balance Card */}
      <div 
        onClick={() => setWalletOpen(true)}
        className="cursor-pointer glass-card-interactive px-4 py-2 rounded-2xl flex flex-col items-center justify-center border border-[#2E7BFF]/25 shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-95 transition-transform"
      >
        <span className="text-[10px] font-semibold tracking-wider text-[#6E7A94] uppercase mb-0.5">
          Balance
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[19px] font-extrabold text-white tracking-tight">
            ${telemetry.balanceUsd.toFixed(2)}
          </span>
          <span className="text-[11px] font-bold text-[#2E7BFF] flex items-center">
            +{telemetry.change24h}%
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] ml-0.5" />
          </span>
        </div>
      </div>

      {/* Active Wallet Badge & Button */}
      <button
        onClick={() => setWalletOpen(true)}
        aria-label="Open Wallet"
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-2xl bg-[#0F1420]/80 border border-[#2E7BFF]/30 text-white hover:border-[#2E7BFF]/60 hover:bg-[#151D2F] active:scale-90 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      >
        <div className="w-7 h-7 rounded-xl bg-[#2E7BFF]/20 flex items-center justify-center text-[#2E7BFF] flex-shrink-0">
          <Wallet className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col text-left mr-0.5">
          <span className="text-[9px] font-bold text-[#6E7A94] uppercase tracking-wider leading-none">Wallet</span>
          <span className="text-[11px] font-mono text-[#38BDF8] font-bold leading-tight">
            {activeWallet ? activeWallet.shortAddress : 'Connect'}
          </span>
        </div>
      </button>
    </header>
  );
};
