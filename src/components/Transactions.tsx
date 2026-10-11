import React, { useState } from 'react';
import { useFinance } from '../store';
import { CATEGORY_EMOJIS } from '../utils/finance';
import { sanitizeInput, sanitizeAmount } from '../utils/sanitize';
import { Plus, Trash2 } from 'lucide-react';

export function Transactions() {
  const { state, dispatch } = useFinance();
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState('Food');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = sanitizeAmount(amt);
    const cleanDesc = sanitizeInput(desc);
    if (!cleanAmt || !cleanDesc) return;

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

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-200">Manage Expenses 💳</h2>
      <form onSubmit={handleAdd} className="glass rounded-xl p-4 space-y-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => setType('expense')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${type === 'expense' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-zinc-800 text-zinc-400'}`}>Expense</button>
          <button type="button" onClick={() => setType('income')} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${type === 'income' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'}`}>Income</button>
        </div>
        <input type="number" placeholder="Amount (₹)" value={amt} onChange={e => setAmt(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm" required min="1" />
        <input type="text" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm" required />
        <select value={cat} onChange={e => setCat(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm">
          {Object.keys(CATEGORY_EMOJIS).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" className="w-full gradient-bg py-2.5 rounded-xl font-bold text-sm cursor-pointer">Add Record</button>
      </form>

      <div className="space-y-2">
        {state.transactions.map(t => (
          <div key={t.id} className="glass rounded-xl p-3 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span>{CATEGORY_EMOJIS[t.category] || '📦'}</span>
              <div>
                <p className="font-semibold">{t.description}</p>
                <p className="text-[10px] text-zinc-500">Day {t.day} · {t.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={t.type === 'income' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount}
              </span>
              <button onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: t.id })} className="text-zinc-600 hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}