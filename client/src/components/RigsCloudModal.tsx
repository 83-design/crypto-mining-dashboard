import React, { useState } from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { Server, Cpu, Plus, CheckCircle2, ShieldCheck, Zap, Trash2, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const RigsCloudView: React.FC = () => {
  const { telemetry, activateCloudTier, cancelCloudTier, linkDevice, removeDevice } = useMiningStore();
  const [showPairModal, setShowPairModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newRigName, setNewRigName] = useState('MacBook M3 Max');
  const [newRigCpu, setNewRigCpu] = useState('Apple M3 Max 16-Core');
  const [newRigHash, setNewRigHash] = useState('24.5');

  const pairCommand = 'curl -sL https://nexus.mine/pair?token=VRSC-9821-RIG | sh';

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(pairCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCustomRig = () => {
    linkDevice(newRigName, 'desktop', newRigCpu, parseFloat(newRigHash) || 20);
    setShowPairModal(false);
  };

  return (
    <div className="w-full flex-1 overflow-y-auto px-5 py-4 pb-24 text-white">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[20px] font-bold tracking-tight">Rigs & Cloud Fleet</h2>
          <p className="text-[12px] text-[#6E7A94]">Manage linked physical devices & cloud hash nodes</p>
        </div>
        <button
          onClick={() => setShowPairModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E7BFF]/20 border border-[#2E7BFF]/50 text-[#38BDF8] text-[12px] font-semibold hover:bg-[#2E7BFF]/30 active:scale-95 transition-all shadow-[0_0_15px_rgba(46,123,255,0.25)]"
        >
          <Plus className="w-4 h-4" />
          <span>Pair Rig</span>
        </button>
      </div>

      {/* Aggregate Stats Banner */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/25 mb-6 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#6E7A94] font-medium">Total Fleet Hashrate</span>
          <div className="text-[22px] font-black text-white mt-0.5">{telemetry.formattedHashrate}</div>
        </div>
        <div className="text-right">
          <span className="text-[11px] uppercase tracking-wider text-[#6E7A94] font-medium">Active Workers</span>
          <div className="text-[18px] font-bold text-[#2E7BFF] mt-0.5">
            {telemetry.linkedDevices.length} physical + {telemetry.cloudNodes.filter(c => c.active).length} cloud
          </div>
        </div>
      </div>

      {/* SECTION 1: Rent Cloud Servers (Subscription Tiers) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#2E7BFF]" />
            <h3 className="text-[15px] font-bold text-white tracking-tight">Rent Cloud Servers</h3>
          </div>
          <span className="text-[11px] text-[#38BDF8] font-semibold bg-[#2E7BFF]/10 px-2 py-0.5 rounded-full border border-[#2E7BFF]/20">
            Zero Battery Drain
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
                  : 'border-[#2E7BFF]/15 hover:border-[#2E7BFF]/35'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-[15px] font-bold text-white">{tier.name}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2E7BFF]/20 text-[#38BDF8] border border-[#2E7BFF]/30">
                      {tier.badge}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6E7A94] mt-1 max-w-[260px]">{tier.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-black text-white">${tier.priceMonthly}</div>
                  <span className="text-[10px] text-[#6E7A94]">/ month</span>
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

              {/* Action Button */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#38BDF8] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-[#38BDF8]" />
                  +{tier.hashrateMH} MH/s Instant Power
                </span>

                {tier.active ? (
                  <button
                    onClick={() => cancelCloudTier(tier.id)}
                    className="px-4 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-[12px] font-bold transition-all active:scale-95"
                  >
                    Active ({tier.nodeCount}x) • Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => activateCloudTier(tier.id)}
                    className="px-4 py-1.5 rounded-xl bg-[#2E7BFF] hover:bg-blue-600 text-white text-[12px] font-bold shadow-[0_0_15px_#2E7BFF] transition-all active:scale-95"
                  >
                    Subscribe & Boost
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION 2: My Linked Devices */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#2E7BFF]" />
            <h3 className="text-[15px] font-bold text-white tracking-tight">My Linked Devices</h3>
          </div>
          <span className="text-[11px] text-[#6E7A94]">
            {telemetry.linkedDevices.length} Connected
          </span>
        </div>

        <div className="space-y-2.5">
          {telemetry.linkedDevices.map((device) => (
            <div
              key={device.id}
              className="w-full glass-panel rounded-2xl p-3.5 border border-[#2E7BFF]/15 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#15223A] border border-[#2E7BFF]/30 flex items-center justify-center text-[#2E7BFF] flex-shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-white tracking-tight">{device.name}</span>
                    {device.isCurrentDevice && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        THIS DEVICE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6E7A94] truncate max-w-[200px]">{device.cpu}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[13px] font-bold text-white">{device.hashrateMH} MH/s</div>
                  <div className="text-[10px] text-[#38BDF8] flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34D399]" />
                    {device.temp}°C
                  </div>
                </div>

                {!device.isCurrentDevice && (
                  <button
                    onClick={() => removeDevice(device.id)}
                    className="p-1.5 rounded-lg text-[#6E7A94] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Unlink Rig"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Pair New Device */}
      {showPairModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm glass-panel rounded-3xl p-5 border border-[#2E7BFF]/30 shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
          >
            <h3 className="text-[17px] font-bold text-white">Link Mining Rig</h3>
            <p className="text-[12px] text-[#6E7A94] mt-1">
              Run this one-line pairing command on your PC, Linux box, or Android Termux to stream hashrate into your dashboard.
            </p>

            {/* Terminal Snippet */}
            <div className="mt-3 p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-[11px] text-[#38BDF8] break-all flex items-center justify-between gap-2">
              <span>{pairCommand}</span>
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick Demo Simulator Adder */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <span className="text-[11px] font-bold uppercase text-[#6E7A94]">Or Add Simulated Worker:</span>
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  value={newRigName}
                  onChange={(e) => setNewRigName(e.target.value)}
                  placeholder="Device Name"
                  className="w-full bg-[#0D1525] border border-white/10 rounded-xl px-3 py-1.5 text-[12px] text-white focus:outline-none focus:border-[#2E7BFF]"
                />
                <input
                  type="text"
                  value={newRigCpu}
                  onChange={(e) => setNewRigCpu(e.target.value)}
                  placeholder="CPU Model"
                  className="w-full bg-[#0D1525] border border-white/10 rounded-xl px-3 py-1.5 text-[12px] text-white focus:outline-none focus:border-[#2E7BFF]"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newRigHash}
                    onChange={(e) => setNewRigHash(e.target.value)}
                    placeholder="Hashrate (MH/s)"
                    className="flex-1 bg-[#0D1525] border border-white/10 rounded-xl px-3 py-1.5 text-[12px] text-white focus:outline-none focus:border-[#2E7BFF]"
                  />
                  <button
                    onClick={handleAddCustomRig}
                    className="px-4 py-1.5 bg-[#2E7BFF] rounded-xl text-[12px] font-bold text-white shadow-[0_0_10px_#2E7BFF]"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPairModal(false)}
              className="mt-4 w-full py-2 rounded-xl bg-white/10 text-[13px] font-semibold text-slate-300 hover:bg-white/15"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
