import React from 'react';
import {
  Gamepad2,
  Rocket,
  Zap,
  Grid,
  Layers,
  Flag,
  Swords,
  Wind,
  Trophy
} from 'lucide-react';
import { Game } from '../types';

interface GameThumbnailProps {
  game: Game;
  className?: string;
  showTitleOverlay?: boolean;
}

export const GameThumbnail: React.FC<GameThumbnailProps> = ({
  game,
  className = 'w-full h-full',
  showTitleOverlay = false,
}) => {
  // If a real external user image is supplied, attempt to display it
  const [hasError, setHasError] = React.useState(false);

  if (game.thumbnail && !hasError && !game.thumbnail.includes('/assets/images/')) {
    return (
      <img
        src={game.thumbnail}
        alt={game.title}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`${className} object-cover`}
      />
    );
  }

  // Pure SVG/CSS Vector Art based on game id/category
  const renderVectorGraphics = () => {
    switch (game.id) {
      case 'basket-bros':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-amber-950 via-slate-900 to-orange-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Hardwood court perspective lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="100%" x2="50%" y2="0" stroke="#f97316" strokeWidth="2" />
              <line x1="100%" y1="100%" x2="50%" y2="0" stroke="#f97316" strokeWidth="2" />
              <circle cx="50%" cy="50%" r="35" stroke="#f97316" strokeWidth="2" fill="none" />
              <path d="M 20% 100% C 20% 60%, 80% 60%, 80% 100%" stroke="#f97316" strokeWidth="2" fill="none" />
            </svg>
            <div className="relative z-10 w-16 h-16 rounded-full bg-orange-600/20 border-2 border-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              {/* Basketball icon */}
              <svg className="w-9 h-9 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M4.93 4.93l4.24 4.24" />
                <path d="M14.83 14.83l4.24 4.24" />
                <path d="M14.83 9.17l4.24-4.24" />
                <path d="M4.93 19.07l4.24-4.24" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="12" y1="2" x2="12" y2="22" />
              </svg>
            </div>
            <div className="relative z-10 mt-2 text-[11px] font-bold tracking-wider text-orange-300 uppercase">
              Street Dunk
            </div>
          </div>
        );

      case 'retro-arcade-snake':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
            {/* Snake Body segments */}
            <div className="relative z-10 flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-indigo-700 opacity-60" />
              <div className="w-5 h-5 rounded bg-indigo-600 opacity-80" />
              <div className="w-6 h-6 rounded-md bg-indigo-500 shadow-md shadow-indigo-500/50 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-white rounded-full" />
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
              <div className="w-3.5 h-3.5 rounded-full bg-sky-400 shadow-lg shadow-sky-400 animate-pulse ml-2" />
            </div>
            <div className="relative z-10 mt-3 text-[11px] font-bold tracking-wider text-indigo-300 uppercase">
              Neon Grid
            </div>
          </div>
        );

      case 'cosmic-rebel-fighter':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-sky-950 to-indigo-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Starfield dots */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
            <div className="relative z-10 w-16 h-16 rounded-full bg-sky-600/20 border border-sky-500/60 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Rocket className="w-8 h-8 text-sky-400 -rotate-45" />
            </div>
            <div className="relative z-10 mt-2 text-[11px] font-bold tracking-wider text-sky-300 uppercase">
              Starfighter
            </div>
          </div>
        );

      case 'cyber-rooftop-runner':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-purple-950 via-slate-900 to-fuchsia-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Perspective ground grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
            <div className="relative z-10 w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/60 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <div className="relative z-10 mt-2 text-[11px] font-bold tracking-wider text-purple-300 uppercase">
              Endless Speed
            </div>
          </div>
        );

      case 'puzzle-2048-pulse':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 flex flex-col items-center justify-center overflow-hidden">
            <div className="relative z-10 grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-slate-900/80 border border-slate-700/60">
              <div className="w-6 h-6 rounded bg-sky-900/60 text-sky-300 font-bold text-[10px] flex items-center justify-center">2</div>
              <div className="w-6 h-6 rounded bg-sky-700 text-white font-bold text-[10px] flex items-center justify-center">8</div>
              <div className="w-6 h-6 rounded bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">64</div>
              <div className="w-6 h-6 rounded bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">2k</div>
            </div>
            <div className="relative z-10 mt-2 text-[11px] font-bold tracking-wider text-sky-300 uppercase">
              Merge 2048
            </div>
          </div>
        );

      case 'neon-breakout':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-rose-950 via-slate-900 to-pink-950 flex flex-col items-center justify-center overflow-hidden">
            {/* Bricks mini layout */}
            <div className="relative z-10 space-y-1">
              <div className="flex gap-1">
                <div className="w-4 h-1.5 rounded-sm bg-rose-500" />
                <div className="w-4 h-1.5 rounded-sm bg-amber-500" />
                <div className="w-4 h-1.5 rounded-sm bg-emerald-500" />
                <div className="w-4 h-1.5 rounded-sm bg-sky-500" />
              </div>
              <div className="flex gap-1 justify-center">
                <div className="w-4 h-1.5 rounded-sm bg-amber-500" />
                <div className="w-4 h-1.5 rounded-sm bg-sky-500" />
              </div>
            </div>
            <div className="relative z-10 mt-3 w-10 h-1.5 rounded-full bg-sky-400 shadow-md shadow-sky-400/50" />
            <div className="relative z-10 mt-2 text-[11px] font-bold tracking-wider text-rose-300 uppercase">
              Brick Smasher
            </div>
          </div>
        );

      case 'cyber-minesweeper':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex flex-col items-center justify-center overflow-hidden">
            <div className="relative z-10 w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/60 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Flag className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="relative z-10 mt-2 text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
              Minefield
            </div>
          </div>
        );

      case 'cyber-pong-1v1':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 flex flex-col items-center justify-center overflow-hidden">
            <div className="relative z-10 flex items-center justify-between w-28 px-2 border-b border-dashed border-cyan-500/40 pb-2">
              <div className="w-1.5 h-7 rounded bg-sky-400 shadow-sm shadow-sky-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-md shadow-white" />
              <div className="w-1.5 h-7 rounded bg-rose-400 shadow-sm shadow-rose-400" />
            </div>
            <div className="relative z-10 mt-2 text-[11px] font-bold tracking-wider text-cyan-300 uppercase">
              Cyber Pong
            </div>
          </div>
        );

      case 'pixel-flight-wings':
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-amber-950 via-sky-950 to-emerald-950 flex flex-col items-center justify-center overflow-hidden">
            <div className="relative z-10 w-16 h-16 rounded-full bg-amber-600/20 border border-amber-500/60 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Wind className="w-8 h-8 text-amber-400" />
            </div>
            <div className="relative z-10 mt-2 text-[11px] font-bold tracking-wider text-amber-300 uppercase">
              Flap & Fly
            </div>
          </div>
        );

      default:
        return (
          <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-indigo-400" />
            </div>
            <div className="mt-2 text-[11px] font-bold tracking-wider text-indigo-300 uppercase">
              {game.category}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      {renderVectorGraphics()}
      {showTitleOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
          <span className="text-xs font-bold text-white truncate">{game.title}</span>
        </div>
      )}
    </div>
  );
};
