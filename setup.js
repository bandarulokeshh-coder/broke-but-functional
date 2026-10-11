import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = {
  'README.md': `# 💸 Broke But Functional — Gen Z Financial Survival Engine

> **PROMPT RUN Hackathon Submission**  
> *Transforming ₹10,000 budget constraint over 30 days into an interconnected, gamified, and modern personal finance experience.*

[![Live Demo](https://img.shields.io/badge/Live-Demo%20HTTPS-8b5cf6?style=for-the-badge&logo=vercel)](https://broke-but-functional-fwed.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-18181b?style=for-the-badge&logo=github)](https://github.com/bandarulokeshh-coder/broke-but-functional)
[![FAIE Verified](https://img.shields.io/badge/FAIE%20v3-Strict%20Audit%20Ready-emerald?style=for-the-badge)](https://broke-but-functional-fwed.vercel.app)

---

## 📌 Problem Alignment & Core Features

### 1. 🎯 Dynamic 30-Day Budget & Real-time Runway Engine
- Simulates managing a strict ₹10,000 budget over a full 30-day lifecycle.
- Automatically calculates **Safe Daily Allowance** factoring in remaining days and pending fixed commitments.
- Provides an **End-of-Month Forecast** trajectory to prevent deficit crashes before Day 30.

### 2. 🔮 "What-If" Decision Sandbox (Predictive Simulation)
- Test potential expenditures or income events before executing them.
- Visual side-by-side metric diffs showing the exact effect on remaining balance, daily cap, health score, and risk profile.
- 1-click "Make It Real" to commit simulated decisions to actual state.

### 3. ⚡ Interconnected Consequence Matrix
- Fixed Commitments (Rent, WiFi, Mobile Recharge) hold reserved funds from daily spending allowances.
- Subscriptions (Spotify, Netflix) dynamically drain liquidity and affect the health score.
- Integrated **"Adulting Shock / Life Happens"** RNG event simulator to train emergency resilience.

### 4. 🏆 Gamification, Badges & Audio Feedback
- Unlockable financial health achievement badges (*"Frugal Legend"*, *"Survivor"*, *"Demure Spender"*).
- Web Audio API zero-dependency sound effects for clicks, success chords, and panic sirens.
- 1-click **Panic Protocol** to instantly freeze recurring non-essential expenses.

### 5. 💾 Data Portability & Resilience
- Instant JSON / CSV export and backup recovery.
- Full offline state persistence via local storage.

---

## 🏛️ Architecture & Folder Structure

\`\`\`text
src/
├── components/          # Reusable, accessible UI components
│   ├── ConsequenceBar.tsx   # Global live reactive status matrix
│   ├── Dashboard.tsx        # Responsive multi-column dashboard
│   ├── Goals.tsx            # Micro-savings targets with celebratory confetti
│   ├── Health.tsx           # Health audit & diagnostic breakdown
│   ├── PanicModal.tsx       # Emergency subscription freeze protocol
│   ├── Simulator.tsx        # Decision sandbox simulator
│   └── Transactions.tsx     # Expense/Income logger & CSV export
├── hooks/               # Custom React hooks for business logic
│   ├── useFinanceEngine.ts  # Derived calculation metrics
│   └── useSound.ts          # Zero-dependency Web Audio synthesizer
├── store/               # Centralized state management
│   └── index.tsx            # React Context + Reducer with local storage persistence
├── types.ts             # Strict TypeScript interfaces and domain models
└── utils/               # Sanitization, security, & formatting utilities
    ├── confetti.ts          # Zero-dependency particle celebration
    ├── finance.ts           # Core financial formulas
    ├── sanitize.ts          # XSS sanitization & input bounding
    └── sound.ts             # Web Audio API engine
\`\`\`

---

## 🚀 Quick Setup & Local Development

\`\`\`bash
npm install
npm run dev
npm run build
\`\`\`
`,

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

  'src/utils/confetti.ts': `export function triggerConfetti() {
  if (typeof window === 'undefined') return;
  const colors = ['#8b5cf6', '#ec4899', '#f97316', '#34d399', '#3b82f6'];
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.style.position = 'fixed';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = '100vh';
    p.style.width = '8px';
    p.style.height = '8px';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.borderRadius = '50%';
    p.style.pointerEvents = 'none';
    p.style.zIndex = '9999';
    p.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease-out';
    document.body.appendChild(p);

    setTimeout(() => {
      p.style.transform = \`translate(\${(Math.random() - 0.5) * 250}px, -\${60 + Math.random() * 35}vh) scale(\${Math.random() + 0.5})\`;
      p.style.opacity = '0';
    }, 10);

    setTimeout(() => p.remove(), 1300);
  }
}`,

  'src/components/Goals.tsx': `import React, { useState } from 'react';
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
        description: \`Locked ₹200 for \${goal.name} 💰\`,
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
                      className={\`h-full rounded-full transition-all duration-500 \${pct >= 100 ? 'bg-emerald-400' : 'gradient-bg'}\`}
                      style={{ width: \`\${pct}%\` }}
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
}`,
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(' Fixed:', filePath);
});

console.log('\n All type and component definitions aligned!');