import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Users, Zap, ShieldCheck } from 'lucide-react';
import { useMiningStore } from '../store/useMiningStore';
import confetti from 'canvas-confetti';

export const ReferralBonusModal: React.FC = () => {
  const { isBonusModalOpen, setBonusModalOpen, telemetry, claimReferralBonus, activeWallet } = useMiningStore();
  const [copied, setCopied] = useState(false);

  if (!isBonusModalOpen) return null;

  const referralCode = activeWallet ? activeWallet.shortAddress.replace(/[^a-zA-Z0-9]/g, '') : 'NEXUS9821';
  const referralLink = `https://t.me/nexus_mining_bot?start=ref_${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaim = () => {
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#2E7BFF', '#38BDF8', '#60A5FA', '#FFFFFF'],
    });
    claimReferralBonus();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 select-none">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="w-full max-w-md bg-[#070B14] border-t sm:border border-[#2E7BFF]/35 rounded-t-[32px] sm:rounded-3xl p-5 shadow-[0_-12px_60px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2E7BFF]/20 border border-[#2E7BFF]/40 flex items-center justify-center text-[#2E7BFF]">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white tracking-tight">Referral & Hashrate Boost</h3>
                <span className="text-[11px] text-[#38BDF8] font-semibold">+15% постоянный буст к мощности</span>
              </div>
            </div>
            <button
              onClick={() => setBonusModalOpen(false)}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Boost Status Card */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#102347] to-[#080D1A] border border-[#2E7BFF]/35 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E7A94]">
              Текущий статус ускорения
            </span>
            <div className="text-[28px] font-black text-white mt-1">
              {telemetry.hasClaimedBonus ? '+15% АКТИВНО' : '+15% ДОСТУПНО'}
            </div>
            <p className="text-[12px] text-slate-300 mt-1 max-w-[280px] mx-auto">
              Увеличивает скорость локального майнинга и облачных ригов на 15%.
            </p>

            {!telemetry.hasClaimedBonus ? (
              <button
                onClick={handleClaim}
                className="mt-4 w-full py-3 rounded-xl bg-[#2E7BFF] hover:bg-blue-600 text-white font-bold text-[13px] shadow-[0_0_15px_#2E7BFF] active:scale-95 transition-all"
              >
                Активировать приветственный буст (+15%)
              </button>
            ) : (
              <div className="mt-3 py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[12px] font-bold">
                ✓ Буст применен к текущему хэшрейту
              </div>
            )}
          </div>

          {/* Referral Invite Link */}
          <div className="mt-5">
            <label className="text-[12px] font-bold text-white mb-1.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#2E7BFF]" />
              <span>Ваша реферальная ссылка</span>
            </label>

            <div className="p-3 rounded-xl bg-[#0B1322] border border-white/10 flex items-center justify-between font-mono text-[11px] text-[#38BDF8] break-all gap-2">
              <span className="truncate">{referralLink}</span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-[#2E7BFF]/20 hover:bg-[#2E7BFF]/35 text-[#38BDF8] flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#6E7A94] mt-1.5">
              Получайте 5% от добычи каждого приглашенного пользователя прямо на ваш баланс.
            </p>
          </div>

          <button
            onClick={() => setBonusModalOpen(false)}
            className="mt-5 w-full py-2.5 rounded-xl bg-white/10 text-[13px] font-semibold text-slate-300 hover:bg-white/15"
          >
            Закрыть
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
