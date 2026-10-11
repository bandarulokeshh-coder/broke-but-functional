import React, { useState } from 'react';
import { useFinance } from '../store';
import { sanitizeAmount, sanitizeInput } from '../utils/sanitize';
import { Target, Plus } from 'lucide-react';

export function Goals() {
  const { state, dispatch } = useFinance();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = sanitizeAmount(target);
    const cleanName = sanitizeInput(name);
    if (!cleanAmt || !cleanName) return;

    dispatch({
      type: 'ADD_GOAL',
      payload: { id: 'g-' + Date.now(), name: cleanName, target: cleanAmt, saved: 0, emoji: '🎯' }
    });
    setName('');
    setTarget('');
  };

  const handleSave = (id: string) => {
    dispatch({ type: 'UPDATE_GOAL_SAVED', payload: { id, amount: 200 } });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
        <Target className="text-violet-400" /> Savings Goals 🎯
      </h2>
      <form onSubmit={handleAddGoal} className="glass rounded-xl p-4 space-y-3">
        <input type="text" placeholder="Goal name (e.g., Concert Ticket)" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm" required />
        <input type="number" placeholder="Target ₹" value={target} onChange={e => setTarget(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm" required min="1" />
        <button type="submit" className="w-full gradient-bg py-2 rounded-lg text-xs font-bold">Create Goal ✨</button>
      </form>

      <div className="space-y-3">
        {state.savingsGoals.map(g => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          return (
            <div key={g.id} className="glass rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>{g.emoji} {g.name}</span>
                <span className="text-violet-400">{pct}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full gradient-bg rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-zinc-500">₹{g.saved} / ₹{g.target}</span>
                {pct < 100 && (
                  <button onClick={() => handleSave(g.id)} className="bg-zinc-800 hover:bg-zinc-700 text-xs px-2.5 py-1 rounded-md text-zinc-200">
                    + Add ₹200
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}