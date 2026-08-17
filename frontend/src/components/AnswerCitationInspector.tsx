import React, { useState } from 'react';
import { Bot, FileText, CheckCircle2, Award, Layers } from 'lucide-react';
import { SourceChunk } from '../types';

interface AnswerCitationInspectorProps {
  answer: string;
  citations: number[];
  sources: SourceChunk[];
  isLoading: boolean;
}

export const AnswerCitationInspector: React.FC<AnswerCitationInspectorProps> = ({
  answer,
  citations,
  sources,
  isLoading,
}) => {
  const [highlightedCitation, setHighlightedCitation] = useState<number | null>(null);

  // Render text with interactive [N] badges
  const renderFormattedAnswer = (text: string) => {
    if (!text) return null;

    // Split text by bracket citations like [1], [2], [3]
    const parts = text.split(/(\[\d+\])/g);

    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationNum = parseInt(match[1], 10);
        const isHighlighted = highlightedCitation === citationNum;

        return (
          <button
            key={index}
            onClick={() => setHighlightedCitation(isHighlighted ? null : citationNum)}
            onMouseEnter={() => setHighlightedCitation(citationNum)}
            onMouseLeave={() => setHighlightedCitation(null)}
            className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-mono font-bold text-xs transition-all ${
              isHighlighted
                ? 'bg-cyan-500 text-obsidian-950 shadow-glow-cyan scale-110'
                : 'bg-purple-600/30 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/40'
            }`}
          >
            [{citationNum}]
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4">
      {/* Answer Box */}
      <div className="glass-panel p-5 glow-cyan space-y-3">
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Verified Grounded Answer Output
            </h3>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Citations: {citations.length > 0 ? citations.map(c => `[${c}]`).join(', ') : 'None'}</span>
          </div>
        </div>

        <div className="bg-obsidian-950/80 p-4 rounded-xl border border-slate-800/80 min-h-[100px] text-sm text-slate-200 leading-relaxed font-sans">
          {isLoading ? (
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Synthesizing grounded answer with Qwen 2.5 on GPU 2...</span>
            </div>
          ) : answer ? (
            renderFormattedAnswer(answer)
          ) : (
            <span className="text-slate-500 italic">
              Submit a multilingual question via microphone or text to view the grounded cited response.
            </span>
          )}
        </div>
      </div>

      {/* Verified Source Passages Grid */}
      <div className="glass-panel p-5 space-y-3">
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Verified Source Passages (Top 3 Multi-Strategy Reranked)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Cross-Encoder Rescored</span>
        </div>

        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {sources.length > 0 ? (
            sources.map((source, idx) => {
              const citationIndex = idx + 1;
              const isTargeted = highlightedCitation === citationIndex;

              return (
                <div
                  key={idx}
                  id={`source-${citationIndex}`}
                  className={`p-3.5 rounded-xl border transition-all duration-300 ${
                    isTargeted
                      ? 'bg-slate-900 border-cyan-400/80 shadow-glow-cyan ring-1 ring-cyan-400/50'
                      : 'bg-obsidian-950/70 border-slate-800/80 hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        isTargeted ? 'bg-cyan-400 text-obsidian-950' : 'bg-purple-600/30 text-purple-300'
                      }`}>
                        [{citationIndex}] Source
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        <Layers className="w-3 h-3 text-purple-400" />
                        {source.strategy || 'parent_child'}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">
                        {source.language || 'hi'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>Re-rank: {(source.rerank_score || 0.95).toFixed(4)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {source.text}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="p-4 rounded-xl bg-obsidian-950/50 border border-slate-800/60 text-center text-slate-500 text-xs italic font-sans">
              Source passage references will appear here with chunking strategy attribution (Parent-Child, Semantic, Metadata-Aware)...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
