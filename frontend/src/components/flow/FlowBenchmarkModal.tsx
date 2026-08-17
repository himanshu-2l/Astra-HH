import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Zap, Globe, ArrowRight } from 'lucide-react';
import { SupportedLanguage } from '../../types';

export interface BenchmarkQuestion {
  text: string;
  lang: SupportedLanguage;
  label: string;
  category: 'Tech' | 'Agriculture' | 'Science' | 'History' | 'Literature';
}

export const BENCHMARK_QUESTIONS: BenchmarkQuestion[] = [
  // Hindi
  { text: 'कंप्यूटर ऑपरेटिंग सिस्टम क्या है?', lang: 'hi', label: 'OS Definition', category: 'Tech' },
  { text: 'सौर ऊर्जा के मुख्य लाभ क्या हैं?', lang: 'hi', label: 'Solar Energy', category: 'Science' },
  { text: 'चंद्रयान मिशन के मुख्य वैज्ञानिक उद्देश्य क्या हैं?', lang: 'hi', label: 'Chandrayaan Mission', category: 'Science' },

  // Marathi
  { text: 'शेतीसाठी मातीचे आरोग्य का महत्त्वाचे आहे?', lang: 'mr', label: 'Soil Health', category: 'Agriculture' },
  { text: 'छत्रपती शिवाजी महाराजांचे आरमार प्रशासन कसे होते?', lang: 'mr', label: 'Maratha Navy', category: 'History' },
  { text: 'पश्चिम घाटातील जैवविविधतेचे महत्त्व काय आहे?', lang: 'mr', label: 'Western Ghats Ecology', category: 'Science' },

  // Bengali
  { text: 'সালোকসংশ্লেষণ প্রক্রিয়া কি এবং এর গুরুত্ব?', lang: 'bn', label: 'Photosynthesis', category: 'Science' },
  { text: 'সুন্দরবনের ম্যানগ্রোভ অরণ্যের পরিবেশগত গুরুত্ব কি?', lang: 'bn', label: 'Sundarbans Mangroves', category: 'Science' },
  { text: 'রবীন্দ্রনাথ ঠাকুরের গীতাঞ্জলির মূল ভাবনা কি?', lang: 'bn', label: 'Tagore Literature', category: 'Literature' },

  // Telugu
  { text: 'కంప్యూటర్ ఆపరేటింగ్ సిస్టమ్ అంటే ఏమిటి?', lang: 'te', label: 'OS Architecture', category: 'Tech' },
  { text: 'గోదావరి నదీ పరీవాహక ప్రాంత ప్రాముఖ్యత ఏమిటి?', lang: 'te', label: 'Godavari Basin', category: 'Agriculture' },
  { text: 'కృత్రిమ మేధస్సు (AI) భవిష్యత్తు ప్రభావాలు ఏమిటి?', lang: 'te', label: 'AI Technology', category: 'Tech' },

  // Tamil
  { text: 'இயக்க முறைமை (OS) என்றால் என்ன?', lang: 'ta', label: 'System Software', category: 'Tech' },
  { text: 'திருக்குறளின் முக்கிய வாழ்வியல் கருத்துக்கள் யாவை?', lang: 'ta', label: 'Thirukkural Ethics', category: 'Literature' },
  { text: 'சூரிய குடும்பத்தில் கோள்களின் வரிசை என்ன?', lang: 'ta', label: 'Solar Astronomy', category: 'Science' },

  // English
  { text: 'How does RAM-pinned hybrid search achieve sub-200ms latency?', lang: 'en', label: 'Sub-200ms RAG', category: 'Tech' },
  { text: 'What are the 3 safety guardrail gates in Astra?', lang: 'en', label: '3-Gate Safety', category: 'Tech' },
  { text: 'Explain the difference between dense and sparse vector search.', lang: 'en', label: 'Hybrid Retrieval', category: 'Tech' },
];

interface FlowBenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (text: string, lang: SupportedLanguage) => void;
}

export const FlowBenchmarkModal: React.FC<FlowBenchmarkModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('All');
  const modalCardRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ['All', 'Tech', 'Science', 'Agriculture', 'History', 'Literature'];
  const langFilters = [
    { code: 'All', name: 'All' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'te', name: 'Telugu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'en', name: 'English' },
  ];

  const filteredQuestions = BENCHMARK_QUESTIONS.filter((q) => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesLang = selectedLangFilter === 'All' || q.lang === selectedLangFilter;
    return matchesCategory && matchesLang;
  });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={(e) => {
        if (modalCardRef.current && !modalCardRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        ref={modalCardRef}
        className="relative w-full max-w-2xl my-auto rounded-3xl bg-[#070c18]/96 backdrop-blur-2xl border border-slate-700/80 p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-white flex flex-col max-h-[82vh] overflow-hidden"
      >
        {/* 1. Sticky Header with Clear Close Button */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-700/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shadow-inner">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-sans text-white">
                Benchmark Question Library
              </h3>
              <p className="text-xs font-mono text-slate-400">
                18 Curated Multilingual Indic Evaluations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700/60 shadow-md"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Filters Section (Language & Category) */}
        <div className="py-3 space-y-2.5 border-b border-slate-800 shrink-0">
          {/* Language Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
            {langFilters.map((lf) => (
              <button
                key={lf.code}
                onClick={() => setSelectedLangFilter(lf.code)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  selectedLangFilter === lf.code
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-105 border border-cyan-300'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                {lf.name}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)] scale-105 border border-purple-400'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Scrollable Questions List */}
        <div className="overflow-y-auto pr-1 pt-3 space-y-2.5 flex-1 min-h-0 no-scrollbar">
          {filteredQuestions.map((q, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectPrompt(q.text, q.lang);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 hover:border-cyan-500/60 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-md"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold uppercase border border-cyan-500/40">
                    {q.lang}
                  </span>
                  <span className="text-slate-400">{q.category}</span>
                  <span className="text-slate-300 font-bold">• {q.label}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-100 font-sans truncate group-hover:text-cyan-200 transition-colors">
                  {q.text}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-cyan-400 text-slate-400 group-hover:text-black flex items-center justify-center transition-all shrink-0 border border-slate-700/60 group-hover:border-cyan-300 shadow-sm">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="py-12 text-center text-xs font-mono text-slate-400 space-y-1">
              <p>No questions found for the selected filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLangFilter('All');
                }}
                className="text-cyan-400 hover:underline cursor-pointer pt-1"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
