import React, { useState, useMemo } from 'react';
import { Layers, Filter, Info, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { AssetQuote } from '../data/marketData';
import { SymbolBadge } from './BrandLogos';

interface MarketHeatmapProps {
  assets: AssetQuote[];
  onSelectSymbol: (symbol: string) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ assets, onSelectSymbol }) => {
  const [filterMode, setFilterMode] = useState<'stocks' | 'crypto'>('stocks');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [hoveredSymbol, setHoveredSymbol] = useState<AssetQuote | null>(null);

  // Filter relevant assets
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (filterMode === 'stocks' && a.category !== 'stocks') return false;
      if (filterMode === 'crypto' && a.category !== 'crypto') return false;
      if (selectedSector !== 'all' && a.sector !== selectedSector) return false;
      return true;
    });
  }, [assets, filterMode, selectedSector]);

  // Extract available sectors
  const sectors = useMemo(() => {
    const list = new Set<string>();
    assets
      .filter((a) => (filterMode === 'stocks' ? a.category === 'stocks' : a.category === 'crypto'))
      .forEach((a) => {
        if (a.sector) list.add(a.sector);
      });
    return Array.from(list);
  }, [assets, filterMode]);

  // Total market cap for sizing
  const totalMarketCap = useMemo(() => {
    return filteredAssets.reduce((sum, item) => sum + (item.marketCapNumeric || 10), 0);
  }, [filteredAssets]);

  // Color generator based on change percent
  const getTileColor = (pct: number) => {
    if (pct >= 4) return 'bg-[#089981] border-[#0aa88f] text-white';
    if (pct >= 2) return 'bg-[#0b826f] border-[#089981] text-white';
    if (pct > 0.5) return 'bg-[#0f6b5c] border-[#0b826f] text-white';
    if (pct >= -0.5 && pct <= 0.5) return 'bg-[#363a45] border-[#434651] text-slate-200';
    if (pct > -2) return 'bg-[#99222c] border-[#b02733] text-white';
    if (pct > -4) return 'bg-[#c92533] border-[#dc2626] text-white';
    return 'bg-[#f23645] border-[#f45663] text-white';
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 max-w-7xl mx-auto w-full">
      {/* Heatmap Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1e222d] p-3.5 rounded-lg border border-[#2a2e39]">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
            <button
              onClick={() => {
                setFilterMode('stocks');
                setSelectedSector('all');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                filterMode === 'stocks' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white'
              }`}
            >
              S&P 500 Stocks
            </button>
            <button
              onClick={() => {
                setFilterMode('crypto');
                setSelectedSector('all');
              }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                filterMode === 'crypto' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Crypto Market
            </button>
          </div>

          {/* Sector filter */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedSector('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                selectedSector === 'all'
                  ? 'bg-[#2a2e39] text-white'
                  : 'text-[#787b86] hover:text-white hover:bg-[#131722]'
              }`}
            >
              All Sectors
            </button>
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  selectedSector === sec
                    ? 'bg-[#2a2e39] text-white'
                    : 'text-[#787b86] hover:text-white hover:bg-[#131722]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#787b86]">
          <span>-3%</span>
          <span className="w-3.5 h-3.5 rounded-xs bg-[#f23645] inline-block"></span>
          <span className="w-3.5 h-3.5 rounded-xs bg-[#c92533] inline-block"></span>
          <span className="w-3.5 h-3.5 rounded-xs bg-[#363a45] inline-block"></span>
          <span className="w-3.5 h-3.5 rounded-xs bg-[#0b826f] inline-block"></span>
          <span className="w-3.5 h-3.5 rounded-xs bg-[#089981] inline-block"></span>
          <span>+3%</span>
        </div>
      </div>

      {/* Main Treemap Visualization Grid */}
      <div className="relative bg-[#1e222d] border border-[#2a2e39] rounded-lg p-3 min-h-[500px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 auto-rows-fr h-full">
          {filteredAssets.map((asset) => {
            const isMega = (asset.marketCapNumeric || 0) > 1000;
            const isLarge = (asset.marketCapNumeric || 0) > 300;
            const colorClass = getTileColor(asset.changePercent);

            // Responsive col/row spans according to market cap weight
            let spanClass = 'col-span-1 row-span-1';
            if (isMega) {
              spanClass = 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2';
            } else if (isLarge) {
              spanClass = 'col-span-1 sm:col-span-1 row-span-1';
            }

            return (
              <button
                key={asset.symbol}
                onClick={() => onSelectSymbol(asset.symbol)}
                onMouseEnter={() => setHoveredSymbol(asset)}
                onMouseLeave={() => setHoveredSymbol(null)}
                className={`group relative p-3 rounded border flex flex-col justify-between transition-all duration-150 text-left cursor-pointer hover:scale-[1.01] hover:z-10 shadow-xs ${spanClass} ${colorClass}`}
              >
                {/* Symbol & Sector Top */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sm tracking-tight drop-shadow-xs">
                      {asset.symbol}
                    </div>
                    <div className="text-[11px] opacity-80 truncate max-w-[120px]">
                      {asset.name}
                    </div>
                  </div>
                  {asset.sector && (
                    <span className="text-[10px] opacity-75 font-mono uppercase hidden sm:inline">
                      {asset.sector}
                    </span>
                  )}
                </div>

                {/* Price & Change % Bottom */}
                <div className="mt-4">
                  <div className="text-base sm:text-lg font-bold font-mono tabular-nums leading-tight">
                    {asset.changePercent >= 0 ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%
                  </div>
                  <div className="text-xs font-mono opacity-90 tabular-nums">
                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Floating Tooltip preview when hovering */}
        {hoveredSymbol && (
          <div className="absolute bottom-4 left-4 pointer-events-none bg-[#131722]/95 border border-[#2a2e39] rounded-lg p-3 shadow-xl backdrop-blur-md flex items-center gap-4 z-20">
            <SymbolBadge symbol={hoveredSymbol.symbol} className="w-10 h-10 text-sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{hoveredSymbol.symbol}</span>
                <span className="text-xs text-[#787b86]">{hoveredSymbol.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2a2e39] text-slate-300">
                  {hoveredSymbol.sector || hoveredSymbol.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs mt-1">
                <span className="font-mono text-white font-bold">
                  ${hoveredSymbol.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`font-mono font-semibold ${
                    hoveredSymbol.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {hoveredSymbol.change >= 0 ? '+' : ''}
                  {hoveredSymbol.changePercent.toFixed(2)}%
                </span>
                <span className="text-[#787b86]">Cap: {hoveredSymbol.marketCap}</span>
                <span className="text-[#787b86]">Vol: {hoveredSymbol.volume}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
