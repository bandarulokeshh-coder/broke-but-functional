import { AppState, FinancialSnapshot } from '../types';

export function getTotalExpenses(state: AppState): number {
  return state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalIncome(state: AppState): number {
  return state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getActiveSubscriptionsTotal(state: AppState): number {
  return state.subscriptions
    .filter(s => s.active)
    .reduce((sum, s) => sum + s.amount, 0);
}

export function getUnpaidCommitmentsTotal(state: AppState): number {
  return state.commitments
    .filter(c => !c.paid)
    .reduce((sum, c) => sum + c.amount, 0);
}

export function getRemainingBalance(state: AppState): number {
  return getTotalIncome(state) - getTotalExpenses(state) - getActiveSubscriptionsTotal(state);
}

export function getRemainingDays(state: AppState): number {
  return Math.max(1, 30 - state.currentDay);
}

export function getDailyAllowance(state: AppState): number {
  const balance = getRemainingBalance(state);
  const unpaid = getUnpaidCommitmentsTotal(state);
  return Math.max(0, (balance - unpaid) / getRemainingDays(state));
}

export function getHealthScore(state: AppState): number {
  const balance = getRemainingBalance(state);
  const daily = getDailyAllowance(state);
  const totalIncome = getTotalIncome(state) || 1;
  const spentRatio = getTotalExpenses(state) / totalIncome;
  const expectedRatio = state.currentDay / 30;

  const spendingScore = Math.max(0, Math.min(100, (1 - (spentRatio - expectedRatio)) * 100));
  const riskScore = Math.min(100, (daily / 400) * 100);
  const commitmentScore = balance > getUnpaidCommitmentsTotal(state) ? 100 : Math.max(0, (balance / (getUnpaidCommitmentsTotal(state) || 1)) * 100);

  return Math.round(spendingScore * 0.4 + riskScore * 0.3 + commitmentScore * 0.3);
}

export function getRiskLevel(state: AppState): 'low' | 'medium' | 'high' | 'critical' {
  const daily = getDailyAllowance(state);
  const balance = getRemainingBalance(state);
  if (daily < 50 || balance < 500) return 'critical';
  if (daily < 150) return 'high';
  if (daily < 300) return 'medium';
  return 'low';
}

export function getForecast(state: AppState): number {
  const daily = getDailyAllowance(state);
  return Math.round(getRemainingBalance(state) - (daily * getRemainingDays(state) * 0.8));
}

export function getSnapshot(state: AppState): FinancialSnapshot {
  return {
    remainingBalance: getRemainingBalance(state),
    dailyAllowance: Math.round(getDailyAllowance(state)),
    healthScore: getHealthScore(state),
    riskLevel: getRiskLevel(state),
    forecast: getForecast(state),
  };
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
  { description: 'Phone screen cracked 📱💔', amount: 1500 },
  { description: 'Medical emergency 🏥', amount: 2000 },
  { description: 'Laptop repair 💻🔧', amount: 2500 },
  { description: 'Friend\'s birthday gift 🎁', amount: 500 },
  { description: 'Lost wallet cash 💸', amount: 1000 },
];