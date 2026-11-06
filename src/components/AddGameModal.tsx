import React, { useState } from 'react';
import { X, Plus, Play, AlertCircle } from 'lucide-react';
import { Game } from '../types';
import { playUiClick } from '../utils/audio';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: Game) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Game['category']>('Arcade');
  const [iframeUrl, setIframeUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [controlsText, setControlsText] = useState('Arrow Keys or WASD to move\nSpace for action');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Game title is required.');
      return;
    }
    if (!iframeUrl.trim()) {
      setError('Iframe URL is required.');
      return;
    }

    // Parse controls
    const controls = controlsText
      .split('\n')
      .map(c => c.trim())
      .filter(Boolean);

    const newGame: Game = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category,
      iframeUrl: iframeUrl.trim(),
      thumbnail: thumbnail.trim(),
      description: description.trim() || 'Custom game loaded via iframe.',
      rating: 5.0,
      plays: 1,
      controls: controls.length > 0 ? controls : ['Standard Keyboard / Mouse Controls'],
      tags: ['Custom', category],
      isCustom: true,
    };

    playUiClick();
    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add Custom IFrame Game</h3>
              <p className="text-xs text-slate-400">Embed any HTML5 game or iframe source into your library</p>
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

        {error && (
          <div className="p-3 text-xs text-rose-300 bg-rose-950/50 border border-rose-800 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Game Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Slope Rider 3D"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Game['category'])}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Action">Action</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Retro">Retro</option>
                <option value="Sports">Sports</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              IFrame URL / Game Link *
            </label>
            <input
              type="text"
              required
              value={iframeUrl}
              onChange={e => setIframeUrl(e.target.value)}
              placeholder="e.g. /games/snake/index.html or https://..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Thumbnail Image URL (Optional)
            </label>
            <input
              type="text"
              value={thumbnail}
              onChange={e => setThumbnail(e.target.value)}
              placeholder="Leave empty for auto arcade artwork"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of the game rules and goals..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Controls (one instruction per line)
            </label>
            <textarea
              rows={2}
              value={controlsText}
              onChange={e => setControlsText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Test Preview */}
          {iframeUrl && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{showPreview ? 'Hide IFrame Preview' : 'Test IFrame Preview'}</span>
              </button>

              {showPreview && (
                <div className="mt-2 rounded-lg border border-slate-800 overflow-hidden aspect-video bg-black">
                  <iframe
                    src={iframeUrl}
                    title="Preview"
                    className="w-full h-full border-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                playUiClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Save to Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
