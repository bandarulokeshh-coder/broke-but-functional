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
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
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
  | { type: 'ADD_COMMITMENT'; payload: Commitment }
  | { type: 'TOGGLE_COMMITMENT_PAID'; payload: string }
  | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
  | { type: 'TOGGLE_SUBSCRIPTION'; payload: string }
  | { type: 'ADD_GOAL'; payload: SavingsGoal }
  | { type: 'UPDATE_GOAL_SAVED'; payload: { id: string; amount: number } }
  | { type: 'SET_DAY'; payload: number }
  | { type: 'RESET' };