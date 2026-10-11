import React, { useState } from 'react';
import { useFinanceEngine } from '../hooks/useFinanceEngine';
import { sanitizeAmount, sanitizeInput } from '../utils/sanitize';
import { useSound } from '../hooks/useSound';
import { triggerConfetti } from '../utils/confetti';
import { Target, Award } from 'lucide-react';

export function Goals() {
  const { state, dispatch } = useFinanceEngine();
  const { playSuccess } = useSound();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = sanitizeAmount(target);
    const cleanName = sanitizeInput(name);
    if (!cleanAmt || !cleanName) return;

    playSuccess();
    dispatch({
      type: 'ADD_GOAL',
      payload: {
        id: 'goal-' + Date.now(),
        name: cleanName,
        target: cleanAmt,
        saved: 0,
        emoji: '🎯',
      },
    });
    setName('');
    setTarget('');
  };

  const handleSave = (id: string, goal: typeof state.savingsGoals[0]) => {
    playSuccess();
    dispatch({ type: 'ADD_TO_GOAL', payload: { id, amount: 200 } });
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: 'save-txn-' + Date.now(),
        amount: 200,
        category: 'Other',
        description: `Locked ₹200 for ${goal.name} 💰`,
        day: state.currentDay,
        type: 'expense',
      },
    });

    if (goal.saved + 200 >= goal.target) {
      triggerConfetti();
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-200 flex items-center gap-2">
            <Target className="text-violet-400" /> Micro-Savings Goals & Buffer Funds 🎯
          </h2>
          <p className="text-xs text-zinc-400">Ring-fence capital away from impulsive spending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form onSubmit={handleCreate} className="glass rounded-2xl p-5 border border-zinc-800 space-y-3 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Set New Milestone</h3>

          <div>
            <label htmlFor="goal-name" className="text-[10px] text-zinc-400 block mb-1">Milestone Name</label>
            <input
              id="goal-name"
              type="text"
              required
              placeholder="e.g. Wireless Buds, Roadtrip Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100"
            />
          </div>

          <div>
            <label htmlFor="goal-target" className="text-[10px] text-zinc-400 block mb-1">Target Amount (₹)</label>
            <input
              id="goal-target"
              type="number"
              min="100"
              required
              placeholder="e.g. 1500"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100"
            />
          </div>

          <button
            type="submit"
            className="w-full gradient-bg text-white font-bold py-3 rounded-xl text-xs hover:opacity-90 cursor-pointer shadow-md"
          >
            Create Goal ✨
          </button>
        </form>

        <section aria-label="Goals Progress" className="glass rounded-2xl p-5 border border-zinc-800 lg:col-span-2 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Goals ({state.savingsGoals.length})</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {state.savingsGoals.map((g) => {
              const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
              return (
                <div key={g.id} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-zinc-200">{g.emoji} {g.name}</span>
                    <span className={pct >= 100 ? 'text-emerald-400' : 'text-violet-400'}>{pct}%</span>
                  </div>

                  <div className="h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-emerald-400' : 'gradient-bg'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-1 text-[11px]">
                    <span className="text-zinc-400">₹{g.saved.toLocaleString()} / ₹{g.target.toLocaleString()}</span>
                    {pct < 100 ? (
                      <button
                        onClick={() => handleSave(g.id, g)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1 rounded-lg border border-zinc-700 font-semibold cursor-pointer"
                      >
                        + Lock ₹200
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Award size={14} /> Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}