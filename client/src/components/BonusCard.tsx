import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Check } from 'lucide-react';
import { useMiningStore } from '../store/useMiningStore';

export const BonusCard: React.FC = () => {
  const { telemetry, setBonusModalOpen } = useMiningStore();
  const hasClaimed = telemetry.hasClaimedBonus;

  return (
    <div className="w-full px-5 my-1.5 select-none">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setBonusModalOpen(true)}
        className="w-full glass-card-interactive rounded-[20px] p-3 flex items-center justify-between cursor-pointer border border-[#2E7BFF]/25 shadow-[0_6px_20px_rgba(0,0,0,0.45)] group"
      >
        {/* Left: Glowing Blue 3D Boost Icon with Neon Ring */}
        <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 mr-3">
          <div className="absolute -bottom-1 w-11 h-3.5 rounded-full border border-[#2E7BFF] shadow-[0_0_12px_#2E7BFF] bg-[#2E7BFF]/10" />
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] border border-[#60A5FA]/40 flex items-center justify-center text-white shadow-[0_0_15px_rgba(46,123,255,0.6)]">
            <Zap className="w-5 h-5 fill-white text-white drop-shadow-[0_0_8px_#38BDF8]" />
          </div>
        </div>

        {/* Middle: Title & Subtitle */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-white tracking-tight">
              Hashrate Boost
            </h3>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#2E7BFF]/20 text-[#38BDF8] border border-[#2E7BFF]/35">
              +{telemetry.referralBoostPercent}% SPEED
            </span>
          </div>
          <p className="text-[11px] font-medium text-[#6E7A94] mt-0.5 truncate">
            {hasClaimed ? 'Ускорение +15% активно!' : 'Пригласите друга или активируйте буст'}
          </p>
        </div>

        {/* Right: Action Button */}
        <div className="flex-shrink-0 ml-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              hasClaimed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-[#15223A] border border-[#2E7BFF]/40 text-[#2E7BFF] group-hover:bg-[#2E7BFF] group-hover:text-white'
            }`}
          >
            {hasClaimed ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
