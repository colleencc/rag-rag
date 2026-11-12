import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AssetQuote } from '../data/marketData';

interface TickerTapeProps {
  assets: AssetQuote[];
  onSelectSymbol: (symbol: string) => void;
  flashingSymbols: Record<string, 'up' | 'down'>;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ assets, onSelectSymbol, flashingSymbols }) => {
  // We double the list for continuous marquee effect or horizontal scrolling
  const tapeAssets = assets.slice(0, 12);

  return (
    <div className="w-full bg-[#1e222d] dark:bg-[#1e222d] border-b border-[#2a2e39] py-1.5 px-3 overflow-hidden select-none">
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {tapeAssets.map((asset) => {
          const isPositive = asset.change >= 0;
          const flash = flashingSymbols[asset.symbol];

          return (
            <button
              key={asset.symbol}
              onClick={() => onSelectSymbol(asset.symbol)}
              className={`flex items-center gap-2 px-2 py-0.5 rounded text-xs transition-colors shrink-0 cursor-pointer hover:bg-[#2a2e39] ${
                flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
              }`}
            >
              <span className="font-semibold text-slate-200">{asset.symbol}</span>
              <span className="font-mono text-slate-100 tabular-nums">
                {asset.price.toLocaleString(undefined, {
                  minimumFractionDigits: asset.price < 2 ? 4 : 2,
                  maximumFractionDigits: asset.price < 2 ? 4 : 2,
                })}
              </span>
              <span
                className={`flex items-center font-mono font-medium tabular-nums ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                {isPositive ? '+' : ''}
                {asset.changePercent.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
