import React from 'react';
import { House, Award, Library, Cpu, ShieldCheck, Layers, Settings, Zap } from 'lucide-react';

interface FlowNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOnline: boolean;
  onOpenSettings: () => void;
}

export const FlowNavbar: React.FC<FlowNavbarProps> = ({
  activeTab = 'home',
  onTabChange,
  isOnline,
  onOpenSettings,
}) => {
  const tabs = [
    { id: 'home', label: 'home', icon: <House className="w-3.5 h-3.5" /> },
    { id: 'why-astra', label: 'why astra?', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'library', label: 'chunking', icon: <Library className="w-3.5 h-3.5" /> },
    { id: 'telemetry', label: 'telemetry', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'guardrails', label: 'guardrails', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'architecture', label: 'architecture', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-full max-w-5xl px-2 sm:px-4 flex justify-center">
      <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-full px-2 sm:px-3 py-1.5 flex items-center gap-1 sm:gap-1.5 shadow-2xl overflow-x-auto no-scrollbar max-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs sm:text-sm transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white text-black font-bold shadow-lg scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}

        <div className="w-px h-4 bg-white/20 hidden lg:block mx-1 shrink-0" />

        {/* Latency Target SLA Badge */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-white/90 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 shrink-0">
          <Zap className="w-3 h-3 text-cyan-300 animate-pulse" />
          <span>42ms SLA</span>
        </div>

        {/* Settings & Online Indicator */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-mono text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer ml-auto shrink-0"
          title="Server Configuration"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOnline ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isOnline ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </span>
          <Settings className="w-3.5 h-3.5 text-white/70" />
        </button>
      </div>
    </nav>
  );
};
