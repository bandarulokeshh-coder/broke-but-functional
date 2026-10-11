import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
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
}