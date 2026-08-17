import React from 'react';
import { ShieldCheck, CheckCircle, AlertOctagon, Lock } from 'lucide-react';

interface GuardrailMonitorProps {
  guardrailStatus?: {
    passed: boolean;
    reason?: string;
    gate?: string;
  };
}

export const GuardrailMonitor: React.FC<GuardrailMonitorProps> = ({ guardrailStatus }) => {
  const isBlocked = guardrailStatus && !guardrailStatus.passed;

  return (
    <div className="glass-panel p-5 space-y-3.5">
      <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            3-Gate Guardrail Activity Feed
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
          Strict Mode Active
        </span>
      </div>

      {/* Rejection Alert Banner if Triggered */}
      {isBlocked && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/50 flex items-start space-x-2.5 animate-pulse">
          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs font-mono">
            <span className="font-bold text-rose-300 block">🛑 Guardrail Rejection Triggered</span>
            <span className="text-rose-200/90">{guardrailStatus.reason}</span>
          </div>
        </div>
      )}

      {/* 3 Gates List */}
      <div className="space-y-2 font-mono text-xs">
        {/* Gate 1 */}
        <div className="p-2.5 rounded-xl bg-obsidian-950 border border-slate-800/80 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-300">Gate 1: Input Injection & Jailbreak Guard</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
            isBlocked && guardrailStatus?.gate === 'Gate 1'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {isBlocked && guardrailStatus?.gate === 'Gate 1' ? 'REJECTED' : 'PASSED'}
          </span>
        </div>

        {/* Gate 2 */}
        <div className="p-2.5 rounded-xl bg-obsidian-950 border border-slate-800/80 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300">Gate 2: Centroid Out-of-Domain Filter (&lt;0.20)</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
            isBlocked && guardrailStatus?.gate === 'Gate 2'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {isBlocked && guardrailStatus?.gate === 'Gate 2' ? 'REJECTED' : 'PASSED'}
          </span>
        </div>

        {/* Gate 3 */}
        <div className="p-2.5 rounded-xl bg-obsidian-950 border border-slate-800/80 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">Gate 3: Grounded Citation Validator</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            ENFORCED [1]
          </span>
        </div>
      </div>
    </div>
  );
};
