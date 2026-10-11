import React, { useState } from 'react';
import { FinanceProvider } from './store';
import { PanicModal } from './components/PanicModal';
import { ConsequenceBar } from './components/ConsequenceBar';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Simulator } from './components/Simulator';
import { Goals } from './components/Goals';
import { Health } from './components/Health';
import { useSound } from './hooks/useSound';
import {
  LayoutDashboard,
  ArrowLeftRight,
  FlaskConical,
  Target,
  ShieldCheck,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';

function MainApp() {
  const [tab, setTab] = useState<'dashboard' | 'transactions' | 'simulator' | 'goals' | 'health'>('dashboard');
  const [panicOpen, setPanicOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const { playClick, playAlert, toggleSound } = useSound();

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playClick();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Cashflow', icon: ArrowLeftRight },
    { id: 'simulator', label: 'Sandbox', icon: FlaskConical },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'health', label: 'Health', icon: ShieldCheck },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      <PanicModal isOpen={panicOpen} onClose={() => setPanicOpen(false)} />

      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-violet-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg text-xs font-bold"
      >
        Skip to main content
      </a>

      {/* Responsive Header */}
      <header className="sticky top-0 z-40 glass border-b border-zinc-800/80 px-4 sm:px-8 py-3.5" role="banner">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-black gradient-text tracking-tight">Broke But Functional</h1>
            <span className="hidden sm:inline-block text-[10px] bg-zinc-900 border border-zinc-800 text-violet-300 px-2.5 py-1 rounded-full font-bold">
              ₹10K / 30-Day Engine
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5" role="navigation" aria-label="Desktop Navigation">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { playClick(); setTab(id); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tab === id ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                aria-current={tab === id ? 'page' : undefined}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { playAlert(); setPanicOpen(true); }}
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[11px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-red-950/40"
              aria-label="Emergency Panic Protocol"
            >
              <Flame size={14} className="text-red-400 animate-pulse" /> PANIC PROTOCOL
            </button>

            <button
              onClick={handleSoundToggle}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              aria-label="Toggle Sound Effects"
            >
              {soundOn ? <Volume2 size={16} className="text-violet-400" /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Viewport */}
      <main id="main-content" className="max-w-6xl mx-auto w-full px-4 sm:px-8 pt-5 pb-24 md:pb-12 flex-1" role="main" tabIndex={-1}>
        <ConsequenceBar />
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'transactions' && <Transactions />}
        {tab === 'simulator' && <Simulator />}
        {tab === 'goals' && <Goals />}
        {tab === 'health' && <Health />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-zinc-800/80 py-2.5 z-50" role="navigation" aria-label="Mobile Navigation">
        <div className="max-w-md mx-auto flex justify-around">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { playClick(); setTab(id); }}
              className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-all cursor-pointer ${
                tab === id ? 'text-violet-400 font-bold scale-105' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              aria-label={label}
              aria-current={tab === id ? 'page' : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <MainApp />
    </FinanceProvider>
  );
}