import React from 'react';
import { Play, Sparkles, ShieldCheck } from 'lucide-react';
import { Game } from '../types';
import { GameThumbnail } from './GameThumbnail';
import { playUiClick } from '../utils/audio';

interface HeroBannerProps {
  featuredGame?: Game;
  onPlayGame: (game: Game) => void;
  onOpenCloakModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredGame,
  onPlayGame,
  onOpenCloakModal,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
      {/* Sleek SVG Grid Pattern & Radial Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="text-indigo-400 font-semibold">Unblocked Arcade</span>
            <span aria-hidden="true">·</span>
            <span>Local & Sandboxed IFrames</span>
            <span aria-hidden="true">·</span>
            <span>Zero School Filter Tracking</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white" style={{ textWrap: 'balance' }}>
            Next-generation unblocked gaming hub.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Stream standalone HTML5 canvas and web arcade games with zero latency. Every game is isolated in a secure iframe, stored cleanly in JSON, and equipped with stealth tab cloaking.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {featuredGame && (
              <button
                onClick={() => {
                  playUiClick();
                  onPlayGame(featuredGame);
                }}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play {featuredGame.title}</span>
              </button>
            )}

            <button
              onClick={() => {
                playUiClick();
                onOpenCloakModal();
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Configure Stealth Cloak</span>
            </button>
          </div>
        </div>

        {featuredGame && (
          <div className="hidden lg:flex flex-col items-center shrink-0 w-80">
            <div
              onClick={() => {
                playUiClick();
                onPlayGame(featuredGame);
              }}
              className="cursor-pointer group relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-700/80 bg-slate-800 shadow-2xl transition-transform duration-200 hover:-translate-y-1"
            >
              <GameThumbnail
                game={featuredGame}
                className="w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Featured Pick
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {featuredGame.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-0.5">
                    <span>{featuredGame.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>★ {featuredGame.rating}</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-indigo-600/90 flex items-center justify-center text-white group-hover:bg-indigo-500 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
