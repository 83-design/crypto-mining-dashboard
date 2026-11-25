import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { telemetry, setWalletOpen } = useMiningStore();

  return (
    <header className="w-full flex items-center justify-between px-5 pt-3 pb-2 z-20">
      {/* Geometric Blue Crystal Logo */}
      <div className="relative group cursor-pointer">
        <div className="w-10 h-10 relative flex items-center justify-center">
          <svg viewBox="0 0 44 44" fill="none" className="w-9 h-9 drop-shadow-[0_0_12px_rgba(46,123,255,0.7)]">
            {/* Outer Diamond */}
            <path
              d="M22 2L41 22L22 42L3 22L22 2Z"
              fill="url(#crystalGrad1)"
              stroke="#2E7BFF"
              strokeWidth="1.5"
            />
            {/* Inner Facets */}
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
          {/* Subtle logo pulse */}
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md -z-10 group-hover:bg-blue-400/30 transition-all" />
        </div>
      </div>

      {/* Pill-shaped Balance Card */}
      <div 
        onClick={() => setWalletOpen(true)}
        className="cursor-pointer glass-card-interactive px-5 py-2.5 rounded-2xl flex flex-col items-center justify-center border border-[#2E7BFF]/25 shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-95 transition-transform"
      >
        <span className="text-[11px] font-medium tracking-wide text-[#6E7A94] uppercase mb-0.5">
          Balance
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[20px] font-bold text-white tracking-tight">
            ${telemetry.balanceUsd.toFixed(2)}
          </span>
          <span className="text-[12px] font-semibold text-[#2E7BFF] flex items-center">
            +{telemetry.change24h}%
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] ml-0.5" />
          </span>
        </div>
      </div>

      {/* Rounded Square Wallet Button */}
      <button
        onClick={() => setWalletOpen(true)}
        aria-label="Open Wallet"
        className="w-11 h-11 rounded-2xl bg-[#0F1420]/80 border border-[#2E7BFF]/25 flex items-center justify-center text-[#2E7BFF] hover:text-white hover:border-[#2E7BFF]/60 hover:bg-[#151D2F] active:scale-90 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 drop-shadow-[0_0_8px_rgba(46,123,255,0.6)]"
        >
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          <circle cx="17.5" cy="12.5" r="1" fill="currentColor" />
        </svg>
      </button>
    </header>
  );
};
