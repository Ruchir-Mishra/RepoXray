import React from 'react';
import { TextEffect } from './components/core/text-effect';

export function HeroHeading() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Line 1: Welcome to */}
      <TextEffect as="h2" className="text-xl md:text-2xl font-medium text-white/90 tracking-wide mb-1" per="word" preset="slide">
        Welcome to
      </TextEffect>

      {/* Line 2: RepoXray Brand Title */}
      <TextEffect as="h1" className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight" delay={0.3} per="char" preset="slide">
        RepoXray
      </TextEffect>
    </div>
  );
}
