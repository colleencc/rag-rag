import React, { useState } from 'react';
import {
  Coins,
  DollarSign,
  TrendingUp,
  Globe,
  PieChart,
  BarChart,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { AssetQuote, MarketNews, MARKET_NEWS } from '../data/marketData';
import { SymbolBadge } from './BrandLogos';
import { EconomicCalendar } from './EconomicCalendar';

interface CategoryHubProps {
  category: 'stocks' | 'crypto' | 'forex' | 'news';
  assets: AssetQuote[];
  onSelectSymbol: (symbol: string) => void;
  onOpenScreener: () => void;
}

export const CategoryHub: React.FC<CategoryHubProps> = ({
  category,
  assets,
  onSelectSymbol,
  onOpenScreener,
}) => {
  const [subFilter, setSubFilter] = useState<string>('all');

  // Filter assets by current category
  const categoryAssets = assets.filter((a) => {
    if (category === 'stocks') return a.category === 'stocks';
    if (category === 'crypto') return a.category === 'crypto';
    if (category === 'forex') return a.category === 'forex';
    return true;
  });

  const filteredAssets = categoryAssets.filter((a) => {
    if (subFilter === 'all') return true;
    if (subFilter === 'gainers') return a.changePercent > 0;
    if (subFilter === 'losers') return a.changePercent < 0;
    if (subFilter === 'strong_buy') return a.rating === 'Strong Buy';
    return true;
  });

  if (category === 'news') {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between bg-[#1e222d] p-4 rounded-lg border border-[#2a2e39]">
          <div>
            <h2 className="text-base font-bold text-white">Global Markets News & Economic Events</h2>
            <p className="text-xs text-[#787b86]">
              Real-time financial journalism, central bank communications, and data releases.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Top Headlines</h3>
            <div className="space-y-3">
              {MARKET_NEWS.map((news) => (
                <div
                  key={news.id}
                  className="p-4 bg-[#1e222d] border border-[#2a2e39] hover:border-slate-600 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-xs text-[#787b86] mb-1.5">
                    <span className="font-semibold text-white">{news.source}</span>
                    <span>·</span>
                    <span>{news.timeAgo}</span>
                    <span>·</span>
                    <span className="font-mono text-emerald-400 font-semibold">{news.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#2962ff] transition-colors">
                    {news.title}
                  </h4>
                  <p className="text-xs text-[#787b86] mt-2 leading-relaxed">{news.summary}</p>
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#2a2e39]">
                    <span className="text-[11px] text-[#787b86]">Related Assets:</span>
                    {news.relatedSymbols.map((sym) => (
                      <button
                        key={sym}
                        onClick={() => onSelectSymbol(sym)}
                        className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#131722] hover:bg-[#2962ff] text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <EconomicCalendar />
          </div>
        </div>
      </div>
    );
  }

  // Titles and banners by category
  const title =
    category === 'stocks'
      ? 'Stock Market Hub — Equities & Sectors'
      : category === 'crypto'
      ? 'Cryptocurrency Market Overview'
      : 'Foreign Exchange (Forex) Currency Matrix';

  const desc =
    category === 'stocks'
      ? 'Track top US and global corporations with real-time quotes, sector performance, and valuations.'
      : category === 'crypto'
      ? 'Live cryptocurrency capitalization, volume metrics, and Layer 1 network performance.'
      : 'Major, minor, and exotic currency pairs with live pip changes and spread calculations.';

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-[#1e222d] p-4 rounded-lg border border-[#2a2e39]">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {category === 'crypto' ? (
              <Coins className="w-5 h-5 text-amber-400" />
            ) : category === 'forex' ? (
              <Globe className="w-5 h-5 text-sky-400" />
            ) : (
              <BarChart className="w-5 h-5 text-[#2962ff]" />
            )}
            {title}
          </h2>
          <p className="text-xs text-[#787b86]">{desc}</p>
        </div>

        <button
          onClick={onOpenScreener}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-md transition-colors cursor-pointer whitespace-nowrap"
        >
          <Sliders className="w-3.5 h-3.5" />
          Filter in Screener
        </button>
      </div>

      {/* Crypto Macro Dominance Bar (When in Crypto mode) */}
      {category === 'crypto' && (
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <div className="text-[10px] text-[#787b86]">Total Crypto Cap</div>
              <div className="font-bold text-white font-mono mt-0.5">$3.14 Trillion</div>
            </div>
            <div>
              <div className="text-[10px] text-[#787b86]">24h Volume</div>
              <div className="font-bold text-white font-mono mt-0.5">$118.4 Billion</div>
            </div>
            <div>
              <div className="text-[10px] text-[#787b86]">BTC Dominance</div>
              <div className="font-bold text-amber-400 font-mono mt-0.5">58.6%</div>
            </div>
            <div>
              <div className="text-[10px] text-[#787b86]">ETH Dominance</div>
              <div className="font-bold text-indigo-400 font-mono mt-0.5">13.2%</div>
            </div>
          </div>

          <div className="w-full md:w-64 h-2 bg-[#131722] rounded-full overflow-hidden flex">
            <div className="h-full bg-amber-500" style={{ width: '58.6%' }} title="Bitcoin: 58.6%"></div>
            <div className="h-full bg-indigo-500" style={{ width: '13.2%' }} title="Ethereum: 13.2%"></div>
            <div className="h-full bg-[#089981]" style={{ width: '28.2%' }} title="Altcoins: 28.2%"></div>
          </div>
        </div>
      )}

      {/* Sub-filter chips */}
      <div className="flex items-center gap-1.5 text-xs">
        {[
          { id: 'all', label: 'All Assets' },
          { id: 'gainers', label: 'Top Gainers' },
          { id: 'losers', label: 'Top Losers' },
          { id: 'strong_buy', label: 'Strong Buy' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSubFilter(f.id)}
            className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
              subFilter === f.id
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] bg-[#1e222d] hover:text-white border border-[#2a2e39]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredAssets.map((asset) => {
          const isPos = asset.changePercent >= 0;
          return (
            <div
              key={asset.symbol}
              onClick={() => onSelectSymbol(asset.symbol)}
              className="bg-[#1e222d] border border-[#2a2e39] hover:border-slate-600 rounded-lg p-4 flex flex-col justify-between transition-all hover:scale-[1.01] cursor-pointer shadow-xs group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <SymbolBadge symbol={asset.symbol} className="w-8 h-8 text-xs" />
                  <div>
                    <div className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                      {asset.symbol}
                    </div>
                    <div className="text-xs text-[#787b86] truncate max-w-[140px]">
                      {asset.name}
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    asset.rating.includes('Buy')
                      ? 'bg-[#089981]/20 text-[#089981]'
                      : asset.rating.includes('Sell')
                      ? 'bg-[#f23645]/20 text-[#f23645]'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  {asset.rating}
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-lg font-bold font-mono text-white tabular-nums">
                    ${asset.price.toLocaleString(undefined, {
                      minimumFractionDigits: asset.price < 2 ? 4 : 2,
                      maximumFractionDigits: asset.price < 2 ? 4 : 2,
                    })}
                  </div>
                  <div
                    className={`font-mono text-xs font-semibold flex items-center tabular-nums ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? (
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                    {isPos ? '+' : ''}
                    {asset.change.toFixed(2)} ({isPos ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%)
                  </div>
                </div>

                {/* Sparkline */}
                <div className="w-24 h-8">
                  <svg className="w-full h-full overflow-visible">
                    {(() => {
                      const pts = asset.sparkline;
                      const min = Math.min(...pts);
                      const max = Math.max(...pts);
                      const range = max - min || 1;
                      const poly = pts
                        .map((p, i) => {
                          const x = (i / (pts.length - 1)) * 96;
                          const y = 30 - ((p - min) / range) * 24;
                          return `${x},${y}`;
                        })
                        .join(' ');
                      return (
                        <polyline
                          points={poly}
                          fill="none"
                          stroke={isPos ? '#089981' : '#f23645'}
                          strokeWidth="1.6"
                        />
                      );
                    })()}
                  </svg>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86] font-mono">
                <span>Cap: {asset.marketCap}</span>
                <span>Vol: {asset.volume}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
