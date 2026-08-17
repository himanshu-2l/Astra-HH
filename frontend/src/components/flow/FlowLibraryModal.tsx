import React, { useState } from 'react';
import { BookOpen, X, Sparkles } from 'lucide-react';

interface FlowLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STRATEGIES = [
  {
    id: 'parent_child',
    name: 'Parent-Child Contextual',
    tag: 'Hierarchical',
    color: 'border-purple-500/40 text-purple-300 bg-purple-500/10',
    description: 'Retrieves compact 128-token dense vector chunks while providing the full 1024-token parent context window to Qwen 2.5 during generation.',
    sampleCount: '48,102 chunks indexed',
    samplePassage: 'ऑपरेटिंग सिस्टम (OS) हा सॉफ्टवेअरचा एक मुख्य भाग आहे जो बूटअपनंतर चालतो आणि संगणकाचे सर्व घटक नियंत्रित करतो.',
  },
  {
    id: 'semantic_boundary',
    name: 'Indic Semantic Boundary',
    tag: 'Akshara / Viram',
    color: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
    description: 'Uses sentence boundaries tailored for Devanagari and Indic punctuation (Purna Viram |) avoiding mid-phrase splitting.',
    sampleCount: '19,382 chunks indexed',
    samplePassage: 'कंप्यूटर सिस्टम में ऑपरेटिंग सिस्टम यूजर और हार्डवेयर के बीच माध्यम के रूप में कार्य करता है।',
  },
  {
    id: 'slakh_syllable',
    name: 'Slakh Syllable Tokenizer',
    tag: 'Grapheme Cluster',
    color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
    description: 'Decomposes complex Indic matras, conjuncts, and vowel modifiers into grapheme clusters to maintain zero character corruption.',
    sampleCount: '30,219 chunks indexed',
    samplePassage: 'ऑपरेटिंग सिस्टम के मुख्य कार्यों में प्रोसेस शेड्यूलिंग, मेमोरी एलोकेशन, फाइल सिस्टम मैनेजमेंट शामिल हैं।',
  },
  {
    id: 'fixed_512',
    name: 'Fixed Overlap (512 tokens)',
    tag: 'Baseline Stride',
    color: 'border-blue-500/40 text-blue-300 bg-blue-500/10',
    description: 'Standard 512-token fixed window with 64-token sliding overlap for baseline benchmarking.',
    sampleCount: '24,000 chunks indexed',
    samplePassage: 'An operating system manages computer hardware, memory allocation, and provides common services for computer programs.',
  },
  {
    id: 'hierarchical_doc',
    name: 'Hierarchical Document',
    tag: 'Tree Decomposition',
    color: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
    description: 'Decomposes structured documents into Section → Paragraph → Sentence hierarchy trees.',
    sampleCount: '12,500 chunks indexed',
    samplePassage: 'Section 4.1: Memory Management Algorithms and Page Replacement Schemes in Modern Kernels.',
  },
];

export const FlowLibraryModal: React.FC<FlowLibraryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeStrategy, setActiveStrategy] = useState('parent_child');

  if (!isOpen) return null;

  const currentStrat = STRATEGIES.find((s) => s.id === activeStrategy) || STRATEGIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-obsidian-950/95 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 font-mono">
                Indic Corpus & 5-Strategy Chunking Inspector
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                MSMARCO-XI Knowledge Base • 5 Parallel Chunking Topologies in 512GB RAM
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

        {/* 5 Strategy Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {STRATEGIES.map((strat) => (
            <button
              key={strat.id}
              onClick={() => setActiveStrategy(strat.id)}
              className={`p-3 rounded-2xl border text-left transition-all font-mono cursor-pointer ${
                activeStrategy === strat.id
                  ? 'bg-purple-600/30 border-purple-400 text-white shadow-glow-purple scale-[1.02]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:text-slate-200'
              }`}
            >
              <span className="block text-[10px] uppercase font-bold text-cyan-300">
                {strat.tag}
              </span>
              <span className="text-xs font-semibold block truncate mt-1">{strat.name}</span>
            </button>
          ))}
        </div>

        {/* Active Strategy Deep-Dive Box */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 font-mono">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-slate-100">{currentStrat.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${currentStrat.color}`}>
                {currentStrat.tag}
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">{currentStrat.sampleCount}</span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {currentStrat.description}
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Sample Grounded Passage (Indexed in RAM)
            </span>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 font-sans leading-relaxed shadow-inner">
              {currentStrat.samplePassage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
