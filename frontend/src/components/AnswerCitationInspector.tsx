import React, { useState } from 'react';
import { Bot, FileText, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { SourceChunk, SupportedLanguage } from '../types';
import { MultilingualAudioPlayer } from './MultilingualAudioPlayer';

interface AnswerCitationInspectorProps {
  answer: string;
  citations: number[];
  sources: SourceChunk[];
  isLoading: boolean;
  language?: SupportedLanguage;
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

export const AnswerCitationInspector: React.FC<AnswerCitationInspectorProps> = ({
  answer,
  citations,
  sources,
  isLoading,
  language = 'hi',
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
            className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-mono font-bold text-xs transition-all cursor-pointer ${
              isHighlighted
                ? 'bg-cyan-500 text-obsidian-950 shadow-glow-cyan scale-110'
                : 'bg-purple-600/30 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/40'
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
    <div className="space-y-4">
      {/* Grounded Answer Box */}
      <div className="glass-panel p-5 glow-cyan space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2.5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Verified Grounded Answer Output
            </h3>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Citations: {citations.length > 0 ? citations.map((c) => `[${c}]`).join(', ') : 'None'}
            </span>
          </div>
        </div>

        <div className="bg-obsidian-950/80 p-4 rounded-xl border border-slate-800/80 min-h-[100px] text-sm text-slate-200 leading-relaxed font-sans shadow-inner">
          {isLoading ? (
            <div className="flex items-center space-x-3 text-slate-400 py-4">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-mono text-xs">
                Retrieving & synthesizing grounded answer with Qwen 2.5 on GPU 2...
              </span>
            </div>
          ) : answer ? (
            renderFormattedAnswer(answer)
          ) : (
            <span className="text-slate-500 italic text-xs">
              Submit a multilingual voice or text question to view the verified grounded response with provenance citations.
            </span>
          )}
        </div>

        {/* Embedded Multilingual Audio Speech Synthesizer */}
        {!isLoading && answer && (
          <MultilingualAudioPlayer text={answer} language={language} autoPlay={false} />
        )}
      </div>

      {/* Verified Source Passages Grid with 5-Strategy Badges */}
      <div className="glass-panel p-5 space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-2 pb-2.5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Verified Source Passages (Top Multi-Strategy Reranked)
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-purple-400">
            <Sparkles className="w-3 h-3" />
            <span>bge-reranker-v2-m3 Rescored</span>
          </div>
        </div>

        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {sources.length > 0 ? (
            sources.map((src, index) => {
              const citationIndex = index + 1;
              const isSpotlighted = highlightedCitation === citationIndex;
              const strategyMeta = STRATEGY_LABELS[src.strategy] || {
                name: src.strategy || 'parent_child',
                color: 'bg-slate-800 text-slate-300 border-slate-700',
                desc: 'Indexed chunk provenance',
              };

              return (
                <div
                  key={index}
                  onMouseEnter={() => setHighlightedCitation(citationIndex)}
                  onMouseLeave={() => setHighlightedCitation(null)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 ${
                    isSpotlighted
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-glow-cyan scale-[1.01]'
                      : 'bg-obsidian-950/70 border-slate-800/80 hover:border-purple-500/40'
                  }`}
                >
                  {/* Top Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold">
                        [{citationIndex}] {src.doc_id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] ${strategyMeta.color}`} title={strategyMeta.desc}>
                        {strategyMeta.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] text-slate-400 uppercase">
                        LANG: <strong className="text-slate-200">{src.language}</strong>
                      </span>
                      {src.rerank_score !== undefined && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px]">
                          Score: {(src.rerank_score * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Passage Text */}
                  <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                    {src.text}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-xl">
              <BookOpen className="w-5 h-5 mx-auto mb-2 opacity-50" />
              <span>No retrieved source passages yet. Run a query to inspect reranked chunks.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
