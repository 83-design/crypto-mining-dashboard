import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { Zap, ArrowUpRight } from 'lucide-react';

export const SessionYield: React.FC = () => {
  const { telemetry } = useMiningStore();
  const { isMining, sessionSeconds, sessionYield, coinSymbol } = telemetry;

  // Format seconds into "0h 12m 47s"
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center -mt-1 mb-4 select-none">
      {/* Status Header */}
      <div className="flex items-center gap-2">
        <h2 className="text-[22px] font-bold tracking-tight text-white">
          {isMining ? 'Mining...' : 'Paused'}
        </h2>
        {isMining && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E7BFF]"></span>
          </span>
        )}
      </div>

      {/* Session Timer */}
      <p className="text-[14px] font-medium text-[#6E7A94] mt-0.5 tracking-wide">
        {formatTime(sessionSeconds)}
      </p>

      {/* Glowing Yield Pill Badge */}
      <div className="mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0D1525]/90 border border-[#2E7BFF]/30 shadow-[0_4px_24px_rgba(46,123,255,0.25)] transition-all">
        <Zap className="w-4 h-4 text-[#2E7BFF] fill-[#2E7BFF] drop-shadow-[0_0_8px_rgba(46,123,255,0.9)]" />
        <span className="text-[15px] font-bold text-white tracking-wide">
          +{sessionYield.toFixed(4)} {coinSymbol}
        </span>
        <ArrowUpRight className="w-4 h-4 text-[#6E7A94] stroke-[2.5]" />
      </div>
    </div>
  );
};
