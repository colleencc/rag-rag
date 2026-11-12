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
  Check,
  Camera,
  Trash2,
  LayoutGrid,
  Columns,
  Square,
  BookOpen,
  PieChart,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { AssetQuote, Candle, generateCandles, ProTimeframe, OrderBook, generateOrderBook } from '../data/marketData';
import { SymbolBadge } from './BrandLogos';

interface SuperChartProps {
  asset: AssetQuote;
  onTrade?: (symbol: string, type: 'buy' | 'sell', shares: number, price: number) => void;
  isModal?: boolean;
}

type ChartStyle = 'candles' | 'line' | 'area';
type DrawingTool = 'cursor' | 'trendline' | 'ray' | 'fib' | 'measure';

interface DrawnLine {
  id: string;
  type: 'trendline' | 'ray' | 'fib';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  price1: number;
  price2: number;
  color: string;
}

export const SuperChart: React.FC<SuperChartProps> = ({ asset, onTrade, isModal = false }) => {
  const [timeframe, setTimeframe] = useState<ProTimeframe>('15m');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');
  const [activeDrawingTool, setActiveDrawingTool] = useState<DrawingTool>('cursor');
  
  // Indicators
  const [showEMA20, setShowEMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(false);
  const [showSMA200, setShowSMA200] = useState(false);
  const [showBollinger, setShowBollinger] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [showVPVR, setShowVPVR] = useState(true); // Volume profile on price scale
  const [indicatorsMenuOpen, setIndicatorsMenuOpen] = useState(false);

  // Layout mode: 1 chart or DOM side-by-side
  const [sidebarTab, setSidebarTab] = useState<'stats' | 'dom' | 'drawings'>('stats');

  // Drawing state
  const [drawings, setDrawings] = useState<DrawnLine[]>([]);
  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number; price: number } | null>(null);

  // Measure ruler state
  const [measureBox, setMeasureBox] = useState<{
    startIdx: number;
    endIdx: number;
    startPrice: number;
    endPrice: number;
    startX: number;
    endX: number;
    startY: number;
    endY: number;
  } | null>(null);

  // Paper trade state
  const [tradeShares, setTradeShares] = useState(1);
  const [tradeType, setTradeType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState(asset.price);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  // Candles data
  const [candles, setCandles] = useState<Candle[]>([]);
  useEffect(() => {
    const data = generateCandles(asset.price, timeframe, 70);
    setCandles(data);
    setLimitPrice(asset.price);
  }, [asset.symbol, asset.price, timeframe]);

  // Order Book Level 2 data
  const [orderBook, setOrderBook] = useState<OrderBook>(() => generateOrderBook(asset.price));
  useEffect(() => {
    const timer = setInterval(() => {
      setOrderBook(generateOrderBook(asset.price));
    }, 2500);
    return () => clearInterval(timer);
  }, [asset.price]);

  // Hover state for Crosshair and HUD
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Calculations: Indicators, Min/Max Price, EMA, Bollinger, RSI, MACD, Volume Profile
  const {
    minPrice,
    maxPrice,
    priceRange,
    activeCandle,
    ema20Values,
    sma50Values,
    bollingerBands,
    rsiValues,
    macdData,
    vpvrBuckets
  } = useMemo(() => {
    if (!candles.length) {
      return {
        minPrice: 0,
        maxPrice: 100,
        priceRange: 100,
        activeCandle: null,
        ema20Values: [],
        sma50Values: [],
        bollingerBands: { upper: [], lower: [], basis: [] },
        rsiValues: [],
        macdData: { macd: [], signal: [], hist: [] },
        vpvrBuckets: []
      };
    }

    let min = Infinity;
    let max = -Infinity;
    const closes: number[] = [];
    const volumes: number[] = [];

    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      closes.push(c.close);
      volumes.push(c.volume);
    });

    const padding = (max - min) * 0.1 || 1;
    min = Math.max(0, min - padding);
    max = max + padding;
    const range = max - min;

    // EMA 20
    const k = 2 / (20 + 1);
    const ema20: number[] = [];
    let currentEma = closes[0];
    for (let i = 0; i < closes.length; i++) {
      currentEma = closes[i] * k + currentEma * (1 - k);
      ema20.push(currentEma);
    }

    // SMA 50
    const sma50: number[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 20) {
        sma50.push(closes[i]);
      } else {
        const slice = closes.slice(Math.max(0, i - 20), i + 1);
        const sum = slice.reduce((a, b) => a + b, 0);
        sma50.push(sum / slice.length);
      }
    }

    // Bollinger Bands (20, 2)
    const bbUpper: number[] = [];
    const bbLower: number[] = [];
    const bbBasis: number[] = [];
    for (let i = 0; i < closes.length; i++) {
      const slice = closes.slice(Math.max(0, i - 19), i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / slice.length;
      const stdDev = Math.sqrt(variance);
      bbBasis.push(mean);
      bbUpper.push(mean + stdDev * 2);
      bbLower.push(mean - stdDev * 2);
    }

    // RSI 14
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

    // MACD (12, 26, 9)
    const k12 = 2 / (12 + 1);
    const k26 = 2 / (26 + 1);
    let ema12 = closes[0];
    let ema26 = closes[0];
    const macdLine: number[] = [];
    for (let i = 0; i < closes.length; i++) {
      ema12 = closes[i] * k12 + ema12 * (1 - k12);
      ema26 = closes[i] * k26 + ema26 * (1 - k26);
      macdLine.push(ema12 - ema26);
    }

    const signalLine: number[] = [];
    const k9 = 2 / (9 + 1);
    let sig = macdLine[0];
    for (let i = 0; i < macdLine.length; i++) {
      sig = macdLine[i] * k9 + sig * (1 - k9);
      signalLine.push(sig);
    }

    const hist: number[] = [];
    for (let i = 0; i < macdLine.length; i++) {
      hist.push(macdLine[i] - signalLine[i]);
    }

    // Volume Profile (VPVR): 12 price buckets
    const numBuckets = 12;
    const bucketStep = range / numBuckets;
    const buckets: { price: number; volume: number; pct: number }[] = [];
    for (let b = 0; b < numBuckets; b++) {
      const bMin = min + b * bucketStep;
      const bMax = bMin + bucketStep;
      let bVol = 0;
      candles.forEach((c) => {
        if (c.close >= bMin && c.close < bMax) {
          bVol += c.volume;
        }
      });
      buckets.push({ price: bMin + bucketStep / 2, volume: bVol, pct: 0 });
    }
    const maxVol = Math.max(...buckets.map((b) => b.volume), 1);
    buckets.forEach((b) => (b.pct = b.volume / maxVol));

    const currentIdx = hoverIndex !== null && hoverIndex >= 0 && hoverIndex < candles.length
      ? hoverIndex
      : candles.length - 1;

    return {
      minPrice: min,
      maxPrice: max,
      priceRange: range,
      activeCandle: candles[currentIdx],
      ema20Values: ema20,
      sma50Values: sma50,
      bollingerBands: { upper: bbUpper, lower: bbLower, basis: bbBasis },
      rsiValues: rsi,
      macdData: { macd: macdLine, signal: signalLine, hist },
      vpvrBuckets: buckets
    };
  }, [candles, hoverIndex]);

  // Mouse Handlers for Crosshair & Interactive Drawings
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartContainerRef.current || !candles.length) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const availableWidth = rect.width - 65;
    const step = availableWidth / (candles.length - 1);
    let idx = Math.round(x / step);
    if (idx < 0) idx = 0;
    if (idx >= candles.length) idx = candles.length - 1;

    setHoverIndex(idx);
    setMousePos({ x, y });

    // Handle interactive ruler measurement
    if (activeDrawingTool === 'measure' && drawingStart) {
      const currentPrice = maxPrice - (y / (showRSI || showMACD ? 230 : 310)) * priceRange;
      setMeasureBox({
        startIdx: Math.round(drawingStart.x / step),
        endIdx: idx,
        startPrice: drawingStart.price,
        endPrice: currentPrice,
        startX: drawingStart.x,
        endX: x,
        startY: drawingStart.y,
        endY: y
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartContainerRef.current) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const chartHeight = showRSI || showMACD ? 230 : 310;
    const clickedPrice = maxPrice - (y / chartHeight) * priceRange;

    if (activeDrawingTool === 'ray') {
      // Create horizontal support/resistance ray instantly
      const newRay: DrawnLine = {
        id: `line-${Date.now()}`,
        type: 'ray',
        x1: 0,
        y1: y,
        x2: rect.width - 65,
        y2: y,
        price1: clickedPrice,
        price2: clickedPrice,
        color: '#f59e0b'
      };
      setDrawings([...drawings, newRay]);
      setActiveDrawingTool('cursor');
    } else if (activeDrawingTool === 'trendline' || activeDrawingTool === 'fib' || activeDrawingTool === 'measure') {
      if (!drawingStart) {
        setDrawingStart({ x, y, price: clickedPrice });
      } else {
        // Finish drawing
        const newLine: DrawnLine = {
          id: `line-${Date.now()}`,
          type: activeDrawingTool as any,
          x1: drawingStart.x,
          y1: drawingStart.y,
          x2: x,
          y2: y,
          price1: drawingStart.price,
          price2: clickedPrice,
          color: activeDrawingTool === 'fib' ? '#2962ff' : '#089981'
        };
        setDrawings([...drawings, newLine]);
        setDrawingStart(null);
        if (activeDrawingTool !== 'measure') {
          setActiveDrawingTool('cursor');
        }
      }
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setMousePos(null);
  };

  const handleClearDrawings = () => {
    setDrawings([]);
    setMeasureBox(null);
    setDrawingStart(null);
    setActiveDrawingTool('cursor');
  };

  const handleQuickTrade = (type: 'buy' | 'sell') => {
    const execPrice = tradeType === 'market' ? asset.price : limitPrice;
    if (onTrade) {
      onTrade(asset.symbol, type, tradeShares, execPrice);
    }
    setTradeMessage(`Executed ${type.toUpperCase()} ${tradeShares} ${asset.symbol} @ $${execPrice.toFixed(2)}`);
    setTimeout(() => setTradeMessage(null), 3000);
  };

  const handleSnapshot = () => {
    setTradeMessage(`Captured Chart Snapshot for ${asset.symbol} (${timeframe})`);
    setTimeout(() => setTradeMessage(null), 3000);
  };

  return (
    <div className="flex flex-col bg-[#131722] text-[#d1d4dc] border border-[#2a2e39] rounded-lg overflow-hidden w-full h-full select-none">
      {/* Top Pro Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#1e222d] border-b border-[#2a2e39]">
        {/* Left: Symbol & Pro Badge */}
        <div className="flex items-center gap-2.5">
          <SymbolBadge symbol={asset.symbol} className="w-7 h-7 text-xs" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs">{asset.symbol}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PRO+
              </span>
              <span className="text-[10px] text-[#787b86] hidden sm:inline">{asset.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-white tabular-nums">
                ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </span>
              <span
                className={`font-mono font-semibold flex items-center tabular-nums text-[11px] ${
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

        {/* Center: Pro Intraday Timeframes */}
        <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39]">
          {(['1m', '5m', '15m', '1h', '4h', '1D', '1W', '1M'] as ProTimeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                timeframe === tf ? 'bg-[#2962ff] text-white shadow-xs' : 'text-[#787b86] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Right: Chart Style & Pro Indicators Dropdown & Snapshot */}
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
              title="Area Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicators Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIndicatorsMenuOpen(!indicatorsMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-[#131722] hover:bg-[#2a2e39] border border-[#2a2e39] rounded text-slate-200 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#2962ff]" />
              <span>Pro Indicators</span>
              <ChevronDown className="w-3 h-3 text-[#787b86]" />
            </button>

            {indicatorsMenuOpen && (
              <div className="absolute right-0 mt-1 w-60 bg-[#1e222d] border border-[#2a2e39] rounded-md shadow-2xl py-1 z-30 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold text-[#787b86] uppercase tracking-wider">
                  Trend & Overlay
                </div>
                <button
                  onClick={() => setShowEMA20(!showEMA20)}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#2a2e39] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                    EMA 20 Trend
                  </span>
                  {showEMA20 && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>
                <button
                  onClick={() => setShowSMA50(!showSMA50)}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#2a2e39] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                    SMA 50 Major
                  </span>
                  {showSMA50 && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>
                <button
                  onClick={() => setShowBollinger(!showBollinger)}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#2a2e39] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Bollinger Bands (20, 2)
                  </span>
                  {showBollinger && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>

                <div className="px-3 py-1 text-[10px] font-bold text-[#787b86] uppercase tracking-wider mt-1 border-t border-[#2a2e39]">
                  Oscillators & Volume
                </div>
                <button
                  onClick={() => setShowRSI(!showRSI)}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#2a2e39] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8b5cf6]"></span>
                    RSI (14) Oscillator
                  </span>
                  {showRSI && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>
                <button
                  onClick={() => setShowMACD(!showMACD)}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#2a2e39] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    MACD (12, 26, 9)
                  </span>
                  {showMACD && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>
                <button
                  onClick={() => setShowVPVR(!showVPVR)}
                  className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#2a2e39] text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    VPVR Volume Profile
                  </span>
                  {showVPVR && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>
              </div>
            )}
          </div>

          {/* Snapshot Button */}
          <button
            onClick={handleSnapshot}
            className="p-1.5 rounded bg-[#131722] hover:bg-[#2a2e39] border border-[#2a2e39] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Take Chart Snapshot"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Chart Body */}
      <div className="flex-1 flex overflow-hidden min-h-[420px] relative">
        {/* Left Pro Drawing Toolbar */}
        <div className="w-10 bg-[#1e222d] border-r border-[#2a2e39] flex flex-col items-center py-2 gap-1 shrink-0 select-none">
          <button
            onClick={() => {
              setActiveDrawingTool('cursor');
              setDrawingStart(null);
            }}
            className={`p-2 rounded text-xs transition-colors cursor-pointer ${
              activeDrawingTool === 'cursor' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Crosshair Cursor"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setActiveDrawingTool('trendline');
              setDrawingStart(null);
            }}
            className={`p-2 rounded text-xs transition-colors cursor-pointer ${
              activeDrawingTool === 'trendline' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Trendline (Click 2 points)"
          >
            <Minus className="w-4 h-4 rotate-45" />
          </button>
          <button
            onClick={() => {
              setActiveDrawingTool('ray');
              setDrawingStart(null);
            }}
            className={`p-2 rounded text-xs transition-colors cursor-pointer ${
              activeDrawingTool === 'ray' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Horizontal Price Ray / Support & Resistance"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setActiveDrawingTool('fib');
              setDrawingStart(null);
            }}
            className={`p-2 rounded text-xs transition-colors cursor-pointer ${
              activeDrawingTool === 'fib' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Fibonacci Retracement (Click High then Low)"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setActiveDrawingTool('measure');
              setDrawingStart(null);
              setMeasureBox(null);
            }}
            className={`p-2 rounded text-xs transition-colors cursor-pointer ${
              activeDrawingTool === 'measure' ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
            }`}
            title="Measure Price & Bar Delta"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {drawings.length > 0 && (
            <button
              onClick={handleClearDrawings}
              className="mt-auto p-2 rounded text-[#787b86] hover:text-[#f23645] hover:bg-[#2a2e39] transition-colors cursor-pointer"
              title="Clear All Drawings"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Center: Interactive SVG/Canvas Chart */}
        <div
          ref={chartContainerRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          className="flex-1 relative cursor-crosshair overflow-hidden select-none bg-[#131722]"
        >
          {/* Active Candle HUD Bar */}
          {activeCandle && (
            <div className="absolute top-2 left-3 z-20 flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#787b86] pointer-events-none">
              <span className="text-white font-semibold">{activeCandle.time}</span>
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
                C:{' '}
                <span
                  className={
                    activeCandle.close >= activeCandle.open
                      ? 'text-[#089981] font-semibold'
                      : 'text-[#f23645] font-semibold'
                  }
                >
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

          {/* SVG Canvas Engine */}
          <svg className="w-full h-full" style={{ minHeight: '380px' }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2962ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="bollingerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            {/* Price Grid Lines (horizontal) */}
            {[0.12, 0.32, 0.52, 0.72].map((pct, idx) => {
              const mainH = showRSI || showMACD ? 230 : 310;
              const y = pct * mainH;
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

            {/* Volume Profile (VPVR) on Right Price Scale */}
            {showVPVR &&
              vpvrBuckets.map((bucket, idx) => {
                const mainH = showRSI || showMACD ? 230 : 310;
                const y = ((maxPrice - bucket.price) / priceRange) * mainH;
                const barWidth = bucket.pct * 45;
                return (
                  <rect
                    key={idx}
                    x={`calc(94% - ${barWidth}px)`}
                    y={y - 8}
                    width={barWidth}
                    height="16"
                    fill="#f59e0b"
                    opacity="0.18"
                  />
                );
              })}

            {/* Bollinger Bands Shaded Area & Lines */}
            {showBollinger && candles.length > 0 && (() => {
              const mainH = showRSI || showMACD ? 230 : 310;
              const widthRatio = (100 - 6) / (candles.length - 1);
              
              const upperPts = bollingerBands.upper.map((v, i) => `${i * widthRatio}%,${((maxPrice - v) / priceRange) * mainH}`);
              const lowerPts = bollingerBands.lower.map((v, i) => `${i * widthRatio}%,${((maxPrice - v) / priceRange) * mainH}`).reverse();
              const polyArea = [...upperPts, ...lowerPts].join(' ');

              return (
                <g>
                  <polygon points={polyArea} fill="url(#bollingerGradient)" />
                  <polyline
                    points={upperPts.join(' ')}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1"
                    opacity="0.5"
                    strokeDasharray="3 3"
                  />
                  <polyline
                    points={bollingerBands.basis
                      .map((v, i) => `${i * widthRatio}%,${((maxPrice - v) / priceRange) * mainH}`)
                      .join(' ')}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  <polyline
                    points={bollingerBands.lower
                      .map((v, i) => `${i * widthRatio}%,${((maxPrice - v) / priceRange) * mainH}`)
                      .join(' ')}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1"
                    opacity="0.5"
                    strokeDasharray="3 3"
                  />
                </g>
              );
            })()}

            {/* Area or Line Style Fill */}
            {chartStyle === 'area' && candles.length > 0 && (() => {
              const mainH = showRSI || showMACD ? 230 : 310;
              const widthRatio = (100 - 6) / (candles.length - 1);
              const points = candles.map((c, i) => `${i * widthRatio}%,${((maxPrice - c.close) / priceRange) * mainH}`).join(' ');
              const areaPoints = `0%,${mainH} ` + points + ` 94%,${mainH}`;
              return <polygon points={areaPoints} fill="url(#areaGradient)" />;
            })()}

            {/* Candlesticks Rendering */}
            {candles.length > 0 && (() => {
              const mainH = showRSI || showMACD ? 230 : 310;
              const widthRatio = (100 - 6) / (candles.length - 1);

              return candles.map((c, i) => {
                const xPct = i * widthRatio;
                const isBullish = c.close >= c.open;
                const color = isBullish ? '#089981' : '#f23645';

                const openY = ((maxPrice - c.open) / priceRange) * mainH;
                const closeY = ((maxPrice - c.close) / priceRange) * mainH;
                const highY = ((maxPrice - c.high) / priceRange) * mainH;
                const lowY = ((maxPrice - c.low) / priceRange) * mainH;

                const topY = Math.min(openY, closeY);
                const bodyH = Math.max(2, Math.abs(closeY - openY));

                if (chartStyle === 'candles') {
                  return (
                    <g key={i}>
                      {/* Wick */}
                      <line
                        x1={`${xPct}%`}
                        y1={highY}
                        x2={`${xPct}%`}
                        y2={lowY}
                        stroke={color}
                        strokeWidth="1.2"
                      />
                      {/* Body */}
                      <rect
                        x={`calc(${xPct}% - 3px)`}
                        y={topY}
                        width="6"
                        height={bodyH}
                        fill={color}
                        stroke={color}
                        strokeWidth="0.5"
                      />
                      {/* Volume Bars */}
                      {showVolume && (
                        <rect
                          x={`calc(${xPct}% - 2px)`}
                          y={mainH - (c.volume / 1000000) * 18}
                          width="4"
                          height={(c.volume / 1000000) * 18}
                          fill={color}
                          opacity="0.25"
                        />
                      )}
                    </g>
                  );
                } else {
                  return null;
                }
              });
            })()}

            {/* Line Chart Path */}
            {chartStyle !== 'candles' && candles.length > 0 && (() => {
              const mainH = showRSI || showMACD ? 230 : 310;
              const widthRatio = (100 - 6) / (candles.length - 1);
              const points = candles.map((c, i) => `${i * widthRatio}%,${((maxPrice - c.close) / priceRange) * mainH}`).join(' ');
              return <polyline points={points} fill="none" stroke="#2962ff" strokeWidth="2" />;
            })()}

            {/* EMA 20 & SMA 50 Overlays */}
            {showEMA20 && candles.length > 0 && (() => {
              const mainH = showRSI || showMACD ? 230 : 310;
              const widthRatio = (100 - 6) / (candles.length - 1);
              const points = ema20Values.map((v, i) => `${i * widthRatio}%,${((maxPrice - v) / priceRange) * mainH}`).join(' ');
              return <polyline points={points} fill="none" stroke="#f59e0b" strokeWidth="1.6" opacity="0.9" />;
            })()}

            {showSMA50 && candles.length > 0 && (() => {
              const mainH = showRSI || showMACD ? 230 : 310;
              const widthRatio = (100 - 6) / (candles.length - 1);
              const points = sma50Values.map((v, i) => `${i * widthRatio}%,${((maxPrice - v) / priceRange) * mainH}`).join(' ');
              return <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="1.6" opacity="0.9" />;
            })()}

            {/* User Drawings */}
            {drawings.map((draw) => {
              if (draw.type === 'ray') {
                return (
                  <g key={draw.id}>
                    <line x1="0" y1={draw.y1} x2="94%" y2={draw.y1} stroke={draw.color} strokeWidth="1.5" strokeDasharray="4 2" />
                    <rect x="94%" y={draw.y1 - 9} width="48" height="18" fill="#1e222d" stroke={draw.color} rx="3" />
                    <text x="95%" y={draw.y1 + 4} fill={draw.color} fontSize="9" fontFamily="monospace" fontWeight="bold">
                      ${draw.price1.toFixed(2)}
                    </text>
                  </g>
                );
              }
              if (draw.type === 'trendline') {
                return (
                  <g key={draw.id}>
                    <line x1={draw.x1} y1={draw.y1} x2={draw.x2} y2={draw.y2} stroke={draw.color} strokeWidth="2" />
                    <circle cx={draw.x1} cy={draw.y1} r="3" fill="white" stroke={draw.color} />
                    <circle cx={draw.x2} cy={draw.y2} r="3" fill="white" stroke={draw.color} />
                  </g>
                );
              }
              if (draw.type === 'fib') {
                const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0];
                const fibColors = ['#f23645', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
                const pDiff = draw.price2 - draw.price1;
                return (
                  <g key={draw.id}>
                    {levels.map((lvl, lIdx) => {
                      const lvlPrice = draw.price1 + pDiff * lvl;
                      const mainH = showRSI || showMACD ? 230 : 310;
                      const lvlY = ((maxPrice - lvlPrice) / priceRange) * mainH;
                      return (
                        <g key={lIdx}>
                          <line x1="0" y1={lvlY} x2="94%" y2={lvlY} stroke={fibColors[lIdx]} strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
                          <text x="4" y={lvlY - 3} fill={fibColors[lIdx]} fontSize="9" fontFamily="monospace">
                            {lvl} (${lvlPrice.toFixed(2)})
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              }
              return null;
            })}

            {/* In-Progress Measure Ruler */}
            {measureBox && (
              <g pointerEvents="none">
                <rect
                  x={Math.min(measureBox.startX, measureBox.endX)}
                  y={Math.min(measureBox.startY, measureBox.endY)}
                  width={Math.abs(measureBox.endX - measureBox.startX)}
                  height={Math.abs(measureBox.endY - measureBox.startY)}
                  fill="#2962ff"
                  fillOpacity="0.15"
                  stroke="#2962ff"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                <rect
                  x={measureBox.endX + 5}
                  y={measureBox.endY - 25}
                  width="110"
                  height="36"
                  fill="#131722"
                  stroke="#2962ff"
                  rx="4"
                />
                <text x={measureBox.endX + 10} y={measureBox.endY - 12} fill="white" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  Δ ${(measureBox.endPrice - measureBox.startPrice).toFixed(2)} (
                  {(((measureBox.endPrice - measureBox.startPrice) / measureBox.startPrice) * 100).toFixed(2)}%)
                </text>
                <text x={measureBox.endX + 10} y={measureBox.endY + 2} fill="#787b86" fontSize="9" fontFamily="monospace">
                  Bars: {Math.abs(measureBox.endIdx - measureBox.startIdx)}
                </text>
              </g>
            )}

            {/* RSI Sub-Chart (when active) */}
            {showRSI && (
              <g>
                <line x1="0" y1="240" x2="100%" y2="240" stroke="#2a2e39" strokeWidth="1" />
                <rect x="0" y="240" width="94%" height="65" fill="#131722" opacity="0.6" />
                <line x1="0" y1="260" x2="94%" y2="260" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                <line x1="0" y1="285" x2="94%" y2="285" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                <text x="95%" y="252" fill="#8b5cf6" fontSize="9" fontFamily="monospace">RSI 14</text>
                <text x="95%" y="263" fill="#787b86" fontSize="8" fontFamily="monospace">70</text>
                <text x="95%" y="288" fill="#787b86" fontSize="8" fontFamily="monospace">30</text>
                <polyline
                  points={rsiValues
                    .map((val, i) => `${(i * (100 - 6)) / (candles.length - 1)}%,${240 + 65 * (1 - val / 100)}`)
                    .join(' ')}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                />
              </g>
            )}

            {/* MACD Sub-Chart (when active) */}
            {showMACD && (
              <g>
                <line x1="0" y1={showRSI ? '310' : '240'} x2="100%" y2={showRSI ? '310' : '240'} stroke="#2a2e39" strokeWidth="1" />
                <rect x="0" y={showRSI ? '310' : '240'} width="94%" height="65" fill="#131722" opacity="0.6" />
                <text x="95%" y={showRSI ? '322' : '252'} fill="#089981" fontSize="9" fontFamily="monospace">MACD</text>
                {macdData.hist.map((h, i) => {
                  const baseY = (showRSI ? 310 : 240) + 32;
                  const xPct = (i * (100 - 6)) / (candles.length - 1);
                  const hHeight = Math.min(28, Math.abs(h) * 15);
                  const isUp = h >= 0;
                  return (
                    <rect
                      key={i}
                      x={`calc(${xPct}% - 2px)`}
                      y={isUp ? baseY - hHeight : baseY}
                      width="4"
                      height={hHeight}
                      fill={isUp ? '#089981' : '#f23645'}
                      opacity="0.75"
                    />
                  );
                })}
              </g>
            )}

            {/* Real-Time Price Line Badge on Right Scale */}
            {(() => {
              const mainH = showRSI || showMACD ? 230 : 310;
              const y = ((maxPrice - asset.price) / priceRange) * mainH;
              return (
                <g>
                  <line x1="0" y1={y} x2="94%" y2={y} stroke="#2962ff" strokeWidth="1" strokeDasharray="2 2" />
                  <rect x="94%" y={y - 9} width="48" height="18" fill="#2962ff" rx="3" />
                  <text x="95%" y={y + 4} fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    ${asset.price.toFixed(2)}
                  </text>
                </g>
              );
            })()}

            {/* Crosshair Cursor */}
            {mousePos && (
              <g pointerEvents="none">
                <line x1={mousePos.x} y1="0" x2={mousePos.x} y2="100%" stroke="#787b86" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1={mousePos.y} x2="100%" y2={mousePos.y} stroke="#787b86" strokeWidth="1" strokeDasharray="3 3" />
              </g>
            )}
          </svg>
        </div>

        {/* Right Pro Sidebar: Order Book (DOM) vs Statistics vs Drawings */}
        <div className="w-68 bg-[#1e222d] border-l border-[#2a2e39] flex flex-col shrink-0 overflow-y-auto">
          {/* Sidebar Tab Header */}
          <div className="flex border-b border-[#2a2e39] bg-[#131722] text-xs">
            <button
              onClick={() => setSidebarTab('stats')}
              className={`flex-1 py-2 font-semibold transition-colors cursor-pointer ${
                sidebarTab === 'stats' ? 'text-white border-b-2 border-[#2962ff] bg-[#1e222d]' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setSidebarTab('dom')}
              className={`flex-1 py-2 font-semibold transition-colors cursor-pointer ${
                sidebarTab === 'dom' ? 'text-white border-b-2 border-[#2962ff] bg-[#1e222d]' : 'text-[#787b86] hover:text-white'
              }`}
            >
              Order Book (DOM)
            </button>
          </div>

          {/* TAB 1: Analytics & Execution */}
          {sidebarTab === 'stats' && (
            <div className="p-3.5 flex flex-col gap-4 text-xs">
              {/* Technical Gauge Meter */}
              <div className="bg-[#131722] p-3 rounded-lg border border-[#2a2e39] flex flex-col items-center">
                <div className="text-[11px] font-semibold text-slate-300">Technical Rating</div>
                <div
                  className={`text-sm font-bold mt-1 uppercase tracking-wider ${
                    asset.rating.includes('Buy')
                      ? 'text-[#089981]'
                      : asset.rating.includes('Sell')
                      ? 'text-[#f23645]'
                      : 'text-amber-400'
                  }`}
                >
                  {asset.rating}
                </div>
                <div className="text-[10px] text-[#787b86] mt-0.5">14 Indicators Summary</div>
              </div>

              {/* Key Stats Table */}
              <div className="space-y-1.5 text-xs">
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
              </div>

              {/* Instant Execution Panel */}
              <div className="pt-2 border-t border-[#2a2e39]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#787b86] uppercase tracking-wider">
                    Execution
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTradeType('market')}
                      className={`px-2 py-0.5 text-[10px] rounded cursor-pointer ${
                        tradeType === 'market' ? 'bg-[#2962ff] text-white' : 'text-[#787b86]'
                      }`}
                    >
                      Market
                    </button>
                    <button
                      onClick={() => setTradeType('limit')}
                      className={`px-2 py-0.5 text-[10px] rounded cursor-pointer ${
                        tradeType === 'limit' ? 'bg-[#2962ff] text-white' : 'text-[#787b86]'
                      }`}
                    >
                      Limit
                    </button>
                  </div>
                </div>

                {tradeType === 'limit' && (
                  <div className="mb-2">
                    <span className="text-[10px] text-[#787b86]">Limit Price</span>
                    <input
                      type="number"
                      step="any"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(parseFloat(e.target.value) || asset.price)}
                      className="w-full mt-0.5 px-2 py-1 bg-[#131722] border border-[#2a2e39] rounded font-mono text-xs text-white"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs text-[#787b86]">Units</span>
                  <div className="flex items-center gap-1">
                    {[1, 5, 10, 50].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setTradeShares(qty)}
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded cursor-pointer ${
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
                    className="py-2 bg-[#089981] hover:bg-[#077a67] text-white font-bold text-xs rounded transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                    BUY ${asset.price.toFixed(2)}
                  </button>
                  <button
                    onClick={() => handleQuickTrade('sell')}
                    className="py-2 bg-[#f23645] hover:bg-[#c92533] text-white font-bold text-xs rounded transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5 stroke-[3]" />
                    SELL ${asset.price.toFixed(2)}
                  </button>
                </div>

                {tradeMessage && (
                  <div className="mt-2 p-1.5 bg-[#089981]/20 border border-[#089981]/40 text-[#089981] text-[11px] rounded text-center font-medium">
                    {tradeMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Order Book (Level 2 DOM) */}
          {sidebarTab === 'dom' && (
            <div className="p-3 flex flex-col gap-2 text-xs font-mono">
              <div className="flex justify-between text-[10px] text-[#787b86] border-b border-[#2a2e39] pb-1">
                <span>SIZE</span>
                <span>BID / ASK</span>
                <span>TOTAL</span>
              </div>

              {/* Asks (Red) */}
              <div className="space-y-0.5">
                {orderBook.asks.map((ask, idx) => (
                  <div key={idx} className="relative flex justify-between py-0.5 px-1 hover:bg-[#2a2e39]">
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-[#f23645]/15"
                      style={{ width: `${Math.min(100, (ask.size / 50) * 100)}%` }}
                    ></div>
                    <span className="text-[#787b86] relative z-10">{ask.size}</span>
                    <span className="text-[#f23645] font-semibold relative z-10">${ask.price.toFixed(2)}</span>
                    <span className="text-[#787b86] text-[10px] relative z-10">{ask.total}</span>
                  </div>
                ))}
              </div>

              {/* Spread Indicator */}
              <div className="py-1 px-2 my-1 bg-[#131722] rounded border border-[#2a2e39] text-center text-[10px] text-slate-300">
                Spread: ${orderBook.spread.toFixed(2)}
              </div>

              {/* Bids (Green) */}
              <div className="space-y-0.5">
                {orderBook.bids.map((bid, idx) => (
                  <div key={idx} className="relative flex justify-between py-0.5 px-1 hover:bg-[#2a2e39]">
                    <div
                      className="absolute right-0 top-0 bottom-0 bg-[#089981]/15"
                      style={{ width: `${Math.min(100, (bid.size / 50) * 100)}%` }}
                    ></div>
                    <span className="text-[#787b86] relative z-10">{bid.size}</span>
                    <span className="text-[#089981] font-semibold relative z-10">${bid.price.toFixed(2)}</span>
                    <span className="text-[#787b86] text-[10px] relative z-10">{bid.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
