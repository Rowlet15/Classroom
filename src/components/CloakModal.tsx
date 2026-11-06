import React, { useState, useEffect } from 'react';
import { X, Shield, Check, ExternalLink } from 'lucide-react';
import { CLOAK_PRESETS, applyCloak } from '../utils/cloak';
import { playUiClick } from '../utils/audio';

interface CloakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPanic: () => void;
}

export const CloakModal: React.FC<CloakModalProps> = ({ isOpen, onClose, onPanic }) => {
  const [activePreset, setActivePreset] = useState<string>('default');
  const [panicUrl, setPanicUrl] = useState<string>('https://classroom.google.com');

  useEffect(() => {
    const saved = localStorage.getItem('portal_cloak_preset') || 'default';
    setActivePreset(saved);
    const savedUrl = localStorage.getItem('portal_panic_url') || 'https://classroom.google.com';
    setPanicUrl(savedUrl);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (id: string) => {
    playUiClick();
    setActivePreset(id);
    applyCloak(id);
  };

  const handleSavePanicUrl = (url: string) => {
    setPanicUrl(url);
    localStorage.setItem('portal_panic_url', url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Tab Cloaker & Panic Key</h3>
              <p className="text-xs text-slate-400">Disguise browser tab title and favicon</p>
            </div>
          </div>
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300">
            Select Tab Disguise (Updates Title & Favicon immediately)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CLOAK_PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/80 text-white'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-5 h-5 shrink-0 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: preset.iconSvg }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.title}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panic Button Settings */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300">
            Panic Escape Destination URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={panicUrl}
              onChange={(e) => handleSavePanicUrl(e.target.value)}
              placeholder="https://classroom.google.com"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => {
                playUiClick();
                onPanic();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-rose-300 bg-rose-950/70 border border-rose-800 rounded-lg hover:bg-rose-900 transition-colors whitespace-nowrap"
            >
              Test Panic Now
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Emergency Hotkey: Pressing <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 font-mono">Esc</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] text-slate-300 font-mono">]</kbd> anywhere instantly triggers the redirect.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3">
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
