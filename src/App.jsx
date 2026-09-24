import React, { useState } from 'react';
import HeroHeading from './HeroHeading';

export default function App() {
  const [currentView, setCurrentView] = useState('welcome');

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030712]">
      {/* 1. Background glow / mesh canvas (behind everything) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Render BackgroundGlow component if present */}
      </div>

      {/* 2. Glassmorphic Central Card: Perfectly Centered */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        className="z-10 w-[420px] max-w-[90vw] p-8 rounded-3xl backdrop-blur-2xl bg-white/[0.05] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col items-center text-center"
      >
        {/* Restored Hero Title */}
        <div className="mb-6 flex flex-col items-center">
          <p className="text-sm md:text-base text-gray-300 mb-1 font-medium">Welcome to</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">RepoXray</h1>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setCurrentView('signup')}
          className="w-full py-3 px-6 rounded-full bg-white text-black font-semibold text-base shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Sign up
        </button>

        {/* Login Row */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs md:text-sm text-gray-400">
          <span>Already a member?</span>
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer border-0 underline underline-offset-4 decoration-white/60 hover:decoration-white"
          >
            Login
          </button>
        </div>
      </div>

      {/* 3. Bottom Footer Logo */}
      <footer 
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        className="z-20 flex flex-col items-center"
      >
        <button 
          type="button"
          onClick={() => setCurrentView('welcome')}
          className="hover:scale-105 transition cursor-pointer bg-transparent border-0"
        >
          <img 
            src="/repoxray-logo.png" 
            alt="RepoXray" 
            className="h-6 w-auto object-contain select-none"
            style={{ mixBlendMode: 'screen' }}
          />
        </button>
      </footer>
    </div>
  );
}
