export interface AssetQuote {
  symbol: string;
  name: string;
  category: 'stocks' | 'crypto' | 'forex' | 'indices' | 'futures' | 'bonds';
  sector?: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: string;
  volumeNumeric: number;
  marketCap: string;
  marketCapNumeric: number; // in billions
  peRatio?: number;
  divYield?: number;
  beta?: number;
  week52High: number;
  week52Low: number;
  rating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  ratingScore: number; // -10 (Strong Sell) to +10 (Strong Buy)
  sparkline: number[];
  currency: string;
}

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  currency: string;
  country: string;
  countryCode: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual: string;
  forecast: string;
  previous: string;
}

export interface MarketNews {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  readTime: string;
  summary: string;
  relatedSymbols: string[];
  imageUrl: string;
}

export const INITIAL_ASSETS: AssetQuote[] = [
  // INDICES
  {
    symbol: 'SPX',
    name: 'S&P 500 Index',
    category: 'indices',
    exchange: 'INDEX',
    price: 5894.20,
    change: 41.50,
    changePercent: 0.71,
    open: 5860.10,
    high: 5902.40,
    low: 5855.30,
    prevClose: 5852.70,
    volume: '2.84B',
    volumeNumeric: 2840000000,
    marketCap: '48.2T',
    marketCapNumeric: 48200,
    peRatio: 26.4,
    divYield: 1.32,
    week52High: 5950.00,
    week52Low: 4953.56,
    rating: 'Buy',
    ratingScore: 6,
    sparkline: [5830, 5845, 5840, 5865, 5855, 5880, 5894.2],
    currency: 'USD'
  },
  {
    symbol: 'NDX',
    name: 'Nasdaq 100 Index',
    category: 'indices',
    exchange: 'INDEX',
    price: 20645.80,
    change: 218.40,
    changePercent: 1.07,
    open: 20450.00,
    high: 20690.50,
    low: 20420.10,
    prevClose: 20427.40,
    volume: '5.12B',
    volumeNumeric: 5120000000,
    marketCap: '24.8T',
    marketCapNumeric: 24800,
    peRatio: 31.8,
    divYield: 0.85,
    week52High: 20850.00,
    week52Low: 16973.00,
    rating: 'Strong Buy',
    ratingScore: 8,
    sparkline: [20350, 20400, 20380, 20520, 20500, 20610, 20645.8],
    currency: 'USD'
  },
  {
    symbol: 'DJI',
    name: 'Dow Jones Industrial Average',
    category: 'indices',
    exchange: 'INDEX',
    price: 43750.86,
    change: 120.30,
    changePercent: 0.28,
    open: 43680.00,
    high: 43810.00,
    low: 43620.00,
    prevClose: 43630.56,
    volume: '380M',
    volumeNumeric: 380000000,
    marketCap: '14.1T',
    marketCapNumeric: 14100,
    peRatio: 22.1,
    divYield: 1.84,
    week52High: 44486.00,
    week52Low: 37122.00,
    rating: 'Neutral',
    ratingScore: 2,
    sparkline: [43600, 43620, 43580, 43710, 43690, 43740, 43750.86],
    currency: 'USD'
  },
  {
    symbol: 'RUT',
    name: 'Russell 2000 Index',
    category: 'indices',
    exchange: 'INDEX',
    price: 2315.40,
    change: -12.60,
    changePercent: -0.54,
    open: 2332.00,
    high: 2338.00,
    low: 2309.10,
    prevClose: 2328.00,
    volume: '1.2B',
    volumeNumeric: 1200000000,
    marketCap: '3.1T',
    marketCapNumeric: 3100,
    peRatio: 28.3,
    divYield: 1.45,
    week52High: 2445.00,
    week52Low: 1920.00,
    rating: 'Neutral',
    ratingScore: -1,
    sparkline: [2335, 2330, 2325, 2318, 2322, 2312, 2315.4],
    currency: 'USD'
  },
  {
    symbol: 'DAX',
    name: 'DAX 40 Germany',
    category: 'indices',
    exchange: 'INDEX',
    price: 19448.20,
    change: 85.50,
    changePercent: 0.44,
    open: 19380.00,
    high: 19490.00,
    low: 19350.00,
    prevClose: 19362.70,
    volume: '85M',
    volumeNumeric: 85000000,
    marketCap: '1.9T',
    marketCapNumeric: 1900,
    peRatio: 14.8,
    divYield: 3.12,
    week52High: 19674.00,
    week52Low: 15600.00,
    rating: 'Buy',
    ratingScore: 5,
    sparkline: [19350, 19380, 19400, 19390, 19420, 19440, 19448.2],
    currency: 'EUR'
  },

  // STOCKS
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    category: 'stocks',
    sector: 'Technology',
    exchange: 'NASDAQ',
    price: 147.25,
    change: 4.85,
    changePercent: 3.41,
    open: 143.50,
    high: 148.30,
    low: 142.90,
    prevClose: 142.40,
    volume: '62.4M',
    volumeNumeric: 62400000,
    marketCap: '3.61T',
    marketCapNumeric: 3610,
    peRatio: 64.2,
    divYield: 0.03,
    beta: 1.68,
    week52High: 149.77,
    week52Low: 45.12,
    rating: 'Strong Buy',
    ratingScore: 9,
    sparkline: [141.5, 143.0, 142.8, 145.2, 146.1, 146.8, 147.25],
    currency: 'USD'
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'stocks',
    sector: 'Technology',
    exchange: 'NASDAQ',
    price: 228.60,
    change: 1.40,
    changePercent: 0.62,
    open: 227.10,
    high: 229.40,
    low: 226.50,
    prevClose: 227.20,
    volume: '45.1M',
    volumeNumeric: 45100000,
    marketCap: '3.48T',
    marketCapNumeric: 3480,
    peRatio: 35.2,
    divYield: 0.44,
    beta: 1.04,
    week52High: 237.23,
    week52Low: 164.08,
    rating: 'Buy',
    ratingScore: 5,
    sparkline: [226.5, 227.2, 227.0, 228.1, 227.9, 228.4, 228.6],
    currency: 'USD'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    category: 'stocks',
    sector: 'Technology',
    exchange: 'NASDAQ',
    price: 423.80,
    change: 3.20,
    changePercent: 0.76,
    open: 421.50,
    high: 425.10,
    low: 420.20,
    prevClose: 420.60,
    volume: '22.8M',
    volumeNumeric: 22800000,
    marketCap: '3.15T',
    marketCapNumeric: 3150,
    peRatio: 34.7,
    divYield: 0.75,
    beta: 0.89,
    week52High: 468.35,
    week52Low: 366.50,
    rating: 'Buy',
    ratingScore: 6,
    sparkline: [419.0, 421.0, 422.3, 421.8, 423.0, 423.5, 423.8],
    currency: 'USD'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    category: 'stocks',
    sector: 'Communication',
    exchange: 'NASDAQ',
    price: 176.40,
    change: 2.10,
    changePercent: 1.20,
    open: 174.60,
    high: 177.20,
    low: 174.10,
    prevClose: 174.30,
    volume: '28.5M',
    volumeNumeric: 28500000,
    marketCap: '2.19T',
    marketCapNumeric: 2190,
    peRatio: 23.8,
    divYield: 0.45,
    beta: 1.05,
    week52High: 191.75,
    week52Low: 129.40,
    rating: 'Strong Buy',
    ratingScore: 7,
    sparkline: [173.5, 174.8, 175.2, 175.0, 176.1, 176.0, 176.4],
    currency: 'USD'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    category: 'stocks',
    sector: 'Consumer Discretionary',
    exchange: 'NASDAQ',
    price: 208.50,
    change: 3.80,
    changePercent: 1.86,
    open: 205.20,
    high: 209.10,
    low: 204.80,
    prevClose: 204.70,
    volume: '39.4M',
    volumeNumeric: 39400000,
    marketCap: '2.18T',
    marketCapNumeric: 2180,
    peRatio: 44.5,
    divYield: 0.0,
    beta: 1.15,
    week52High: 212.50,
    week52Low: 140.25,
    rating: 'Strong Buy',
    ratingScore: 8,
    sparkline: [203.0, 204.5, 205.2, 206.8, 207.5, 208.1, 208.5],
    currency: 'USD'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    category: 'stocks',
    sector: 'Communication',
    exchange: 'NASDAQ',
    price: 592.10,
    change: 6.40,
    changePercent: 1.09,
    open: 587.00,
    high: 595.40,
    low: 585.50,
    prevClose: 585.70,
    volume: '14.2M',
    volumeNumeric: 14200000,
    marketCap: '1.49T',
    marketCapNumeric: 1490,
    peRatio: 28.6,
    divYield: 0.34,
    beta: 1.21,
    week52High: 602.95,
    week52Low: 313.66,
    rating: 'Strong Buy',
    ratingScore: 8,
    sparkline: [584.0, 586.5, 588.0, 590.2, 589.5, 591.4, 592.1],
    currency: 'USD'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    category: 'stocks',
    sector: 'Consumer Discretionary',
    exchange: 'NASDAQ',
    price: 338.50,
    change: -9.20,
    changePercent: -2.65,
    open: 345.00,
    high: 349.80,
    low: 334.20,
    prevClose: 347.70,
    volume: '88.9M',
    volumeNumeric: 88900000,
    marketCap: '1.08T',
    marketCapNumeric: 1080,
    peRatio: 88.4,
    divYield: 0.0,
    beta: 2.34,
    week52High: 358.64,
    week52Low: 138.80,
    rating: 'Neutral',
    ratingScore: 1,
    sparkline: [348.0, 346.5, 342.0, 339.0, 341.2, 336.5, 338.5],
    currency: 'USD'
  },
  {
    symbol: 'LLY',
    name: 'Eli Lilly and Company',
    category: 'stocks',
    sector: 'Healthcare',
    exchange: 'NYSE',
    price: 785.40,
    change: 14.20,
    changePercent: 1.84,
    open: 772.00,
    high: 789.00,
    low: 770.50,
    prevClose: 771.20,
    volume: '3.4M',
    volumeNumeric: 3400000,
    marketCap: '746B',
    marketCapNumeric: 746,
    peRatio: 72.1,
    divYield: 0.65,
    beta: 0.62,
    week52High: 972.53,
    week52Low: 568.20,
    rating: 'Buy',
    ratingScore: 6,
    sparkline: [768, 772, 775, 779, 782, 784, 785.4],
    currency: 'USD'
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    category: 'stocks',
    sector: 'Financial',
    exchange: 'NYSE',
    price: 242.90,
    change: 2.30,
    changePercent: 0.96,
    open: 241.10,
    high: 244.00,
    low: 240.50,
    prevClose: 240.60,
    volume: '8.7M',
    volumeNumeric: 8700000,
    marketCap: '689B',
    marketCapNumeric: 689,
    peRatio: 12.8,
    divYield: 1.98,
    beta: 1.08,
    week52High: 248.80,
    week52Low: 148.50,
    rating: 'Buy',
    ratingScore: 5,
    sparkline: [240, 241, 241.5, 242.8, 242.0, 242.5, 242.9],
    currency: 'USD'
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    category: 'stocks',
    sector: 'Energy',
    exchange: 'NYSE',
    price: 119.20,
    change: -1.40,
    changePercent: -1.16,
    open: 120.40,
    high: 121.00,
    low: 118.60,
    prevClose: 120.60,
    volume: '14.8M',
    volumeNumeric: 14800000,
    marketCap: '472B',
    marketCapNumeric: 472,
    peRatio: 14.2,
    divYield: 3.25,
    beta: 0.88,
    week52High: 126.34,
    week52Low: 95.77,
    rating: 'Sell',
    ratingScore: -4,
    sparkline: [121.2, 120.8, 120.2, 119.8, 119.5, 119.0, 119.2],
    currency: 'USD'
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    category: 'stocks',
    sector: 'Technology',
    exchange: 'NASDAQ',
    price: 64.80,
    change: 3.75,
    changePercent: 6.14,
    open: 61.20,
    high: 65.40,
    low: 60.90,
    prevClose: 61.05,
    volume: '74.2M',
    volumeNumeric: 74200000,
    marketCap: '144B',
    marketCapNumeric: 144,
    peRatio: 128.5,
    divYield: 0.0,
    beta: 2.75,
    week52High: 66.00,
    week52Low: 17.50,
    rating: 'Strong Buy',
    ratingScore: 10,
    sparkline: [59.8, 61.0, 62.4, 63.1, 64.0, 64.5, 64.8],
    currency: 'USD'
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices, Inc.',
    category: 'stocks',
    sector: 'Technology',
    exchange: 'NASDAQ',
    price: 142.60,
    change: -2.80,
    changePercent: -1.93,
    open: 145.00,
    high: 146.20,
    low: 141.50,
    prevClose: 145.40,
    volume: '38.2M',
    volumeNumeric: 38200000,
    marketCap: '231B',
    marketCapNumeric: 231,
    peRatio: 84.1,
    divYield: 0.0,
    beta: 1.82,
    week52High: 227.30,
    week52Low: 116.00,
    rating: 'Neutral',
    ratingScore: 0,
    sparkline: [146.0, 145.2, 144.0, 143.5, 144.0, 142.1, 142.6],
    currency: 'USD'
  },

  // CRYPTO
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    category: 'crypto',
    sector: 'Layer 1',
    exchange: 'CRYPTO',
    price: 91420.00,
    change: 2840.00,
    changePercent: 3.21,
    open: 88580.00,
    high: 92350.00,
    low: 88120.00,
    prevClose: 88580.00,
    volume: '42.8B',
    volumeNumeric: 42800000000,
    marketCap: '1.81T',
    marketCapNumeric: 1810,
    week52High: 93480.00,
    week52Low: 38500.00,
    rating: 'Strong Buy',
    ratingScore: 9,
    sparkline: [88200, 89100, 88800, 90400, 91200, 91000, 91420],
    currency: 'USD'
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum',
    category: 'crypto',
    sector: 'Smart Contracts',
    exchange: 'CRYPTO',
    price: 3280.50,
    change: 85.20,
    changePercent: 2.67,
    open: 3195.30,
    high: 3320.00,
    low: 3170.00,
    prevClose: 3195.30,
    volume: '24.1B',
    volumeNumeric: 24100000000,
    marketCap: '394B',
    marketCapNumeric: 394,
    week52High: 4093.00,
    week52Low: 2150.00,
    rating: 'Buy',
    ratingScore: 6,
    sparkline: [3180, 3210, 3200, 3250, 3260, 3275, 3280.5],
    currency: 'USD'
  },
  {
    symbol: 'SOL/USD',
    name: 'Solana',
    category: 'crypto',
    sector: 'Layer 1',
    exchange: 'CRYPTO',
    price: 218.40,
    change: 14.80,
    changePercent: 7.27,
    open: 203.60,
    high: 222.50,
    low: 201.20,
    prevClose: 203.60,
    volume: '9.4B',
    volumeNumeric: 9400000000,
    marketCap: '103B',
    marketCapNumeric: 103,
    week52High: 225.00,
    week52Low: 54.00,
    rating: 'Strong Buy',
    ratingScore: 10,
    sparkline: [201, 205, 209, 212, 216, 217, 218.4],
    currency: 'USD'
  },
  {
    symbol: 'BNB/USD',
    name: 'BNB Chain',
    category: 'crypto',
    sector: 'Exchange / L1',
    exchange: 'CRYPTO',
    price: 645.20,
    change: 8.40,
    changePercent: 1.32,
    open: 636.80,
    high: 652.00,
    low: 634.50,
    prevClose: 636.80,
    volume: '2.1B',
    volumeNumeric: 2100000000,
    marketCap: '94B',
    marketCapNumeric: 94,
    week52High: 720.67,
    week52Low: 220.00,
    rating: 'Buy',
    ratingScore: 4,
    sparkline: [635, 638, 642, 640, 644, 645.2, 645.2],
    currency: 'USD'
  },
  {
    symbol: 'XRP/USD',
    name: 'XRP',
    category: 'crypto',
    sector: 'Payments',
    exchange: 'CRYPTO',
    price: 0.824,
    change: 0.082,
    changePercent: 11.05,
    open: 0.742,
    high: 0.854,
    low: 0.730,
    prevClose: 0.742,
    volume: '7.8B',
    volumeNumeric: 7800000000,
    marketCap: '46.8B',
    marketCapNumeric: 46.8,
    week52High: 0.854,
    week52Low: 0.420,
    rating: 'Strong Buy',
    ratingScore: 10,
    sparkline: [0.73, 0.75, 0.77, 0.79, 0.81, 0.83, 0.824],
    currency: 'USD'
  },

  // FOREX
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    exchange: 'FX',
    price: 1.0568,
    change: -0.0042,
    changePercent: -0.40,
    open: 1.0610,
    high: 1.0625,
    low: 1.0552,
    prevClose: 1.0610,
    volume: '112B',
    volumeNumeric: 112000000000,
    marketCap: 'N/A',
    marketCapNumeric: 0,
    week52High: 1.1214,
    week52Low: 1.0505,
    rating: 'Strong Sell',
    ratingScore: -8,
    sparkline: [1.061, 1.059, 1.058, 1.057, 1.056, 1.057, 1.0568],
    currency: 'USD'
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    category: 'forex',
    exchange: 'FX',
    price: 1.2715,
    change: -0.0035,
    changePercent: -0.27,
    open: 1.2750,
    high: 1.2780,
    low: 1.2690,
    prevClose: 1.2750,
    volume: '86B',
    volumeNumeric: 86000000000,
    marketCap: 'N/A',
    marketCapNumeric: 0,
    week52High: 1.3434,
    week52Low: 1.2300,
    rating: 'Sell',
    ratingScore: -5,
    sparkline: [1.276, 1.274, 1.273, 1.271, 1.270, 1.272, 1.2715],
    currency: 'USD'
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'forex',
    exchange: 'FX',
    price: 154.62,
    change: 0.88,
    changePercent: 0.57,
    open: 153.74,
    high: 155.10,
    low: 153.50,
    prevClose: 153.74,
    volume: '94B',
    volumeNumeric: 94000000000,
    marketCap: 'N/A',
    marketCapNumeric: 0,
    week52High: 161.95,
    week52Low: 140.25,
    rating: 'Strong Buy',
    ratingScore: 8,
    sparkline: [153.6, 153.9, 154.2, 154.0, 154.5, 154.8, 154.62],
    currency: 'JPY'
  },
  {
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    category: 'forex',
    exchange: 'FX',
    price: 0.6518,
    change: -0.0016,
    changePercent: -0.24,
    open: 0.6534,
    high: 0.6550,
    low: 0.6508,
    prevClose: 0.6534,
    volume: '45B',
    volumeNumeric: 45000000000,
    marketCap: 'N/A',
    marketCapNumeric: 0,
    week52High: 0.6942,
    week52Low: 0.6350,
    rating: 'Sell',
    ratingScore: -4,
    sparkline: [0.654, 0.653, 0.652, 0.651, 0.652, 0.651, 0.6518],
    currency: 'USD'
  },

  // FUTURES & COMMODITIES
  {
    symbol: 'GOLD',
    name: 'Gold (XAU/USD)',
    category: 'futures',
    sector: 'Metals',
    exchange: 'COMEX',
    price: 2634.80,
    change: 18.20,
    changePercent: 0.70,
    open: 2616.60,
    high: 2642.50,
    low: 2614.00,
    prevClose: 2616.60,
    volume: '280K',
    volumeNumeric: 280000,
    marketCap: '17.4T',
    marketCapNumeric: 17400,
    week52High: 2790.15,
    week52Low: 1973.00,
    rating: 'Buy',
    ratingScore: 5,
    sparkline: [2615, 2620, 2625, 2622, 2630, 2638, 2634.8],
    currency: 'USD'
  },
  {
    symbol: 'SILVER',
    name: 'Silver (XAG/USD)',
    category: 'futures',
    sector: 'Metals',
    exchange: 'COMEX',
    price: 31.25,
    change: 0.45,
    changePercent: 1.46,
    open: 30.80,
    high: 31.45,
    low: 30.70,
    prevClose: 30.80,
    volume: '85K',
    volumeNumeric: 85000,
    marketCap: '1.6T',
    marketCapNumeric: 1600,
    week52High: 34.87,
    week52Low: 21.90,
    rating: 'Buy',
    ratingScore: 6,
    sparkline: [30.7, 30.9, 31.0, 31.1, 31.3, 31.4, 31.25],
    currency: 'USD'
  },
  {
    symbol: 'USOIL',
    name: 'Crude Oil (WTI)',
    category: 'futures',
    sector: 'Energy',
    exchange: 'NYMEX',
    price: 68.42,
    change: -0.98,
    changePercent: -1.41,
    open: 69.40,
    high: 69.85,
    low: 67.90,
    prevClose: 69.40,
    volume: '340K',
    volumeNumeric: 340000,
    marketCap: 'N/A',
    marketCapNumeric: 0,
    week52High: 87.67,
    week52Low: 65.27,
    rating: 'Sell',
    ratingScore: -6,
    sparkline: [69.5, 69.2, 68.8, 68.9, 68.5, 68.2, 68.42],
    currency: 'USD'
  },
  {
    symbol: 'NATGAS',
    name: 'Natural Gas',
    category: 'futures',
    sector: 'Energy',
    exchange: 'NYMEX',
    price: 2.894,
    change: 0.124,
    changePercent: 4.48,
    open: 2.770,
    high: 2.940,
    low: 2.750,
    prevClose: 2.770,
    volume: '160K',
    volumeNumeric: 160000,
    marketCap: 'N/A',
    marketCapNumeric: 0,
    week52High: 3.390,
    week52Low: 1.580,
    rating: 'Strong Buy',
    ratingScore: 8,
    sparkline: [2.76, 2.80, 2.82, 2.85, 2.88, 2.91, 2.894],
    currency: 'USD'
  },

  // BONDS
  {
    symbol: 'US10Y',
    name: 'U.S. 10 Year Treasury Yield',
    category: 'bonds',
    exchange: 'BOND',
    price: 4.442,
    change: 0.038,
    changePercent: 0.86,
    open: 4.404,
    high: 4.460,
    low: 4.390,
    prevClose: 4.404,
    volume: 'N/A',
    volumeNumeric: 0,
    marketCap: 'N/A',
    marketCapNumeric: 0,
    week52High: 4.740,
    week52Low: 3.600,
    rating: 'Neutral',
    ratingScore: 2,
    sparkline: [4.40, 4.41, 4.43, 4.42, 4.44, 4.45, 4.442],
    currency: '%'
  },
  {
    symbol: 'US02Y',
    name: 'U.S. 2 Year Treasury Yield',
    category: 'bonds',
    exchange: 'BOND',
    price: 4.298,
    change: 0.042,
    changePercent: 0.99,
    open: 4.256,
    high: 4.310,
    low: 4.240,
    prevClose: 4.256,
    volume: 'N/A',
    volumeNumeric: 0,
    marketCap: 'N/A',
    marketCapNumeric: 0,
    week52High: 5.040,
    week52Low: 3.550,
    rating: 'Neutral',
    ratingScore: 1,
    sparkline: [4.26, 4.27, 4.28, 4.29, 4.30, 4.31, 4.298],
    currency: '%'
  }
];

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'eco-1',
    date: 'Today',
    time: '08:30 AM',
    currency: 'USD',
    country: 'United States',
    countryCode: 'US',
    event: 'Core CPI (MoM)',
    impact: 'high',
    actual: '0.3%',
    forecast: '0.3%',
    previous: '0.3%'
  },
  {
    id: 'eco-2',
    date: 'Today',
    time: '08:30 AM',
    currency: 'USD',
    country: 'United States',
    countryCode: 'US',
    event: 'CPI (YoY)',
    impact: 'high',
    actual: '2.6%',
    forecast: '2.6%',
    previous: '2.4%'
  },
  {
    id: 'eco-3',
    date: 'Today',
    time: '10:30 AM',
    currency: 'USD',
    country: 'United States',
    countryCode: 'US',
    event: 'EIA Crude Oil Inventories',
    impact: 'medium',
    actual: '+2.089M',
    forecast: '+1.850M',
    previous: '+2.149M'
  },
  {
    id: 'eco-4',
    date: 'Tomorrow',
    time: '08:30 AM',
    currency: 'USD',
    country: 'United States',
    countryCode: 'US',
    event: 'Producer Price Index (PPI)',
    impact: 'high',
    actual: 'Pending',
    forecast: '0.2%',
    previous: '0.0%'
  },
  {
    id: 'eco-5',
    date: 'Tomorrow',
    time: '08:30 AM',
    currency: 'USD',
    country: 'United States',
    countryCode: 'US',
    event: 'Initial Jobless Claims',
    impact: 'medium',
    actual: 'Pending',
    forecast: '223K',
    previous: '221K'
  },
  {
    id: 'eco-6',
    date: 'Friday',
    time: '02:00 AM',
    currency: 'GBP',
    country: 'United Kingdom',
    countryCode: 'GB',
    event: 'GDP (QoQ)',
    impact: 'high',
    actual: 'Pending',
    forecast: '0.2%',
    previous: '0.5%'
  },
  {
    id: 'eco-7',
    date: 'Friday',
    time: '08:30 AM',
    currency: 'USD',
    country: 'United States',
    countryCode: 'US',
    event: 'Retail Sales (MoM)',
    impact: 'high',
    actual: 'Pending',
    forecast: '0.3%',
    previous: '0.4%'
  }
];

export const MARKET_NEWS: MarketNews[] = [
  {
    id: 'news-1',
    title: 'NVIDIA Surges as AI Hyperscaler Capex Targets Expand for Next-Gen Blackwell Rigs',
    source: 'Bloomberg Markets',
    timeAgo: '18m ago',
    category: 'Stocks',
    sentiment: 'bullish',
    readTime: '3 min read',
    summary: 'Cloud providers boost forward infrastructure guidance, highlighting sustained demand for compute and high-bandwidth memory clusters.',
    relatedSymbols: ['NVDA', 'MSFT', 'GOOGL'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'news-2',
    title: 'Bitcoin Crosses $91,000 as Institutional Inflows Drive US Spot ETFs to Record Volume',
    source: 'CoinDesk',
    timeAgo: '42m ago',
    category: 'Crypto',
    sentiment: 'bullish',
    readTime: '4 min read',
    summary: 'Net daily ETF subscriptions exceed $1.2 billion as derivatives open interest touches unprecedented milestones.',
    relatedSymbols: ['BTC/USD', 'ETH/USD', 'SOL/USD'],
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'news-3',
    title: 'Federal Reserve Policy Path in Focus Following In-Line CPI Prints and Bond Yield Moves',
    source: 'Reuters Financial',
    timeAgo: '1h ago',
    category: 'Bonds & Macro',
    sentiment: 'neutral',
    readTime: '5 min read',
    summary: 'Treasury yields fluctuate as interest rate swap traders price in an 82% probability of a 25 basis point cut at the upcoming FOMC gathering.',
    relatedSymbols: ['SPX', 'US10Y', 'EUR/USD'],
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'news-4',
    title: 'Crude Oil Steady Under $70 as Global Demand Projections Temper Geopolitical Premiums',
    source: 'Financial Times',
    timeAgo: '2h ago',
    category: 'Commodities',
    sentiment: 'bearish',
    readTime: '3 min read',
    summary: 'OPEC+ scheduled production adjustments weighed against refinery maintenance schedules in key Asian trading hubs.',
    relatedSymbols: ['USOIL', 'XOM'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  }
];

export type ProTimeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W' | '1M';

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
}

// Generate realistic Level 2 Order Book Depth
export function generateOrderBook(midPrice: number): OrderBook {
  const bids: OrderBookLevel[] = [];
  const asks: OrderBookLevel[] = [];
  const tick = midPrice > 1000 ? 1 : midPrice > 100 ? 0.05 : 0.01;

  let totalBid = 0;
  for (let i = 1; i <= 8; i++) {
    const price = parseFloat((midPrice - i * tick).toFixed(2));
    const size = parseFloat((Math.random() * 45 + 5).toFixed(1));
    totalBid += size;
    bids.push({ price, size, total: parseFloat(totalBid.toFixed(1)) });
  }

  let totalAsk = 0;
  for (let i = 1; i <= 8; i++) {
    const price = parseFloat((midPrice + i * tick).toFixed(2));
    const size = parseFloat((Math.random() * 45 + 5).toFixed(1));
    totalAsk += size;
    asks.push({ price, size, total: parseFloat(totalAsk.toFixed(1)) });
  }

  return {
    bids,
    asks: asks.reverse(),
    spread: parseFloat((asks[0]?.price - bids[0]?.price || tick).toFixed(2))
  };
}

// Helper to generate realistic candlestick data for any asset and timeframe
export function generateCandles(basePrice: number, timeframe: ProTimeframe | string = '1D', count = 75): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  
  let intervalMs = 15 * 60 * 1000;
  let isIntraday = true;

  switch (timeframe) {
    case '1m':
      intervalMs = 60 * 1000;
      break;
    case '5m':
      intervalMs = 5 * 60 * 1000;
      break;
    case '15m':
      intervalMs = 15 * 60 * 1000;
      break;
    case '1h':
      intervalMs = 60 * 60 * 1000;
      break;
    case '4h':
      intervalMs = 4 * 60 * 60 * 1000;
      break;
    case '1D':
      intervalMs = 24 * 60 * 60 * 1000;
      isIntraday = false;
      break;
    case '1W':
      intervalMs = 7 * 24 * 60 * 60 * 1000;
      isIntraday = false;
      break;
    case '1M':
      intervalMs = 30 * 24 * 60 * 60 * 1000;
      isIntraday = false;
      break;
    default:
      intervalMs = 60 * 60 * 1000;
  }

  let currentPrice = basePrice * (1 - (Math.random() * 0.12 - 0.04));
  const volatility = basePrice * (isIntraday ? 0.005 : 0.015);

  for (let i = count; i >= 0; i--) {
    const timeTimestamp = now - i * intervalMs;
    const dateObj = new Date(timeTimestamp);
    
    let timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!isIntraday) {
      timeStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    const open = currentPrice;
    const change = (Math.random() - 0.48) * volatility;
    const close = Math.max(open * 0.2, open + change);
    const high = Math.max(open, close) + Math.random() * (volatility * 0.6);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.6);
    const volume = Math.floor(Math.random() * 850000) + 120000;

    candles.push({
      time: timeStr,
      timestamp: timeTimestamp,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });

    currentPrice = close;
  }

  // Anchor the last candle close near actual current price
  if (candles.length > 0) {
    candles[candles.length - 1].close = basePrice;
    candles[candles.length - 1].high = Math.max(candles[candles.length - 1].high, basePrice);
    candles[candles.length - 1].low = Math.min(candles[candles.length - 1].low, basePrice);
  }

  return candles;
}
