import React, { useState } from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { X, ArrowDownRight, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WalletModal: React.FC = () => {
  const { telemetry, isWalletOpen, setWalletOpen, requestPayout } = useMiningStore();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [address, setAddress] = useState('R9xLw4K9k2FqLz8Nm1V9821');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isWalletOpen) return null;

  const handleMax = () => {
    setWithdrawAmount(telemetry.balanceCoin.toFixed(4));
    setErrorMsg('');
  };

  const handleWithdraw = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    const amt = parseFloat(withdrawAmount);

    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please enter a valid amount');
      return;
    }

    if (amt < 2.0) {
      setErrorMsg('Minimum withdrawal threshold is 2.00 VRSC');
      return;
    }

    if (amt > telemetry.balanceCoin) {
      setErrorMsg('Withdrawal amount exceeds your current balance');
      return;
    }

    if (!address || address.length < 10) {
      setErrorMsg('Please enter a valid crypto address');
      return;
    }

    setIsSubmitting(true);
    const res = await requestPayout(amt, address);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(`Successfully queued payout of ${amt} VRSC!`);
      setWithdrawAmount('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.error || 'Failed to submit withdrawal request');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-[#080C14] border-t sm:border border-[#2E7BFF]/30 rounded-t-[32px] sm:rounded-3xl p-6 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2E7BFF]/20 border border-[#2E7BFF]/40 flex items-center justify-center text-[#2E7BFF]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-[18px] font-bold text-white tracking-tight">Wallet & Payouts</h2>
            </div>
            <button
              onClick={() => setWalletOpen(false)}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Balance Overview Card */}
          <div className="my-5 glass-panel rounded-2xl p-5 border border-[#2E7BFF]/25 shadow-[0_4px_24px_rgba(46,123,255,0.15)] flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold text-[#6E7A94] uppercase tracking-wider">
              Total Miner Balance
            </span>
            <div className="text-[32px] font-black text-white mt-1 tracking-tight">
              ${telemetry.balanceUsd.toFixed(2)}
            </div>
            <div className="text-[14px] font-bold text-[#2E7BFF] mt-0.5">
              {telemetry.balanceCoin.toFixed(4)} {telemetry.coinSymbol}
            </div>
          </div>

          {/* Payout Input Section */}
          <div className="space-y-3">
            <label className="text-[12px] font-bold text-white flex justify-between">
              <span>Withdraw VRSC / XMR</span>
              <span className="text-[#6E7A94] font-normal">Min. 2.00 VRSC</span>
            </label>

            <div className="relative">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full bg-[#0D1525] border border-[#2E7BFF]/25 rounded-2xl px-4 py-3 text-[16px] font-bold text-white focus:outline-none focus:border-[#2E7BFF] transition-colors pr-20"
              />
              <button
                onClick={handleMax}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#2E7BFF]/20 text-[#38BDF8] text-[11px] font-bold hover:bg-[#2E7BFF]/30 transition-colors"
              >
                MAX
              </button>
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#6E7A94] mb-1 block">
                Destination Address (Verus / Native XMR)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Paste wallet address"
                className="w-full bg-[#0D1525] border border-[#2E7BFF]/25 rounded-2xl px-4 py-2.5 text-[12px] text-white focus:outline-none focus:border-[#2E7BFF] transition-colors font-mono"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-[12px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[12px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              onClick={handleWithdraw}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-[#2E7BFF] hover:bg-blue-600 text-white font-bold text-[14px] shadow-[0_0_20px_#2E7BFF] active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Processing...' : 'Request Instant Payout'}</span>
            </button>
          </div>

          {/* Transaction History */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <h3 className="text-[13px] font-bold text-white mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#6E7A94]" />
              <span>Recent Payout Activity</span>
            </h3>

            <div className="space-y-2">
              {telemetry.recentPayouts.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-[#0F172A]/60 border border-white/5 flex items-center justify-between text-[12px]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-white">
                        {tx.amount} {tx.coin}
                      </div>
                      <div className="text-[10px] text-[#6E7A94] font-mono">{tx.address}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      {tx.status}
                    </span>
                    <div className="text-[10px] text-[#6E7A94] mt-0.5">{tx.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
