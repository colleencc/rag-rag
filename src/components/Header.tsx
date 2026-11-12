import React from 'react';
import { Search, Bookmark, Sun, Moon, Sparkles } from 'lucide-react';
import { TradingViewLogo } from './BrandLogos';

export type MarketTab = 'overview' | 'stocks' | 'crypto' | 'forex' | 'heatmap' | 'screener' | 'news';

interface HeaderProps {
  activeTab: MarketTab;
  onTabChange: (tab: MarketTab) => void;
  onOpenSearch: () => void;
  watchlistCount: number;
  onToggleWatchlist: () => void;
  isWatchlistOpen: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  watchlistCount,
  onToggleWatchlist,
  isWatchlistOpen,
  theme,
  onToggleTheme
}) => {
  const navTabs: { id: MarketTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'heatmap', label: 'Heatmap' },
    { id: 'screener', label: 'Screener' },
    { id: 'news', label: 'News & Macro' },
  ];

  return (
    <header className="h-14 bg-[#131722] dark:bg-[#131722] border-b border-[#2a2e39] px-4 md:px-6 flex items-center justify-between gap-8 shrink-0 select-none sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onTabChange('overview')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <TradingViewLogo className="w-7 h-7" />
          <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 whitespace-nowrap">
            TradingView
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#2962ff]/20 text-[#2962ff] border border-[#2962ff]/30">
              Markets
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              PRO
            </span>
          </span>
        </button>
      </div>

      {/* Zone 2: 4-5 single-line clean navigation links */}
      <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'text-white bg-[#2a2e39] shadow-sm'
                  : 'text-[#787b86] hover:text-white hover:bg-[#1e222d]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Search, Watchlist, Theme Toggle, Primary CTA */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Quick Search Shortcut */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#787b86] bg-[#1e222d] hover:bg-[#2a2e39] border border-[#2a2e39] hover:border-slate-600 rounded-md transition-all cursor-pointer"
          title="Search markets (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline font-normal">Search symbols, indices, crypto...</span>
          <span className="hidden sm:inline text-[10px] font-mono bg-[#131722] px-1.5 py-0.5 rounded border border-[#2a2e39] text-slate-400">
            ⌘K
          </span>
        </button>

        {/* Watchlist Drawer Toggle */}
        <button
          onClick={onToggleWatchlist}
          className={`relative p-2 rounded-md transition-colors cursor-pointer border ${
            isWatchlistOpen
              ? 'bg-[#2962ff] text-white border-[#2962ff]'
              : 'bg-[#1e222d] text-[#d1d4dc] hover:bg-[#2a2e39] border-[#2a2e39]'
          }`}
          title="Toggle Watchlist Panel"
        >
          <Bookmark className="w-4 h-4" />
          {watchlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#2962ff] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#131722]">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-md bg-[#1e222d] hover:bg-[#2a2e39] text-[#d1d4dc] border border-[#2a2e39] transition-colors cursor-pointer"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Primary Action Button */}
        <button
          onClick={() => onTabChange('screener')}
          className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-md transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Launch Screener
        </button>
      </div>
    </header>
  );
};
