import React from 'react';
import { motion } from 'framer-motion';
import { useMiningStore } from '../store/useMiningStore';

export const MiningRingHero: React.FC = () => {
  const { telemetry, toggleMining } = useMiningStore();
  const isMining = telemetry.isMining;

  return (
    <div className="relative w-full flex flex-col items-center justify-center my-1 select-none">
      {/* Deep Royal-Blue Radial Ambient Glow behind centerpiece */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#14388C]/35 blur-[70px] pointer-events-none -z-10 animate-pulse-glow" />

      {/* Interactive Mining Core Container */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        onClick={toggleMining}
        className="relative w-[240px] h-[240px] flex items-center justify-center cursor-pointer group"
      >
        {/* Progress SVG Ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
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
            r="100"
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
              r="100"
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 100}
              initial={{ strokeDashoffset: 2 * Math.PI * 100 * 0.4 }}
              animate={{
                strokeDashoffset: [
                  2 * Math.PI * 100 * 0.45,
                  2 * Math.PI * 100 * 0.2,
                  2 * Math.PI * 100 * 0.45,
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              filter="url(#neonGlow)"
            />
          ) : (
            <circle
              cx="120"
              cy="120"
              r="100"
              fill="none"
              stroke="#1E293B"
              strokeWidth="7"
              strokeDasharray={2 * Math.PI * 100}
              strokeDashoffset={2 * Math.PI * 100 * 0.7}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Inner Obsidian Rock + Metallic Pickaxe Centerpiece */}
        <div className="absolute inset-0 flex items-center justify-center p-7">
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Blue Ambient Reflection beneath the rock */}
            <div className="absolute bottom-2 w-32 h-14 bg-blue-500/25 blur-xl rounded-full -z-10" />

            {/* Custom SVG Graphic reproducing the Obsidian Rock & Pickaxe */}
            <svg
              viewBox="0 0 160 160"
              className="w-[170px] h-[170px] transition-transform duration-300 group-hover:scale-105"
            >
              <defs>
                {/* Obsidian rock shading gradient */}
                <linearGradient id="rockBase" x1="0.2" y1="0.1" x2="0.8" y2="0.9">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="40%" stopColor="#0F172A" />
                  <stop offset="85%" stopColor="#050811" />
                  <stop offset="100%" stopColor="#020408" />
                </linearGradient>

                {/* Metallic pickaxe head gradient */}
                <linearGradient id="steelHead" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#94A3B8" />
                  <stop offset="45%" stopColor="#475569" />
                  <stop offset="70%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>

                {/* Chrome handle gradient with royal blue reflection */}
                <linearGradient id="chromeHandle" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1E3A8A" />
                  <stop offset="35%" stopColor="#3B82F6" />
                  <stop offset="60%" stopColor="#93C5FD" />
                  <stop offset="85%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#1E3A8A" />
                </linearGradient>

                {/* Vein neon filter */}
                <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Obsidian Rock Geode Body */}
              <g className="rock-body">
                {/* Main rough rock facet */}
                <path
                  d="M32 96 L58 48 L104 54 L128 92 L112 124 L48 126 Z"
                  fill="url(#rockBase)"
                  stroke="#1E293B"
                  strokeWidth="1"
                />
                {/* Front facets for 3D crystalline depth */}
                <path
                  d="M58 48 L82 72 L48 126 L32 96 Z"
                  fill="#0B1120"
                  opacity="0.85"
                />
                <path
                  d="M58 48 L104 54 L88 88 L82 72 Z"
                  fill="#1E293B"
                  opacity="0.6"
                />
                <path
                  d="M104 54 L128 92 L96 112 L88 88 Z"
                  fill="#090E1A"
                  opacity="0.9"
                />
                <path
                  d="M88 88 L96 112 L48 126 L82 72 Z"
                  fill="#060A13"
                />

                {/* Glowing Electric Cyan Mineral Veins (Pulsing when mining) */}
                <g className={isMining ? 'animate-vein' : 'opacity-40'}>
                  <path
                    d="M62 76 L70 82 L67 96 L76 104"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    filter="url(#cyanGlow)"
                  />
                  <path
                    d="M89 65 L94 74 L88 84 L96 98"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    filter="url(#cyanGlow)"
                  />
                  <path
                    d="M54 100 L60 108 L52 118"
                    fill="none"
                    stroke="#2E7BFF"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    filter="url(#cyanGlow)"
                  />
                  <circle cx="70" cy="82" r="1.5" fill="#BAE6FD" />
                  <circle cx="94" cy="74" r="1.5" fill="#BAE6FD" />
                  <circle cx="88" cy="84" r="1.2" fill="#BAE6FD" />
                </g>
              </g>

              {/* 3D Pickaxe Leaning Forward */}
              <g
                className="pickaxe-group"
                style={{
                  transformOrigin: '80px 80px',
                }}
              >
                {/* Pickaxe Curved Blade Head */}
                <path
                  d="M68 40 C85 41 106 46 118 55 C114 56 105 54 96 56 L94 62 L90 62 L88 56 C78 57 66 61 58 64 C62 55 64 47 68 40 Z"
                  fill="url(#steelHead)"
                  stroke="#CBD5E1"
                  strokeWidth="0.8"
                />
                {/* Pointed pickaxe pick tip */}
                <path
                  d="M118 55 L124 59 L115 58 Z"
                  fill="#F1F5F9"
                  filter="drop-shadow(0 0 3px rgba(255,255,255,0.7))"
                />
                {/* Pointed back hammer/adze tip */}
                <path
                  d="M58 64 L54 67 L60 66 Z"
                  fill="#94A3B8"
                />
                {/* Pickaxe collar bracket */}
                <rect
                  x="87"
                  y="53"
                  width="8"
                  height="11"
                  rx="2"
                  transform="rotate(38 91 58.5)"
                  fill="#0F172A"
                  stroke="#60A5FA"
                  strokeWidth="1"
                />

                {/* Handle extending down diagonally with royal blue metallic shine */}
                <rect
                  x="87"
                  y="59"
                  width="7.5"
                  height="66"
                  rx="3.75"
                  transform="rotate(38 87 59)"
                  fill="url(#chromeHandle)"
                  stroke="#2E7BFF"
                  strokeWidth="0.8"
                />

                {/* Bottom handle knob with bright cyan jewel accent */}
                <circle
                  cx="49"
                  cy="114"
                  r="5"
                  fill="#1E40AF"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  filter="url(#cyanGlow)"
                />
              </g>
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
