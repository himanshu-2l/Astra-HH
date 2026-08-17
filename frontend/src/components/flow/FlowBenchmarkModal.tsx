import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#060b19]/95 backdrop-blur-3xl border border-white/20 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-white space-y-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold font-sans">
                Benchmark Question Library
              </h3>
              <p className="text-xs font-mono text-white/50">
                18 Curated Multilingual Indic Evaluations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-3 shrink-0">
          {/* Language Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <Globe className="w-3.5 h-3.5 text-white/40 shrink-0 mr-1" />
            {langFilters.map((lf) => (
              <button
                key={lf.code}
                onClick={() => setSelectedLangFilter(lf.code)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  selectedLangFilter === lf.code
                    ? 'bg-white text-black font-bold shadow-md scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                }`}
              >
                {lf.name}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white font-bold shadow-glow-purple scale-105 border border-purple-400'
                    : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Grid */}
        <div className="overflow-y-auto pr-1 space-y-2.5 flex-1">
          {filteredQuestions.map((q, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectPrompt(q.text, q.lang);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 transition-all cursor-pointer group flex items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-white/15 text-cyan-300 font-bold uppercase">
                    {q.lang}
                  </span>
                  <span className="text-white/40">{q.category}</span>
                  <span className="text-white/60 font-bold">• {q.label}</span>
                </div>
                <p className="text-xs sm:text-sm text-white/90 font-sans truncate group-hover:text-white">
                  {q.text}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white text-white/40 group-hover:text-black flex items-center justify-center transition-all shrink-0">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="py-8 text-center text-xs font-mono text-white/40">
              No questions found for the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
