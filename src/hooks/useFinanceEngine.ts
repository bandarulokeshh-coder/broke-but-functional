import { useFinance } from '../store';
import {
  getRemainingBalance,
  getDailyAllowance,
  getHealthScore,
  getRiskLevel,
  getForecast,
  getTotalExpenses,
  getTotalIncome,
  getUnpaidCommitmentsTotal,
  getActiveSubsTotal,
  getGenZMood,
} from '../utils/finance';

export function useFinanceEngine() {
  const { state, dispatch } = useFinance();

  const balance = getRemainingBalance(state);
  const daily = getDailyAllowance(state);
  const health = getHealthScore(state);
  const risk = getRiskLevel(state);
  const forecast = getForecast(state);
  const expenses = getTotalExpenses(state);
  const income = getTotalIncome(state);
  const unpaidCommitments = getUnpaidCommitmentsTotal(state);
  const activeSubs = getActiveSubsTotal(state);
  const mood = getGenZMood(health, risk);

  return {
    state,
    dispatch,
    balance,
    daily,
    health,
    risk,
    forecast,
    expenses,
    income,
    unpaidCommitments,
    activeSubs,
    mood,
  };
}