import React, { useState } from 'react';
import { Bot, FileText, X, Zap } from 'lucide-react';
import { QueryResponse, SupportedLanguage } from '../../types';
import { MultilingualAudioPlayer } from '../MultilingualAudioPlayer';

interface FlowAnswerModalProps {
  result: QueryResponse | null;
  isLoading: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

const STRATEGY_LABELS: Record<string, { name: string; color: string; desc: string }> = {
  parent_child: {
    name: 'Parent-Child Contextual',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    desc: 'Small chunk retrieval + Full parent document context window',
  },
  semantic_boundary: {
    name: 'Indic Semantic Boundary',
    color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    desc: 'Akshara and Purna Viram (|) sentence boundary segmentation',
  },
  slakh_syllable: {
    name: 'Slakh Syllable Tokenizer',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    desc: 'Grapheme cluster and Indic vowel modifier segmentation',
  },
  fixed_512: {
    name: 'Fixed Overlap (512 tokens)',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    desc: '512 token window with 64 token sliding stride',
  },
  hierarchical_doc: {
    name: 'Hierarchical Document',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    desc: 'Section and heading tree decomposition',
  },
};

export const FlowAnswerModal: React.FC<FlowAnswerModalProps> = ({
  result,
  isLoading,
  onClose,
  language,
}) => {
  const [highlightedCitation, setHighlightedCitation] = useState<number | null>(null);

  if (!isLoading && !result) return null;

  const renderFormattedAnswer = (text: string) => {
    if (!text) return null;
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
            className={`inline-flex items-center px-2 py-0.5 mx-0.5 rounded font-mono font-bold text-xs transition-all cursor-pointer ${
              isHighlighted
                ? 'bg-cyan-400 text-black shadow-glow-cyan scale-110'
                : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
            }`}
            title={`Click to spotlight Source Chunk [${citationNum}]`}
          >
            [{citationNum}]
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-obsidian-950/90 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-white">
        {/* Header with Query & Close */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-300 font-bold">
                Astra Grounded Answer Output
              </span>
            </div>
            <h3 className="text-base md:text-lg font-medium text-slate-100 font-sans">
              &ldquo;{result?.query || 'Processing query...'}&rdquo;
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-slate-300 animate-pulse">
              Retrieving from 10× RAM Index & Synthesizing via Qwen 2.5 on GPU 2...
            </p>
          </div>
        ) : (
          <>
            {/* Grounded Answer Output */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-sm md:text-base leading-relaxed text-slate-100 font-sans shadow-inner">
              {renderFormattedAnswer(result?.answer || '')}
            </div>

            {/* Multilingual Audio TTS Synthesizer */}
            {result?.answer && (
              <MultilingualAudioPlayer text={result.answer} language={language} autoPlay={false} />
            )}

            {/* Latency & Hardware Badge Strip */}
            {result?.latency && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>
                    Total Retrieval:{' '}
                    <strong className="text-emerald-300">
                      {result.latency.total_retrieval_ms.toFixed(1)} ms
                    </strong>
                  </span>
                </div>
                <div>
                  End-to-End Latency:{' '}
                  <strong className="text-cyan-300">
                    {result.latency.end_to_end_ms.toFixed(1)} ms
                  </strong>
                </div>
              </div>
            )}

            {/* Verified Sources List */}
            {result?.sources && result.sources.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Verified Source Passages ({result.sources.length})</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Cross-Encoder Rescored</span>
                </div>

                <div className="space-y-3">
                  {result.sources.map((src, idx) => {
                    const citationIdx = idx + 1;
                    const isSpotlighted = highlightedCitation === citationIdx;
                    const strategy = STRATEGY_LABELS[src.strategy] || {
                      name: src.strategy,
                      color: 'bg-white/10 text-white border-white/20',
                      desc: 'Strategy provenance',
                    };

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all duration-300 ${
                          isSpotlighted
                            ? 'bg-cyan-950/60 border-cyan-400 shadow-glow-cyan scale-[1.01]'
                            : 'bg-white/5 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-purple-600/30 text-purple-300 font-bold">
                              [{citationIdx}] {src.doc_id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md border text-[10px] ${strategy.color}`}>
                              {strategy.name}
                            </span>
                          </div>
                          {src.rerank_score !== undefined && (
                            <span className="text-emerald-400 font-semibold">
                              {(src.rerank_score * 100).toFixed(1)}% match
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
                          {src.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
