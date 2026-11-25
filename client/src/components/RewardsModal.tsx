import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { Trophy, Users, Zap, CheckCircle2, ChevronRight, Award } from 'lucide-react';

export const RewardsView: React.FC = () => {
  const { telemetry, setBonusModalOpen } = useMiningStore();

  return (
    <div className="w-full flex-1 overflow-y-auto px-5 py-3 pb-24 text-white select-none">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[20px] font-bold tracking-tight">Rewards & Achievements</h2>
        <p className="text-[12px] text-[#6E7A94]">Выполняйте задания и получайте ускорение хэшрейта</p>
      </div>

      {/* Referral Boost Banner */}
      <div 
        onClick={() => setBonusModalOpen(true)}
        className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/35 mb-5 shadow-[0_4px_24px_rgba(46,123,255,0.25)] cursor-pointer group active:scale-98 transition-transform"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#2E7BFF] fill-[#2E7BFF]" />
            <h3 className="text-[15px] font-bold text-white">Реферальный буст</h3>
          </div>
          <span className="text-[10px] font-extrabold text-[#38BDF8] bg-[#2E7BFF]/20 px-2.5 py-0.5 rounded-full border border-[#2E7BFF]/35">
            +15% SPEED
          </span>
        </div>
        <p className="text-[12px] text-slate-300">
          Приглашайте друзей и получайте постоянный бонус к скорости майнинга.
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-[#38BDF8] font-bold">
          <span>{telemetry.hasClaimedBonus ? '✓ Буст активирован' : 'Активировать буст'}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Mining Missions */}
      <div className="space-y-3 mb-5">
        <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-[#2E7BFF]" />
          <span>Активные миссии</span>
        </h3>

        {/* Quest 1 */}
        <div className="glass-panel rounded-2xl p-3.5 border border-[#2E7BFF]/15 flex items-center justify-between">
          <div>
            <h4 className="text-[13px] font-bold text-white">Непрерывный майнинг (1 час)</h4>
            <p className="text-[11px] text-[#6E7A94] mt-0.5">Держите майнер включенным</p>
            <div className="w-32 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#2E7BFF] w-3/4 rounded-full" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#38BDF8] bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
            +0.15 VRSC
          </span>
        </div>

        {/* Quest 2 */}
        <div className="glass-panel rounded-2xl p-3.5 border border-[#2E7BFF]/15 flex items-center justify-between">
          <div>
            <h4 className="text-[13px] font-bold text-white">Cloud Explorer</h4>
            <p className="text-[11px] text-[#6E7A94] mt-0.5">Арендуйте хотя бы 1 облачный сервер</p>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Доступно в маркете
            </span>
          </div>
          <span className="text-[11px] font-bold text-[#38BDF8] bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
            +50 MH/s
          </span>
        </div>
      </div>

      {/* Telegram Community */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2E7BFF]/20 border border-[#2E7BFF]/40 flex items-center justify-center text-[#2E7BFF]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-white">Сообщество майнеров</h4>
            <p className="text-[11px] text-[#6E7A94]">Обсуждение пулов и новых тарифов</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#6E7A94]" />
      </div>
    </div>
  );
};
