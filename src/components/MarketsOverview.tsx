import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  BarChart2,
  Newspaper,
  Compass,
  Zap,
  Globe2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { AssetQuote, MarketNews, MARKET_NEWS, ECONOMIC_EVENTS } from '../data/marketData';
import { SymbolBadge } from './BrandLogos';
import { EconomicCalendar } from './EconomicCalendar';

interface MarketsOverviewProps {
  assets: AssetQuote[];
  onSelectSymbol: (symbol: string) => void;
  onViewScreener: () => void;
  onViewHeatmap: () => void;
}

export const MarketsOverview: React.FC<MarketsOverviewProps> = ({
  assets,
  onSelectSymbol,
  onViewScreener,
  onViewHeatmap
}) => {
  const [moversTab, setMoversTab] = useState<'gainers' | 'losers' | 'active'>('gainers');
  const [marketFilter, setMarketFilter] = useState<'all' | 'stocks' | 'crypto' | 'futures'>('all');

  // Major Indices for top cards
  const majorIndices = assets.filter((a) => a.category === 'indices').slice(0, 4);

  // Filter movers by category
  const filteredAssets = assets.filter((a) => {
    if (marketFilter === 'all') return true;
    return a.category === marketFilter;
  });

  // Top Movers computation
  const topGainers = [...filteredAssets].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers = [...filteredAssets].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const mostActive = [...filteredAssets].sort((a, b) => b.volumeNumeric - a.volumeNumeric).slice(0, 5);

  const activeMovers = moversTab === 'gainers' ? topGainers : moversTab === 'losers' ? topLosers : mostActive;

  // Sector Performance calculation
  const sectorPerformance = [
    { name: 'Technology', change: 2.85, count: 5, leader: 'NVDA +3.41%' },
    { name: 'Communication', change: 1.15, count: 2, leader: 'GOOGL +1.20%' },
    { name: 'Healthcare', change: 0.94, count: 2, leader: 'LLY +1.84%' },
    { name: 'Financials', change: 0.62, count: 2, leader: 'JPM +0.96%' },
    { name: 'Consumer Disc.', change: -0.40, count: 2, leader: 'AMZN +1.86%' },
    { name: 'Energy', change: -1.28, count: 2, leader: 'XOM -1.16%' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Pro Market Breadth Strip */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
            <span className="font-bold text-white">US Market Pulse:</span>
            <span className="font-semibold text-[#089981]">Bullish Momentum</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[#787b86]">
            <span>Breadth:</span>
            <span className="font-mono text-[#089981] font-semibold">18 Adv</span>
            <span>/</span>
            <span className="font-mono text-[#f23645] font-semibold">6 Dec</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[#787b86]">
            <span>CBOE Volatility (VIX):</span>
            <span className="font-mono text-emerald-400 font-semibold">14.18 (-1.42%)</span>
          </div>
        </div>

        <button
          onClick={() => onSelectSymbol('NVDA')}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#2962ff] hover:bg-[#1e53e5] text-white font-semibold rounded text-xs transition-colors cursor-pointer"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Launch SuperChart PRO</span>
        </button>
      </div>

      {/* 1. Global Major Indices Strip */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-[#2962ff]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Major Global Indices
            </h2>
          </div>
          <span className="text-xs text-[#787b86]">Real-time index quotes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {majorIndices.map((idx) => {
            const isPos = idx.changePercent >= 0;
            return (
              <div
                key={idx.symbol}
                onClick={() => onSelectSymbol(idx.symbol)}
                className="bg-[#1e222d] border border-[#2a2e39] hover:border-slate-600 rounded-lg p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] shadow-xs group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-[#2962ff] transition-colors">
                      {idx.name}
                    </div>
                    <div className="text-[11px] text-[#787b86] font-mono">{idx.symbol}</div>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold flex items-center tabular-nums px-1.5 py-0.5 rounded ${
                      isPos ? 'bg-[#089981]/15 text-[#089981]' : 'bg-[#f23645]/15 text-[#f23645]'
                    }`}
                  >
                    {isPos ? (
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                    {isPos ? '+' : ''}
                    {idx.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-lg font-bold font-mono text-white tabular-nums">
                      {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div
                      className={`text-xs font-mono tabular-nums ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {idx.change.toFixed(2)} pts
                    </div>
                  </div>

                  {/* Sparkline curve */}
                  <div className="w-24 h-9">
                    <svg className="w-full h-full overflow-visible">
                      {(() => {
                        const pts = idx.sparkline;
                        const min = Math.min(...pts);
                        const max = Math.max(...pts);
                        const range = max - min || 1;
                        const poly = pts
                          .map((p, i) => {
                            const x = (i / (pts.length - 1)) * 96;
                            const y = 32 - ((p - min) / range) * 26;
                            return `${x},${y}`;
                          })
                          .join(' ');
                        return (
                          <polyline
                            points={poly}
                            fill="none"
                            stroke={isPos ? '#089981' : '#f23645'}
                            strokeWidth="1.8"
                          />
                        );
                      })()}
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Middle Row: Market Movers & Sector Breakdown & Fear/Greed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Movers Card (2 Columns on large screens) */}
        <div className="lg:col-span-2 bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2e39] pb-3 mb-3">
            {/* Movers category tabs */}
            <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
              <button
                onClick={() => setMoversTab('gainers')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                  moversTab === 'gainers'
                    ? 'bg-[#089981] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Top Gainers</span>
              </button>
              <button
                onClick={() => setMoversTab('losers')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                  moversTab === 'losers'
                    ? 'bg-[#f23645] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Top Losers</span>
              </button>
              <button
                onClick={() => setMoversTab('active')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                  moversTab === 'active'
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Most Active</span>
              </button>
            </div>

            {/* Market Asset Class Filter */}
            <div className="flex items-center gap-1 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'stocks', label: 'Stocks' },
                { id: 'crypto', label: 'Crypto' },
                { id: 'futures', label: 'Commodities' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMarketFilter(m.id as any)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    marketFilter === m.id
                      ? 'bg-[#2a2e39] text-white'
                      : 'text-[#787b86] hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Movers Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#787b86] text-[11px] font-semibold border-b border-[#2a2e39]/50">
                  <th className="py-2 px-2">Symbol</th>
                  <th className="py-2 px-2 text-right">Last Price</th>
                  <th className="py-2 px-2 text-right">Change %</th>
                  <th className="py-2 px-2 text-right hidden sm:table-cell">Volume</th>
                  <th className="py-2 px-2 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2e39]/40">
                {activeMovers.map((asset) => {
                  const isPos = asset.changePercent >= 0;
                  return (
                    <tr
                      key={asset.symbol}
                      onClick={() => onSelectSymbol(asset.symbol)}
                      className="hover:bg-[#2a2e39]/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          <SymbolBadge symbol={asset.symbol} className="w-6 h-6 text-[10px]" />
                          <div>
                            <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                              {asset.symbol}
                            </span>
                            <span className="text-[11px] text-[#787b86] ml-2 hidden sm:inline truncate max-w-[140px]">
                              {asset.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-2 text-right font-mono font-bold text-white tabular-nums">
                        ${asset.price.toLocaleString(undefined, {
                          minimumFractionDigits: asset.price < 2 ? 4 : 2,
                          maximumFractionDigits: asset.price < 2 ? 4 : 2,
                        })}
                      </td>

                      <td
                        className={`py-2.5 px-2 text-right font-mono font-semibold tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        <div className="flex items-center justify-end gap-0.5">
                          {isPos ? (
                            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          {isPos ? '+' : ''}
                          {asset.changePercent.toFixed(2)}%
                        </div>
                      </td>

                      <td className="py-2.5 px-2 text-right font-mono text-[#787b86] tabular-nums hidden sm:table-cell">
                        {asset.volume}
                      </td>

                      <td className="py-2.5 px-2 text-center">
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom quick links */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#2a2e39] text-xs">
            <button
              onClick={onViewScreener}
              className="text-[#2962ff] hover:text-[#5382ff] font-semibold flex items-center gap-1 cursor-pointer"
            >
              Open Full Screener <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onViewHeatmap}
              className="text-[#787b86] hover:text-white transition-colors cursor-pointer"
            >
              View Treemap Heatmap →
            </button>
          </div>
        </div>

        {/* Right Side Column: Sector Performance & Fear & Greed Index */}
        <div className="space-y-6">
          {/* Fear & Greed Index Card */}
          <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                Market Sentiment Index
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/15">
                Greed (74)
              </span>
            </div>

            {/* Gauge meter display */}
            <div className="mt-3 flex flex-col items-center">
              <div className="w-full bg-[#131722] h-2.5 rounded-full overflow-hidden flex">
                <div className="w-1/4 bg-[#f23645]"></div>
                <div className="w-1/4 bg-[#f59e0b]"></div>
                <div className="w-1/4 bg-[#3b82f6]"></div>
                <div className="w-1/4 bg-[#089981]"></div>
              </div>
              <div className="flex justify-between w-full text-[10px] text-[#787b86] font-mono mt-1">
                <span>0 Extreme Fear</span>
                <span>50 Neutral</span>
                <span>100 Extreme Greed</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#2a2e39] text-center text-xs">
              <div>
                <div className="text-[10px] text-[#787b86]">Yesterday</div>
                <div className="font-bold text-white mt-0.5">71 (Greed)</div>
              </div>
              <div>
                <div className="text-[10px] text-[#787b86]">Last Week</div>
                <div className="font-bold text-white mt-0.5">68 (Greed)</div>
              </div>
              <div>
                <div className="text-[10px] text-[#787b86]">Last Month</div>
                <div className="font-bold text-white mt-0.5">58 (Neutral)</div>
              </div>
            </div>
          </div>

          {/* Sector Performance Bar Breakdown */}
          <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-[#2962ff]" />
                US Sector Performance
              </span>
              <button
                onClick={onViewHeatmap}
                className="text-[11px] text-[#2962ff] hover:underline cursor-pointer"
              >
                Heatmap
              </button>
            </div>

            <div className="space-y-2.5">
              {sectorPerformance.map((sec) => {
                const isPos = sec.change >= 0;
                return (
                  <div key={sec.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{sec.name}</span>
                      <span
                        className={`font-mono font-semibold tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {sec.change.toFixed(2)}%
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-[#131722] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isPos ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                        style={{ width: `${Math.min(100, Math.abs(sec.change) * 25)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Economic Calendar & Curated News Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Economic Calendar Widget */}
        <div className="lg:col-span-1">
          <EconomicCalendar />
        </div>

        {/* Curated Market News Grid */}
        <div className="lg:col-span-2 bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-[#2a2e39] pb-3">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[#2962ff]" />
              <h3 className="text-sm font-bold text-white">Live Market News & Analysis</h3>
            </div>
            <span className="text-xs text-[#787b86]">Streaming institutional updates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
            {MARKET_NEWS.map((news) => (
              <div
                key={news.id}
                className="p-3 bg-[#131722] border border-[#2a2e39] hover:border-slate-600 rounded-lg flex flex-col justify-between transition-colors group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-[#787b86] mb-1.5">
                    <span className="font-semibold text-slate-300">{news.source}</span>
                    <span>·</span>
                    <span>{news.timeAgo}</span>
                    <span>·</span>
                    <span
                      className={`font-semibold uppercase ${
                        news.sentiment === 'bullish'
                          ? 'text-[#089981]'
                          : news.sentiment === 'bearish'
                          ? 'text-[#f23645]'
                          : 'text-amber-400'
                      }`}
                    >
                      {news.sentiment}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-[#2962ff] transition-colors leading-snug">
                    {news.title}
                  </h4>

                  <p className="text-[11px] text-[#787b86] mt-1 line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#2a2e39] text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {news.relatedSymbols.map((sym) => (
                      <button
                        key={sym}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSymbol(sym);
                        }}
                        className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1e222d] hover:bg-[#2962ff] text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] text-[#787b86]">{news.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
