import React, { useState } from 'react';
import { FinanceProvider } from './store';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Simulator } from './components/Simulator';
import { Goals } from './components/Goals';
import { Health } from './components/Health';
import { LayoutDashboard, ArrowLeftRight, FlaskConical, Target, ShieldCheck } from 'lucide-react';

export default function App() {
  const [tab, setTab] = useState<'dashboard' | 'transactions' | 'simulator' | 'goals' | 'health'>('dashboard');

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-zinc-950 text-white pb-20">
        <header className="sticky top-0 z-40 glass border-b border-zinc-800/80 px-4 py-3">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <h1 className="text-base font-bold gradient-text">Broke But Functional</h1>
            <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-400">Gen Z Budget</span>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-4">
          {tab === 'dashboard' && <Dashboard />}
          {tab === 'transactions' && <Transactions />}
          {tab === 'simulator' && <Simulator />}
          {tab === 'goals' && <Goals />}
          {tab === 'health' && <Health />}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 glass border-t border-zinc-800/80 py-2 z-50">
          <div className="max-w-md mx-auto flex justify-around">
            <button onClick={() => setTab('dashboard')} className={`flex flex-col items-center gap-0.5 ${tab === 'dashboard' ? 'text-violet-400' : 'text-zinc-500'}`}>
              <LayoutDashboard size={18} />
              <span className="text-[10px]">Home</span>
            </button>
            <button onClick={() => setTab('transactions')} className={`flex flex-col items-center gap-0.5 ${tab === 'transactions' ? 'text-violet-400' : 'text-zinc-500'}`}>
              <ArrowLeftRight size={18} />
              <span className="text-[10px]">Spend</span>
            </button>
            <button onClick={() => setTab('simulator')} className={`flex flex-col items-center gap-0.5 ${tab === 'simulator' ? 'text-violet-400' : 'text-zinc-500'}`}>
              <FlaskConical size={18} />
              <span className="text-[10px]">Sandbox</span>
            </button>
            <button onClick={() => setTab('goals')} className={`flex flex-col items-center gap-0.5 ${tab === 'goals' ? 'text-violet-400' : 'text-zinc-500'}`}>
              <Target size={18} />
              <span className="text-[10px]">Goals</span>
            </button>
            <button onClick={() => setTab('health')} className={`flex flex-col items-center gap-0.5 ${tab === 'health' ? 'text-violet-400' : 'text-zinc-500'}`}>
              <ShieldCheck size={18} />
              <span className="text-[10px]">Health</span>
            </button>
          </div>
        </nav>
      </div>
    </FinanceProvider>
  );
}