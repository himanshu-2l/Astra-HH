import React, { useState } from 'react';
import { FlowCanvas } from './FlowCanvas';
import { FlowNavbar } from './FlowNavbar';
import { FlowHero } from './FlowHero';
import { FlowMarquee } from './FlowMarquee';
import { FlowFooter } from './FlowFooter';
import { SupportedLanguage } from '../../types';

export const FlowRebuiltSite: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleSearch = (query: string, lang: SupportedLanguage) => {
    console.log('Search in flow rebuilt:', query, lang);
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden relative bg-[#050a14] text-white select-none">
      {/* Exact 3D Raymarching Shader Background */}
      <FlowCanvas scale={1} />

      {/* Radial Vignette Overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(transparent 0%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.9) 100%)',
          zIndex: 1,
        }}
      />

      {/* Top Floating Glass Nav */}
      <FlowNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOnline={true}
        onOpenSettings={() => {}}
      />

      {/* Hero & Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-24 pb-36 px-4">
        {/* Built With Tech Marquee */}
        <FlowMarquee />

        {/* Hero Section */}
        <FlowHero onSearch={handleSearch} isLoading={false} />
      </div>

      {/* Bottom Fixed Footer */}
      <FlowFooter />
    </div>
  );
};
