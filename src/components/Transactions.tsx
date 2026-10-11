import React, { useState } from 'react';
import { useFinanceEngine } from '../hooks/useFinanceEngine';
import { CATEGORY_EMOJIS } from '../utils/finance';
import { sanitizeAmount, sanitizeInput } from '../utils/sanitize';
import { useSound } from '../hooks/useSound';
import { Plus, Trash2, Download } from 'lucide-react';

export function Transactions() {
  const { state, dispatch } = useFinanceEngine();
  const { playClick, playSuccess } = useSound();
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState('Food');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = sanitizeAmount(amt);
    const cleanDesc = sanitizeInput(desc);
    if (!cleanAmt || !cleanDesc) return;

    playSuccess();
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: 'txn-' + Date.now(),
        amount: cleanAmt,
        category: cat,
        description: cleanDesc,
        day: state.currentDay,
        type,
      },
    });

    setDesc('');
    setAmt('');
  };

  const exportCSV = () => {
    playClick();
    const headers = 'ID,Type,Category,Description,Amount,Day\n';
    const rows = state.transactions.map((t) => `${t.id},${t.type},${t.category},"${t.description}",${t.amount},${t.day}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `broke-budget-day${state.currentDay}.csv`;
    a.click();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-200">Cashflow & Transaction Audit 💳</h2>
          <p className="text-xs text-zinc-400">Log expenditures and track your category velocity</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs rounded-xl cursor-pointer"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 border border-zinc-800 space-y-3 lg:col-span-1" aria-label="Add transaction">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Record New Outflow</h3>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { playClick(); setType('expense'); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                type === 'expense' ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              Expense 💸
            </button>
            <button
              type="button"
              onClick={() => { playClick(); setType('income'); }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                type === 'income' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              Income 💰
            </button>
          </div>

          <div>
            <label htmlFor="amount-input" className="text-[10px] text-zinc-400 block mb-1">Amount (₹)</label>
            <input
              id="amount-input"
              type="number"
              min="1"
              max="100000"
              required
              placeholder="e.g. 350"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-violet-500"
            />
          </div>

          <div>
            <label htmlFor="desc-input" className="text-[10px] text-zinc-400 block mb-1">Description</label>
            <input
              id="desc-input"
              type="text"
              required
              maxLength={100}
              placeholder="e.g. Metro recharge, Zomato meal"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-violet-500"
            />
          </div>

          <div>
            <label htmlFor="cat-select" className="text-[10px] text-zinc-400 block mb-1">Category</label>
            <select
              id="cat-select"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100"
            >
              {Object.keys(CATEGORY_EMOJIS).map((c) => (
                <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full gradient-bg text-white font-bold py-3 rounded-xl text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-violet-900/30"
          >
            <Plus size={16} /> Log Entry
          </button>
        </form>

        <section aria-label="Transaction Feed" className="glass rounded-2xl p-5 border border-zinc-800 lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Activity History ({state.transactions.length})</h3>
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {state.transactions.map((t) => (
              <div key={t.id} className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 flex justify-between items-center text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CATEGORY_EMOJIS[t.category] || '📦'}</span>
                  <div>
                    <p className="font-bold text-zinc-200">{t.description}</p>
                    <p className="text-[10px] text-zinc-500">Day {t.day} · {t.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount}
                  </span>
                  <button
                    onClick={() => { playClick(); dispatch({ type: 'DELETE_TRANSACTION', payload: t.id }); }}
                    className="text-zinc-600 hover:text-red-400 p-1 cursor-pointer"
                    aria-label={`Delete transaction ${t.description}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}