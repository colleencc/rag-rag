import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { AssetQuote } from '../data/marketData';
import { SuperChart } from './SuperChart';

interface SuperChartModalProps {
  asset: AssetQuote | null;
  onClose: () => void;
  onTrade?: (symbol: string, type: 'buy' | 'sell', shares: number, price: number) => void;
}

export const SuperChartModal: React.FC<SuperChartModalProps> = ({ asset, onClose, onTrade }) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-6xl h-[88vh] bg-[#131722] rounded-xl border border-[#2a2e39] shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e222d] border-b border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#2962ff]/20 text-[#2962ff] border border-[#2962ff]/30">
              Interactive SuperChart
            </span>
            <span className="text-xs text-[#787b86]">Professional Multi-Timeframe Charting Engine</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition-colors cursor-pointer"
            title="Close Chart (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SuperChart Viewport */}
        <div className="flex-1 overflow-hidden p-2">
          <SuperChart asset={asset} onTrade={onTrade} isModal={true} />
        </div>
      </div>
    </div>
  );
};
