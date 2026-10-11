import React, { useState } from 'react';
import { useFinance } from '../store';
import { getSnapshot } from '../utils/finance';
import { sanitizeAmount, sanitizeInput } from '../utils/sanitize';
import { FlaskConical, ArrowRight } from 'lucide-react';

export function Simulator() {
  const { state, dispatch } = useFinance();
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [simulated, setSimulated] = useState<{ before: any; after: any } | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = sanitizeAmount(amt);
    if (!val) return;

    const before = getSnapshot(state);
    const mockState = {
      ...state,
      transactions: [...state.transactions, { id: 'sim', amount: val, category: 'Other', description: desc, day: state.currentDay, type: 'expense' as const }]
    };
    const after = getSnapshot(mockState);
    setSimulated({ before, after });
  };

  const handleCommit = () => {
    if (!simulated) return;
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: 'real-' + Date.now(),
        amount: sanitizeAmount(amt),
        category: 'Other',
        description: sanitizeInput(desc),
        day: state.currentDay,
        type: 'expense'
      }
    });
    setSimulated(null);
    setAmt('');
    setDesc('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
          <FlaskConical className="text-violet-400" /> Decision Sandbox 🔮
        </h2>
        <p className="text-xs text-zinc-400">Test spending decisions before you spend!</p>
      </div>

      <form onSubmit={handleSimulate} className="glass rounded-xl p-4 space-y-3">
        <input type="number" placeholder="Simulate spending ₹..." value={amt} onChange={e => setAmt(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm" required min="1" />
        <input type="text" placeholder="What's this for? (e.g., New Jacket)" value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm" required />
        <button type="submit" className="w-full gradient-bg py-2.5 rounded-xl font-bold text-sm cursor-pointer">Simulate Consequence ⚡</button>
      </form>

      {simulated && (
        <div className="glass rounded-xl p-4 border border-violet-500/30 space-y-3">
          <h3 className="text-xs font-bold text-violet-300 uppercase">Simulated Impact</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Remaining Balance:</span>
              <span className="font-bold text-white">₹{simulated.before.remainingBalance} <ArrowRight size={10} className="inline mx-1"/> <span className="text-red-400">₹{simulated.after.remainingBalance}</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Daily Allowance:</span>
              <span className="font-bold text-white">₹{simulated.before.dailyAllowance} <ArrowRight size={10} className="inline mx-1"/> <span className="text-red-400">₹{simulated.after.dailyAllowance}</span></span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Health Score:</span>
              <span className="font-bold text-white">{simulated.before.healthScore} <ArrowRight size={10} className="inline mx-1"/> <span className="text-amber-400">{simulated.after.healthScore}</span></span>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleCommit} className="flex-1 gradient-bg py-2 rounded-lg font-bold text-xs cursor-pointer">Make It Real 💸</button>
            <button onClick={() => setSimulated(null)} className="flex-1 bg-zinc-800 text-zinc-400 py-2 rounded-lg text-xs">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}