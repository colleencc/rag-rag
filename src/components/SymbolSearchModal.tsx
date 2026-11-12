import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AssetQuote } from '../data/marketData';
import { SymbolBadge } from './BrandLogos';

interface SymbolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetQuote[];
  onSelectSymbol: (symbol: string) => void;
}

export const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'stocks' | 'crypto' | 'forex' | 'indices' | 'futures'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = assets.filter((asset) => {
    if (activeFilter !== 'all' && asset.category !== activeFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return asset.symbol.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#1e222d] border border-[#2a2e39] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input Field */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2a2e39] bg-[#131722]">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company name, crypto, currency (e.g. NVDA, BTC, EUR/USD)..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[#787b86] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#787b86] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2a2e39] text-[#787b86]">
            ESC
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#2a2e39] bg-[#1a1e29] overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'stocks', label: 'Stocks' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'forex', label: 'Forex' },
            { id: 'indices', label: 'Indices' },
            { id: 'futures', label: 'Commodities' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFilter(item.id as any)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === item.id
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#2a2e39]/50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#787b86]">
              No symbols match "{query}" in {activeFilter}
            </div>
          ) : (
            filtered.map((asset) => {
              const isPositive = asset.changePercent >= 0;
              return (
                <div
                  key={asset.symbol}
                  onClick={() => {
                    onSelectSymbol(asset.symbol);
                    onClose();
                  }}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-[#2a2e39] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <SymbolBadge symbol={asset.symbol} className="w-8 h-8 text-xs" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs group-hover:text-[#2962ff] transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#131722] text-[#787b86]">
                          {asset.exchange}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#787b86] truncate max-w-[240px]">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-white tabular-nums">
                      ${asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: asset.price < 2 ? 4 : 2,
                        maximumFractionDigits: asset.price < 2 ? 4 : 2,
                      })}
                    </div>
                    <div
                      className={`font-mono text-[11px] font-semibold flex items-center justify-end gap-0.5 tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                      )}
                      {isPositive ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
