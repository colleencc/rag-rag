import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  Search,
  Filter,
  Star,
  Check,
  TrendingUp,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AssetQuote } from '../data/marketData';
import { SymbolBadge } from './BrandLogos';

interface MarketScreenerProps {
  assets: AssetQuote[];
  onSelectSymbol: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'volumeNumeric' | 'marketCapNumeric' | 'peRatio';
type SortOrder = 'asc' | 'desc';

export const MarketScreener: React.FC<MarketScreenerProps> = ({
  assets,
  onSelectSymbol,
  watchlist,
  onToggleWatchlist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('marketCapNumeric');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Category filter
      if (selectedCategory !== 'all' && asset.category !== selectedCategory) return false;
      // Rating filter
      if (selectedRating !== 'all' && asset.rating !== selectedRating) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSymbol = asset.symbol.toLowerCase().includes(query);
        const matchesName = asset.name.toLowerCase().includes(query);
        if (!matchesSymbol && !matchesName) return false;
      }
      return true;
    });
  }, [assets, selectedCategory, selectedRating, searchQuery]);

  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      let aVal = a[sortField] ?? 0;
      let bVal = b[sortField] ?? 0;
      if (typeof aVal === 'string') aVal = (aVal as string).toLowerCase();
      if (typeof bVal === 'string') bVal = (bVal as string).toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAssets, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Screener Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#1e222d] p-4 rounded-lg border border-[#2a2e39]">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#2962ff]" />
            Market Screener & Scanner
          </h2>
          <p className="text-xs text-[#787b86]">
            Filter across stocks, cryptocurrencies, forex, and commodities using technical ratings and volume metrics.
          </p>
        </div>

        {/* Live Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-[#787b86] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter symbols or name..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#131722] border border-[#2a2e39] focus:border-[#2962ff] rounded-md text-xs text-white placeholder-[#787b86] outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category filter */}
        <div className="flex items-center gap-1 bg-[#1e222d] p-1 rounded-lg border border-[#2a2e39] overflow-x-auto">
          {[
            { id: 'all', label: 'All Markets' },
            { id: 'stocks', label: 'Stocks' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'forex', label: 'Forex' },
            { id: 'futures', label: 'Commodities' },
            { id: 'indices', label: 'Indices' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2962ff] text-white shadow-xs'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Technical Rating filter */}
        <div className="flex items-center gap-1.5 text-xs text-[#787b86]">
          <span className="hidden sm:inline">Rating:</span>
          {['all', 'Strong Buy', 'Buy', 'Neutral', 'Sell'].map((rat) => (
            <button
              key={rat}
              onClick={() => setSelectedRating(rat)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedRating === rat
                  ? 'bg-[#2a2e39] text-white'
                  : 'text-[#787b86] hover:text-white hover:bg-[#1e222d]'
              }`}
            >
              {rat === 'all' ? 'All' : rat}
            </button>
          ))}
        </div>
      </div>

      {/* Screener Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#2a2e39] text-[#787b86] text-[11px] font-semibold bg-[#131722]/50 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-8"></th>
              <th
                onClick={() => handleSort('symbol')}
                className="py-2.5 px-3 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  Symbol <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  Price <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  Change % <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('volumeNumeric')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition-colors hidden sm:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  Volume <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('marketCapNumeric')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition-colors hidden md:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  Market Cap <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('peRatio')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-white transition-colors hidden lg:table-cell"
              >
                <div className="flex items-center justify-end gap-1">
                  P/E <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center hidden md:table-cell">Technical Rating</th>
              <th className="py-2.5 px-3 text-center hidden sm:table-cell">7D Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]/60">
            {sortedAssets.map((asset) => {
              const inWatchlist = watchlist.includes(asset.symbol);
              const isPositive = asset.changePercent >= 0;

              return (
                <tr
                  key={asset.symbol}
                  onClick={() => onSelectSymbol(asset.symbol)}
                  className="hover:bg-[#2a2e39]/50 transition-colors group cursor-pointer"
                >
                  {/* Watchlist toggle star */}
                  <td
                    className="py-2.5 px-3 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(asset.symbol);
                    }}
                  >
                    <button
                      className="p-1 text-[#787b86] hover:text-amber-400 transition-colors cursor-pointer"
                      title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          inWatchlist ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Symbol & Name */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <SymbolBadge symbol={asset.symbol} className="w-6 h-6 text-[10px]" />
                      <div>
                        <div className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                          {asset.symbol}
                        </div>
                        <div className="text-[11px] text-[#787b86] truncate max-w-[150px]">
                          {asset.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white tabular-nums">
                    ${asset.price.toLocaleString(undefined, {
                      minimumFractionDigits: asset.price < 2 ? 4 : 2,
                      maximumFractionDigits: asset.price < 2 ? 4 : 2,
                    })}
                  </td>

                  {/* Change % */}
                  <td
                    className={`py-2.5 px-3 text-right font-mono font-semibold tabular-nums ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                      {isPositive ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </div>
                  </td>

                  {/* Volume */}
                  <td className="py-2.5 px-3 text-right font-mono text-[#d1d4dc] tabular-nums hidden sm:table-cell">
                    {asset.volume}
                  </td>

                  {/* Market Cap */}
                  <td className="py-2.5 px-3 text-right font-mono text-[#d1d4dc] tabular-nums hidden md:table-cell">
                    {asset.marketCap}
                  </td>

                  {/* P/E Ratio */}
                  <td className="py-2.5 px-3 text-right font-mono text-[#787b86] tabular-nums hidden lg:table-cell">
                    {asset.peRatio ? asset.peRatio.toFixed(1) : '—'}
                  </td>

                  {/* Technical Rating */}
                  <td className="py-2.5 px-3 text-center hidden md:table-cell">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        asset.rating === 'Strong Buy'
                          ? 'bg-[#089981]/20 text-[#089981] border border-[#089981]/30'
                          : asset.rating === 'Buy'
                          ? 'bg-[#089981]/15 text-[#089981]'
                          : asset.rating === 'Neutral'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-[#f23645]/20 text-[#f23645] border border-[#f23645]/30'
                      }`}
                    >
                      {asset.rating}
                    </span>
                  </td>

                  {/* Sparkline */}
                  <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                    <div className="w-20 h-6 mx-auto">
                      <svg className="w-full h-full overflow-visible">
                        {(() => {
                          const pts = asset.sparkline;
                          const min = Math.min(...pts);
                          const max = Math.max(...pts);
                          const range = max - min || 1;
                          const poly = pts
                            .map((p, idx) => {
                              const x = (idx / (pts.length - 1)) * 80;
                              const y = 24 - ((p - min) / range) * 20;
                              return `${x},${y}`;
                            })
                            .join(' ');
                          return (
                            <polyline
                              points={poly}
                              fill="none"
                              stroke={isPositive ? '#089981' : '#f23645'}
                              strokeWidth="1.5"
                            />
                          );
                        })()}
                      </svg>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
