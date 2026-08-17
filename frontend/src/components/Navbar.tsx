import React from 'react';
import { Cpu, Zap, Activity, Settings } from 'lucide-react';

interface NavbarProps {
  serverUrl: string;
  isOnline: boolean;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ serverUrl, isOnline, onOpenSettings }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 px-6 border-b border-slate-800/80 bg-obsidian-950/60 backdrop-blur-md sticky top-0 z-40 gap-4">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3.5">
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/25">
            <div className="w-full h-full bg-obsidian-950 rounded-xl flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-300 text-xl tracking-wider">A</span>
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-obsidian-950 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              ASTRA <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 ml-1">v2.0</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>Voice-Enabled Multilingual Indic RAG</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400/90 font-mono">MSMARCO-XI</span>
            <span className="text-slate-600">•</span>
            <span className="text-purple-400 font-mono">HH Goa 2026</span>
          </p>
        </div>
      </div>

      {/* Badges & Actions */}
      <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
        {/* Latency Target Badge */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>SLA P50: <strong className="text-emerald-300">42.2ms</strong></span>
        </div>

        {/* 512GB RAM Pinned Badge */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>512GB RAM PINNED</span>
        </div>

        {/* Connection status button / Settings */}
        <button
          onClick={onOpenSettings}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 font-mono transition-all hover:border-purple-500/50 hover:text-white"
        >
          <Activity className={`w-3.5 h-3.5 ${isOnline ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`} />
          <span className="truncate max-w-[140px]">{serverUrl.replace('http://', '').replace('https://', '')}</span>
          <Settings className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </button>
      </div>
    </header>
  );
};
