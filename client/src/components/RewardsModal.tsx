import React from 'react';
import { useMiningStore } from '../store/useMiningStore';
import { Trophy, Gift, Users, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RewardsView: React.FC = () => {
  const { telemetry, claimDailyBonus } = useMiningStore();

  const handleBonusClaim = () => {
    if (!telemetry.dailyBonusAvailable) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2E7BFF', '#38BDF8', '#60A5FA', '#FFFFFF'],
    });
    claimDailyBonus();
  };

  const streakDays = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="w-full flex-1 overflow-y-auto px-5 py-4 pb-24 text-white">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-[20px] font-bold tracking-tight">Rewards & Boosts</h2>
        <p className="text-[12px] text-[#6E7A94]">Earn VRSC bonuses, streak boosts, and pool shares</p>
      </div>

      {/* 7-Day Mining Streak Card */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/25 mb-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#2E7BFF]" />
            <h3 className="text-[14px] font-bold text-white">Mining Streak</h3>
          </div>
          <span className="text-[11px] font-extrabold text-[#38BDF8] bg-[#2E7BFF]/20 px-2.5 py-0.5 rounded-full border border-[#2E7BFF]/30">
            {telemetry.streakDays} Days Active 🔥
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 my-3">
          {streakDays.map((day) => {
            const isCompleted = day <= telemetry.streakDays;
            const isCurrent = day === telemetry.streakDays + 1;
            return (
              <div
                key={day}
                className={`flex flex-col items-center justify-center py-2 rounded-xl border text-[11px] transition-all ${
                  isCompleted
                    ? 'bg-[#2E7BFF]/20 border-[#2E7BFF] text-white shadow-[0_0_10px_rgba(46,123,255,0.4)]'
                    : isCurrent
                    ? 'bg-[#15223A] border-dashed border-[#2E7BFF]/50 text-slate-300'
                    : 'bg-[#0B1322] border-white/5 text-slate-600'
                }`}
              >
                <span className="text-[9px] uppercase font-bold text-[#6E7A94]">D{day}</span>
                <span className="font-extrabold mt-0.5">{isCompleted ? '✓' : `+${0.1 * day}`}</span>
              </div>
            );
          })}
        </div>

        {telemetry.dailyBonusAvailable ? (
          <button
            onClick={handleBonusClaim}
            className="w-full py-2.5 rounded-xl bg-[#2E7BFF] hover:bg-blue-600 text-white font-bold text-[13px] shadow-[0_0_15px_#2E7BFF] active:scale-95 transition-all mt-2"
          >
            Claim Today's Reward (+{telemetry.dailyBonusReward} VRSC)
          </button>
        ) : (
          <div className="w-full py-2 rounded-xl bg-white/5 text-center text-[#6E7A94] text-[12px] font-medium mt-2">
            Today's Streak Reward Claimed! Next drop in 8h 14m
          </div>
        )}
      </div>

      {/* Quests & Tasks */}
      <div className="space-y-3 mb-5">
        <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#2E7BFF]" />
          <span>Active Mining Missions</span>
        </h3>

        {/* Quest 1 */}
        <div className="glass-panel rounded-2xl p-3.5 border border-[#2E7BFF]/15 flex items-center justify-between">
          <div>
            <h4 className="text-[13px] font-bold text-white">Non-Stop Mining Session (1 Hour)</h4>
            <p className="text-[11px] text-[#6E7A94] mt-0.5">Keep miner active with 0 interruptions</p>
            <div className="w-32 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-[#2E7BFF] w-3/4 rounded-full" />
            </div>
          </div>
          <span className="text-[12px] font-bold text-[#38BDF8] bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
            +0.15 VRSC
          </span>
        </div>

        {/* Quest 2 */}
        <div className="glass-panel rounded-2xl p-3.5 border border-[#2E7BFF]/15 flex items-center justify-between">
          <div>
            <h4 className="text-[13px] font-bold text-white">Cluster Builder</h4>
            <p className="text-[11px] text-[#6E7A94] mt-0.5">Link at least 2 physical rigs or 1 cloud node</p>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Completed
            </span>
          </div>
          <span className="text-[12px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
            Claimed
          </span>
        </div>
      </div>

      {/* Referral Booster */}
      <div className="w-full glass-panel rounded-2xl p-4 border border-[#2E7BFF]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2E7BFF]/20 border border-[#2E7BFF]/40 flex items-center justify-center text-[#2E7BFF]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-white">Invite Fellow Miners</h4>
            <p className="text-[11px] text-[#6E7A94]">Get 5% permanent hashrate boost per invite</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#6E7A94]" />
      </div>
    </div>
  );
};
