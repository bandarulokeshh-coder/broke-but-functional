export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

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
  | { type: 'RESET_STATE' };