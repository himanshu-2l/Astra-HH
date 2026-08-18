import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Globe, ChevronDown, Check, Sparkles, RotateCcw, LayoutGrid, ChevronUp, ArrowRight } from 'lucide-react';
import { TextScramble } from './TextScramble';
import { SupportedLanguage, LanguageOption, QueryResponse } from '../../types';
import { FlowAnswerCard } from './FlowAnswerCard';
import { BENCHMARK_QUESTIONS } from './FlowBenchmarkModal';

interface FlowHeroProps {
  onSearch: (query: string, lang: SupportedLanguage) => void;
  isLoading: boolean;
  queryResult?: QueryResponse | null;
  onClearResult?: () => void;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', speechLocale: 'hi-IN' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', speechLocale: 'mr-IN' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', speechLocale: 'bn-IN' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', speechLocale: 'te-IN' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', speechLocale: 'ta-IN' },
  { code: 'en', name: 'English', native: 'English', speechLocale: 'en-US' },
];

const SUBTITLES = [
  'voice-enabled multilingual indic rag',
  'sub-200ms dense-sparse hybrid engine',
  '6× rtx 2080 ti hardware accelerated',
  'grounded citations over msmarco-xi',
];

export const FlowHero: React.FC<FlowHeroProps> = ({
  onSearch,
  isLoading,
  queryResult = null,
  onClearResult = () => {},
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('hi');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isExpandedBenchmarks, setIsExpandedBenchmarks] = useState(false);
  const [benchmarkLangFilter, setBenchmarkLangFilter] = useState<string>('All');
  const [benchmarkCategoryFilter, setBenchmarkCategoryFilter] = useState<string>('All');
  const [promptIdx, setPromptIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  // Typewriter effect for subtitle
  const [subIdx, setSubIdx] = useState(0);
  const [typedSub, setTypedSub] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Rotating prompt interval for placeholder suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIdx((prev) => (prev + 1) % BENCHMARK_QUESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Subtitle typewriter loop
  useEffect(() => {
    const fullText = SUBTITLES[subIdx];
    let timer: any;

    if (!isDeleting && typedSub !== fullText) {
      timer = setTimeout(() => {
        setTypedSub(fullText.substring(0, typedSub.length + 1));
      }, 65);
    } else if (!isDeleting && typedSub === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && typedSub !== '') {
      timer = setTimeout(() => {
        setTypedSub(fullText.substring(0, typedSub.length - 1));
      }, 35);
    } else if (isDeleting && typedSub === '') {
      setIsDeleting(false);
      setSubIdx((prev) => (prev + 1) % SUBTITLES.length);
    }

    return () => clearTimeout(timer);
  }, [typedSub, isDeleting, subIdx]);

  // Stop speech recognition on unmount
  useEffect(() => {
    return () => {
      stopVisualizerAnimation();
      try {
        recognitionRef.current?.abort();
      } catch (e) {}
    };
  }, []);

  const startVisualizerAnimation = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    let frame = 0;
    const animate = () => {
      frame++;
      const level = Math.sin(frame * 0.18) * 35 + Math.cos(frame * 0.28) * 30 + 35;
      setAudioLevel(Math.min(100, Math.max(10, Math.round(level))));
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
  };

  const stopVisualizerAnimation = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioLevel(0);
  };

  const toggleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice input is supported in Google Chrome, Microsoft Edge, and Safari on HTTPS.');
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsRecording(false);
      stopVisualizerAnimation();
    } else {
      try {
        // Abort previous instance if any
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch (e) {}
        }

        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;

        const activeLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];
        rec.lang = activeLangObj.speechLocale;

        rec.onstart = () => {
          setIsRecording(true);
          startVisualizerAnimation();
        };

        rec.onresult = (event: any) => {
          let fullTranscript = '';
          let isFinalResult = false;

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            fullTranscript += transcript;
            if (event.results[i].isFinal) {
              isFinalResult = true;
            }
          }

          if (fullTranscript.trim()) {
            setQueryInput(fullTranscript);
          }

          if (isFinalResult && fullTranscript.trim()) {
            setIsRecording(false);
            stopVisualizerAnimation();
            onSearch(fullTranscript.trim(), selectedLang);
          }
        };

        rec.onerror = (event: any) => {
          console.warn('Speech recognition status:', event?.error);
          setIsRecording(false);
          stopVisualizerAnimation();
          if (event?.error === 'not-allowed') {
            alert('Microphone access was denied. Please allow microphone permissions in your browser.');
          }
        };

        rec.onend = () => {
          setIsRecording(false);
          stopVisualizerAnimation();
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsRecording(false);
        stopVisualizerAnimation();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isLoading) return;
    onSearch(queryInput.trim(), selectedLang);
  };

  const handleSelectSample = (sampleText: string, lang: SupportedLanguage) => {
    setQueryInput(sampleText);
    setSelectedLang(lang);
    onSearch(sampleText, lang);
  };

  const handleReplayIntro = () => {
    setIntroKey((prev) => prev + 1);
    setTypedSub('');
    setIsDeleting(false);
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

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

  const filteredExpandedQuestions = BENCHMARK_QUESTIONS.filter((q) => {
    const matchesCategory = benchmarkCategoryFilter === 'All' || q.category === benchmarkCategoryFilter;
    const matchesLang = benchmarkLangFilter === 'All' || q.lang === benchmarkLangFilter;
    return matchesCategory && matchesLang;
  });

  return (
    <div
      key={introKey}
      className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center select-none py-4 sm:py-6 space-y-4 sm:space-y-5 animate-fadeIn"
    >
      {/* 1. Sleek Floating Language Dropdown Pill */}
      <div ref={dropdownRef} className="relative z-30">
        <button
          type="button"
          onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-mono text-white backdrop-blur-xl shadow-lg transition-all duration-200 cursor-pointer group"
        >
          <Globe className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
          <span className="font-semibold">{currentLangObj.name}</span>
          <span className="text-white/50 text-[11px]">({currentLangObj.native})</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/50 transition-transform duration-200 ${
              isLangDropdownOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>

        {/* Floating Language Picker Menu */}
        {isLangDropdownOpen && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 rounded-2xl bg-[#060b19]/95 backdrop-blur-3xl border border-white/20 p-2 shadow-2xl space-y-1 text-left animate-fadeIn z-50">
            <span className="text-[10px] uppercase tracking-wider font-mono text-white/40 px-3 py-1 block">
              Select Language
            </span>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLang(lang.code);
                  setIsLangDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedLang === lang.code
                    ? 'bg-white text-black font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.name}</span>
                  <span className={selectedLang === lang.code ? 'text-black/60' : 'text-white/40'}>
                    ({lang.native})
                  </span>
                </div>
                {selectedLang === lang.code && <Check className="w-3.5 h-3.5 text-black" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. ASTRA Glowing Headline Title with Cyber Text Scramble */}
      <div className="space-y-1.5 sm:space-y-2">
        <h1
          className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-[0.14em] sm:tracking-[0.18em] text-white select-none transition-all duration-700 font-extrabold uppercase leading-tight"
          style={{
            textShadow: `
              0 0 20px rgba(168, 85, 247, 0.6),
              0 0 40px rgba(168, 85, 247, 0.4),
              0 0 60px rgba(6, 182, 212, 0.3),
              0 0 80px rgba(6, 182, 212, 0.2),
              0 4px 8px rgba(0, 0, 0, 0.6)
            `,
            filter:
              'drop-shadow(0 0 15px rgba(168, 85, 247, 0.5)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.3))',
          }}
        >
          <TextScramble text="astra" speed={80} delay={300} />
        </h1>

        {/* Typewriter Subtitle */}
        <div className="text-[10px] sm:text-xs text-white/70 font-mono min-h-[1.5em] tracking-[0.05em] uppercase flex items-center justify-center px-2">
          <span className="truncate">{typedSub}</span>
          <span className="inline-block w-0.5 h-3.5 bg-cyan-400 ml-1 animate-pulse" />
        </div>
      </div>

      {/* 3. Unified Input Capsule */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl px-1 sm:px-0">
        <div className="relative flex items-center rounded-full bg-[#060b19]/80 backdrop-blur-2xl border border-white/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus-within:border-white/50 focus-within:shadow-glow-purple transition-all duration-300 p-1 sm:p-1.5">
          {/* Glowing Mic Orb */}
          <div className="relative pl-1">
            <button
              type="button"
              onClick={toggleMic}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg border ${
                isRecording
                  ? 'bg-white text-black shadow-white/60 scale-105 border-white'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:scale-105'
              }`}
              title={isRecording ? 'Listening... click to stop' : `Tap to speak in ${currentLangObj.name}`}
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {isRecording && (
              <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-75 pointer-events-none" />
            )}
          </div>

          {/* Text Input / Live Visualizer / Dynamic Rotating Placeholder */}
          <div className="flex-1 px-3 sm:px-4 min-w-0">
            {isRecording ? (
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cyan-300 animate-pulse truncate">
                  {queryInput || `Listening in ${currentLangObj.name}...`}
                </span>
                {/* Reactive Equalizer Bars */}
                <div className="flex items-center gap-0.5 sm:gap-1 pl-1">
                  {[20, 50, 80, 40, 90, 60, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 sm:w-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full transition-all duration-100"
                      style={{ height: `${Math.max(3, (audioLevel / 100) * (h * 0.8))}px` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={`Try: "${BENCHMARK_QUESTIONS[promptIdx].text}"`}
                className="w-full bg-transparent text-white placeholder-white/40 font-mono text-xs sm:text-sm focus:outline-none"
              />
            )}
          </div>

          {/* Submit Action Button */}
          <div className="pr-1">
            <button
              type="submit"
              disabled={isLoading || !queryInput.trim()}
              className="p-2.5 sm:p-3 rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer font-bold"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 4. In-Page Smooth Expandable Benchmark Section */}
      <div className="w-full max-w-2xl space-y-2.5 transition-all duration-500">
        <div className="flex items-center justify-between text-[10px] font-mono text-white/60 px-2">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-white/80 font-bold uppercase tracking-wider">Instant Benchmark Questions</span>
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpandedBenchmarks(!isExpandedBenchmarks)}
              className="flex items-center gap-1.5 text-cyan-300 hover:text-white transition-all cursor-pointer font-bold bg-[#070c18]/90 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700/80 shadow-md"
              title="Expand full benchmark grid directly on page"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isExpandedBenchmarks ? 'collapse' : 'browse all (18)'}</span>
              {isExpandedBenchmarks ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            <button
              onClick={handleReplayIntro}
              className="flex items-center gap-1 hover:text-white text-white/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>replay</span>
            </button>
          </div>
        </div>

        {/* Collapsed Mode: Smooth Gradient Edge-Fade Slider */}
        {!isExpandedBenchmarks && (
          <div
            className="w-full overflow-hidden relative py-1 animate-fadeIn"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-4 scroll-smooth">
              {BENCHMARK_QUESTIONS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample.text, sample.lang)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#070c18]/90 hover:bg-slate-800 backdrop-blur-xl border border-slate-700/80 hover:border-cyan-400/50 text-white/90 hover:text-white text-xs font-mono whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-md hover:scale-105 group"
                >
                  <span className="text-[9px] uppercase font-bold text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40">
                    {sample.lang}
                  </span>
                  <span className="text-slate-200 group-hover:text-white font-medium">{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expanded Mode: High-Contrast Solid Obsidian 2-Column Grid */}
        {isExpandedBenchmarks && (
          <div className="w-full rounded-3xl bg-[#060a14]/98 backdrop-blur-3xl border border-slate-700/80 p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] space-y-4 text-left animate-fadeIn">
            {/* Filter Strips */}
            <div className="space-y-2.5 border-b border-slate-700/80 pb-3.5 font-mono text-xs">
              {/* Language Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
                {langFilters.map((lf) => {
                  const isActive = benchmarkLangFilter === lf.code;
                  return (
                    <button
                      key={lf.code}
                      onClick={() => setBenchmarkLangFilter(lf.code)}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-105 border border-cyan-300'
                          : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70'
                      }`}
                    >
                      {lf.name}
                    </button>
                  );
                })}
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mr-1" />
                {categories.map((cat) => {
                  const isActive = benchmarkCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setBenchmarkCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-purple-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)] scale-105 border border-purple-400'
                          : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/70'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2-Column High-Contrast Prompt Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto no-scrollbar pr-0.5">
              {filteredExpandedQuestions.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleSelectSample(q.text, q.lang);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/70 hover:border-cyan-400/60 transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold uppercase border border-cyan-500/50 shadow-sm">
                        {q.lang}
                      </span>
                      <span className="text-cyan-400 font-semibold">{q.category}</span>
                      <span className="text-slate-300 font-bold truncate">• {q.label}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white font-sans font-medium leading-snug truncate group-hover:text-cyan-200 transition-colors">
                      {q.text}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-cyan-400 text-cyan-400 group-hover:text-black flex items-center justify-center transition-all shrink-0 border border-slate-700 group-hover:border-cyan-300 shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}

              {filteredExpandedQuestions.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs font-mono text-slate-400">
                  No questions match the selected filters.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. Collapsible Hardware Specs Toggle */}
      <div className="flex flex-col items-center pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/50 hover:text-white transition-all font-mono text-[11px] cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>hardware parameters</span>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-300 ${
              showAdvanced ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="mt-2 p-3.5 rounded-2xl bg-[#060b19]/95 backdrop-blur-3xl border border-white/20 text-xs font-mono text-white/80 space-y-1.5 max-w-sm text-left shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Embedding Engine:</span>
              <span className="text-white font-bold">bge-m3 (cuda:1)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Generator LLM:</span>
              <span className="text-white font-bold">Qwen 2.5-3B (cuda:2)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Cross-Reranker:</span>
              <span className="text-white font-bold">bge-reranker-v2-m3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Indices in 512GB RAM:</span>
              <span className="text-white font-bold">5× Dense + 5× Sparse</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. Answer Card (Floats smoothly in view when query answered) */}
      {queryResult && (
        <div className="w-full pt-4 animate-fadeIn">
          <FlowAnswerCard
            result={queryResult}
            language={selectedLang}
            onClear={onClearResult}
          />
        </div>
      )}
    </div>
  );
};
