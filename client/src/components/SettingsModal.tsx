import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { Settings, Shield, Flame, Activity, Wifi, Check, Cpu } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { telemetry, setMode } = useMiningStore();
  const { mode, poolUrl, poolStatus, poolLatencyMs, sharesAccepted, sharesRejected, currentCoin } = telemetry;

  return (
    <div className="w-full flex-1 overflow-y-auto px-5 py-4 pb-24 text-white">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[20px] font-bold tracking-tight">Mining Engine Settings</h2>
        <p className="text-[12px] text-[#6E7A94]">Thermal management, core allocation & Stratum config</p>
      </div>

      {/* Mode Switcher: "TikTok Safe Mode" vs "Turbo" */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/25 mb-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-bold uppercase tracking-wider text-[#6E7A94]">
            Performance Profile
          </span>
          <span className="text-[11px] text-[#38BDF8] font-bold">
            {mode === 'eco' ? 'Eco Background Safe' : 'Maximum Beast Mode'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* TikTok Safe Mode */}
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
            <div className="text-[14px] font-bold text-white mt-2">TikTok Safe Mode</div>
            <p className="text-[10px] text-[#6E7A94] mt-1 leading-snug">
              Efficiency cores only. Keeps device under 37°C so you can scroll TikTok without stutter or heat.
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
            <div className="text-[14px] font-bold text-white mt-2">Turbo Full Power</div>
            <p className="text-[10px] text-[#6E7A94] mt-1 leading-snug">
              All CPU threads unlocked. Maximum MH/s yield. Suitable when connected to charger.
            </p>
          </button>
        </div>
      </div>

      {/* Stratum Pool Proxy Details */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/15 mb-5 space-y-3">
        <h3 className="text-[13px] font-bold text-white flex items-center gap-2">
          <Wifi className="w-4 h-4 text-[#2E7BFF]" />
          <span>Stratum Protocol Proxy</span>
        </h3>

        <div className="p-3 bg-[#090F1C] rounded-xl border border-white/5 font-mono text-[11px] text-slate-300">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#6E7A94]">Pool URL:</span>
            <span className="text-[#38BDF8]">{poolUrl}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#6E7A94]">Stratum Status:</span>
            <span className="text-emerald-400 font-bold uppercase">{poolStatus}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[#6E7A94]">Pool Latency:</span>
            <span className="text-white">{poolLatencyMs} ms</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#6E7A94]">Shares Accepted / Rejected:</span>
            <span className="text-emerald-400">
              {sharesAccepted} <span className="text-red-400">/ {sharesRejected}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Target Mining Algorithm & Coin */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/15">
        <h3 className="text-[13px] font-bold text-white flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-[#2E7BFF]" />
          <span>Mining Algorithm Target</span>
        </h3>

        <div className="space-y-2 text-[12px]">
          <div className="p-2.5 rounded-xl bg-[#15223A] border border-[#2E7BFF]/30 flex items-center justify-between">
            <div>
              <span className="font-bold text-white">VerusHash 2.2b (VerusCoin VRSC)</span>
              <p className="text-[10px] text-[#6E7A94]">ASIC & FPGA resistant, mobile & CPU friendly</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2E7BFF]/20 text-[#38BDF8]">
              ACTIVE
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0B1322] border border-white/5 flex items-center justify-between opacity-60">
            <div>
              <span className="font-bold text-white">RandomX (Monero XMR)</span>
              <p className="text-[10px] text-[#6E7A94]">L3-Cache intensive CPU privacy algorithm</p>
            </div>
            <span className="text-[10px] text-[#6E7A94]">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
