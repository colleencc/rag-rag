import React, { useState } from 'react';
import { LayoutGrid, Columns, Square, Plus, Maximize2 } from 'lucide-react';
import { AssetQuote } from '../data/marketData';
import { SuperChart } from './SuperChart';

interface MultiChartGridProps {
  primaryAsset: AssetQuote;
  allAssets: AssetQuote[];
  onTrade?: (symbol: string, type: 'buy' | 'sell', shares: number, price: number) => void;
}

type GridLayout = '1x1' | '1x2' | '2x2';

export const MultiChartGrid: React.FC<MultiChartGridProps> = ({
  primaryAsset,
  allAssets,
  onTrade
}) => {
  const [layout, setLayout] = useState<GridLayout>('1x1');
  const [symbols, setSymbols] = useState<string[]>([
    primaryAsset.symbol,
    'BTC/USD',
    'SPX',
    'AAPL'
  ]);

  const handleSymbolChange = (index: number, newSymbol: string) => {
    const updated = [...symbols];
    updated[index] = newSymbol;
    setSymbols(updated);
  };

  const activeAssets = symbols.map(
    (sym) => allAssets.find((a) => a.symbol === sym) || primaryAsset
  );

  return (
    <div className="flex flex-col h-full w-full gap-2">
      {/* Multi-chart Layout Selector Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1e222d] border border-[#2a2e39] rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300">Layout:</span>
          <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
            <button
              onClick={() => setLayout('1x1')}
              className={`p-1 rounded cursor-pointer transition-colors ${
                layout === '1x1' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white'
              }`}
              title="Single Chart (1x1)"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayout('1x2')}
              className={`p-1 rounded cursor-pointer transition-colors ${
                layout === '1x2' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white'
              }`}
              title="Dual Split View (1x2)"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayout('2x2')}
              className={`p-1 rounded cursor-pointer transition-colors ${
                layout === '2x2' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white'
              }`}
              title="Quad Grid View (2x2)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick symbol selectors for the secondary slots */}
        {layout !== '1x1' && (
          <div className="flex items-center gap-2 overflow-x-auto">
            {activeAssets.slice(0, layout === '1x2' ? 2 : 4).map((ast, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="text-[10px] text-[#787b86] font-mono">#{idx + 1}</span>
                <select
                  value={ast.symbol}
                  onChange={(e) => handleSymbolChange(idx, e.target.value)}
                  className="bg-[#131722] border border-[#2a2e39] rounded px-1.5 py-0.5 text-[11px] font-bold text-white outline-none cursor-pointer"
                >
                  {allAssets.map((a) => (
                    <option key={a.symbol} value={a.symbol}>
                      {a.symbol} ({a.category})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Charts */}
      <div
        className={`flex-1 grid gap-2 overflow-hidden ${
          layout === '1x1'
            ? 'grid-cols-1'
            : layout === '1x2'
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 grid-rows-2'
        }`}
      >
        {activeAssets.slice(0, layout === '1x1' ? 1 : layout === '1x2' ? 2 : 4).map((ast, idx) => (
          <div key={`${ast.symbol}-${idx}`} className="h-full min-h-[380px] overflow-hidden">
            <SuperChart asset={ast} onTrade={onTrade} />
          </div>
        ))}
      </div>
    </div>
  );
};
