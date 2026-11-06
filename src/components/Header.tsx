import React from 'react';
import { Shield, Plus, FileCode, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { playUiClick } from '../utils/audio';

interface HeaderProps {
  onOpenCloakModal: () => void;
  onOpenAddModal: () => void;
  onOpenJsonModal: () => void;
  onResetView: () => void;
  onPanic: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCloakModal,
  onOpenAddModal,
  onOpenJsonModal,
  onResetView,
  onPanic,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => {
            playUiClick();
            onResetView();
          }}
          className="text-left group flex items-center gap-2.5 whitespace-nowrap shrink-0 text-slate-100 hover:text-indigo-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm shadow-indigo-500/20">
            P
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            PortalHub
          </span>
        </button>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => {
              playUiClick();
              onResetView();
            }}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0"
          >
            All Games
          </button>
          <button
            onClick={() => {
              playUiClick();
              onOpenCloakModal();
            }}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Tab Cloaker
          </button>
          <button
            onClick={() => {
              playUiClick();
              onOpenAddModal();
            }}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            Add Custom Game
          </button>
          <button
            onClick={() => {
              playUiClick();
              onOpenJsonModal();
            }}
            className="hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            JSON Library
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Utility */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              playUiClick();
              onToggleSound();
            }}
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onPanic}
            title="Panic Key: Instantly redirect to safe site (Shortcut: Esc or ])"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/70 border border-rose-800/80 rounded-lg hover:bg-rose-900/80 transition-colors whitespace-nowrap shrink-0"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Panic Escape</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-rose-900/60 rounded border border-rose-700/50">Esc</kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
