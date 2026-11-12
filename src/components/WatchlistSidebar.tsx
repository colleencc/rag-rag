import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Bell,
  TrendingUp,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AssetQuote } from '../data/marketData';
import { SymbolBadge } from './BrandLogos';

export interface Position {
  symbol: string;
  shares: number;
  avgPrice: number;
  type: 'buy' | 'sell';
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
}

interface WatchlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  allAssets: AssetQuote[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onAddToWatchlist: (symbol: string) => void;
  flashingSymbols: Record<string, 'up' | 'down'>;
  positions: Position[];
  cashBalance: number;
  onClosePosition: (symbol: string) => void;
}

export const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  allAssets,
  selectedSymbol,
  onSelectSymbol,
  onRemoveFromWatchlist,
  onAddToWatchlist,
  flashingSymbols,
  positions,
  cashBalance,
  onClosePosition
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'alerts' | 'portfolio'>('watchlist');
  const [newSymbolInput, setNewSymbolInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Alerts state
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: 'al-1',
      symbol: 'BTC/USD',
      targetPrice: 93000,
      condition: 'above',
      createdAt: 'Today 09:15',
    },
    {
      id: 'al-2',
      symbol: 'NVDA',
      targetPrice: 150,
      condition: 'above',
      createdAt: 'Today 10:30',
    },
  ]);
  const [alertTarget, setAlertTarget] = useState<number>(0);
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Selected asset object
  const currentAsset = allAssets.find((a) => a.symbol === selectedSymbol) || allAssets[0];

  // Watched assets
  const watchedAssets = allAssets.filter((a) => watchlistSymbols.includes(a.symbol));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = newSymbolInput.trim().toUpperCase();
    const found = allAssets.find((a) => a.symbol.toUpperCase() === query);
    if (found) {
      onAddToWatchlist(found.symbol);
      setNewSymbolInput('');
      setIsAdding(false);
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTarget || alertTarget <= 0) return;
    const newAlert: PriceAlert = {
      id: `al-${Date.now()}`,
      symbol: currentAsset.symbol,
      targetPrice: alertTarget,
      condition: alertCondition,
      createdAt: 'Just now',
    };
    setAlerts([newAlert, ...alerts]);
    setAlertSuccess(`Alert set for ${currentAsset.symbol} ${alertCondition} $${alertTarget}`);
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  // Portfolio calculations
  const portfolioEquity = positions.reduce((acc, pos) => {
    const asset = allAssets.find((a) => a.symbol === pos.symbol);
    const price = asset ? asset.price : pos.avgPrice;
    return acc + pos.shares * price;
  }, 0);

  const totalValue = cashBalance + portfolioEquity;

  return (
    <aside className="fixed md:sticky top-0 md:top-14 right-0 w-80 md:w-84 h-[100vh] md:h-[calc(100vh-3.5rem)] bg-[#1e222d] border-l border-[#2a2e39] shadow-2xl flex flex-col z-40 select-none">
      {/* Sidebar Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2e39] bg-[#131722]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
              activeTab === 'watchlist' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
            }`}
          >
            Watchlist
          </button>
          <button
            onClick={() => {
              setActiveTab('alerts');
              setAlertTarget(currentAsset.price);
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
              activeTab === 'alerts' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
            }`}
          >
            Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
              activeTab === 'portfolio' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
            }`}
          >
            Trading ({positions.length})
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-[#787b86] hover:text-white hover:bg-[#2a2e39] transition-colors cursor-pointer"
          title="Close Sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab 1: Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Quick Add Bar */}
          <div className="px-3 py-2 border-b border-[#2a2e39] flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#787b86] uppercase tracking-wider">
              Favorites ({watchedAssets.length})
            </span>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 text-[11px] text-[#2962ff] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Symbol</span>
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAddSubmit} className="p-2 bg-[#131722] border-b border-[#2a2e39]">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newSymbolInput}
                  onChange={(e) => setNewSymbolInput(e.target.value)}
                  placeholder="e.g. NVDA, BTC/USD"
                  className="flex-1 px-2.5 py-1 bg-[#1e222d] border border-[#2a2e39] focus:border-[#2962ff] text-xs text-white rounded outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-[#2962ff] text-white text-xs font-semibold rounded hover:bg-[#1e53e5] cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          {/* Symbols Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/50">
            {watchedAssets.map((asset) => {
              const isSelected = asset.symbol === selectedSymbol;
              const flash = flashingSymbols[asset.symbol];
              const isPositive = asset.changePercent >= 0;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => onSelectSymbol(asset.symbol)}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors group ${
                    isSelected ? 'bg-[#2a2e39]' : 'hover:bg-[#2a2e39]/50'
                  } ${flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <SymbolBadge symbol={asset.symbol} className="w-6 h-6 text-[10px]" />
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#2962ff] transition-colors">
                        {asset.symbol}
                      </div>
                      <div className="text-[10px] text-[#787b86] truncate max-w-[90px]">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-white tabular-nums">
                        ${asset.price.toLocaleString(undefined, {
                          minimumFractionDigits: asset.price < 2 ? 4 : 2,
                          maximumFractionDigits: asset.price < 2 ? 4 : 2,
                        })}
                      </div>
                      <div
                        className={`font-mono text-[10px] font-semibold tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(asset.symbol);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#787b86] hover:text-[#f23645] transition-opacity cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Mini Quote Summary Card for Selected Symbol */}
          {currentAsset && (
            <div className="p-3 bg-[#131722] border-t border-[#2a2e39] text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white">{currentAsset.symbol} Quote</span>
                <span className="text-[10px] text-[#787b86] font-mono">{currentAsset.exchange}</span>
              </div>

              {/* Day's Range Visual Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-[10px] text-[#787b86] font-mono mb-0.5">
                  <span>L: ${currentAsset.low.toFixed(2)}</span>
                  <span>H: ${currentAsset.high.toFixed(2)}</span>
                </div>
                <div className="w-full h-1.5 bg-[#2a2e39] rounded-full overflow-hidden relative">
                  {(() => {
                    const range = currentAsset.high - currentAsset.low || 1;
                    const posPct = ((currentAsset.price - currentAsset.low) / range) * 100;
                    return (
                      <div
                        className="h-full bg-[#2962ff] rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, posPct))}%` }}
                      ></div>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#787b86] font-mono pt-1">
                <div>
                  Vol: <span className="text-slate-200">{currentAsset.volume}</span>
                </div>
                <div>
                  Cap: <span className="text-slate-200">{currentAsset.marketCap}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Alerts */}
      {activeTab === 'alerts' && (
        <div className="flex-1 flex flex-col p-3 overflow-y-auto">
          <div className="text-xs font-bold text-white mb-2">Create Price Alert</div>
          <form onSubmit={handleCreateAlert} className="space-y-3 bg-[#131722] p-3 rounded-lg border border-[#2a2e39]">
            <div>
              <span className="text-[11px] text-[#787b86]">Symbol</span>
              <div className="font-bold text-xs text-white mt-0.5">{currentAsset.symbol}</div>
            </div>

            <div>
              <span className="text-[11px] text-[#787b86]">Condition</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setAlertCondition('above')}
                  className={`py-1 text-xs rounded font-medium cursor-pointer ${
                    alertCondition === 'above'
                      ? 'bg-[#2962ff] text-white'
                      : 'bg-[#1e222d] text-[#787b86]'
                  }`}
                >
                  Crosses Above
                </button>
                <button
                  type="button"
                  onClick={() => setAlertCondition('below')}
                  className={`py-1 text-xs rounded font-medium cursor-pointer ${
                    alertCondition === 'below'
                      ? 'bg-[#2962ff] text-white'
                      : 'bg-[#1e222d] text-[#787b86]'
                  }`}
                >
                  Crosses Below
                </button>
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[#787b86]">Target Price ($)</span>
              <input
                type="number"
                step="any"
                value={alertTarget || ''}
                onChange={(e) => setAlertTarget(parseFloat(e.target.value) || 0)}
                className="w-full mt-1 px-2.5 py-1.5 bg-[#1e222d] border border-[#2a2e39] rounded text-xs text-white font-mono outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-[#2962ff] hover:bg-[#1e53e5] text-white text-xs font-bold rounded cursor-pointer"
            >
              Set Alert
            </button>
          </form>

          {alertSuccess && (
            <div className="mt-2 p-2 bg-[#089981]/20 border border-[#089981]/40 text-[#089981] text-xs rounded flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{alertSuccess}</span>
            </div>
          )}

          {/* Active Alerts List */}
          <div className="mt-4">
            <div className="text-[11px] font-semibold text-[#787b86] uppercase tracking-wider mb-2">
              Active Alerts ({alerts.length})
            </div>
            <div className="space-y-2">
              {alerts.map((al) => (
                <div
                  key={al.id}
                  className="p-2.5 bg-[#131722] rounded border border-[#2a2e39] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Bell className="w-3 h-3 text-amber-400" />
                      {al.symbol}
                    </div>
                    <div className="text-[11px] text-[#787b86] mt-0.5">
                      {al.condition === 'above' ? '≥' : '≤'} ${al.targetPrice.toLocaleString()} ·{' '}
                      {al.createdAt}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(al.id)}
                    className="p-1 text-[#787b86] hover:text-[#f23645] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Paper Trading Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="flex-1 flex flex-col p-3 overflow-y-auto text-xs">
          {/* Account Balance Card */}
          <div className="bg-[#131722] p-3 rounded-lg border border-[#2a2e39] mb-3">
            <div className="text-[11px] text-[#787b86]">Total Account Value</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5 tabular-nums">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="flex justify-between text-[11px] text-[#787b86] mt-2 pt-2 border-t border-[#2a2e39]">
              <span>Cash Balance:</span>
              <span className="font-mono text-slate-200">
                ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-[#787b86] uppercase tracking-wider mb-2">
            Open Positions ({positions.length})
          </div>

          {positions.length === 0 ? (
            <div className="text-center py-8 text-[#787b86]">
              <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No open paper trades.</p>
              <p className="text-[11px] mt-1">Use "Instant Order" on any chart to execute simulated trades.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {positions.map((pos) => {
                const asset = allAssets.find((a) => a.symbol === pos.symbol);
                const currentPrice = asset ? asset.price : pos.avgPrice;
                const pnl = (currentPrice - pos.avgPrice) * pos.shares;
                const pnlPct = ((currentPrice - pos.avgPrice) / pos.avgPrice) * 100;
                const isPos = pnl >= 0;

                return (
                  <div
                    key={pos.symbol}
                    className="p-2.5 bg-[#131722] rounded border border-[#2a2e39] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{pos.symbol}</span>
                      <span
                        className={`font-mono font-semibold tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}${pnl.toFixed(2)} ({isPos ? '+' : ''}
                        {pnlPct.toFixed(2)}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#787b86] font-mono">
                      <span>{pos.shares} units @ ${pos.avgPrice.toFixed(2)}</span>
                      <span>Now: ${currentPrice.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => onClosePosition(pos.symbol)}
                      className="w-full mt-1 py-1 bg-[#2a2e39] hover:bg-[#363a45] text-slate-200 font-medium text-[11px] rounded transition-colors cursor-pointer"
                    >
                      Close Position
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
