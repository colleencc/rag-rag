/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_ASSETS, AssetQuote } from './data/marketData';
import { Header, MarketTab } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { MarketsOverview } from './components/MarketsOverview';
import { MarketHeatmap } from './components/MarketHeatmap';
import { MarketScreener } from './components/MarketScreener';
import { CategoryHub } from './components/CategoryHub';
import { SuperChartModal } from './components/SuperChartModal';
import { WatchlistSidebar, Position } from './components/WatchlistSidebar';
import { SymbolSearchModal } from './components/SymbolSearchModal';
import { TradingViewLogo } from './components/BrandLogos';

export default function App() {
  const [assets, setAssets] = useState<AssetQuote[]>(INITIAL_ASSETS);
  const [activeTab, setActiveTab] = useState<MarketTab>('overview');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NVDA');
  const [isSuperChartModalOpen, setIsSuperChartModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Watchlist symbols
  const [watchlist, setWatchlist] = useState<string[]>([
    'NVDA',
    'BTC/USD',
    'SPX',
    'AAPL',
    'SOL/USD',
    'GOLD',
    'TSLA'
  ]);

  // Paper trading portfolio state
  const [positions, setPositions] = useState<Position[]>([
    { symbol: 'NVDA', shares: 10, avgPrice: 142.50, type: 'buy' },
    { symbol: 'BTC/USD', shares: 0.25, avgPrice: 89200.00, type: 'buy' }
  ]);
  const [cashBalance, setCashBalance] = useState<number>(75000);

  // Price ticks flashing tracker
  const [flashingSymbols, setFlashingSymbols] = useState<Record<string, 'up' | 'down'>>({});

  // Real-time market tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        // Pick 1-2 random assets to tick
        const randomIndex = Math.floor(Math.random() * prevAssets.length);
        const asset = prevAssets[randomIndex];
        if (!asset) return prevAssets;

        const deltaPct = (Math.random() - 0.48) * 0.006; // small ~0.3% price tick
        const newPrice = Math.max(0.01, asset.price * (1 + deltaPct));
        const priceDiff = newPrice - asset.price;
        const newChange = asset.change + priceDiff;
        const newChangePct = ((newPrice - asset.prevClose) / asset.prevClose) * 100;

        const isUp = priceDiff >= 0;
        setFlashingSymbols((prev) => ({
          ...prev,
          [asset.symbol]: isUp ? 'up' : 'down'
        }));

        setTimeout(() => {
          setFlashingSymbols((prev) => {
            const next = { ...prev };
            delete next[asset.symbol];
            return next;
          });
        }, 1500);

        const updated = [...prevAssets];
        updated[randomIndex] = {
          ...asset,
          price: parseFloat(newPrice.toFixed(asset.price < 2 ? 4 : 2)),
          change: parseFloat(newChange.toFixed(2)),
          changePercent: parseFloat(newChangePct.toFixed(2)),
          high: Math.max(asset.high, newPrice),
          low: Math.min(asset.low, newPrice)
        };
        return updated;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // Theme synchronization with document.documentElement
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSelectSymbol = (symbol: string) => {
    setSelectedSymbol(symbol);
    setIsSuperChartModalOpen(true);
  };

  const handleToggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter((s) => s !== symbol));
    } else {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const handleAddToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol));
  };

  const handleTrade = (symbol: string, type: 'buy' | 'sell', shares: number, price: number) => {
    const cost = shares * price;
    if (type === 'buy') {
      if (cashBalance < cost) return;
      setCashBalance((c) => c - cost);
      setPositions((prev) => {
        const existing = prev.find((p) => p.symbol === symbol);
        if (existing) {
          const totalShares = existing.shares + shares;
          const newAvg = (existing.shares * existing.avgPrice + cost) / totalShares;
          return prev.map((p) => (p.symbol === symbol ? { ...p, shares: totalShares, avgPrice: newAvg } : p));
        }
        return [...prev, { symbol, shares, avgPrice: price, type: 'buy' }];
      });
    } else {
      // Sell
      setPositions((prev) => {
        const existing = prev.find((p) => p.symbol === symbol);
        if (!existing) return prev;
        const soldShares = Math.min(existing.shares, shares);
        setCashBalance((c) => c + soldShares * price);
        if (existing.shares <= shares) {
          return prev.filter((p) => p.symbol !== symbol);
        }
        return prev.map((p) => (p.symbol === symbol ? { ...p, shares: p.shares - soldShares } : p));
      });
    }
  };

  const handleClosePosition = (symbol: string) => {
    const pos = positions.find((p) => p.symbol === symbol);
    if (!pos) return;
    const asset = assets.find((a) => a.symbol === symbol);
    const price = asset ? asset.price : pos.avgPrice;
    setCashBalance((c) => c + pos.shares * price);
    setPositions(positions.filter((p) => p.symbol !== symbol));
  };

  const activeAssetQuote = assets.find((a) => a.symbol === selectedSymbol) || assets[0];

  return (
    <div className="min-h-screen bg-[#131722] dark:bg-[#131722] text-[#d1d4dc] flex flex-col selection:bg-[#2962ff]/30">
      {/* 1. Header Navigation Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        watchlistCount={watchlist.length}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
        isWatchlistOpen={isWatchlistOpen}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Top Rolling Ticker Tape */}
      <TickerTape
        assets={assets}
        onSelectSymbol={handleSelectSymbol}
        flashingSymbols={flashingSymbols}
      />

      {/* 3. Main Viewport & Collapsible Right Watchlist Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <MarketsOverview
              assets={assets}
              onSelectSymbol={handleSelectSymbol}
              onViewScreener={() => setActiveTab('screener')}
              onViewHeatmap={() => setActiveTab('heatmap')}
            />
          )}

          {activeTab === 'heatmap' && (
            <MarketHeatmap assets={assets} onSelectSymbol={handleSelectSymbol} />
          )}

          {activeTab === 'screener' && (
            <MarketScreener
              assets={assets}
              onSelectSymbol={handleSelectSymbol}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
            />
          )}

          {(activeTab === 'stocks' || activeTab === 'crypto' || activeTab === 'forex' || activeTab === 'news') && (
            <CategoryHub
              category={activeTab}
              assets={assets}
              onSelectSymbol={handleSelectSymbol}
              onOpenScreener={() => setActiveTab('screener')}
            />
          )}

          {/* Footer Area */}
          <footer className="mt-12 py-8 px-6 border-t border-[#2a2e39] bg-[#131722] text-xs text-[#787b86]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <TradingViewLogo className="w-5 h-5" />
                <span className="font-bold text-slate-300">TradingView Markets</span>
                <span className="text-[11px] text-[#787b86]">· Global Data & Charting Platform</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span>Market quotes delayed by 15 mins</span>
                <span>·</span>
                <span>Terms of Service</span>
                <span>·</span>
                <span>Privacy Policy</span>
                <span>·</span>
                <span>Paper Trading Sandbox</span>
              </div>
            </div>
          </footer>
        </main>

        {/* Watchlist & Alerts Right Sidebar */}
        <WatchlistSidebar
          isOpen={isWatchlistOpen}
          onClose={() => setIsWatchlistOpen(false)}
          watchlistSymbols={watchlist}
          allAssets={assets}
          selectedSymbol={selectedSymbol}
          onSelectSymbol={setSelectedSymbol}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          onAddToWatchlist={handleAddToWatchlist}
          flashingSymbols={flashingSymbols}
          positions={positions}
          cashBalance={cashBalance}
          onClosePosition={handleClosePosition}
        />
      </div>

      {/* 4. SuperChart Modal View */}
      {isSuperChartModalOpen && (
        <SuperChartModal
          asset={activeAssetQuote}
          onClose={() => setIsSuperChartModalOpen(false)}
          onTrade={handleTrade}
        />
      )}

      {/* 5. Symbol Search Modal (Ctrl+K) */}
      <SymbolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        onSelectSymbol={handleSelectSymbol}
      />
    </div>
  );
}
