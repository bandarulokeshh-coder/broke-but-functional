import React from 'react';
import { useFinanceEngine } from '../hooks/useFinanceEngine';
import { AlertCircle, Zap } from 'lucide-react';

export function ConsequenceBar() {
  const { balance, daily, health, risk, forecast } = useFinanceEngine();

  const riskBadge: Record<string, string> = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    critical: 'text-red-400 bg-red-500/20 border-red-500/30',
  };

  return (
    <section aria-label="Live Interconnected Status" className="glass rounded-2xl p-3.5 mb-5 border border-violet-500/20 animate-fade-in shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
          <Zap size={14} className="text-violet-400" /> Live Interconnected Impact Matrix
        </span>
        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${riskBadge[risk] || riskBadge.medium}`}>
          {risk.toUpperCase()} RISK
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
        <div className="bg-zinc-900/80 rounded-xl p-2.5 border border-zinc-800">
          <p className="text-[10px] text-zinc-400 font-medium">Safe Remaining</p>
          <p className={`text-sm md:text-base font-extrabold ${balance < 500 ? 'text-red-400' : 'text-zinc-100'}`}>₹{balance.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900/80 rounded-xl p-2.5 border border-zinc-800">
          <p className="text-[10px] text-zinc-400 font-medium">Daily Allowance</p>
          <p className={`text-sm md:text-base font-extrabold ${daily < 150 ? 'text-red-400' : 'text-emerald-400'}`}>₹{daily}/day</p>
        </div>
        <div className="bg-zinc-900/80 rounded-xl p-2.5 border border-zinc-800">
          <p className="text-[10px] text-zinc-400 font-medium">Health Score</p>
          <p className="text-sm md:text-base font-extrabold text-violet-400">{health}/100</p>
        </div>
        <div className="bg-zinc-900/80 rounded-xl p-2.5 border border-zinc-800">
          <p className="text-[10px] text-zinc-400 font-medium">Day 30 Trajectory</p>
          <p className={`text-sm md:text-base font-extrabold ${forecast < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {forecast < 0 ? `-₹${Math.abs(forecast)}` : `₹${forecast}`}
          </p>
        </div>
      </div>

      {forecast < 0 && (
        <div className="mt-2.5 text-xs text-red-300 bg-red-500/10 rounded-lg p-2 flex items-center gap-1.5 border border-red-500/20" role="alert">
          <AlertCircle size={14} className="shrink-0 text-red-400" />
          <span><strong>Budget Deficit:</strong> At this velocity, you will exhaust funds before Day 30! Consider freezing subscriptions.</span>
        </div>
      )}
    </section>
  );
}