import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface MultilingualAudioPlayerProps {
  text: string;
  language: SupportedLanguage;
  autoPlay?: boolean;
}

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  en: 'en-IN',
};

const LANG_LABEL_MAP: Record<SupportedLanguage, string> = {
  hi: 'Hindi (हिन्दी)',
  mr: 'Marathi (मराठी)',
  bn: 'Bengali (বাংলা)',
  te: 'Telugu (తెలుగు)',
  ta: 'Tamil (தமிழ்)',
  en: 'English (Indian Accent)',
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
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean text by stripping citation references like [1], [2], markdown asterisks, etc.
  const getCleanSpeechText = (rawText: string) => {
    return rawText
      .replace(/\[\d+\]/g, '') // remove [1], [2]
      .replace(/[*_#`]/g, '')  // remove markdown symbols
      .trim();
  };

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setHasSpeechSupport(false);
      return;
    }

    // Stop previous utterance when text or language changes
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);

    if (autoPlay && text) {
      handlePlay();
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, language]);

  const handlePlay = () => {
    if (!('speechSynthesis' in window) || !text) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = getCleanSpeechText(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLocale = LOCALE_MAP[language] || 'en-IN';
    utterance.lang = targetLocale;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Pick best available voice for language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang === targetLocale || v.lang.startsWith(language));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
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
  };

  if (!hasSpeechSupport || !text) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-obsidian-950/80 border border-purple-500/20 shadow-inner">
      {/* Voice Status & Indicator */}
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${isPlaying ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-purple' : 'bg-slate-800 text-slate-400'}`}>
          {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300 font-semibold">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Indic TTS Voice: {LANG_LABEL_MAP[language] || language}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {isPlaying ? 'Speaking synthesized answer...' : isPaused ? 'Audio paused' : 'Sub-200ms Voice Synthesis'}
          </span>
        </div>
      </div>

      {/* Waveform Animation when playing */}
      {isPlaying && (
        <div className="flex items-center gap-1 h-5 px-2">
          {[40, 80, 60, 100, 75, 45, 90, 65, 30].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s',
              }}
            />
          ))}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center space-x-2 font-mono text-xs">
        {isPlaying ? (
          <button
            onClick={handlePause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 border border-purple-500/50 text-purple-200 hover:bg-purple-600/40 transition-all shadow-glow-purple cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPaused ? 'Resume' : 'Listen Answer'}</span>
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="Stop Audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Speed Selector */}
        <select
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] focus:outline-none focus:border-purple-500 cursor-pointer"
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
