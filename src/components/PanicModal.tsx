import React from 'react';
import { useFinance } from '../store';
import { useSound } from '../hooks/useSound';
import { ShieldAlert, ZapOff } from 'lucide-react';

export function PanicModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, dispatch } = useFinance();
  const { playAlert } = useSound();

  if (!isOpen) return null;

  const handleExecuteSurvival = () => {
    playAlert();
    state.subscriptions.forEach((s) => {
      if (s.active) dispatch({ type: 'TOGGLE_SUBSCRIPTION', payload: s.id });
    });
    onClose();
  };

  const activeSubsSum = state.subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true">
      <div className="glass max-w-sm w-full rounded-2xl p-5 border border-red-500/40 space-y-3">
        <div className="flex items-center gap-2 text-red-400">
          <ShieldAlert size={24} className="animate-bounce" />
          <h3 className="font-black text-sm uppercase tracking-wider">Survival Emergency Protocol</h3>
        </div>
        <p className="text-xs text-zinc-300">
          Running out of cash? Triggering <strong>Panic Protocol</strong> will immediately pause all active recurring subscriptions to protect liquidity.
        </p>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 text-xs text-red-300">
          ⚡ Instant monthly liquidity unlocked: <strong>₹{activeSubsSum}</strong>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleExecuteSurvival}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black text-xs py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-1"
          >
            <ZapOff size={14} /> ENGAGE PANIC PROTOCOL
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-zinc-800 text-zinc-400 text-xs rounded-xl hover:bg-zinc-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}