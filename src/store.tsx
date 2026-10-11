import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction } from './types';

const initialState: AppState = {
  budget: 10000,
  currentDay: 8,
  transactions: [
    { id: '1', amount: 10000, category: 'Income', description: 'Monthly allowance 💰', day: 1, type: 'income' },
    { id: '2', amount: 350, category: 'Food', description: 'Groceries 🛒', day: 2, type: 'expense' },
    { id: '3', amount: 120, category: 'Transport', description: 'Metro recharge 🚇', day: 3, type: 'expense' },
    { id: '4', amount: 500, category: 'Food', description: 'Zomato orders 🍔', day: 5, type: 'expense' },
    { id: '5', amount: 200, category: 'Entertainment', description: 'Movie night 🎬', day: 6, type: 'expense' },
    { id: '6', amount: 800, category: 'Shopping', description: 'New t-shirt 👕', day: 7, type: 'expense' },
  ],
  commitments: [
    { id: 'c1', name: 'Room Rent', amount: 3000, dueDay: 1, paid: true, emoji: '🏠' },
    { id: 'c2', name: 'Phone Bill', amount: 500, dueDay: 15, paid: false, emoji: '📱' },
    { id: 'c3', name: 'WiFi Bill', amount: 300, dueDay: 20, paid: false, emoji: '📶' },
  ],
  subscriptions: [
    { id: 's1', name: 'Netflix', amount: 199, emoji: '🎬', active: true },
    { id: 's2', name: 'Spotify', amount: 119, emoji: '🎵', active: true },
    { id: 's3', name: 'YouTube Premium', amount: 129, emoji: '▶️', active: false },
  ],
  savingsGoals: [
    { id: 'g1', name: 'Emergency Fund', target: 2000, saved: 500, emoji: '🆘' },
    { id: 'g2', name: 'New Earbuds', target: 1500, saved: 300, emoji: '🎧' },
  ],
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'ADD_GOAL':
      return { ...state, savingsGoals: [...state.savingsGoals, action.payload] };
    case 'UPDATE_GOAL_SAVED':
      return {
        ...state,
        savingsGoals: state.savingsGoals.map(g =>
          g.id === action.payload.id ? { ...g, saved: Math.min(g.target, g.saved + action.payload.amount) } : g
        ),
      };
    case 'SET_DAY':
      return { ...state, currentDay: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const FinanceContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> } | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('broke-state');
      return saved ? JSON.parse(saved) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem('broke-state', JSON.stringify(state));
  }, [state]);

  return <FinanceContext.Provider value={{ state, dispatch }}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be inside FinanceProvider');
  return ctx;
}