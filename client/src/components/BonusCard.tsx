import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMiningStore } from '../store/useMiningStore';

export const BonusCard: React.FC = () => {
  const { telemetry, claimDailyBonus } = useMiningStore();
  const [claimedJustNow, setClaimedJustNow] = useState(false);

  const handleClaim = () => {
    if (!telemetry.dailyBonusAvailable || claimedJustNow) return;

    // Trigger celebratory particle explosion
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#2E7BFF', '#38BDF8', '#60A5FA', '#FFFFFF'],
    });

    claimDailyBonus();
    setClaimedJustNow(true);
    setTimeout(() => setClaimedJustNow(false), 3000);
  };

  return (
    <div className="w-full px-5 my-2">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClaim}
        className="w-full glass-card-interactive rounded-[20px] p-3.5 flex items-center justify-between cursor-pointer border border-[#2E7BFF]/20 shadow-[0_8px_24px_rgba(0,0,0,0.45)] group"
      >
        {/* Left: 3D Blue Glowing Gift Box with Neon Base Ring */}
        <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0 mr-3">
          {/* Blue Neon Ring around Base */}
          <div className="absolute -bottom-1 w-12 h-4 rounded-full border border-[#2E7BFF] shadow-[0_0_12px_#2E7BFF] bg-[#2E7BFF]/10 transform rotate-[-4deg]" />
          
          {/* 3D Gift Box SVG */}
          <svg viewBox="0 0 48 48" className="w-12 h-12 relative z-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            <defs>
              <linearGradient id="giftBodyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="60%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#0B1322" />
              </linearGradient>
              <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            {/* Box Body */}
            <rect x="8" y="16" width="32" height="24" rx="4" fill="url(#giftBodyGrad)" stroke="#2E7BFF" strokeWidth="1" />
            {/* Lid */}
            <rect x="6" y="12" width="36" height="7" rx="3" fill="#1E293B" stroke="#60A5FA" strokeWidth="1" />
            {/* Vertical Ribbon */}
            <rect x="21" y="12" width="6" height="28" fill="url(#ribbonGrad)" />
            {/* Horizontal Ribbon on Lid */}
            <rect x="6" y="14" width="36" height="3" fill="url(#ribbonGrad)" opacity="0.8" />
            {/* Bow on Top */}
            <path
              d="M24 12 C20 7 14 7 17 11 C19 13 22 12 24 12 Z"
              fill="#38BDF8"
              filter="drop-shadow(0 0 4px #38BDF8)"
            />
            <path
              d="M24 12 C28 7 34 7 31 11 C29 13 26 12 24 12 Z"
              fill="#60A5FA"
              filter="drop-shadow(0 0 4px #60A5FA)"
            />
            <circle cx="24" cy="12" r="2.5" fill="#BAE6FD" />
          </svg>
        </div>

        {/* Middle: Title & Subtitle */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-white tracking-tight">
              Daily Bonus
            </h3>
            {telemetry.dailyBonusAvailable && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-[#38BDF8] border border-blue-500/30">
                +{telemetry.dailyBonusReward} VRSC
              </span>
            )}
          </div>
          <p className="text-[12px] font-medium text-[#6E7A94] mt-0.5">
            {claimedJustNow
              ? 'Bonus added to balance!'
              : telemetry.dailyBonusAvailable
              ? 'Claim your reward!'
              : `Streak: ${telemetry.streakDays} days active`}
          </p>
        </div>

        {/* Right: Circular Arrow Action Button */}
        <div className="flex-shrink-0 ml-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              telemetry.dailyBonusAvailable
                ? 'bg-[#15223A] border border-[#2E7BFF]/40 text-[#2E7BFF] group-hover:bg-[#2E7BFF] group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_0_15px_#2E7BFF]'
                : 'bg-[#0E1524] border border-white/5 text-[#6E7A94]'
            }`}
          >
            {claimedJustNow ? (
              <Check className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
            ) : (
              <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
