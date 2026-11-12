import React from 'react';

export function TradingViewLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center font-bold tracking-tighter text-white bg-[#2962ff] rounded-md ${className}`}>
      <svg viewBox="0 0 36 28" fill="none" className="w-5 h-4" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0H22V28H14V0Z" fill="white"/>
        <path d="M0 8H8V28H0V8Z" fill="white"/>
        <path d="M28 14H36V28H28V14Z" fill="white"/>
      </svg>
    </div>
  );
}

export function SymbolBadge({ symbol, className = "w-7 h-7 text-xs" }: { symbol: string; className?: string }) {
  // Color coded by symbol prefix/type
  let bg = "bg-slate-800 text-slate-200 border-slate-700";
  let letter = symbol.slice(0, 2);

  if (symbol.includes('BTC')) {
    bg = "bg-amber-500/20 text-amber-400 border-amber-500/30";
    letter = '₿';
  } else if (symbol.includes('ETH')) {
    bg = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
    letter = 'Ξ';
  } else if (symbol.includes('SOL')) {
    bg = "bg-purple-500/20 text-purple-300 border-purple-500/30";
    letter = '◎';
  } else if (symbol.includes('XRP')) {
    bg = "bg-blue-500/20 text-blue-300 border-blue-500/30";
    letter = '✕';
  } else if (symbol.includes('NVDA')) {
    bg = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    letter = 'NV';
  } else if (symbol.includes('AAPL')) {
    bg = "bg-slate-700 text-slate-100 border-slate-600";
    letter = '';
  } else if (symbol.includes('TSLA')) {
    bg = "bg-rose-500/20 text-rose-400 border-rose-500/30";
    letter = 'T';
  } else if (symbol.includes('SPX') || symbol.includes('NDX') || symbol.includes('DJI')) {
    bg = "bg-sky-500/20 text-sky-400 border-sky-500/30";
    letter = symbol.slice(0, 3);
  } else if (symbol.includes('GOLD') || symbol.includes('SILVER')) {
    bg = "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    letter = symbol === 'GOLD' ? 'Au' : 'Ag';
  }

  return (
    <div className={`inline-flex items-center justify-center font-bold border rounded-md shrink-0 ${bg} ${className}`}>
      {letter}
    </div>
  );
}
