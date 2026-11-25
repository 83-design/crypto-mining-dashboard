import React from 'react';
import { motion } from 'framer-motion';
import { useMiningStore } from '../store/useMiningStore';

export const MiningRingHero: React.FC = () => {
  const { telemetry, toggleMining } = useMiningStore();
  const isMining = telemetry.isMining;

  return (
    <div className="relative w-full flex flex-col items-center justify-center my-0.5 select-none z-10">
      {/* Deep Royal-Blue Radial Ambient Glow behind centerpiece */}
      <div className="absolute w-[280px] h-[280px] rounded-full bg-[#14388C]/35 blur-[65px] pointer-events-none -z-10 animate-pulse-glow" />

      {/* Interactive Mining Core Container */}
      <motion.div
        whileTap={{ scale: 0.96 }}
        onClick={toggleMining}
        className="relative w-[230px] h-[230px] flex items-center justify-center cursor-pointer group"
      >
        {/* Progress SVG Ring */}
        <svg className="w-full h-full -rotate-90 z-20 pointer-events-none" viewBox="0 0 240 240">
          <defs>
            {/* Electric Blue Neon Gradient */}
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E7BFF" />
              <stop offset="60%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx="120"
            cy="120"
            r="102"
            fill="none"
            stroke="#0B1322"
            strokeWidth="7"
            strokeOpacity="0.8"
          />

          {/* Active Glowing Electric Arc */}
          {isMining ? (
            <motion.circle
              cx="120"
              cy="120"
              r="102"
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 102}
              initial={{ strokeDashoffset: 2 * Math.PI * 102 * 0.4 }}
              animate={{
                strokeDashoffset: [
                  2 * Math.PI * 102 * 0.45,
                  2 * Math.PI * 102 * 0.2,
                  2 * Math.PI * 102 * 0.45,
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              filter="url(#neonGlow)"
            />
          ) : (
            <circle
              cx="120"
              cy="120"
              r="102"
              fill="none"
              stroke="#1E293B"
              strokeWidth="7"
              strokeDasharray={2 * Math.PI * 102}
              strokeDashoffset={2 * Math.PI * 102 * 0.7}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Inner 3D Pickaxe & Neon-Blue Crystals from Direct URL */}
        <div className="absolute inset-2.5 rounded-full overflow-hidden flex items-center justify-center z-10 pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Glowing radial backdrop inside the core */}
            <div className="absolute inset-0 bg-radial from-blue-600/20 via-blue-900/10 to-transparent blur-md -z-10" />

            <img
              src="https://i.postimg.cc/Y9Dbyc0Y/IMG-0959.jpg"
              alt="3D Mining Pickaxe & Obsidian Crystals"
              className={`w-full h-full object-cover scale-[1.75] mix-blend-screen transition-all duration-500 ${
                isMining
                  ? 'brightness-110 contrast-110 drop-shadow-[0_0_20px_rgba(46,123,255,0.7)]'
                  : 'brightness-75 grayscale-[30%] opacity-70'
              }`}
            />
          </div>
        </div>

        {/* Ambient bottom bounce light */}
        <div className="absolute -bottom-1 w-28 h-8 bg-blue-500/25 blur-lg rounded-full pointer-events-none" />
      </motion.div>
    </div>
  );
};
