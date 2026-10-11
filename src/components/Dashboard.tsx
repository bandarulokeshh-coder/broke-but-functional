import React, { useState } from 'react';
import { useFinance } from '../store';
import { getRemainingBalance, getDailyAllowance, getHealthScore, getRiskLevel, getTotalExpenses, UNEXPECTED_EVENTS, CATEGORY_EMOJIS } from '../utils/finance';
import { Wallet, TrendingDown, Zap, Calendar, Sparkles } from 'lucide-react';

export function Dashboard() {
  const { state, dispatch } = useFinance();
  const [surprise, setSurprise] = useState<typeof UNEXPECTED_EVENTS[0] | null>(null);

  const balance = getRemainingBalance(state);
  const daily = Math.round(getDailyAllowance(state));
  const health = getHealthScore(state);
  const risk = getRiskLevel(state);

  const handleRoll = () => {
    const ev = UNEXPECTED_EVENTS[Math.floor(Math.random() * UNEXPECTED_EVENTS.length)];
    setSurprise(ev);
  };

  const handleAcceptSurprise = () => {
    if (!surprise) return;
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: 'surprise-' + Date.now(),
        amount: surprise.amount,
        category: 'Other',
        description: surprise.description,
        day: state.currentDay,
        type: 'expense',
      },
    });
    setSurprise(null);
  };

  return (
    <div className="space-y-4">
      {/* Hero Card */}
      <section className="glass rounded-2xl p-5 gradient-bg relative overflow-hidden" aria-label="Remaining Balance">
        <p className="text-sm text-white/80 font-medium">Remaining Balance</p>
        <p className="text-4xl font-extrabold mt-1">₹{balance.toLocaleString()}</p>
        <div className="flex gap-4 mt-3 text-xs text-white/90">
          <span className="flex items-center gap-1"><TrendingDown size={14} /> Spent: ₹{getTotalExpenses(state)}</span>
          <span className="flex items-center gap-1"><Calendar size={14} /> Day {state.currentDay}/30</span>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-3" aria-label="Key metrics">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Wallet size={14} /> Daily Budget
          </div>
          <p className="text-xl font-bold text-emerald-400">₹{daily}</p>
          <p className="text-[10px] text-zinc-500">per day left</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Zap size={14} /> Health Score
          </div>
          <p className="text-xl font-bold text-violet-400">{health}/100</p>
          <p className="text-[10px] text-zinc-500">Risk: {risk.toUpperCase()}</p>
        </div>
      </section>

      {/* Unexpected Life Event Button */}
      <section className="glass rounded-xl p-4 border border-pink-500/20" aria-label="Random Events">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-pink-400 flex items-center gap-1.5">
              <Sparkles size={16} /> Life Happens
            </h2>
            <p className="text-xs text-zinc-400">Simulate unexpected emergencies</p>
          </div>
          <button onClick={handleRoll} className="gradient-bg px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">
            Roll 🎲
          </button>
        </div>
        {surprise && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-xs font-semibold text-red-300">{surprise.description}</p>
            <p className="text-sm font-bold text-red-400 mt-0.5">-₹{surprise.amount}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={handleAcceptSurprise} className="flex-1 bg-red-500/30 text-red-200 py-1 rounded text-xs">Accept 😭</button>
              <button onClick={() => setSurprise(null)} className="flex-1 bg-zinc-800 text-zinc-400 py-1 rounded text-xs">Pass</button>
            </div>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="glass rounded-xl p-4" aria-label="Recent activity">
        <h2 className="text-sm font-bold text-zinc-300 mb-3">Recent Spending</h2>
        <div className="space-y-2">
          {state.transactions.slice(-4).reverse().map(t => (
            <div key={t.id} className="flex justify-between items-center text-xs py-1 border-b border-zinc-800/50 pb-2">
              <div className="flex items-center gap-2">
                <span>{CATEGORY_EMOJIS[t.category] || '📦'}</span>
                <span>{t.description}</span>
              </div>
              <span className={t.type === 'income' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}