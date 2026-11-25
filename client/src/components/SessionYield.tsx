import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { Zap, ArrowUpRight } from 'lucide-react';

export const SessionYield: React.FC = () => {
  const { telemetry } = useMiningStore();
  const { isMining, sessionSeconds, sessionYield, coinSymbol } = telemetry;

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-0.5 select-none z-10">
      {/* Status Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-[21px] font-extrabold tracking-tight text-white">
          {isMining ? 'Mining...' : 'Paused'}
        </h2>
        {isMining && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7BFF]"></span>
          </span>
        )}
      </div>

      {/* Session Timer */}
      <p className="text-[13px] font-medium text-[#6E7A94] mt-0.5 tracking-wide">
        {formatTime(sessionSeconds)}
      </p>

      {/* Glowing Yield Pill Badge */}
      <div className="mt-2.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1525]/90 border border-[#2E7BFF]/35 shadow-[0_4px_20px_rgba(46,123,255,0.25)] transition-all">
        <Zap className="w-3.5 h-3.5 text-[#2E7BFF] fill-[#2E7BFF] drop-shadow-[0_0_8px_rgba(46,123,255,0.9)]" />
        <span className="text-[14px] font-bold text-white tracking-wide">
          +{sessionYield.toFixed(4)} {coinSymbol}
        </span>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#6E7A94] stroke-[2.5]" />
      </div>
    </div>
  );
};
