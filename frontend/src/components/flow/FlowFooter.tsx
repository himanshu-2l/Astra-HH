import React from 'react';
import { Trophy, Github, ArrowUpRight } from 'lucide-react';

export const FlowFooter: React.FC = () => {
  return (
    <footer className="w-full relative z-20 pointer-events-auto py-4 sm:py-6 px-3 sm:px-4 flex justify-center mt-auto">
      {/* Floating Frosted Glass Bottom Capsule Dock */}
      <div className="bg-white/[0.06] hover:bg-white/[0.08] backdrop-blur-2xl border border-white/15 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono text-white/80 shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all duration-300">
        {/* Hackathon Badge */}
        <div className="flex items-center gap-1.5 text-white/90">
          <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold text-white">Hacker Goa 2026</span>
        </div>

        <span className="w-px h-3.5 bg-white/20 hidden sm:inline-block" />

        {/* Team Attribution */}
        <div className="flex items-center gap-1.5 text-white/70 text-[11px] sm:text-xs">
          <span className="text-white/40">team:</span>
          <span className="text-white font-medium">Himanshu Rathore</span>
          <span className="text-white/30">•</span>
          <span className="text-white font-medium">Md. Owais Naeem</span>
        </div>

        <span className="w-px h-3.5 bg-white/20 hidden sm:inline-block" />

        {/* GitHub Source Link */}
        <a
          href="https://github.com/himanshu-2l/Astra-HH.git"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-cyan-300 hover:text-white transition-colors cursor-pointer group font-medium text-[11px] sm:text-xs"
        >
          <Github className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
          <span>source</span>
          <ArrowUpRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </footer>
  );
};
