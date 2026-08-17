import React from 'react';
import { Trophy, Github } from 'lucide-react';

export const FlowFooter: React.FC = () => {
  return (
    <footer className="w-full relative z-20 pointer-events-auto border-t border-white/10 py-8 px-6 bg-[#060b19]/80 backdrop-blur-xl mt-12">
      <div className="max-w-6xl mx-auto space-y-3.5">
        {/* Hackathon / Hacker House Badge */}
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-3.5 h-3.5 text-white/50" />
          <p className="font-mono text-xs text-white/60 tracking-wider">
            built for <span className="text-white font-bold">Hacker Goa 2026</span>
          </p>
        </div>

        {/* Team Members & Source Code Link */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
          <span className="text-white/40">team:</span>
          <span className="text-white/90 font-medium">Himanshu Rathore</span>
          <span className="text-white/30">•</span>
          <span className="text-white/90 font-medium">Md. Owais Naeem</span>
          <span className="text-white/30 hidden md:inline">|</span>
          <a
            href="https://github.com/himanshu-2l/Astra-HH.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>source</span>
          </a>
        </div>

        <p className="font-mono text-xs text-white/40 text-center tracking-wide uppercase text-[11px]">
          Astra • Sub-200ms Voice-Enabled Multilingual Indic RAG Engine
        </p>
      </div>
    </footer>
  );
};
