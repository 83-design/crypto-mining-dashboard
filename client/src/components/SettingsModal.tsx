import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { Shield, Flame, Wifi, Check, Cpu } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { telemetry, setMode } = useMiningStore();
  const { mode, poolUrl, poolStatus, poolLatencyMs, sharesAccepted, sharesRejected, stratumProxyUrl, activeThreads } = telemetry;

  return (
    <div className="w-full flex-1 overflow-y-auto px-5 py-3 pb-24 text-white select-none">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[20px] font-bold tracking-tight">Mining Engine Settings</h2>
        <p className="text-[12px] text-[#6E7A94]">Управление производительностью, ядрами и Stratum</p>
      </div>

      {/* Mode Switcher: "Eco" vs "Turbo" (No mention of TikTok anywhere) */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/25 mb-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#6E7A94]">
            Режим майнинга
          </span>
          <span className="text-[11px] text-[#38BDF8] font-bold">
            {mode === 'eco' ? 'Eco Mode (2 потока)' : 'Turbo Mode (Все ядра)'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Eco Mode */}
          <button
            onClick={() => setMode('eco')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              mode === 'eco'
                ? 'bg-[#152744] border-[#2E7BFF] shadow-[0_0_18px_rgba(46,123,255,0.4)]'
                : 'bg-[#0B1322] border-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <Shield className={`w-5 h-5 ${mode === 'eco' ? 'text-[#38BDF8]' : 'text-[#6E7A94]'}`} />
              {mode === 'eco' && <Check className="w-4 h-4 text-[#38BDF8]" />}
            </div>
            <div className="text-[14px] font-bold text-white mt-2">Eco Mode</div>
            <p className="text-[10px] text-[#6E7A94] mt-1 leading-snug">
              2 энергоэффективных потока. Ограничение нагрева до 36°C для комфортной работы устройства без троттлинга.
            </p>
          </button>

          {/* Turbo Mode */}
          <button
            onClick={() => setMode('turbo')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              mode === 'turbo'
                ? 'bg-[#2A1725] border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.4)]'
                : 'bg-[#0B1322] border-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <Flame className={`w-5 h-5 ${mode === 'turbo' ? 'text-rose-400' : 'text-[#6E7A94]'}`} />
              {mode === 'turbo' && <Check className="w-4 h-4 text-rose-400" />}
            </div>
            <div className="text-[14px] font-bold text-white mt-2">Turbo Mode</div>
            <p className="text-[10px] text-[#6E7A94] mt-1 leading-snug">
              Все доступные потоки CPU ({activeThreads} потоков). Максимальный хэшрейт и скорость добычи монет.
            </p>
          </button>
        </div>
      </div>

      {/* Real In-Browser Compute Engine Info */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/15 mb-5 space-y-2.5">
        <h3 className="text-[13px] font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#2E7BFF]" />
          <span>In-Browser Compute Engine</span>
        </h3>

        <div className="p-3 bg-[#090F1C] rounded-xl border border-white/5 font-mono text-[11px] text-slate-300 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#6E7A94]">Compute Technology:</span>
            <span className="text-white">Multi-threaded Web Worker</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6E7A94]">Active Threads:</span>
            <span className="text-[#38BDF8] font-bold">{activeThreads} Threads</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6E7A94]">Current Hashes/Sec:</span>
            <span className="text-emerald-400 font-bold">{telemetry.realHashrateDisplay}</span>
          </div>
        </div>
      </div>

      {/* Stratum Protocol Proxy Details */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/15 mb-5 space-y-3">
        <h3 className="text-[13px] font-bold text-white flex items-center gap-2">
          <Wifi className="w-4 h-4 text-[#2E7BFF]" />
          <span>Stratum Protocol Proxy</span>
        </h3>

        <div className="p-3 bg-[#090F1C] rounded-xl border border-white/5 font-mono text-[11px] text-slate-300 space-y-1">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#6E7A94]">Stratum WS Proxy:</span>
            <span className="text-[#38BDF8] truncate max-w-[200px]">{stratumProxyUrl}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#6E7A94]">Target Pool:</span>
            <span className="text-white truncate max-w-[200px]">{poolUrl}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#6E7A94]">Status:</span>
            <span className="text-emerald-400 font-bold uppercase">{poolStatus}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#6E7A94]">Shares Accepted / Rejected:</span>
            <span className="text-emerald-400">
              {sharesAccepted} <span className="text-red-400">/ {sharesRejected}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
