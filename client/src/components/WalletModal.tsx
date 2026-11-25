import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Plus, Trash2, ShieldCheck, QrCode } from 'lucide-react';
import { useMiningStore } from '../store/useMiningStore';
import { WalletType } from '../types/mining';

export const WalletModal: React.FC = () => {
  const { isWalletOpen, setWalletOpen, wallets, activeWallet, setActiveWallet, bindWallet, unbindWallet } = useMiningStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newType, setNewType] = useState<WalletType>('ton');
  const [newName, setNewName] = useState('My Tonkeeper');
  const [newAddress, setNewAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isWalletOpen) return null;

  const handleCopyActive = () => {
    if (activeWallet?.address) {
      navigator.clipboard?.writeText(activeWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress || newAddress.length < 8) {
      setErrorMsg('Введите корректный адрес кошелька');
      return;
    }
    bindWallet(newType, newName || 'Кошелек', newAddress);
    setNewAddress('');
    setShowAddForm(false);
    setErrorMsg('');
  };

  const qrUrl = activeWallet
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(activeWallet.address)}&bgcolor=05070B&color=2E7BFF`
    : '';

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
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-white tracking-tight">Telegram Multi-Wallet</h3>
                <span className="text-[11px] text-[#38BDF8] font-semibold">Управление привязанными кошельками</span>
              </div>
            </div>
            <button
              onClick={() => setWalletOpen(false)}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Wallet Overview */}
          {activeWallet && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#0F1D38] to-[#080D1A] border border-[#2E7BFF]/35 shadow-[0_4px_24px_rgba(46,123,255,0.2)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeWallet.icon}</span>
                  <div>
                    <span className="text-[13px] font-bold text-white block leading-tight">{activeWallet.name}</span>
                    <span className="text-[10px] text-[#38BDF8] uppercase font-bold tracking-wider">{activeWallet.network}</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Активен
                </span>
              </div>

              {/* Address with copy */}
              <div className="mt-2.5 p-2 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between font-mono text-[11px] text-slate-300">
                <span className="truncate mr-2">{activeWallet.address}</span>
                <button
                  onClick={handleCopyActive}
                  className="p-1 rounded-lg bg-[#2E7BFF]/20 text-[#38BDF8] hover:bg-[#2E7BFF]/40 flex-shrink-0"
                  title="Скопировать"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* QR Code */}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="text-[11px] text-[#6E7A94]">
                  <span>Используется для начислений и вывода монет</span>
                </div>
                {qrUrl && (
                  <div className="p-1 bg-[#05070B] rounded-lg border border-[#2E7BFF]/30">
                    <img src={qrUrl} alt="Wallet QR" className="w-12 h-12 rounded" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bound Wallets List */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#6E7A94]">
                Привязанные кошельки ({wallets.length})
              </span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-[11px] font-bold text-[#38BDF8] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить кошелек</span>
              </button>
            </div>

            <div className="space-y-2">
              {wallets.map((w) => {
                const isSelected = activeWallet?.id === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setActiveWallet(w.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#152544]/80 border-[#2E7BFF] shadow-[0_0_15px_rgba(46,123,255,0.25)]'
                        : 'bg-[#0A101C] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl flex-shrink-0">{w.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-bold text-white truncate">{w.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-semibold uppercase">
                            {w.type}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[#6E7A94] block truncate">{w.shortAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#2E7BFF] text-white flex items-center justify-center shadow-[0_0_8px_#2E7BFF]">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            unbindWallet(w.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                          title="Отвязать"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Wallet Form */}
          {showAddForm && (
            <form onSubmit={handleAddWallet} className="mt-4 p-4 rounded-2xl bg-[#090F1C] border border-[#2E7BFF]/30 space-y-3">
              <h4 className="text-[13px] font-bold text-white">Привязать новый адрес</h4>

              <div>
                <label className="text-[11px] text-[#6E7A94] block mb-1">Сеть / Тип монеты</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'ton', label: 'TON', icon: '💎' },
                    { id: 'usdt_ton', label: 'USDT', icon: '💵' },
                    { id: 'vrsc', label: 'VRSC', icon: '🔷' },
                    { id: 'xmr', label: 'XMR', icon: '🔒' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setNewType(item.id as WalletType);
                        if (item.id === 'ton') setNewName('TON Wallet');
                        if (item.id === 'usdt_ton') setNewName('USDT (TON)');
                        if (item.id === 'vrsc') setNewName('Verus Wallet');
                        if (item.id === 'xmr') setNewName('Monero Wallet');
                      }}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border flex items-center justify-center gap-1 transition-all ${
                        newType === item.id
                          ? 'bg-[#2E7BFF] border-[#2E7BFF] text-white shadow-[0_0_10px_#2E7BFF]'
                          : 'bg-[#060A14] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#6E7A94] block mb-1">Название кошелька</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#050811] border border-white/10 rounded-xl px-3 py-1.5 text-[12px] text-white focus:outline-none focus:border-[#2E7BFF]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#6E7A94] block mb-1">Адрес кошелька</label>
                <input
                  type="text"
                  required
                  placeholder="Вставьте адрес (TON / Verus / Monero)"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-[#050811] border border-white/10 rounded-xl px-3 py-1.5 text-[12px] text-white font-mono focus:outline-none focus:border-[#2E7BFF]"
                />
              </div>

              {errorMsg && (
                <p className="text-[11px] text-red-400">{errorMsg}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 rounded-xl bg-white/5 text-[12px] font-semibold text-slate-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#2E7BFF] text-[12px] font-bold text-white shadow-[0_0_12px_#2E7BFF]"
                >
                  Сохранить
                </button>
              </div>
            </form>
          )}

          <button
            onClick={() => setWalletOpen(false)}
            className="mt-5 w-full py-2.5 rounded-xl bg-white/10 text-[13px] font-semibold text-slate-300 hover:bg-white/15"
          >
            Готово
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
