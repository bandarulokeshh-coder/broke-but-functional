import { AppState, FinancialSnapshot, RiskLevel } from '../types';

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
];