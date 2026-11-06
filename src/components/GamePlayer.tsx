import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Shield,
  Heart,
  Expand,
  Shrink,
  Gamepad2,
  Keyboard,
  Info
} from 'lucide-react';
import { Game } from '../types';
import { GameThumbnail } from './GameThumbnail';
import { launchAboutBlank } from '../utils/cloak';
import { resolveGameUrl } from '../utils/url';
import { playUiClick, playFavoriteSound } from '../utils/audio';

interface GamePlayerProps {
  game: Game;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (gameId: string) => void;
  onSelectGame: (game: Game) => void;
  relatedGames: Game[];
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  isFavorite,
  onBack,
  onToggleFavorite,
  onSelectGame,
  relatedGames,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [aboutBlankNotice, setAboutBlankNotice] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    playUiClick();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleReload = () => {
    playUiClick();
    setReloadKey(prev => prev + 1);
  };

  const resolvedUrl = resolveGameUrl(game.iframeUrl);

  const handleLaunchAboutBlank = () => {
    playUiClick();
    const success = launchAboutBlank(resolvedUrl, game.title);
    if (!success) {
      setAboutBlankNotice(true);
      setTimeout(() => setAboutBlankNotice(false), 3500);
    }
  };

  const handleOpenExternal = () => {
    playUiClick();
    window.open(resolvedUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <button
          onClick={() => {
            playUiClick();
            onBack();
          }}
          className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2">
          {/* About:Blank Stealth Launcher */}
          <button
            onClick={handleLaunchAboutBlank}
            title="Launch in about:blank tab (prevents site from appearing in browser history)"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 rounded-lg transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">About:Blank Cloak</span>
            <span className="sm:hidden">Cloak Tab</span>
          </button>

          {/* Theater Mode */}
          <button
            onClick={() => {
              playUiClick();
              setIsTheater(!isTheater);
            }}
            title={isTheater ? 'Default view' : 'Theater mode'}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors"
          >
            {isTheater ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (F)'}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Reload Button */}
          <button
            onClick={handleReload}
            title="Reload game iframe"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Open In New Tab */}
          <button
            onClick={handleOpenExternal}
            title="Open game direct in new tab"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => {
              playFavoriteSound();
              onToggleFavorite(game.id);
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-lg border transition-colors ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border-rose-800/80'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
          </button>
        </div>
      </div>

      {aboutBlankNotice && (
        <div className="p-3 text-xs text-amber-200 bg-amber-950/70 border border-amber-800 rounded-lg flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Popup blocked. Please allow popups in your browser address bar to launch About:Blank stealth mode.</span>
        </div>
      )}

      {/* Main Iframe Container */}
      <div
        ref={containerRef}
        className={`relative rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl transition-all duration-300 ${
          isTheater ? 'w-full aspect-[16/9] max-h-[85vh]' : 'w-full aspect-[16/10] max-w-5xl mx-auto'
        }`}
      >
        <iframe
          key={`${game.id}-${reloadKey}`}
          ref={iframeRef}
          src={resolvedUrl}
          title={game.title}
          allow="autoplay; fullscreen; keyboard; gamepad"
          allowFullScreen
          className="w-full h-full border-none block"
        />
      </div>

      {/* Details & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Game Info */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-medium text-indigo-400">{game.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">★ {game.rating.toFixed(1)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{game.plays.toLocaleString()} plays</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {game.title}
            </h2>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {game.description}
          </p>

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="text-slate-400">Tags:</span>
              {game.tags.map((tag, idx) => (
                <span key={tag} className="text-slate-300">
                  {tag}{idx < game.tags.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Controls Panel */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Keyboard className="w-4 h-4 text-indigo-400" />
            <span>Controls & Mechanics</span>
          </div>

          {game.controls && game.controls.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-300">
              {game.controls.map((ctrl, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono mt-0.5">▸</span>
                  <span>{ctrl}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Click canvas to focus controls.</p>
          )}

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-normal">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-slate-300">Esc</kbd> anytime to trigger the Panic Cloak.
          </div>
        </div>
      </div>

      {/* Suggested / Related Games */}
      {relatedGames.length > 0 && (
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-base font-bold text-slate-200">
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            <span>More Unblocked Games</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedGames.slice(0, 4).map(rg => (
              <div
                key={rg.id}
                onClick={() => {
                  playUiClick();
                  onSelectGame(rg);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer rounded-lg overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-2 transition-all hover:-translate-y-0.5"
              >
                <div className="aspect-[16/10] w-full rounded overflow-hidden bg-slate-950 mb-2">
                  <GameThumbnail
                    game={rg}
                    className="w-full h-full group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 truncate">
                  {rg.title}
                </h4>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {rg.category} · ★ {rg.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
