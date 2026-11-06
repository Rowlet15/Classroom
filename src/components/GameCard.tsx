import React from 'react';
import { Play, Heart } from 'lucide-react';
import { Game } from '../types';
import { GameThumbnail } from './GameThumbnail';
import { playUiClick, playFavoriteSound } from '../utils/audio';

interface GameCardProps {
  game: Game;
  isFavorite: boolean;
  onPlay: (game: Game) => void;
  onToggleFavorite: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onPlay,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => {
        playUiClick();
        onPlay(game);
      }}
      className="group cursor-pointer flex flex-col rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-indigo-500/10"
    >
      {/* Thumbnail Aspect Container with pure CSS/SVG vector art */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <GameThumbnail game={game} className="w-full h-full transition-transform duration-300 group-hover:scale-105" />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playFavoriteSound();
            onToggleFavorite(game.id);
          }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-lg backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-rose-500/90 text-white'
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-900/90'
          }`}
          aria-label="Favorite toggle"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/30 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/50 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex flex-col flex-grow justify-between gap-2">
        <div>
          <h3 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Unboxed Metadata Line with typographic separators */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-300">{game.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">★ {game.rating.toFixed(1)}</span>
          </div>

          <span className="font-mono tabular-nums text-slate-400">
            {game.plays.toLocaleString()} plays
          </span>
        </div>
      </div>
    </div>
  );
};
