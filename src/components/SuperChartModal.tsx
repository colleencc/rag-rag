import React from 'react';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';
import { AssetQuote } from '../data/marketData';
import { MultiChartGrid } from './MultiChartGrid';

interface SuperChartModalProps {
  asset: AssetQuote | null;
  allAssets: AssetQuote[];
  onClose: () => void;
  onTrade?: (symbol: string, type: 'buy' | 'sell', shares: number, price: number) => void;
}

export const SuperChartModal: React.FC<SuperChartModalProps> = ({
  asset,
  allAssets,
  onClose,
  onTrade
}) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-7xl h-[92vh] bg-[#131722] rounded-xl border border-[#2a2e39] shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1e222d] border-b border-[#2a2e39] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#2962ff]/20 text-[#2962ff] border border-[#2962ff]/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              TradingView SuperChart PRO
            </span>
            <span className="text-xs text-[#787b86] hidden sm:inline">
              Multi-Timeframe Charting Engine & Multi-Chart Grid
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition-colors cursor-pointer"
            title="Close Chart (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SuperChart Viewport with Multi-Chart Grid */}
        <div className="flex-1 overflow-hidden p-2.5">
          <MultiChartGrid primaryAsset={asset} allAssets={allAssets} onTrade={onTrade} />
        </div>
      </div>
    </div>
  );
};
