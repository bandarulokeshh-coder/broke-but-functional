import { getRemainingBalance, getDailyAllowance, getHealthScore } from '../utils/finance';
import { AppState } from '../types';

const mockState: AppState = {
  budget: 10000,
  currentDay: 10,
  transactions: [
    { id: '1', amount: 10000, category: 'Income', description: 'Allowance', day: 1, type: 'income' },
    { id: '2', amount: 2000, category: 'Food', description: 'Groceries', day: 2, type: 'expense' },
  ],
  commitments: [],
  subscriptions: [],
  savingsGoals: [],
};

export function runFinanceTests(): boolean {
  const balance = getRemainingBalance(mockState);
  if (balance !== 8000) throw new Error('Balance test failed');

  const daily = getDailyAllowance(mockState);
  if (daily !== 400) throw new Error('Daily allowance test failed');

  const health = getHealthScore(mockState);
  if (health < 0 || health > 100) throw new Error('Health bounds test failed');

  return true;
}