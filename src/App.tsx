import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Star,
  Clock,
  Sparkles,
  Gamepad2,
  X
} from 'lucide-react';
import { Game, CategoryFilter, SortOption } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { CloakModal } from './components/CloakModal';
import { AddGameModal } from './components/AddGameModal';
import { JsonManagerModal } from './components/JsonManagerModal';
import { initCloak, triggerPanic } from './utils/cloak';
import {
  playUiClick,
  playGameLaunch,
  isSoundEnabled,
  setSoundEnabled,
  initSoundPreference
} from './utils/audio';

// Fallback initial games if fetch fails
import defaultGamesData from '../public/games.json';

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentGameIds, setRecentGameIds] = useState<string[]>([]);
  const [soundOn, setSoundOn] = useState(true);

  // Modals
  const [isCloakOpen, setIsCloakOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize app on mount
  useEffect(() => {
    // 1. Init tab cloak and audio
    initCloak();
    setSoundOn(initSoundPreference());

    // 2. Load favorites & recent from localStorage
    try {
      const savedFavs = localStorage.getItem('portal_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedRecent = localStorage.getItem('portal_recent');
      if (savedRecent) setRecentGameIds(JSON.parse(savedRecent));
    } catch {
      // Ignore
    }

    // 3. Load games from localStorage or public/games.json
    try {
      const storedCustomGames = localStorage.getItem('portal_custom_games');
      const customList: Game[] = storedCustomGames ? JSON.parse(storedCustomGames) : [];

      fetch('/games.json')
        .then(res => res.json())
        .then((data: Game[]) => {
          // Merge custom games with fetched games
          const merged = [...data, ...customList.filter(cg => !data.some(d => d.id === cg.id))];
          setGames(merged);
        })
        .catch(() => {
          // Fallback to imported defaultGamesData
          const merged = [...defaultGamesData, ...customList.filter(cg => !defaultGamesData.some(d => d.id === cg.id))] as Game[];
          setGames(merged);
        });
    } catch {
      setGames(defaultGamesData as Game[]);
    }
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Emergency Panic hotkey: Escape or ']'
      if (e.key === ']' || (e.key === 'Escape' && !isCloakOpen && !isAddOpen && !isJsonOpen && !activeGame)) {
        triggerPanic();
      }

      // Search hotkey: '/'
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCloakOpen, isAddOpen, isJsonOpen, activeGame]);

  // Handle Play Game
  const handlePlayGame = (game: Game) => {
    playGameLaunch();
    setActiveGame(game);

    // Increment local play count
    setGames(prev =>
      prev.map(g => (g.id === game.id ? { ...g, plays: g.plays + 1 } : g))
    );

    // Update recently played
    setRecentGameIds(prev => {
      const next = [game.id, ...prev.filter(id => id !== game.id)].slice(0, 10);
      localStorage.setItem('portal_recent', JSON.stringify(next));
      return next;
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Favorite
  const handleToggleFavorite = (gameId: string) => {
    setFavorites(prev => {
      const next = prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId];
      localStorage.setItem('portal_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Add Custom Game
  const handleAddGame = (newGame: Game) => {
    setGames(prev => [newGame, ...prev]);
    try {
      const stored = localStorage.getItem('portal_custom_games');
      const list: Game[] = stored ? JSON.parse(stored) : [];
      list.unshift(newGame);
      localStorage.setItem('portal_custom_games', JSON.stringify(list));
    } catch {
      // Ignore
    }
  };

  // Import Games
  const handleImportGames = (imported: Game[]) => {
    setGames(imported);
    try {
      localStorage.setItem('portal_custom_games', JSON.stringify(imported.filter(g => g.isCustom)));
    } catch {
      // Ignore
    }
  };

  // Reset to default
  const handleResetDefaults = () => {
    localStorage.removeItem('portal_custom_games');
    setGames(defaultGamesData as Game[]);
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // Filtered & Sorted Games
  const filteredGames = useMemo(() => {
    return games
      .filter(game => {
        // Category filtering
        if (selectedCategory === 'Favorites') {
          return favorites.includes(game.id);
        }
        if (selectedCategory === 'Recent') {
          return recentGameIds.includes(game.id);
        }
        if (selectedCategory !== 'All' && game.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchTag = game.tags?.some(t => t.toLowerCase().includes(q));
          return matchTitle || matchDesc || matchTag;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.plays - a.plays;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, selectedCategory, searchQuery, sortBy, favorites, recentGameIds]);

  const featuredGame = useMemo(() => {
    return games.find(g => g.featured) || games[0];
  }, [games]);

  const categories: { label: CategoryFilter; count: number }[] = [
    { label: 'All', count: games.length },
    { label: 'Sports', count: games.filter(g => g.category === 'Sports').length },
    { label: 'Arcade', count: games.filter(g => g.category === 'Arcade').length },
    { label: 'Action', count: games.filter(g => g.category === 'Action').length },
    { label: 'Puzzle', count: games.filter(g => g.category === 'Puzzle').length },
    { label: 'Retro', count: games.filter(g => g.category === 'Retro').length },
    { label: 'Favorites', count: favorites.length },
    { label: 'Recent', count: recentGameIds.length },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        onOpenCloakModal={() => setIsCloakOpen(true)}
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenJsonModal={() => setIsJsonOpen(true)}
        onResetView={() => setActiveGame(null)}
        onPanic={triggerPanic}
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {activeGame ? (
          /* Single Game Player View */
          <GamePlayer
            game={activeGame}
            isFavorite={favorites.includes(activeGame.id)}
            onBack={() => setActiveGame(null)}
            onToggleFavorite={handleToggleFavorite}
            onSelectGame={handlePlayGame}
            relatedGames={games.filter(g => g.id !== activeGame.id && g.category === activeGame.category)}
          />
        ) : (
          /* Hub Home View */
          <div className="space-y-8">
            {/* Hero Spotlight */}
            <HeroBanner
              featuredGame={featuredGame}
              onPlayGame={handlePlayGame}
              onOpenCloakModal={() => setIsCloakOpen(true)}
            />

            {/* Controls Bar: Search & Category Filter Tabs */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search games, categories, controls... (Press '/' to focus)"
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Option */}
                <div className="flex items-center gap-2 shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => {
                      playUiClick();
                      setSortBy(e.target.value as SortOption);
                    }}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="title">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Functional Segmented Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar p-1 bg-slate-900/60 rounded-xl border border-slate-800/80">
                {categories.map(cat => {
                  const isActive = selectedCategory === cat.label;
                  return (
                    <button
                      key={cat.label}
                      onClick={() => {
                        playUiClick();
                        setSelectedCategory(cat.label);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] opacity-75 font-mono tabular-nums">({cat.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Games Grid Header */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-indigo-400" />
                <h2 className="text-base font-bold text-slate-100">
                  {selectedCategory === 'All' ? 'All Unblocked Games' : `${selectedCategory} Games`}
                </h2>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  · {filteredGames.length} available
                </span>
              </div>
            </div>

            {/* Game Cards Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onPlay={handlePlayGame}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 space-y-3">
                <p className="text-sm text-slate-400">
                  No games matched your search criteria.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      playUiClick();
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => {
                      playUiClick();
                      setIsAddOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Add Custom Game
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">PortalHub</span>
            <span aria-hidden="true">·</span>
            <span>JSON-Powered Unblocked Games</span>
            <span aria-hidden="true">·</span>
            <span>Sandbox Safe</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => {
                playUiClick();
                setIsCloakOpen(true);
              }}
              className="hover:text-slate-200 transition-colors"
            >
              Tab Cloaker
            </button>
            <button
              onClick={() => {
                playUiClick();
                setIsJsonOpen(true);
              }}
              className="hover:text-slate-200 transition-colors"
            >
              Export JSON
            </button>
            <button
              onClick={() => {
                playUiClick();
                setIsAddOpen(true);
              }}
              className="hover:text-slate-200 transition-colors"
            >
              Submit Game
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CloakModal
        isOpen={isCloakOpen}
        onClose={() => setIsCloakOpen(false)}
        onPanic={triggerPanic}
      />

      <AddGameModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonManagerModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        games={games}
        onImportGames={handleImportGames}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
