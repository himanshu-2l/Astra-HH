import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface MultilingualAudioPlayerProps {
  text: string;
  language: SupportedLanguage;
  autoPlay?: boolean;
}

const LOCALE_CANDIDATES: Record<SupportedLanguage, string[]> = {
  hi: ['hi-IN', 'hi_IN', 'hi'],
  mr: ['mr-IN', 'mr_IN', 'mr', 'hi-IN'],
  bn: ['bn-IN', 'bn-BD', 'bn_IN', 'bn'],
  te: ['te-IN', 'te_IN', 'te'],
  ta: ['ta-IN', 'ta-LK', 'ta_IN', 'ta'],
  en: ['en-IN', 'en-US', 'en-GB', 'en'],
};

const LANG_LABEL_MAP: Record<SupportedLanguage, string> = {
  hi: 'Hindi (हिन्दी)',
  mr: 'Marathi (मराठी)',
  bn: 'Bengali (বাংলা)',
  te: 'Telugu (తెలుగు)',
  ta: 'Tamil (தமிழ்)',
  en: 'English (Clear Voice)',
};

export const MultilingualAudioPlayer: React.FC<MultilingualAudioPlayerProps> = ({
  text,
  language,
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const resumeIntervalRef = useRef<any>(null);

  // Clean text by stripping citation references like [1], [2], markdown asterisks, URLs, etc.
  const getCleanSpeechText = (rawText: string) => {
    return rawText
      .replace(/\[\d+\]/g, '') // remove citation brackets
      .replace(/[*_#`~]/g, '')  // remove markdown formatting
      .replace(/https?:\/\/\S+/g, '') // remove URLs
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Pre-load available system voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setHasSpeechSupport(false);
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (resumeIntervalRef.current) {
        clearInterval(resumeIntervalRef.current);
      }
    };
  }, []);

  // Stop previous speech when text or language changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
    if (autoPlay && text) {
      const timer = setTimeout(() => handlePlay(), 150);
      return () => clearTimeout(timer);
    }
  }, [text, language]);

  // Keep-alive heartbeat to prevent Chrome silent speech stalling
  useEffect(() => {
    if (isPlaying) {
      resumeIntervalRef.current = setInterval(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      }, 3000);
    } else {
      if (resumeIntervalRef.current) {
        clearInterval(resumeIntervalRef.current);
        resumeIntervalRef.current = null;
      }
    }
    return () => {
      if (resumeIntervalRef.current) {
        clearInterval(resumeIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const findBestVoice = (lang: SupportedLanguage, voicesList: SpeechSynthesisVoice[]): { voice: SpeechSynthesisVoice | null; locale: string } => {
    const candidates = LOCALE_CANDIDATES[lang] || ['en-US'];
    
    // 1. Exact locale match (e.g., 'hi-IN' or 'en-US')
    for (const cand of candidates) {
      const exact = voicesList.find((v) => v.lang.toLowerCase() === cand.toLowerCase() || v.lang.replace('_', '-').toLowerCase() === cand.toLowerCase());
      if (exact) return { voice: exact, locale: cand };
    }

    // 2. Prefix match (e.g., starts with 'en' or 'hi')
    const primaryCode = lang.toLowerCase();
    const prefixMatch = voicesList.find((v) => v.lang.toLowerCase().startsWith(primaryCode));
    if (prefixMatch) return { voice: prefixMatch, locale: prefixMatch.lang };

    // 3. Fallback to default system voice
    const defaultVoice = voicesList.find((v) => v.default) || (voicesList.length > 0 ? voicesList[0] : null);
    return { voice: defaultVoice, locale: candidates[0] };
  };

  const handlePlay = () => {
    if (!('speechSynthesis' in window) || !text) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // Cancel any ongoing speech cleanly
    window.speechSynthesis.cancel();

    // Use small delay to allow Chromium speech synthesizer audio channel to reset
    setTimeout(() => {
      try {
        const cleanText = getCleanSpeechText(text);
        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
        const { voice, locale } = findBestVoice(language, voices);

        utterance.lang = locale;
        if (voice) {
          utterance.voice = voice;
        }
        utterance.rate = speechRate;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          (window as any).__astra_active_utterance = null;
        };

        utterance.onerror = (e) => {
          console.warn('Speech synthesis error event:', e);
          setIsPlaying(false);
          setIsPaused(false);
          (window as any).__astra_active_utterance = null;
        };

        // Pin to global window to prevent Chrome garbage collector from destroying utterance mid-speech
        (window as any).__astra_active_utterance = utterance;

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Speech synthesis play error:', err);
        setIsPlaying(false);
        setIsPaused(false);
      }
    }, 40);
  };

  const handlePause = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    (window as any).__astra_active_utterance = null;
  };

  if (!hasSpeechSupport || !text) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-obsidian-950/80 border border-purple-500/20 shadow-inner">
      {/* Voice Status & Indicator */}
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-xl transition-all ${isPlaying ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-purple scale-105' : 'bg-slate-800 text-slate-400'}`}>
          {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-200 font-semibold">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Voice Synthesizer: {LANG_LABEL_MAP[language] || language}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {isPlaying ? 'Speaking answer...' : isPaused ? 'Audio paused' : 'Hardware-accelerated Indic TTS'}
          </span>
        </div>
      </div>

      {/* Dynamic Animated Equalizer */}
      {isPlaying && (
        <div className="flex items-center gap-1 h-5 px-2">
          {[40, 80, 60, 100, 75, 45, 90, 65, 30].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.08}s`,
                animationDuration: '0.5s',
              }}
            />
          ))}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center space-x-2 font-mono text-xs">
        {isPlaying ? (
          <button
            type="button"
            onClick={handlePause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all cursor-pointer font-semibold"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/50 text-purple-200 hover:bg-purple-600/40 transition-all shadow-glow-purple cursor-pointer font-semibold hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPaused ? 'Resume' : 'Listen Voice'}</span>
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            type="button"
            onClick={handleStop}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Stop Audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Speed Selector */}
        <select
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          className="px-2 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-[11px] focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          <option value="0.8">0.8x</option>
          <option value="1.0">1.0x</option>
          <option value="1.2">1.2x</option>
          <option value="1.5">1.5x</option>
        </select>
      </div>
    </div>
  );
};
