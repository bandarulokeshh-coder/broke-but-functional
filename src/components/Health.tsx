import React from 'react';
import { useFinance } from '../store';
import { getHealthScore, getRiskLevel, getDailyAllowance, getForecast, getRemainingBalance } from '../utils/finance';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export function Health() {
  const { state } = useFinance();
  const health = getHealthScore(state);
  const risk = getRiskLevel(state);
  const daily = Math.round(getDailyAllowance(state));
  const forecast = getForecast(state);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
        <ShieldCheck className="text-emerald-400" /> Financial Health Audit
      </h2>
      <div className="glass rounded-2xl p-6 text-center space-y-2">
        <div className="text-5xl font-black gradient-text">{health}/100</div>
        <p className="text-xs text-zinc-400 font-semibold uppercase">Risk Status: <span className="text-emerald-400">{risk}</span></p>
      </div>

      <div className="glass rounded-xl p-4 space-y-2 text-xs">
        <h3 className="font-bold text-zinc-300">Insights & Survival Guide</h3>
        <p className="text-zinc-400">💡 At your current pace, you can safely spend <strong>₹{daily}/day</strong> until Day 30.</p>
        <p className="text-zinc-400">📈 End of Month projected remaining: <strong className={forecast > 0 ? "text-emerald-400" : "text-red-400"}>₹{forecast}</strong>.</p>
      </div>
    </div>
  );
}