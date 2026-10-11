import React from 'react';
import { useFinanceEngine } from '../hooks/useFinanceEngine';
import { ShieldCheck } from 'lucide-react';

export function Health() {
  const { health, risk, forecast, balance } = useFinanceEngine();

  const diagnostics = [
    {
      title: 'Pacing Efficiency',
      status: health > 60 ? 'Optimal' : 'Needs Attention',
      desc: `Spending velocity is ${health > 60 ? 'well within' : 'exceeding'} your ₹333/day baseline.`,
    },
    {
      title: 'Fixed Liability Coverage',
      status: balance >= 1000 ? 'Safe' : 'Critical',
      desc: 'Adequate liquidity reserved to honor rent & utility obligations.',
    },
    {
      title: 'Month-End Survivability',
      status: forecast >= 0 ? 'Surplus' : 'Deficit',
      desc: forecast >= 0 ? `Projected to finish with a surplus of ₹${forecast}.` : 'Projected to exhaust funds prematurely.',
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-base sm:text-lg font-bold text-zinc-200 flex items-center gap-2">
        <ShieldCheck className="text-emerald-400" /> Comprehensive Financial Health Audit 🛡️
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section aria-label="Health Score" className="glass rounded-2xl p-6 text-center border border-zinc-800 flex flex-col justify-center items-center">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Survivability Index</p>
          <div className="text-6xl font-black gradient-text my-2">{health}/100</div>
          <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Risk Profile: <span className={`font-bold ${risk === 'critical' ? 'text-red-400' : 'text-emerald-400'}`}>{risk.toUpperCase()}</span>
          </p>
        </section>

        <section aria-label="Diagnostic Insights" className="glass rounded-2xl p-5 border border-zinc-800 lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Diagnostic Evaluation</h3>
          <div className="space-y-2.5">
            {diagnostics.map((d) => (
              <div key={d.title} className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs sm:text-sm font-bold text-zinc-200">{d.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-violet-300 border border-zinc-700">
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}