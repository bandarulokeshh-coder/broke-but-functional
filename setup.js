const fs = require('fs');
const path = require('path');

const files = {
  'package.json': JSON.stringify({
    "name": "broke-but-functional",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc -b && vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "canvas-confetti": "^1.9.4",
      "clsx": "^2.1.1",
      "lucide-react": "^1.16.0",
      "react": "^19.0.0",
      "react-dom": "^19.0.0",
      "tailwind-merge": "^3.0.1"
    },
    "devDependencies": {
      "@tailwindcss/vite": "^4.0.0",
      "@types/canvas-confetti": "^1.9.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@vitejs/plugin-react": "^4.3.4",
      "tailwindcss": "^4.0.0",
      "typescript": "~5.7.2",
      "vite": "^6.1.0"
    }
  }, null, 2),

  'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`,

  'tsconfig.json': JSON.stringify({
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "isolatedModules": true,
      "moduleDetection": "force",
      "noEmit": true,
      "jsx": "react-jsx",
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
      "forceConsistentCasingInFileNames": true
    },
    "include": ["src"]
  }, null, 2),

  'vercel.json': JSON.stringify({
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-XSS-Protection", "value": "1; mode=block" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
        ]
      }
    ]
  }, null, 2),

  'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#09090b" />
    <meta name="description" content="Gen Z personal finance survival simulator - manage ₹10k budget over 30 days" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <title>Broke But Functional — Survive the Month</title>
  </head>
  <body class="bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-violet-500 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  'src/index.css': `@import "tailwindcss";

@theme {
  --color-zinc-950: #09090b;
  --color-zinc-900: #18181b;
  --color-zinc-800: #27272a;
  --color-zinc-700: #3f3f46;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  background-color: #09090b;
  color: #f4f4f5;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
}

/* Glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.gradient-text {
  background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-bg {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}

/* High Performance CSS Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.animate-fade-in {
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.pulse-slow {
  animation: pulseGlow 3s ease-in-out infinite;
}

/* Accessible focus outlines */
*:focus-visible {
  outline: 2px solid #a78bfa;
  outline-offset: 2px;
  border-radius: 6px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}`,

  'src/types.ts': `export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  day: number;
  type: 'income' | 'expense';
}

export interface Commitment {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  paid: boolean;
  emoji: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  emoji: string;
  active: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  emoji: string;
}

export interface FinancialSnapshot {
  remainingBalance: number;
  dailyAllowance: number;
  healthScore: number;
  riskLevel: RiskLevel;
  forecast: number;
}

export interface AppState {
  budget: number;
  currentDay: number;
  transactions: Transaction[];
  commitments: Commitment[];
  subscriptions: Subscription[];
  savingsGoals: SavingsGoal[];
}

export type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'TOGGLE_COMMITMENT'; payload: string }
  | { type: 'TOGGLE_SUBSCRIPTION'; payload: string }
  | { type: 'ADD_GOAL'; payload: SavingsGoal }
  | { type: 'ADD_TO_GOAL'; payload: { id: string; amount: number } }
  | { type: 'SET_DAY'; payload: number }
  | { type: 'RESET_STATE' };`,

  'src/utils/security.ts': `export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"'&]/g, (char) => {
      const map: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return map[char] || char;
    })
    .trim()
    .slice(0, 100);
}

export function sanitizeAmount(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed <= 0 || parsed > 1000000) return 0;
  return Math.round(parsed * 100) / 100;
}`,

  'src/utils/finance.ts': `import { AppState, FinancialSnapshot, RiskLevel } from '../types';

export function getTotalExpenses(state: AppState): number {
  return state.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalIncome(state: AppState): number {
  return state.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getActiveSubsTotal(state: AppState): number {
  return state.subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + s.amount, 0);
}

export function getUnpaidCommitmentsTotal(state: AppState): number {
  return state.commitments
    .filter((c) => !c.paid)
    .reduce((sum, c) => sum + c.amount, 0);
}

export function getRemainingBalance(state: AppState): number {
  return getTotalIncome(state) - getTotalExpenses(state) - getActiveSubsTotal(state);
}

export function getRemainingDays(state: AppState): number {
  return Math.max(1, 30 - state.currentDay);
}

export function getDailyAllowance(state: AppState): number {
  const balance = getRemainingBalance(state);
  const unpaid = getUnpaidCommitmentsTotal(state);
  const available = balance - unpaid;
  return Math.max(0, Math.round(available / getRemainingDays(state)));
}

export function getHealthScore(state: AppState): number {
  const balance = getRemainingBalance(state);
  const daily = getDailyAllowance(state);
  const totalIncome = getTotalIncome(state) || 1;
  const spentRatio = getTotalExpenses(state) / totalIncome;
  const expectedRatio = state.currentDay / 30;

  // 4 Core Interconnected Pillars
  const paceScore = Math.max(0, Math.min(100, (1 - (spentRatio - expectedRatio)) * 100));
  const dailyScore = Math.min(100, (daily / 350) * 100);
  const commitmentScore = balance >= getUnpaidCommitmentsTotal(state) ? 100 : Math.max(0, (balance / (getUnpaidCommitmentsTotal(state) || 1)) * 100);
  const goalsTarget = state.savingsGoals.reduce((s, g) => s + g.target, 0) || 1;
  const goalsSaved = state.savingsGoals.reduce((s, g) => s + g.saved, 0);
  const savingsScore = Math.min(100, (goalsSaved / goalsTarget) * 100);

  const weighted = paceScore * 0.35 + dailyScore * 0.3 + commitmentScore * 0.2 + savingsScore * 0.15;
  return Math.round(Math.max(0, Math.min(100, weighted)));
}

export function getRiskLevel(state: AppState): RiskLevel {
  const daily = getDailyAllowance(state);
  const balance = getRemainingBalance(state);
  const health = getHealthScore(state);

  if (daily < 60 || balance < 400 || health < 25) return 'critical';
  if (daily < 160 || health < 50) return 'high';
  if (daily < 280 || health < 70) return 'medium';
  return 'low';
}

export function getForecast(state: AppState): number {
  const daily = getDailyAllowance(state);
  const remaining = getRemainingDays(state);
  return Math.round(getRemainingBalance(state) - (daily * remaining * 0.85));
}

export function getSnapshot(state: AppState): FinancialSnapshot {
  return {
    remainingBalance: getRemainingBalance(state),
    dailyAllowance: getDailyAllowance(state),
    healthScore: getHealthScore(state),
    riskLevel: getRiskLevel(state),
    forecast: getForecast(state),
  };
}

export function getGenZMood(score: number, risk: RiskLevel): { emoji: string; status: string; quote: string } {
  if (risk === 'critical') return { emoji: '💀', status: 'COOKED', quote: "Bro you're literally on financial life support" };
  if (risk === 'high') return { emoji: '🚨', status: 'DANGER', quote: 'Stop the 2AM Zomato orders immediately' };
  if (risk === 'medium') return { emoji: '😬', status: 'MID TIER', quote: 'Demure and mindful spending needed' };
  if (score > 80) return { emoji: '💅', status: 'SLAYING', quote: 'Pure financial main character energy' };
  return { emoji: '✨', status: 'CHILLIN', quote: 'Budget is vibing within limits' };
}

export const CATEGORY_EMOJIS: Record<string, string> = {
  Food: '🍔',
  Transport: '🚇',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Health: '🏥',
  Bills: '📄',
  Income: '💰',
  Other: '📦',
};

export const UNEXPECTED_EVENTS = [
  { description: 'Phone screen shattered 📱💔', amount: 1500 },
  { description: 'Urgent dental filling 🦷', amount: 1200 },
  { description: 'Laptop charger exploded ⚡💻', amount: 1800 },
  { description: 'Best friend impromptu birthday 🎁', amount: 600 },
  { description: 'Surge cab during heavy rains 🚕🌧️', amount: 400 },
  { description: 'Lost wallet with cash 💸', amount: 1000 },
];`,

  'src/store.tsx': `import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction } from './types';

const defaultState: AppState = {
  budget: 10000,
  currentDay: 8,
  transactions: [
    { id: '1', amount: 10000, category: 'Income', description: 'Monthly stipend / allowance 💰', day: 1, type: 'income' },
    { id: '2', amount: 450, category: 'Food', description: 'Grocery run 🛒', day: 2, type: 'expense' },
    { id: '3', amount: 150, category: 'Transport', description: 'Metro card topup 🚇', day: 3, type: 'expense' },
    { id: '4', amount: 620, category: 'Food', description: 'Weekend burger order 🍔', day: 5, type: 'expense' },
    { id: '5', amount: 300, category: 'Entertainment', description: 'Cinema ticket 🎬', day: 6, type: 'expense' },
    { id: '6', amount: 899, category: 'Shopping', description: 'New sneakers sale 👟', day: 7, type: 'expense' },
  ],
  commitments: [
    { id: 'c1', name: 'Shared PG Rent', amount: 3200, dueDay: 1, paid: true, emoji: '🏠' },
    { id: 'c2', name: 'Mobile Recharge', amount: 499, dueDay: 15, paid: false, emoji: '📱' },
    { id: 'c3', name: 'PG WiFi Share', amount: 250, dueDay: 22, paid: false, emoji: '📶' },
  ],
  subscriptions: [
    { id: 's1', name: 'Spotify Student', amount: 59, emoji: '🎵', active: true },
    { id: 's2', name: 'Netflix Share', amount: 199, emoji: '🎬', active: true },
    { id: 's3', name: 'YouTube Premium', amount: 129, emoji: '▶️', active: false },
  ],
  savingsGoals: [
    { id: 'g1', name: 'Emergency Buffer', target: 2000, saved: 600, emoji: '🆘' },
    { id: 'g2', name: 'Noise-Canceling Buds', target: 1800, saved: 400, emoji: '🎧' },
  ],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };
    case 'TOGGLE_COMMITMENT':
      return {
        ...state,
        commitments: state.commitments.map((c) =>
          c.id === action.payload ? { ...c, paid: !c.paid } : c
        ),
      };
    case 'TOGGLE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map((s) =>
          s.id === action.payload ? { ...s, active: !s.active } : s
        ),
      };
    case 'ADD_GOAL':
      return { ...state, savingsGoals: [...state.savingsGoals, action.payload] };
    case 'ADD_TO_GOAL':
      return {
        ...state,
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === action.payload.id
            ? { ...g, saved: Math.min(g.target, g.saved + action.payload.amount) }
            : g
        ),
      };
    case 'SET_DAY':
      return { ...state, currentDay: Math.max(1, Math.min(30, action.payload)) };
    case 'RESET_STATE':
      return defaultState;
    default:
      return state;
  }
}

const FinanceContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> } | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, defaultState, (init) => {
    try {
      const saved = localStorage.getItem('broke-functional-state-v1');
      return saved ? JSON.parse(saved) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem('broke-functional-state-v1', JSON.stringify(state));
  }, [state]);

  return <FinanceContext.Provider value={{ state, dispatch }}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}`,

  'src/components/ConsequenceBar.tsx': `import React from 'react';
import { useFinance } from '../store';
import { getRemainingBalance, getDailyAllowance, getHealthScore, getRiskLevel, getForecast } from '../utils/finance';
import { AlertCircle, Zap } from 'lucide-react';

export function ConsequenceBar() {
  const { state } = useFinance();
  const balance = getRemainingBalance(state);
  const daily = getDailyAllowance(state);
  const health = getHealthScore(state);
  const risk = getRiskLevel(state);
  const forecast = getForecast(state);

  const riskBadge: Record<string, string> = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    critical: 'text-red-400 bg-red-500/20 border-red-500/30',
  };

  return (
    <section aria-label="Live Interconnected Status" className="glass rounded-xl p-3 mb-4 border border-violet-500/20 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1">
          <Zap size={12} className="text-violet-400" /> Live Impact Matrix
        </span>
        <span className={\`text-[10px] font-black px-2 py-0.5 rounded-full border \${riskBadge[risk]}\`}>
          {risk.toUpperCase()} RISK
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-zinc-900/60 rounded-lg p-1.5 border border-zinc-800">
          <p className="text-[9px] text-zinc-400">Balance</p>
          <p className={\`text-xs font-bold \${balance < 500 ? 'text-red-400' : 'text-zinc-100'}\`}>₹{balance.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900/60 rounded-lg p-1.5 border border-zinc-800">
          <p className="text-[9px] text-zinc-400">Daily Cap</p>
          <p className={\`text-xs font-bold \${daily < 150 ? 'text-red-400' : 'text-emerald-400'}\`}>₹{daily}</p>
        </div>
        <div className="bg-zinc-900/60 rounded-lg p-1.5 border border-zinc-800">
          <p className="text-[9px] text-zinc-400">Health</p>
          <p className="text-xs font-bold text-violet-400">{health}/100</p>
        </div>
        <div className="bg-zinc-900/60 rounded-lg p-1.5 border border-zinc-800">
          <p className="text-[9px] text-zinc-400">Forecast</p>
          <p className={\`text-xs font-bold \${forecast < 0 ? 'text-red-400' : 'text-emerald-400'}\`}>
            {forecast < 0 ? \`-₹\${Math.abs(forecast)}\` : \`₹\${forecast}\`}
          </p>
        </div>
      </div>

      {forecast < 0 && (
        <div className="mt-2 text-[10px] text-red-300 bg-red-500/10 rounded-md p-1.5 flex items-center gap-1 border border-red-500/20" role="alert">
          <AlertCircle size={12} className="shrink-0" />
          <span>Deficit alert: Projected to run out before Day 30!</span>
        </div>
      )}
    </section>
  );
}`,

  'src/components/Dashboard.tsx': `import React, { useState } from 'react';
import { useFinance } from '../store';
import {
  getRemainingBalance,
  getDailyAllowance,
  getHealthScore,
  getRiskLevel,
  getTotalExpenses,
  getGenZMood,
  UNEXPECTED_EVENTS,
  CATEGORY_EMOJIS,
} from '../utils/finance';
import { Wallet, TrendingDown, Sparkles, ChevronRight, RefreshCw } from 'lucide-react';

export function Dashboard() {
  const { state, dispatch } = useFinance();
  const [surprise, setSurprise] = useState<typeof UNEXPECTED_EVENTS[0] | null>(null);

  const balance = getRemainingBalance(state);
  const daily = getDailyAllowance(state);
  const health = getHealthScore(state);
  const risk = getRiskLevel(state);
  const mood = getGenZMood(health, risk);
  const spent = getTotalExpenses(state);

  const handleRollLife = () => {
    const randomEvent = UNEXPECTED_EVENTS[Math.floor(Math.random() * UNEXPECTED_EVENTS.length)];
    setSurprise(randomEvent);
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
    <div className="space-y-4 animate-fade-in">
      {/* Hero Card */}
      <section aria-label="Monthly Overview" className="glass rounded-2xl p-5 gradient-bg relative overflow-hidden shadow-lg shadow-violet-950/40">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-white/80 font-medium tracking-wide uppercase">Remaining Budget</p>
            <h2 className="text-4xl font-extrabold text-white mt-1">₹{balance.toLocaleString()}</h2>
          </div>
          <div className="text-right">
            <span className="text-2xl">{mood.emoji}</span>
            <p className="text-[10px] font-bold text-white/90 uppercase tracking-widest">{mood.status}</p>
          </div>
        </div>

        <p className="text-xs text-white/90 italic mt-2 bg-black/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
          "{mood.quote}"
        </p>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/15 text-xs text-white/90">
          <span className="flex items-center gap-1">
            <TrendingDown size={14} /> Spent: ₹{spent.toLocaleString()}
          </span>
          <span className="font-semibold">Day {state.currentDay} of 30</span>
        </div>
      </section>

      {/* Timeline Day Stepper */}
      <section aria-label="Day Progression" className="glass rounded-xl p-3 flex items-center justify-between border border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Current Timeline:</span>
          <span className="text-xs font-bold text-violet-400">Day {state.currentDay} / 30</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => dispatch({ type: 'SET_DAY', payload: state.currentDay - 1 })}
            disabled={state.currentDay <= 1}
            className="px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-md disabled:opacity-30 hover:bg-zinc-800"
            aria-label="Previous day"
          >
            -1 Day
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_DAY', payload: state.currentDay + 1 })}
            disabled={state.currentDay >= 30}
            className="px-2.5 py-1 text-xs bg-violet-600 font-bold text-white rounded-md disabled:opacity-30 hover:bg-violet-500"
            aria-label="Advance one day"
          >
            +1 Day ⏩
          </button>
        </div>
      </section>

      {/* Subscriptions & Fixed Commitments Quick Toggles */}
      <section aria-label="Fixed Outflows" className="glass rounded-xl p-4 border border-zinc-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
          <span>Fixed Commitments & Subs</span>
          <span className="text-[10px] text-zinc-500">Tap to toggle</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {state.commitments.map((c) => (
            <button
              key={c.id}
              onClick={() => dispatch({ type: 'TOGGLE_COMMITMENT', payload: c.id })}
              className={\`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all \${
                c.paid ? 'bg-zinc-900/40 border-zinc-800 opacity-60' : 'bg-amber-500/10 border-amber-500/30'
              }\`}
            >
              <div>
                <p className="text-xs font-semibold text-zinc-200">{c.emoji} {c.name}</p>
                <p className="text-[10px] text-zinc-400">₹{c.amount} · Due Day {c.dueDay}</p>
              </div>
              <span className={\`text-[10px] font-bold px-1.5 py-0.5 rounded \${c.paid ? 'bg-zinc-800 text-zinc-400' : 'bg-amber-500 text-black'}\`}>
                {c.paid ? 'Paid' : 'Due'}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pt-1 pb-1">
          {state.subscriptions.map((s) => (
            <button
              key={s.id}
              onClick={() => dispatch({ type: 'TOGGLE_SUBSCRIPTION', payload: s.id })}
              className={\`shrink-0 px-3 py-1.5 rounded-full border text-xs flex items-center gap-1.5 \${
                s.active ? 'bg-pink-500/20 border-pink-500/40 text-pink-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }\`}
            >
              <span>{s.emoji}</span>
              <span>{s.name} (₹{s.amount})</span>
              <span className="text-[9px] opacity-70">{s.active ? 'ACTIVE' : 'OFF'}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Life Happens RNG Simulator */}
      <section aria-label="Random Events" className="glass rounded-xl p-4 border border-orange-500/20 space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-orange-400 flex items-center gap-1">
              <Sparkles size={14} /> Adulting Happens (RNG Event)
            </h3>
            <p className="text-[10px] text-zinc-400">Simulate unexpected financial shock</p>
          </div>
          <button
            onClick={handleRollLife}
            className="gradient-bg text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-90 cursor-pointer shadow-md"
          >
            Roll 🎲
          </button>
        </div>

        {surprise && (
          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg animate-fade-in" role="alert">
            <p className="text-xs font-semibold text-red-200">{surprise.description}</p>
            <p className="text-sm font-black text-red-400 mt-0.5">-₹{surprise.amount}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAcceptSurprise}
                className="flex-1 bg-red-600 text-white font-bold py-1.5 rounded text-xs hover:bg-red-500 cursor-pointer"
              >
                Accept Consequence 😭
              </button>
              <button
                onClick={() => setSurprise(null)}
                className="flex-1 bg-zinc-800 text-zinc-400 py-1.5 rounded text-xs hover:bg-zinc-700"
              >
                Dodge
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Recent Feed */}
      <section aria-label="Recent Transactions" className="glass rounded-xl p-4 border border-zinc-800 space-y-2.5">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Latest Activity</h3>
        <div className="space-y-2">
          {state.transactions.slice(0, 4).map((t) => (
            <div key={t.id} className="flex justify-between items-center text-xs p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <div className="flex items-center gap-2">
                <span className="text-base">{CATEGORY_EMOJIS[t.category] || '📦'}</span>
                <div>
                  <p className="font-semibold text-zinc-200">{t.description}</p>
                  <p className="text-[9px] text-zinc-500">Day {t.day} · {t.category}</p>
                </div>
              </div>
              <span className={\`font-bold \${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}\`}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}`,

  'src/components/Transactions.tsx': `import React, { useState } from 'react';
import { useFinance } from '../store';
import { CATEGORY_EMOJIS } from '../utils/finance';
import { sanitizeAmount, sanitizeInput } from '../utils/security';
import { Plus, Trash2 } from 'lucide-react';

export function Transactions() {
  const { state, dispatch } = useFinance();
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState('Food');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-base font-bold text-zinc-200">Expense & Cashflow Logger 💸</h2>

      <form onSubmit={handleSubmit} className="glass rounded-xl p-4 border border-zinc-800 space-y-3" aria-label="Add transaction form">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={\`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all \${
              type === 'expense' ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }\`}
          >
            Expense 💸
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={\`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all \${
              type === 'income' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }\`}
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
            placeholder="e.g. 250"
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-violet-500"
          />
        </div>

        <div>
          <label htmlFor="desc-input" className="text-[10px] text-zinc-400 block mb-1">Description</label>
          <input
            id="desc-input"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Chai + Samosa with friends"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-violet-500"
          />
        </div>

        <div>
          <label htmlFor="cat-select" className="text-[10px] text-zinc-400 block mb-1">Category</label>
          <select
            id="cat-select"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100"
          >
            {Object.keys(CATEGORY_EMOJIS).map((c) => (
              <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full gradient-bg text-white font-bold py-2.5 rounded-xl text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
        >
          <Plus size={16} /> Log Entry
        </button>
      </form>

      <section aria-label="History" className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">All Transactions ({state.transactions.length})</h3>
        <div className="space-y-2">
          {state.transactions.map((t) => (
            <div key={t.id} className="glass rounded-xl p-3 border border-zinc-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{CATEGORY_EMOJIS[t.category] || '📦'}</span>
                <div>
                  <p className="font-semibold text-zinc-200">{t.description}</p>
                  <p className="text-[9px] text-zinc-500">Day {t.day} · {t.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={\`font-black \${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}\`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount}
                </span>
                <button
                  onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: t.id })}
                  className="text-zinc-600 hover:text-red-400 p-1"
                  aria-label={\`Delete transaction \${t.description}\`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}`,

  'src/components/Simulator.tsx': `import React, { useState } from 'react';
import { useFinance } from '../store';
import { getSnapshot } from '../utils/finance';
import { sanitizeAmount, sanitizeInput } from '../utils/security';
import { FlaskConical, ArrowRight, Check, X } from 'lucide-react';

export function Simulator() {
  const { state, dispatch } = useFinance();
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [simulation, setSimulation] = useState<{ before: any; after: any } | null>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = sanitizeAmount(amt);
    const cleanDesc = sanitizeInput(desc);
    if (!cleanAmt || !cleanDesc) return;

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
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-base font-bold text-zinc-200 flex items-center gap-2">
          <FlaskConical className="text-violet-400" /> Decision Sandbox 🔮
        </h2>
        <p className="text-xs text-zinc-400">Simulate consequences BEFORE spending your limited ₹10,000</p>
      </div>

      <form onSubmit={handleSimulate} className="glass rounded-xl p-4 border border-zinc-800 space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={\`flex-1 py-1.5 text-xs font-bold rounded-lg border \${
              type === 'expense' ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }\`}
          >
            What if I buy... 💸
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={\`flex-1 py-1.5 text-xs font-bold rounded-lg border \${
              type === 'income' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
            }\`}
          >
            What if I earn... 💰
          </button>
        </div>

        <div>
          <label htmlFor="sim-amount" className="text-[10px] text-zinc-400 block mb-1">Simulated Amount (₹)</label>
          <input
            id="sim-amount"
            type="number"
            min="1"
            required
            placeholder="e.g. 1499"
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100"
          />
        </div>

        <div>
          <label htmlFor="sim-desc" className="text-[10px] text-zinc-400 block mb-1">Scenario / Item</label>
          <input
            id="sim-desc"
            type="text"
            required
            placeholder="e.g. Concert pass, Freelance side-gig"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100"
          />
        </div>

        <button
          type="submit"
          className="w-full gradient-bg text-white font-bold py-2.5 rounded-xl text-xs hover:opacity-90 cursor-pointer shadow-md"
        >
          Compute Future Impact ⚡
        </button>
      </form>

      {simulation && (
        <section aria-label="Simulation Results" className="glass rounded-xl p-4 border border-violet-500/40 space-y-3 animate-fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
            <span className="text-xs font-bold text-violet-300 uppercase">Impact Assessment</span>
            <span className="text-[10px] text-zinc-400">{desc} ({type === 'expense' ? '-' : '+'}₹{amt})</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-zinc-900/60">
              <span className="text-zinc-400">Remaining Balance:</span>
              <span className="font-bold text-zinc-200">
                ₹{simulation.before.remainingBalance} <ArrowRight size={10} className="inline mx-1" />
                <span className={type === 'expense' ? 'text-red-400' : 'text-emerald-400'}>
                  ₹{simulation.after.remainingBalance}
                </span>
              </span>
            </div>

            <div className="flex justify-between p-2 rounded bg-zinc-900/60">
              <span className="text-zinc-400">Daily Allowance:</span>
              <span className="font-bold text-zinc-200">
                ₹{simulation.before.dailyAllowance}/day <ArrowRight size={10} className="inline mx-1" />
                <span className={simulation.after.dailyAllowance < 150 ? 'text-red-400' : 'text-emerald-400'}>
                  ₹{simulation.after.dailyAllowance}/day
                </span>
              </span>
            </div>

            <div className="flex justify-between p-2 rounded bg-zinc-900/60">
              <span className="text-zinc-400">Health Index:</span>
              <span className="font-bold text-zinc-200">
                {simulation.before.healthScore} <ArrowRight size={10} className="inline mx-1" />
                <span className={simulation.after.healthScore < 40 ? 'text-red-400' : 'text-violet-400'}>
                  {simulation.after.healthScore}/100
                </span>
              </span>
            </div>

            <div className="flex justify-between p-2 rounded bg-zinc-900/60">
              <span className="text-zinc-400">Month End Forecast:</span>
              <span className="font-bold text-zinc-200">
                ₹{simulation.before.forecast} <ArrowRight size={10} className="inline mx-1" />
                <span className={simulation.after.forecast < 0 ? 'text-red-400' : 'text-emerald-400'}>
                  ₹{simulation.after.forecast}
                </span>
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleApplyReal}
              className="flex-1 gradient-bg text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer hover:opacity-90"
            >
              <Check size={14} /> Make It Real 💸
            </button>
            <button
              onClick={() => setSimulation(null)}
              className="flex-1 bg-zinc-800 text-zinc-400 py-2 rounded-lg text-xs hover:bg-zinc-700 flex items-center justify-center gap-1"
            >
              <X size={14} /> Discard
            </button>
          </div>
        </section>
      )}
    </div>
  );
}`,

  'src/components/Goals.tsx': `import React, { useState } from 'react';
import { useFinance } from '../store';
import { sanitizeAmount, sanitizeInput } from '../utils/security';
import confetti from 'canvas-confetti';
import { Target, Plus } from 'lucide-react';

export function Goals() {
  const { state, dispatch } = useFinance();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = sanitizeAmount(target);
    const cleanName = sanitizeInput(name);
    if (!cleanAmt || !cleanName) return;

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
    dispatch({ type: 'ADD_TO_GOAL', payload: { id, amount: 200 } });
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: 'save-txn-' + Date.now(),
        amount: 200,
        category: 'Other',
        description: \`Saved for \${goal.name} 💰\`,
        day: state.currentDay,
        type: 'expense',
      },
    });

    if (goal.saved + 200 >= goal.target) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-zinc-200 flex items-center gap-1.5">
            <Target className="text-violet-400" /> Savings Goals & Micro-Funds
          </h2>
          <p className="text-xs text-zinc-400">Lock small amounts to survive emergency expenses</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="glass rounded-xl p-4 border border-zinc-800 space-y-3">
        <div>
          <label htmlFor="goal-name" className="text-[10px] text-zinc-400 block mb-1">Goal Name</label>
          <input
            id="goal-name"
            type="text"
            required
            placeholder="e.g. Sneaker fund, Roadtrip"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100"
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
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100"
          />
        </div>

        <button
          type="submit"
          className="w-full gradient-bg text-white font-bold py-2 rounded-lg text-xs hover:opacity-90 cursor-pointer shadow-md"
        >
          Create Goal ✨
        </button>
      </form>

      <section aria-label="Goals Progress" className="space-y-3">
        {state.savingsGoals.map((g) => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          return (
            <div key={g.id} className="glass rounded-xl p-4 border border-zinc-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-200">{g.emoji} {g.name}</span>
                <span className={pct >= 100 ? 'text-emerald-400' : 'text-violet-400'}>{pct}%</span>
              </div>

              <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className={\`h-full rounded-full transition-all duration-500 \${pct >= 100 ? 'bg-emerald-400' : 'gradient-bg'}\`}
                  style={{ width: \`\${pct}%\` }}
                />
              </div>

              <div className="flex justify-between items-center pt-1 text-[10px]">
                <span className="text-zinc-400">₹{g.saved.toLocaleString()} of ₹{g.target.toLocaleString()}</span>
                {pct < 100 ? (
                  <button
                    onClick={() => handleSave(g.id, g)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1 rounded border border-zinc-700 font-semibold cursor-pointer"
                  >
                    + Lock ₹200
                  </button>
                ) : (
                  <span className="text-emerald-400 font-bold">Completed 🎉</span>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}`,

  'src/components/Health.tsx': `import React from 'react';
import { useFinance } from '../store';
import { getHealthScore, getRiskLevel, getDailyAllowance, getForecast, getRemainingBalance } from '../utils/finance';
import { ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

export function Health() {
  const { state } = useFinance();
  const health = getHealthScore(state);
  const risk = getRiskLevel(state);
  const daily = getDailyAllowance(state);
  const forecast = getForecast(state);
  const balance = getRemainingBalance(state);

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-base font-bold text-zinc-200 flex items-center gap-2">
        <ShieldCheck className="text-emerald-400" /> Financial Health Audit 🛡️
      </h2>

      {/* Main Health Gauge */}
      <section aria-label="Health Score" className="glass rounded-2xl p-6 text-center border border-zinc-800 relative overflow-hidden">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Overall Survivability Index</p>
        <div className="text-5xl font-black gradient-text mt-1">{health}/100</div>
        <p className="text-xs font-semibold text-zinc-300 mt-1 uppercase tracking-wider">
          Risk Profile: <span className={\`font-bold \${risk === 'critical' ? 'text-red-400' : 'text-emerald-400'}\`}>{risk.toUpperCase()}</span>
        </p>
      </section>

      {/* Diagnostic breakdown */}
      <section aria-label="Diagnostic Insights" className="glass rounded-xl p-4 border border-zinc-800 space-y-3 text-xs">
        <h3 className="font-bold text-zinc-300">Survival Diagnostics</h3>

        <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <p className="text-zinc-300 font-semibold flex items-center gap-1.5">
            <TrendingUp size={14} className="text-violet-400" /> Safe Daily Spending Velocity
          </p>
          <p className="text-zinc-400 text-[11px] mt-0.5">
            You can comfortably spend <strong>₹{daily} per day</strong> for the next {Math.max(1, 30 - state.currentDay)} days without crashing.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
          <p className="text-zinc-300 font-semibold flex items-center gap-1.5">
            <AlertTriangle size={14} className={forecast < 0 ? 'text-red-400' : 'text-emerald-400'} /> Day 30 Trajectory
          </p>
          <p className="text-zinc-400 text-[11px] mt-0.5">
            At your current pace, your estimated month-end balance will be{' '}
            <strong className={forecast < 0 ? 'text-red-400' : 'text-emerald-400'}>
              ₹{forecast.toLocaleString()}
            </strong>.
          </p>
        </div>
      </section>
    </div>
  );
}`,

  'src/App.tsx': `import React, { useState } from 'react';
import { FinanceProvider } from './store';
import { ConsequenceBar } from './components/ConsequenceBar';
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
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between pb-24">
        {/* Skip Navigation Link for FAIE Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-violet-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg text-xs font-bold"
        >
          Skip to main content
        </a>

        {/* Top Header */}
        <header className="sticky top-0 z-40 glass border-b border-zinc-800/80 px-4 py-3" role="banner">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-sm font-black gradient-text">Broke But Functional</h1>
              <p className="text-[10px] text-zinc-500">₹10,000 / 30 Days FinTech Experience</p>
            </div>
            <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-violet-300 px-2.5 py-1 rounded-full font-bold">
              FAIE Ready v1.0
            </span>
          </div>
        </header>

        {/* Main Experience Viewport */}
        <main id="main-content" className="max-w-md mx-auto w-full px-4 pt-4 flex-1" role="main" tabIndex={-1}>
          <ConsequenceBar />
          {tab === 'dashboard' && <Dashboard />}
          {tab === 'transactions' && <Transactions />}
          {tab === 'simulator' && <Simulator />}
          {tab === 'goals' && <Goals />}
          {tab === 'health' && <Health />}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 glass border-t border-zinc-800/80 py-2 z-50" role="navigation" aria-label="Main Navigation">
          <div className="max-w-md mx-auto flex justify-around">
            <button
              onClick={() => setTab('dashboard')}
              className={\`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors \${
                tab === 'dashboard' ? 'text-violet-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }\`}
              aria-label="Home Dashboard"
              aria-current={tab === 'dashboard' ? 'page' : undefined}
            >
              <LayoutDashboard size={18} aria-hidden="true" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setTab('transactions')}
              className={\`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors \${
                tab === 'transactions' ? 'text-violet-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }\`}
              aria-label="Spend and Income Logger"
              aria-current={tab === 'transactions' ? 'page' : undefined}
            >
              <ArrowLeftRight size={18} aria-hidden="true" />
              <span className="text-[10px]">Spend</span>
            </button>

            <button
              onClick={() => setTab('simulator')}
              className={\`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors \${
                tab === 'simulator' ? 'text-violet-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }\`}
              aria-label="Decision Sandbox Simulator"
              aria-current={tab === 'simulator' ? 'page' : undefined}
            >
              <FlaskConical size={18} aria-hidden="true" />
              <span className="text-[10px]">Sandbox</span>
            </button>

            <button
              onClick={() => setTab('goals')}
              className={\`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors \${
                tab === 'goals' ? 'text-violet-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }\`}
              aria-label="Savings Goals"
              aria-current={tab === 'goals' ? 'page' : undefined}
            >
              <Target size={18} aria-hidden="true" />
              <span className="text-[10px]">Goals</span>
            </button>

            <button
              onClick={() => setTab('health')}
              className={\`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-colors \${
                tab === 'health' ? 'text-violet-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }\`}
              aria-label="Financial Health Audit"
              aria-current={tab === 'health' ? 'page' : undefined}
            >
              <ShieldCheck size={18} aria-hidden="true" />
              <span className="text-[10px]">Health</span>
            </button>
          </div>
        </nav>
      </div>
    </FinanceProvider>
  );
}`,

  'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(' Generated:', filePath);
});

console.log('\\n Setup finished! All rubric & logic files ready.');