import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Terminal, GitBranch, Globe } from 'lucide-react';
import { playUiClick } from '../utils/audio';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, stepIndex: number) => {
    playUiClick();
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "Initial commit of PortalHub Unblocked Games"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Deploy & Access via GitHub</h3>
              <p className="text-xs text-slate-400">Host for free with automatic GitHub Pages deployment</p>
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

        {/* Steps */}
        <div className="space-y-4 text-xs text-slate-300">
          {/* Step 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-100">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-[10px] font-mono">1</span>
                Create a Repository on GitHub
              </span>
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
              >
                <span>github.com/new</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400">
              Create a new public repository (e.g. <code className="text-indigo-300 font-mono">unblocked-games</code>).
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2.5">
            <div className="flex items-center justify-between font-semibold text-slate-100">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-[10px] font-mono">2</span>
                Push Code to GitHub
              </span>
              <button
                onClick={() => handleCopy(gitCommands, 2)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                {copiedStep === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedStep === 2 ? 'Copied Commands!' : 'Copy Shell Script'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
              {gitCommands}
            </pre>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-[10px] font-mono">3</span>
              Enable GitHub Pages (Deploy from Branch)
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-400 pl-7">
              <div>1. In your GitHub repository, open the <strong className="text-slate-200">Settings</strong> tab.</div>
              <div>2. Click <strong className="text-slate-200">Pages</strong> in the left sidebar.</div>
              <div>3. Under <strong className="text-slate-200">Source</strong>, choose <strong className="text-white">Deploy from a branch</strong>.</div>
              <div>4. Set Branch to <span className="text-emerald-400 font-semibold font-mono">gh-pages</span> and folder to <span className="text-emerald-400 font-semibold font-mono">/ (root)</span>, then click <strong className="text-slate-200">Save</strong>.</div>
            </div>
          </div>

          {/* Result */}
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-[11px] text-indigo-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              Your site builds with <code className="font-mono text-white">.nojekyll</code> and automatically deploys to the <code className="font-mono text-white">gh-pages</code> branch on every push!
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              playUiClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
