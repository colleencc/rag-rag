import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  TrendingUp,
  BarChart2,
  Sliders,
  Maximize2,
  Crosshair,
  Minus,
  Activity,
  Layers,
  ChevronDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Check
} from 'lucide-react';
import { AssetQuote, Candle, generateCandles } from '../data/marketData';
import { SymbolBadge } from './BrandLogos';

interface SuperChartProps {
  asset: AssetQuote;
  onTrade?: (symbol: string, type: 'buy' | 'sell', shares: number, price: number) => void;
  isModal?: boolean;
}

type Timeframe = '1D' | '5D' | '1M' | '3M' | '1Y' | '5Y' | 'ALL';
type ChartStyle = 'candles' | 'line' | 'area';

export const SuperChart: React.FC<SuperChartProps> = ({ asset, onTrade, isModal = false }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');
  const [activeDrawingTool, setActiveDrawingTool] = useState<'cursor' | 'trendline' | 'ray' | 'measure'>('cursor');
  
  // Indicator toggles
  const [showEMA, setShowEMA] = useState(true);
  const [showSMA, setShowSMA] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [indicatorsMenuOpen, setIndicatorsMenuOpen] = useState(false);

  // Paper trade state
  const [tradeShares, setTradeShares] = useState(1);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  // Candles data
  const [candles, setCandles] = useState<Candle[]>([]);
  useEffect(() => {
    const data = generateCandles(asset.price, timeframe, 65);
    setCandles(data);
  }, [asset.symbol, asset.price, timeframe]);

  // Hover state for Crosshair and HUD
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Computed statistics for the chart view
  const { minPrice, maxPrice, priceRange, activeCandle, ema20, rsiValues } = useMemo(() => {
    if (!candles.length) {
      return { minPrice: 0, maxPrice: 100, priceRange: 100, activeCandle: null, ema20: [], rsiValues: [] };
    }

    let min = Infinity;
    let max = -Infinity;
    const closes: number[] = [];

    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      closes.push(c.close);
    });

    const padding = (max - min) * 0.08 || 1;
    min = Math.max(0, min - padding);
    max = max + padding;

    // Calculate simple 20 EMA
    const k = 2 / (20 + 1);
    const ema: number[] = [];
    let currentEma = closes[0];
    for (let i = 0; i < closes.length; i++) {
      currentEma = closes[i] * k + currentEma * (1 - k);
      ema.push(currentEma);
    }

    // Calculate 14 RSI
    const rsi: number[] = [];
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= 14 && i < closes.length; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }
    let avgGain = gains / 14;
    let avgLoss = losses / 14;

    for (let i = 0; i < closes.length; i++) {
      if (i < 14) {
        rsi.push(50);
        continue;
      }
      const diff = closes[i] - closes[i - 1];
      avgGain = (avgGain * 13 + (diff > 0 ? diff : 0)) / 14;
      avgLoss = (avgLoss * 13 + (diff < 0 ? -diff : 0)) / 14;
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - 100 / (1 + rs));
      }
    }

    const currentIdx = hoverIndex !== null && hoverIndex >= 0 && hoverIndex < candles.length
      ? hoverIndex
      : candles.length - 1;

    return {
      minPrice: min,
      maxPrice: max,
      priceRange: max - min,
      activeCandle: candles[currentIdx],
      ema20: ema,
      rsiValues: rsi
    };
  }, [candles, hoverIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartContainerRef.current || !candles.length) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert x into candle index (excluding price axis width on right, ~60px)
    const availableWidth = rect.width - 65;
    const step = availableWidth / (candles.length - 1);
    let idx = Math.round(x / step);
    if (idx < 0) idx = 0;
    if (idx >= candles.length) idx = candles.length - 1;

    setHoverIndex(idx);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setMousePos(null);
  };

  const handleQuickTrade = (type: 'buy' | 'sell') => {
    if (onTrade) {
      onTrade(asset.symbol, type, tradeShares, asset.price);
    }
    setTradeMessage(`Executed ${type.toUpperCase()} ${tradeShares} ${asset.symbol} @ $${asset.price.toFixed(2)}`);
    setTimeout(() => setTradeMessage(null), 3000);
  };

  return (
    <div className="flex flex-col bg-[#131722] text-[#d1d4dc] border border-[#2a2e39] rounded-lg overflow-hidden w-full h-full">
      {/* Top Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#1e222d] border-b border-[#2a2e39]">
        {/* Left: Symbol & Quick Stats */}
        <div className="flex items-center gap-3">
          <SymbolBadge symbol={asset.symbol} className="w-8 h-8 text-xs" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm tracking-tight">{asset.symbol}</span>
              <span className="text-xs text-[#787b86] hidden sm:inline">{asset.name}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#2a2e39] text-slate-300">
                {asset.exchange}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-white tabular-nums">
                ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </span>
              <span
                className={`font-mono font-semibold flex items-center tabular-nums ${
                  asset.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {asset.change >= 0 ? '+' : ''}
                {asset.change.toFixed(2)} ({asset.change >= 0 ? '+' : ''}
                {asset.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Timeframe Selector */}
        <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
          {(['1D', '5D', '1M', '3M', '1Y', '5Y', 'ALL'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                timeframe === tf ? 'bg-[#2962ff] text-white shadow-sm' : 'text-[#787b86] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right: Chart Type & Indicator controls */}
        <div className="flex items-center gap-2">
          {/* Chart Style Switcher */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
            <button
              onClick={() => setChartStyle('candles')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                chartStyle === 'candles' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
              }`}
              title="Candlestick Chart"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartStyle('line')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                chartStyle === 'line' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
              }`}
              title="Line Chart"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartStyle('area')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                chartStyle === 'area' ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-white'
              }`}
              title="Mountain / Area Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicators Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIndicatorsMenuOpen(!indicatorsMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#131722] hover:bg-[#2a2e39] border border-[#2a2e39] rounded text-slate-300 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#2962ff]" />
              <span>Indicators</span>
              <ChevronDown className="w-3 h-3 text-[#787b86]" />
            </button>

            {indicatorsMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-[#1e222d] border border-[#2a2e39] rounded-md shadow-xl py-1 z-30 text-xs">
                <button
                  onClick={() => setShowEMA(!showEMA)}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#2a2e39] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-0.5 bg-[#f59e0b] rounded-full inline-block"></span>
                    EMA 20 Trend
                  </span>
                  {showEMA && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>
                <button
                  onClick={() => setShowRSI(!showRSI)}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#2a2e39] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-0.5 bg-[#8b5cf6] rounded-full inline-block"></span>
                    RSI (14) Oscillator
                  </span>
                  {showRSI && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>
                <button
                  onClick={() => setShowVolume(!showVolume)}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#2a2e39] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-0.5 bg-slate-400 rounded-full inline-block"></span>
                    Volume Profile
                  </span>
                  {showVolume && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chart Body */}
      <div className="flex-1 flex overflow-hidden min-h-[380px] relative">
        {/* Left Drawing Tools Sidebar */}
        <div className="w-10 bg-[#1e222d] border-r border-[#2a2e39] flex flex-col items-center py-2 gap-1 shrink-0 select-none">
          <button
            onClick={() => setActiveDrawingTool('cursor')}
            className={`p-2 rounded text-xs transition-colors cursor-pointer ${
              activeDrawingTool === 'cursor' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Crosshair Cursor"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveDrawingTool('trendline')}
            className={`p-2 rounded text-xs transition-colors cursor-pointer ${
              activeDrawingTool === 'trendline' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Trendline Tool"
          >
            <Minus className="w-4 h-4 rotate-45" />
          </button>
          <button
            onClick={() => setActiveDrawingTool('ray')}
            className={`p-2 rounded text-xs transition-colors cursor-pointer ${
              activeDrawingTool === 'ray' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Horizontal Support/Resistance Line"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveDrawingTool('measure')}
            className={`p-2 rounded text-xs transition-colors cursor-pointer ${
              activeDrawingTool === 'measure' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Measure Range"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Interactive SVG/Canvas Chart */}
        <div
          ref={chartContainerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex-1 relative cursor-crosshair overflow-hidden select-none bg-[#131722]"
        >
          {/* Active Candle HUD bar at top */}
          {activeCandle && (
            <div className="absolute top-2 left-3 z-20 flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#787b86] pointer-events-none">
              <span>{activeCandle.time}</span>
              <span>
                O: <span className="text-white font-semibold">{activeCandle.open.toFixed(2)}</span>
              </span>
              <span>
                H: <span className="text-[#089981] font-semibold">{activeCandle.high.toFixed(2)}</span>
              </span>
              <span>
                L: <span className="text-[#f23645] font-semibold">{activeCandle.low.toFixed(2)}</span>
              </span>
              <span>
                C: <span className={activeCandle.close >= activeCandle.open ? 'text-[#089981] font-semibold' : 'text-[#f23645] font-semibold'}>
                  {activeCandle.close.toFixed(2)}
                </span>
              </span>
              {showVolume && (
                <span>
                  Vol: <span className="text-white font-semibold">{(activeCandle.volume / 1000).toFixed(0)}K</span>
                </span>
              )}
            </div>
          )}

          {/* SVG Canvas */}
          <svg className="w-full h-full" style={{ minHeight: '340px' }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2962ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Price Grid Lines (horizontal) */}
            {[0.15, 0.35, 0.55, 0.75].map((pct, idx) => {
              const y = pct * (showRSI ? 220 : 300);
              const priceAtY = maxPrice - pct * priceRange;
              return (
                <g key={idx}>
                  <line
                    x1="0"
                    y1={y}
                    x2="95%"
                    y2={y}
                    stroke="#2a2e39"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x="96%"
                    y={y + 4}
                    fill="#787b86"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {priceAtY.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Main Price Area/Candles */}
            {candles.length > 0 && (() => {
              const chartHeight = showRSI ? 220 : 300;
              const widthRatio = (100 - 6) / (candles.length - 1);

              // Build candle SVG elements
              return candles.map((c, i) => {
                const xPct = i * widthRatio;
                const isBullish = c.close >= c.open;
                const candleColor = isBullish ? '#089981' : '#f23645';

                const openY = ((maxPrice - c.open) / priceRange) * chartHeight;
                const closeY = ((maxPrice - c.close) / priceRange) * chartHeight;
                const highY = ((maxPrice - c.high) / priceRange) * chartHeight;
                const lowY = ((maxPrice - c.low) / priceRange) * chartHeight;

                const topY = Math.min(openY, closeY);
                const bodyH = Math.max(2, Math.abs(closeY - openY));

                return (
                  <g key={i}>
                    {/* Wick */}
                    <line
                      x1={`${xPct}%`}
                      y1={highY}
                      x2={`${xPct}%`}
                      y2={lowY}
                      stroke={candleColor}
                      strokeWidth="1.2"
                    />
                    {/* Candle Body */}
                    <rect
                      x={`calc(${xPct}% - 3px)`}
                      y={topY}
                      width="6"
                      height={bodyH}
                      fill={candleColor}
                      stroke={candleColor}
                      strokeWidth="0.5"
                    />

                    {/* Bottom Volume Bars */}
                    {showVolume && (
                      <rect
                        x={`calc(${xPct}% - 2px)`}
                        y={chartHeight - (c.volume / 1000000) * 20}
                        width="4"
                        height={(c.volume / 1000000) * 20}
                        fill={candleColor}
                        opacity="0.3"
                      />
                    )}
                  </g>
                );
              });
            })()}

            {/* EMA 20 Line Overlay */}
            {showEMA && candles.length > 0 && (() => {
              const chartHeight = showRSI ? 220 : 300;
              const widthRatio = (100 - 6) / (candles.length - 1);
              const points = ema20
                .map((val, i) => {
                  const y = ((maxPrice - val) / priceRange) * chartHeight;
                  return `${i * widthRatio}%,${y}`;
                })
                .join(' ');
              return (
                <polyline
                  points={points}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
              );
            })()}

            {/* RSI Sub-Chart (when toggled) */}
            {showRSI && candles.length > 0 && (() => {
              const rsiTop = 240;
              const rsiHeight = 70;
              const widthRatio = (100 - 6) / (candles.length - 1);

              return (
                <g>
                  {/* RSI Separator & Background */}
                  <line x1="0" y1={rsiTop} x2="100%" y2={rsiTop} stroke="#2a2e39" strokeWidth="1" />
                  <rect x="0" y={rsiTop} width="95%" height={rsiHeight} fill="#131722" opacity="0.6" />
                  
                  {/* Overbought (70) and Oversold (30) levels */}
                  <line
                    x1="0"
                    y1={rsiTop + rsiHeight * 0.3}
                    x2="95%"
                    y2={rsiTop + rsiHeight * 0.3}
                    stroke="#8b5cf6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.5"
                  />
                  <line
                    x1="0"
                    y1={rsiTop + rsiHeight * 0.7}
                    x2="95%"
                    y2={rsiTop + rsiHeight * 0.7}
                    stroke="#8b5cf6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.5"
                  />
                  <text x="96%" y={rsiTop + 12} fill="#8b5cf6" fontSize="9" fontFamily="monospace">
                    RSI 14
                  </text>
                  <text x="96%" y={rsiTop + rsiHeight * 0.3 + 3} fill="#787b86" fontSize="8" fontFamily="monospace">
                    70
                  </text>
                  <text x="96%" y={rsiTop + rsiHeight * 0.7 + 3} fill="#787b86" fontSize="8" fontFamily="monospace">
                    30
                  </text>

                  {/* RSI Polyline */}
                  <polyline
                    points={rsiValues
                      .map((val, i) => {
                        const y = rsiTop + rsiHeight * (1 - val / 100);
                        return `${i * widthRatio}%,${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })()}

            {/* Crosshair Cursor Lines */}
            {mousePos && (
              <g pointerEvents="none">
                <line
                  x1={mousePos.x}
                  y1="0"
                  x2={mousePos.x}
                  y2="100%"
                  stroke="#787b86"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <line
                  x1="0"
                  y1={mousePos.y}
                  x2="100%"
                  y2={mousePos.y}
                  stroke="#787b86"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </g>
            )}
          </svg>
        </div>

        {/* Right Sidebar: Key Stats & Technical Gauge */}
        <div className="w-64 bg-[#1e222d] border-l border-[#2a2e39] p-4 flex flex-col gap-4 shrink-0 overflow-y-auto">
          {/* Technical Meter Gauge */}
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">Technical Analysis</div>
            <div className="bg-[#131722] p-3 rounded-lg border border-[#2a2e39] flex flex-col items-center">
              {/* Speedometer Gauge Arc */}
              <div className="relative w-36 h-20 overflow-hidden">
                <svg className="w-36 h-36" viewBox="0 0 100 100">
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#2a2e39"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Colored Arc segments */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 25 25"
                    fill="none"
                    stroke="#f23645"
                    strokeWidth="8"
                  />
                  <path
                    d="M 25 25 A 40 40 0 0 1 50 10"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="8"
                  />
                  <path
                    d="M 50 10 A 40 40 0 0 1 75 25"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                  />
                  <path
                    d="M 75 25 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#089981"
                    strokeWidth="8"
                  />
                  {/* Needle */}
                  {(() => {
                    // Score is -10 to +10, mapped to angle 180 to 0 deg
                    const score = asset.ratingScore;
                    const angle = 180 - ((score + 10) / 20) * 180;
                    const rad = (angle * Math.PI) / 180;
                    const nx = 50 + 32 * Math.cos(rad);
                    const ny = 50 - 32 * Math.sin(rad);
                    return (
                      <g>
                        <line x1="50" y1="50" x2={nx} y2={ny} stroke="white" strokeWidth="2.5" />
                        <circle cx="50" cy="50" r="4" fill="white" />
                      </g>
                    );
                  })()}
                </svg>
              </div>
              <div
                className={`text-xs font-bold mt-1 uppercase tracking-wider ${
                  asset.rating.includes('Buy')
                    ? 'text-[#089981]'
                    : asset.rating.includes('Sell')
                    ? 'text-[#f23645]'
                    : 'text-amber-400'
                }`}
              >
                {asset.rating}
              </div>
              <div className="text-[10px] text-[#787b86] mt-0.5">Oscillators & Moving Averages</div>
            </div>
          </div>

          {/* Key Fundamentals / Numbers */}
          <div className="space-y-2 text-xs">
            <div className="text-[11px] font-semibold text-[#787b86] uppercase tracking-wider">Key Statistics</div>
            <div className="flex justify-between py-1 border-b border-[#2a2e39]">
              <span className="text-[#787b86]">Day Range</span>
              <span className="font-mono text-slate-200">
                ${asset.low.toFixed(2)} - ${asset.high.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#2a2e39]">
              <span className="text-[#787b86]">52W Range</span>
              <span className="font-mono text-slate-200">
                ${asset.week52Low.toFixed(2)} - ${asset.week52High.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#2a2e39]">
              <span className="text-[#787b86]">Market Cap</span>
              <span className="font-mono text-slate-200">{asset.marketCap}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#2a2e39]">
              <span className="text-[#787b86]">Volume</span>
              <span className="font-mono text-slate-200">{asset.volume}</span>
            </div>
            {asset.peRatio && (
              <div className="flex justify-between py-1 border-b border-[#2a2e39]">
                <span className="text-[#787b86]">P/E Ratio</span>
                <span className="font-mono text-slate-200">{asset.peRatio}</span>
              </div>
            )}
            {asset.divYield !== undefined && (
              <div className="flex justify-between py-1 border-b border-[#2a2e39]">
                <span className="text-[#787b86]">Div Yield</span>
                <span className="font-mono text-slate-200">{asset.divYield}%</span>
              </div>
            )}
          </div>

          {/* Paper Trading Quick Order */}
          <div className="pt-2 border-t border-[#2a2e39]">
            <div className="text-[11px] font-semibold text-[#787b86] uppercase tracking-wider mb-2">
              Instant Order
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#787b86]">Units</span>
              <div className="flex items-center gap-1">
                {[1, 5, 10].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setTradeShares(qty)}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded cursor-pointer ${
                      tradeShares === qty ? 'bg-[#2962ff] text-white' : 'bg-[#131722] text-[#787b86]'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickTrade('buy')}
                className="py-2 bg-[#089981] hover:bg-[#077a67] text-white font-bold text-xs rounded transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                Buy ${asset.price.toFixed(2)}
              </button>
              <button
                onClick={() => handleQuickTrade('sell')}
                className="py-2 bg-[#f23645] hover:bg-[#c92533] text-white font-bold text-xs rounded transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[3]" />
                Sell ${asset.price.toFixed(2)}
              </button>
            </div>

            {tradeMessage && (
              <div className="mt-2 p-1.5 bg-[#089981]/20 border border-[#089981]/40 text-[#089981] text-[11px] rounded text-center font-medium">
                {tradeMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
