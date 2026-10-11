import React, { useState } from 'react';
import { useFinanceEngine } from '../hooks/useFinanceEngine';
import { UNEXPECTED_EVENTS } from '../utils/finance';
import { useSound } from '../hooks/useSound';
import { TrendingDown, Sparkles, Calendar } from 'lucide-react';

export function Dashboard() {
  const { state, dispatch, balance, mood, expenses } = useFinanceEngine();
  const { playClick, playAlert } = useSound();
  const [surprise, setSurprise] = useState<typeof UNEXPECTED_EVENTS[0] | null>(null);

  const handleRollLife = () => {
    playAlert();
    const randomEvent = UNEXPECTED_EVENTS[Math.floor(Math.random() * UNEXPECTED_EVENTS.length)];
    setSurprise(randomEvent);
  };

  const handleAcceptSurprise = () => {
    if (!surprise) return;
    playClick();
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
    <div className="space-y-5 animate-fade-in">
      {/* Hero & Responsive Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section aria-label="Monthly Overview" className="lg:col-span-2 glass rounded-2xl p-6 gradient-bg relative overflow-hidden shadow-2xl shadow-violet-950/40">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-white/80 font-bold tracking-wider uppercase">Remaining Survival Budget</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white mt-1">₹{balance.toLocaleString()}</h2>
            </div>
            <div className="text-right">
              <span className="text-3xl">{mood.emoji}</span>
              <p className="text-[11px] font-black text-white uppercase tracking-widest">{mood.status}</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-white/95 italic mt-3 bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/10">
            "{mood.quote}"
          </p>

          <div className="flex flex-wrap justify-between items-center mt-5 pt-4 border-t border-white/20 text-xs sm:text-sm text-white/90 gap-2">
            <span className="flex items-center gap-1.5">
              <TrendingDown size={16} /> Total Outflow: <strong>₹{expenses.toLocaleString()}</strong>
            </span>
            <span className="flex items-center gap-1.5 font-bold bg-black/20 px-3 py-1 rounded-full">
              <Calendar size={14} /> Day {state.currentDay} of 30
            </span>
          </div>
        </section>

        {/* Day Progression Stepper & Quick Actions */}
        <section aria-label="Timeline Controls" className="glass rounded-2xl p-5 flex flex-col justify-between border border-zinc-800">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Month Timeline</h3>
            <div className="flex items-center justify-between bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-300">Active Day</span>
              <span className="text-base font-extrabold text-violet-400">Day {state.currentDay} / 30</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => { playClick(); dispatch({ type: 'SET_DAY', payload: state.currentDay - 1 }); }}
              disabled={state.currentDay <= 1}
              className="flex-1 py-2.5 text-xs bg-zinc-900 border border-zinc-700 rounded-xl font-bold disabled:opacity-30 hover:bg-zinc-800 cursor-pointer"
            >
              -1 Day
            </button>
            <button
              onClick={() => { playClick(); dispatch({ type: 'SET_DAY', payload: state.currentDay + 1 }); }}
              disabled={state.currentDay >= 30}
              className="flex-1 py-2.5 text-xs bg-violet-600 font-bold text-white rounded-xl disabled:opacity-30 hover:bg-violet-500 cursor-pointer shadow-lg shadow-violet-600/30"
            >
              Advance ⏩
            </button>
          </div>
        </section>
      </div>

      {/* Commitments & Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section aria-label="Commitments" className="glass rounded-2xl p-5 border border-zinc-800 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Fixed Monthly Commitments</h3>
            <span className="text-[10px] text-zinc-500">Tap to toggle paid</span>
          </div>
          <div className="space-y-2">
            {state.commitments.map((c) => (
              <button
                key={c.id}
                onClick={() => { playClick(); dispatch({ type: 'TOGGLE_COMMITMENT', payload: c.id }); }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  c.paid ? 'bg-zinc-900/40 border-zinc-800 opacity-60' : 'bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-200">{c.emoji} {c.name}</p>
                  <p className="text-[10px] text-zinc-400">₹{c.amount} · Due Day {c.dueDay}</p>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-md ${c.paid ? 'bg-zinc-800 text-zinc-400' : 'bg-amber-500 text-black'}`}>
                  {c.paid ? 'PAID' : 'DUE'}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section aria-label="Subscriptions" className="glass rounded-2xl p-5 border border-zinc-800 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Recurring Subscriptions</h3>
            <span className="text-[10px] text-zinc-500">Auto-drain liquidity</span>
          </div>
          <div className="space-y-2">
            {state.subscriptions.map((s) => (
              <button
                key={s.id}
                onClick={() => { playClick(); dispatch({ type: 'TOGGLE_SUBSCRIPTION', payload: s.id }); }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  s.active ? 'bg-pink-500/10 border-pink-500/30 text-pink-300' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{s.emoji}</span>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-zinc-200">{s.name}</p>
                    <p className="text-[10px] text-zinc-400">₹{s.amount} / month</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-md ${s.active ? 'bg-pink-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                  {s.active ? 'ACTIVE' : 'PAUSED'}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Adulting Emergency RNG Generator */}
      <section aria-label="Random Events" className="glass rounded-2xl p-5 border border-orange-500/20 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={16} /> Adulting Emergency Shock (RNG Simulator)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Test how prepared your cashflow is for random life shocks</p>
          </div>
          <button
            onClick={handleRollLife}
            className="gradient-bg text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 cursor-pointer shadow-md"
          >
            Roll Shock 🎲
          </button>
        </div>

        {surprise && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in space-y-2" role="alert">
            <p className="text-sm font-bold text-red-200">{surprise.description}</p>
            <p className="text-base font-black text-red-400">-₹{surprise.amount}</p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAcceptSurprise}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg text-xs cursor-pointer"
              >
                Accept Financial Shock 😭
              </button>
              <button
                onClick={() => setSurprise(null)}
                className="px-4 bg-zinc-800 text-zinc-400 py-2 rounded-lg text-xs hover:bg-zinc-700 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}