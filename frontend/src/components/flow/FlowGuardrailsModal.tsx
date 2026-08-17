import React from 'react';
import { ShieldCheck, Lock, X, ShieldAlert } from 'lucide-react';
import { GuardrailStatus } from '../../types';

interface FlowGuardrailsModalProps {
  status?: GuardrailStatus;
  isOpen: boolean;
  onClose: () => void;
}

export const FlowGuardrailsModal: React.FC<FlowGuardrailsModalProps> = ({
  status,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const gates = [
    {
      gate: 'Gate 1',
      name: 'Input Jailbreak & System Prompt Exfiltration Guard',
      desc: 'Pattern matching & adversarial embeddings to block system prompt extraction and instruction overrides before retrieval.',
      status: status?.injection_detected ? 'REJECTED' : 'PASSED',
      statusColor: status?.injection_detected
        ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      gate: 'Gate 2',
      name: 'Corpus Centroid Out-of-Domain Distance Filter',
      desc: 'Cosine distance check against MSMARCO-XI centroid (>0.45). Blocks gibberish and off-corpus queries prior to LLM generation.',
      status: status?.out_of_domain ? 'REJECTED' : 'PASSED',
      statusColor: status?.out_of_domain
        ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      gate: 'Gate 3',
      name: 'Grounded Citation Validator & Faithfulness Check',
      desc: 'Enforces that every factual statement in the generated answer has a matching citation [N] from retrieved sources.',
      status: status?.grounding_failed ? 'REJECTED' : 'ENFORCED',
      statusColor: status?.grounding_failed
        ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
        : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-obsidian-950/95 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-mono">
                3-Gate Safety & Guardrail Activity Monitor
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Real-Time Jailbreak Defense • Cosine Centroid Rejection • Strict Citation Grounding
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Gates List */}
        <div className="space-y-3 font-mono">
          {gates.map((g, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-white/25 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-200">{g.gate}: {g.name}</span>
                </div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${g.statusColor}`}>
                  {g.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {g.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Refusal Reason if any */}
        {status?.reason && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Guardrail Rejection Notice:</span>
              <span className="text-rose-200/90 font-sans">{status.reason}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
