import React, { useState } from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { Server, Cpu, Terminal, Copy, Check, Zap, CheckCircle2, ChevronRight, ShieldCheck, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { CloudServerTier } from '../types/mining';

export const RigsCloudView: React.FC = () => {
  const { telemetry, activeWallet, setSelectedServerTier } = useMiningStore();
  const [selectedMinerType, setSelectedMinerType] = useState<'ccminer' | 'xmrig'>('ccminer');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const walletAddr = activeWallet?.address || 'UQCDcSB00TOddH1qm-vwnOsSUTZuxzDC31_lcKe09j_D_8Rg';

  // Real ccminer command for VerusHash
  const ccminerCommand = `ccminer -a verus -o stratum+tcp://eu.vipor.net:5040 -u ${walletAddr}.Rig1 -p x -t 8`;

  // Real XMRig JSON configuration
  const xmrigConfig = JSON.stringify(
    {
      autosave: true,
      cpu: { enabled: true, "huge-pages": true, "max-threads-hint": 100 },
      pools: [
        {
          url: "pool.supportxmr.com:3333",
          user: walletAddr,
          pass: "worker1",
          rig_id: "PC_Worker",
          nicehash: false,
          keepalive: true,
          tls: false
        }
      ]
    },
    null,
    2
  );

  const copyCommand = () => {
    navigator.clipboard?.writeText(ccminerCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const copyJson = () => {
    navigator.clipboard?.writeText(xmrigConfig);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const activeCloudCount = telemetry.cloudNodes.filter((c) => c.active).length;

  return (
    <div className="w-full flex-1 overflow-y-auto px-5 py-3 pb-24 text-white select-none">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[20px] font-bold tracking-tight">Rigs & Cloud Servers</h2>
        <p className="text-[12px] text-[#6E7A94]">Аренда облачных нод и конфигурация внешних ригов</p>
      </div>

      {/* Aggregate Status Banner */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/25 mb-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#6E7A94] font-bold">Хэшрейт пула</span>
          <div className="text-[22px] font-black text-white mt-0.5">{telemetry.formattedHashrate}</div>
          <span className="text-[10px] text-[#38BDF8] font-semibold">Web Worker: {telemetry.realHashrateDisplay}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-[#6E7A94] font-bold">Серверы в работе</span>
          <div className="text-[16px] font-bold text-[#2E7BFF] mt-0.5">
            {activeCloudCount} облачных
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">● Пул онлайн (24ms)</span>
        </div>
      </div>

      {/* SECTION 1: Rent Cloud Servers */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#2E7BFF]" />
            <h3 className="text-[15px] font-bold text-white tracking-tight">Аренда Cloud Серверов</h3>
          </div>
          <span className="text-[10px] text-[#38BDF8] font-bold bg-[#2E7BFF]/10 px-2 py-0.5 rounded-full border border-[#2E7BFF]/25">
            USDT (TON Network)
          </span>
        </div>

        <div className="space-y-3">
          {telemetry.cloudNodes.map((tier) => (
            <motion.div
              key={tier.id}
              whileHover={{ scale: 1.01 }}
              className={`w-full glass-panel rounded-2xl p-4 border transition-all ${
                tier.active
                  ? 'border-[#2E7BFF] bg-[#0E1B33]/85 shadow-[0_0_20px_rgba(46,123,255,0.25)]'
                  : 'border-[#2E7BFF]/20 hover:border-[#2E7BFF]/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-[15px] font-bold text-white">{tier.name}</h4>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#2E7BFF]/20 text-[#38BDF8] border border-[#2E7BFF]/30">
                      {tier.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E7A94] mt-1 max-w-[240px] leading-relaxed">{tier.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-black text-white">{tier.priceUsdt} USDT</div>
                  <span className="text-[10px] text-[#6E7A94]">/ месяц</span>
                </div>
              </div>

              {/* Feature Chips */}
              <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
                {tier.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7BFF] flex-shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button -> opens ServerPurchaseModal */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#38BDF8] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-[#38BDF8]" />
                  +{tier.hashrateDisplay}
                </span>

                {tier.active ? (
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 text-[12px] font-bold">
                    ✓ Активен ({tier.nodeCount}x)
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedServerTier(tier)}
                    className="px-4 py-1.5 rounded-xl bg-[#2E7BFF] hover:bg-blue-600 text-white text-[12px] font-bold shadow-[0_0_15px_#2E7BFF] transition-all active:scale-95"
                  >
                    Арендовать ({tier.priceUsdt} USDT)
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Companion Miner Config Generator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#2E7BFF]" />
            <h3 className="text-[15px] font-bold text-white tracking-tight">Генератор майнера (PC / Android)</h3>
          </div>
          <span className="text-[10px] text-[#6E7A94]">ccminer & XMRig</span>
        </div>

        <p className="text-[11px] text-[#6E7A94] mb-3">
          1-клик команда с авто-подстановкой вашего привязанного кошелька для майнинга на реальном железе:
        </p>

        {/* Miner Type Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setSelectedMinerType('ccminer')}
            className={`py-2 px-3 rounded-xl text-[12px] font-bold border transition-all ${
              selectedMinerType === 'ccminer'
                ? 'bg-[#152544] border-[#2E7BFF] text-white shadow-[0_0_12px_rgba(46,123,255,0.3)]'
                : 'bg-[#090F1C] border-white/10 text-slate-400'
            }`}
          >
            ccminer (VerusHash 2.2b)
          </button>
          <button
            onClick={() => setSelectedMinerType('xmrig')}
            className={`py-2 px-3 rounded-xl text-[12px] font-bold border transition-all ${
              selectedMinerType === 'xmrig'
                ? 'bg-[#152544] border-[#2E7BFF] text-white shadow-[0_0_12px_rgba(46,123,255,0.3)]'
                : 'bg-[#090F1C] border-white/10 text-slate-400'
            }`}
          >
            XMRig (Monero RandomX)
          </button>
        </div>

        {/* Code Snippet Box */}
        {selectedMinerType === 'ccminer' ? (
          <div className="p-3.5 rounded-2xl bg-[#050811] border border-[#2E7BFF]/30 font-mono text-[11px] text-[#38BDF8] relative">
            <div className="break-all pr-12 leading-relaxed">
              {ccminerCommand}
            </div>
            <button
              onClick={copyCommand}
              className="absolute right-3 top-3 p-2 rounded-xl bg-[#2E7BFF]/20 hover:bg-[#2E7BFF]/40 text-[#38BDF8] transition-colors"
              title="Скопировать команду"
            >
              {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#050811] border border-[#2E7BFF]/30 font-mono text-[11px] text-[#38BDF8] relative">
            <pre className="overflow-x-auto text-[10px] leading-tight text-slate-300 pr-12">
              {xmrigConfig}
            </pre>
            <button
              onClick={copyJson}
              className="absolute right-3 top-3 p-2 rounded-xl bg-[#2E7BFF]/20 hover:bg-[#2E7BFF]/40 text-[#38BDF8] transition-colors"
              title="Скопировать config.json"
            >
              {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3: Linked Hardware Nodes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#2E7BFF]" />
            <h3 className="text-[15px] font-bold text-white tracking-tight">Подключенные устройства</h3>
          </div>
          <span className="text-[11px] text-[#6E7A94]">{telemetry.linkedDevices.length} устройства</span>
        </div>

        <div className="space-y-2">
          {telemetry.linkedDevices.map((dev) => (
            <div
              key={dev.id}
              className="p-3 rounded-2xl glass-panel border border-[#2E7BFF]/15 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#15223A] border border-[#2E7BFF]/30 flex items-center justify-center text-[#2E7BFF]">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-white">{dev.name}</span>
                    {dev.isCurrentDevice && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ЭТО УСТРОЙСТВО
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#6E7A94]">{dev.cpu}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[13px] font-bold text-white block">
                  {dev.isCurrentDevice ? telemetry.realHashrateDisplay : `${dev.hashrateMH} MH/s`}
                </span>
                <span className="text-[10px] text-emerald-400">● {dev.temp}°C Онлайн</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
