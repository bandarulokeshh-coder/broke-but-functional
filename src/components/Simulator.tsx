import React, { useState } from 'react';
import { useFinanceEngine } from '../hooks/useFinanceEngine';
import { getSnapshot } from '../utils/finance';
import { sanitizeAmount, sanitizeInput } from '../utils/sanitize';
import { useSound } from '../hooks/useSound';
import { FlaskConical, ArrowRight, Check } from 'lucide-react';

export function Simulator() {
  const { state, dispatch } = useFinanceEngine();
  const { playClick, playSuccess } = useSound();
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [simulation, setSimulation] = useState<{ before: any; after: any } | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = sanitizeAmount(amt);
    const cleanDesc = sanitizeInput(desc);
    if (!cleanAmt || !cleanDesc) return;

    playClick();
    const before = getSnapshot(state);
    const mockState = {
      ...state,
      transactions: [
        {
          id: 'mock-sim',
          amount: cleanAmt,
          category: 'Simulation',
          description: cleanDesc,
          day: state.currentDay,
          type,
        },
        ...state.transactions,
      ],
    };
    const after = getSnapshot(mockState);
    setSimulation({ before, after });
  };

  const handleApplyReal = () => {
    if (!simulation) return;
    playSuccess();
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: 'applied-sim-' + Date.now(),
        amount: sanitizeAmount(amt),
        category: 'Other',
        description: sanitizeInput(desc),
        day: state.currentDay,
        type,
      },
    });
    setSimulation(null);
    setDesc('');
    setAmt('');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-zinc-200 flex items-center gap-2">
          <FlaskConical className="text-violet-400" /> Decision Sandbox Simulator 🔮
        </h2>
        <p className="text-xs text-zinc-400">Pre-compute the consequences of your financial decisions before committing money</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <form onSubmit={handleSimulate} className="glass rounded-2xl p-5 border border-zinc-800 space-y-3.5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { playClick(); setType('expense'); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border cursor-pointer ${
                type === 'expense' ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              Simulate Purchase 💸
            </button>
            <button
              type="button"
              onClick={() => { playClick(); setType('income'); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border cursor-pointer ${
                type === 'income' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              Simulate Income / Side-Gig 💰
            </button>
          </div>

          <div>
            <label htmlFor="sim-amount" className="text-[10px] text-zinc-400 block mb-1">Simulated Amount (₹)</label>
            <input
              id="sim-amount"
              type="number"
              min="1"
              required
              placeholder="e.g. 1999"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100"
            />
          </div>

          <div>
            <label htmlFor="sim-desc" className="text-[10px] text-zinc-400 block mb-1">Hypothetical Scenario</label>
            <input
              id="sim-desc"
              type="text"
              required
              placeholder="e.g. Buying concert tickets, Freelance payout"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100"
            />
          </div>

          <button
            type="submit"
            className="w-full gradient-bg text-white font-bold py-3 rounded-xl text-xs hover:opacity-90 cursor-pointer shadow-lg shadow-violet-950/40"
          >
            Run Predictive Simulation ⚡
          </button>
        </form>

        <section aria-label="Simulation Output" className="glass rounded-2xl p-5 border border-zinc-800 flex flex-col justify-center">
          {simulation ? (
            <div className="space-y-3.5 animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-xs font-bold text-violet-300 uppercase">Predicted Impact</span>
                <span className="text-xs text-zinc-400">{desc} ({type === 'expense' ? '-' : '+'}₹{amt})</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Remaining Balance:</span>
                  <span className="font-bold text-zinc-200">
                    ₹{simulation.before.remainingBalance} <ArrowRight size={12} className="inline mx-1" />
                    <span className={type === 'expense' ? 'text-red-400' : 'text-emerald-400'}>
                      ₹{simulation.after.remainingBalance}
                    </span>
                  </span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Daily Allowance:</span>
                  <span className="font-bold text-zinc-200">
                    ₹{simulation.before.dailyAllowance}/day <ArrowRight size={12} className="inline mx-1" />
                    <span className={simulation.after.dailyAllowance < 150 ? 'text-red-400' : 'text-emerald-400'}>
                      ₹{simulation.after.dailyAllowance}/day
                    </span>
                  </span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">Health Index:</span>
                  <span className="font-bold text-zinc-200">
                    {simulation.before.healthScore} <ArrowRight size={12} className="inline mx-1" />
                    <span className={simulation.after.healthScore < 40 ? 'text-red-400' : 'text-violet-400'}>
                      {simulation.after.healthScore}/100
                    </span>
                  </span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-zinc-400">End-of-Month Forecast:</span>
                  <span className="font-bold text-zinc-200">
                    ₹{simulation.before.forecast} <ArrowRight size={12} className="inline mx-1" />
                    <span className={simulation.after.forecast < 0 ? 'text-red-400' : 'text-emerald-400'}>
                      ₹{simulation.after.forecast}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleApplyReal}
                  className="flex-1 gradient-bg text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90"
                >
                  <Check size={16} /> Commit Decision 💸
                </button>
                <button
                  onClick={() => setSimulation(null)}
                  className="px-4 bg-zinc-800 text-zinc-400 py-2.5 rounded-xl text-xs hover:bg-zinc-700 cursor-pointer"
                >
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-zinc-500">
              <FlaskConical size={36} className="mx-auto mb-2 opacity-40 text-violet-400" />
              <p className="text-xs">Enter a hypothetical expense or gig earning to calculate the consequence trajectory.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}