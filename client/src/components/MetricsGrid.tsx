import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { BarChart2, Zap, Clock } from 'lucide-react';

export const MetricsGrid: React.FC = () => {
  const { telemetry, setActiveTab } = useMiningStore();
  const { totalHashrateMH, deviceTemp, mode, totalMined, coinSymbol } = telemetry;

  const displayHashrate =
    totalHashrateMH >= 1000
      ? `${(totalHashrateMH / 1000).toFixed(2)} GH/s`
      : totalHashrateMH > 0
      ? `${totalHashrateMH.toFixed(1)} MH/s`
      : telemetry.realHashrateDisplay;

  return (
    <div className="w-full px-5 my-1.5 select-none">
      <div className="w-full glass-panel rounded-[20px] p-3.5 grid grid-cols-3 divide-x divide-white/[0.06] border border-[#2E7BFF]/20 shadow-[0_6px_25px_rgba(0,0,0,0.5)]">
        
        {/* Column 1: Hash Power */}
        <div 
          onClick={() => setActiveTab('rigs')}
          className="flex flex-col pr-2.5 cursor-pointer group"
        >
          <div className="flex items-center gap-1.5 text-[#6E7A94] group-hover:text-[#2E7BFF] transition-colors mb-1">
            <BarChart2 className="w-3.5 h-3.5 stroke-[2]" />
            <span className="text-[10px] font-medium tracking-tight">Hash Power</span>
          </div>
          <span className="text-[14px] font-bold text-white tracking-tight leading-tight">
            {displayHashrate}
          </span>
          <span className="text-[9px] text-[#2E7BFF] font-medium mt-0.5">
            {telemetry.realHashrateDisplay} Web
          </span>
        </div>

        {/* Column 2: Battery / Temp (Eco Safe) */}
        <div className="flex flex-col px-2.5">
          <div className="flex items-center gap-1.5 text-[#6E7A94] mb-1">
            <Zap className="w-3.5 h-3.5 text-[#2E7BFF] fill-[#2E7BFF] stroke-[1.5]" />
            <span className="text-[10px] font-medium tracking-tight">Battery / Temp</span>
          </div>
          <span className="text-[14px] font-bold text-white tracking-tight leading-tight flex items-center gap-1">
            {deviceTemp}°C
            <span className="text-[9px] font-semibold text-emerald-400 ml-0.5">
              {mode === 'eco' ? '• Eco Safe' : '• Turbo'}
            </span>
          </span>
          {/* Blue progress bar below */}
          <div className="w-full h-1.5 bg-[#0D1525] rounded-full mt-1.5 overflow-hidden border border-white/5">
            <div
              className="h-full bg-[#2E7BFF] rounded-full shadow-[0_0_8px_#2E7BFF] transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(15, ((deviceTemp - 25) / 35) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Column 3: Total Mined */}
        <div className="flex flex-col pl-2.5">
          <div className="flex items-center gap-1.5 text-[#6E7A94] mb-1">
            <Clock className="w-3.5 h-3.5 stroke-[2]" />
            <span className="text-[10px] font-medium tracking-tight">Total Mined</span>
          </div>
          <span className="text-[14px] font-bold text-white tracking-tight leading-tight truncate">
            {totalMined.toFixed(3)} {coinSymbol}
          </span>
          <span className="text-[9px] text-[#6E7A94] font-medium mt-0.5 truncate">
            ≈ ${(totalMined * telemetry.coinPriceUsd).toFixed(2)} USD
          </span>
        </div>

      </div>
    </div>
  );
};
