import React, { useState } from 'react';
import { X, FileCode, Download, Upload, Copy, Check, RotateCcw, AlertCircle } from 'lucide-react';
import { Game } from '../types';
import { playUiClick } from '../utils/audio';

interface JsonManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  onImportGames: (imported: Game[]) => void;
  onResetDefaults: () => void;
}

export const JsonManagerModal: React.FC<JsonManagerModalProps> = ({
  isOpen,
  onClose,
  games,
  onImportGames,
  onResetDefaults,
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [isImportMode, setIsImportMode] = useState(false);
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    playUiClick();
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    playUiClick();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].iframeUrl) {
          playUiClick();
          onImportGames(parsed);
          onClose();
        } else {
          setImportError('Invalid format: JSON must be an array of games with iframeUrl.');
        }
      } catch {
        setImportError('Failed to parse uploaded JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleManualImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].iframeUrl) {
        playUiClick();
        onImportGames(parsed);
        setIsImportMode(false);
        onClose();
      } else {
        setImportError('Invalid format: Expected array of game objects with iframeUrl.');
      }
    } catch {
      setImportError('Invalid JSON syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">JSON Games Storage</h3>
              <p className="text-xs text-slate-400">Inspect, export, or import the game library stored in games.json</p>
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

        {importError && (
          <div className="p-3 text-xs text-rose-300 bg-rose-950/50 border border-rose-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImportMode(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                !isImportMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              View JSON ({games.length} games)
            </button>
            <button
              onClick={() => setIsImportMode(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isImportMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Import JSON
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download games.json</span>
            </button>
          </div>
        </div>

        {!isImportMode ? (
          <div>
            <div className="relative">
              <pre className="w-full max-h-80 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 leading-relaxed">
                {jsonString}
              </pre>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Note: Every game is stored with an <code className="text-indigo-300 font-mono">iframeUrl</code> property pointing to either a local HTML game or an external embed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Option A: Upload .json File
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-950 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-xs text-slate-300">Click to choose a games.json file</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Option B: Paste JSON Text
              </label>
              <textarea
                rows={6}
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="[ { &quot;id&quot;: &quot;...&quot;, &quot;title&quot;: &quot;...&quot;, &quot;iframeUrl&quot;: &quot;...&quot; } ]"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleManualImport}
                  disabled={!importText.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-40 transition-colors"
                >
                  Import From Text
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset & Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              if (window.confirm('Reset games library to original default games.json?')) {
                playUiClick();
                onResetDefaults();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Original Defaults</span>
          </button>

          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
