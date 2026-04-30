/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 overflow-hidden relative font-sans">
      {/* Immersive background effects */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-80"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(217, 70, 239, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.5) 0%, transparent 100%)
          `,
          filter: 'blur(40px)',
        }}
      />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col xl:flex-row items-center justify-center gap-12 pt-16">
        
        {/* Header/Title - Absolute on top */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-500 animate-pulse shadow-[0_0_20px_rgba(217,70,239,0.5)]"></div>
          <h1 className="text-2xl font-mono font-bold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            NEON<span className="text-fuchsia-500">_</span>SYNTH
          </h1>
        </div>

        {/* Music Player Side */}
        <div className="flex-shrink-0 w-full xl:w-auto flex justify-center xl:justify-end xl:mb-0 mb-8 xl:absolute xl:left-8 xl:top-1/2 xl:-translate-y-1/2">
          <MusicPlayer />
        </div>

        {/* Game Center */}
        <div className="flex-1 flex justify-center items-center">
          <SnakeGame />
        </div>
      </div>
    </div>
  );
}
