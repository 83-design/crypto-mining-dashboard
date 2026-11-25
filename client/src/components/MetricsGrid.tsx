import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { BarChart2, Zap, Clock } from 'lucide-react';

export const MetricsGrid: React.FC = () => {
  const { telemetry, setActiveTab } = useMiningStore();
  const { totalHashrateMH, deviceTemp, mode, totalMined, coinSymbol } = telemetry;

  // Format hashrate display
  const displayHashrate =
    totalHashrateMH >= 1000
      ? `${(totalHashrateMH / 1000).toFixed(2)} GH/s`
      : `${totalHashrateMH.toFixed(1)} MH/s`;

  return (
    <div className="w-full px-5 my-2">
      <div className="w-full glass-panel rounded-[20px] p-4 grid grid-cols-3 divide-x divide-white/[0.06] border border-[#2E7BFF]/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        
        {/* Column 1: Hash Power */}
        <div 
          onClick={() => setActiveTab('rigs')}
          className="flex flex-col pr-3 cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 text-[#6E7A94] group-hover:text-[#2E7BFF] transition-colors mb-1.5">
            <BarChart2 className="w-3.5 h-3.5 stroke-[2]" />
            <span className="text-[11px] font-medium tracking-tight">Hash Power</span>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight leading-tight">
            {displayHashrate}
          </span>
          <span className="text-[10px] text-[#2E7BFF] font-medium mt-1">
            {telemetry.linkedDevices.length + telemetry.cloudNodes.filter(c => c.active).length} Nodes Active
          </span>
        </div>

        {/* Column 2: Battery / Temp (Eco Safe) */}
        <div className="flex flex-col px-3">
          <div className="flex items-center gap-1.5 text-[#6E7A94] mb-1.5">
            <Zap className="w-3.5 h-3.5 text-[#2E7BFF] fill-[#2E7BFF] stroke-[1.5]" />
            <span className="text-[11px] font-medium tracking-tight">
              {mode === 'eco' ? 'Eco Temp' : 'Energy'}
            </span>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight leading-tight flex items-center gap-1">
            {deviceTemp}°C
            <span className="text-[10px] font-semibold text-emerald-400 ml-0.5">
              {mode === 'eco' ? '• Eco' : '• Turbo'}
            </span>
          </span>
          {/* Blue progress bar below */}
          <div className="w-full h-1.5 bg-[#0D1525] rounded-full mt-2 overflow-hidden border border-white/5">
            <div
              className="h-full bg-[#2E7BFF] rounded-full shadow-[0_0_8px_#2E7BFF] transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(15, ((deviceTemp - 25) / 40) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Column 3: Total Mined */}
        <div className="flex flex-col pl-3">
          <div className="flex items-center gap-1.5 text-[#6E7A94] mb-1.5">
            <Clock className="w-3.5 h-3.5 stroke-[2]" />
            <span className="text-[11px] font-medium tracking-tight">Total Mined</span>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight leading-tight truncate">
            {totalMined.toFixed(3)} {coinSymbol}
          </span>
          <span className="text-[10px] text-[#6E7A94] font-medium mt-1 truncate">
            ≈ ${(totalMined * telemetry.coinPriceUsd).toFixed(2)} USD
          </span>
        </div>

      </div>
    </div>
  );
};
