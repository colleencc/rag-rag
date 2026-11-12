import React, { useState, useMemo } from 'react';
import { Calendar, Filter, AlertCircle, Clock } from 'lucide-react';
import { EconomicEvent, ECONOMIC_EVENTS } from '../data/marketData';

export const EconomicCalendar: React.FC = () => {
  const [selectedImpact, setSelectedImpact] = useState<'all' | 'high' | 'medium'>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<'all' | 'USD' | 'EUR' | 'GBP'>('all');

  const filteredEvents = useMemo(() => {
    return ECONOMIC_EVENTS.filter((ev) => {
      if (selectedImpact !== 'all' && ev.impact !== selectedImpact) return false;
      if (selectedCurrency !== 'all' && ev.currency !== selectedCurrency) return false;
      return true;
    });
  }, [selectedImpact, selectedCurrency]);

  return (
    <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2a2e39] pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2962ff]" />
          <h3 className="text-sm font-bold text-white">Economic Calendar</h3>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Currency Filter */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded border border-[#2a2e39] text-xs">
            {['all', 'USD', 'EUR', 'GBP'].map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr as any)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  selectedCurrency === curr ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-white'
                }`}
              >
                {curr === 'all' ? 'All' : curr}
              </button>
            ))}
          </div>

          {/* Impact Filter */}
          <button
            onClick={() => setSelectedImpact(selectedImpact === 'all' ? 'high' : 'all')}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
              selectedImpact === 'high'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-[#131722] text-[#787b86] border-[#2a2e39] hover:text-white'
            }`}
          >
            {selectedImpact === 'high' ? 'High Impact Only' : 'All Impacts'}
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[#787b86] text-[11px] font-semibold border-b border-[#2a2e39]/60 pb-1">
              <th className="py-2 px-2">Time</th>
              <th className="py-2 px-2">Cur</th>
              <th className="py-2 px-2">Impact</th>
              <th className="py-2 px-2">Event</th>
              <th className="py-2 px-2 text-right">Actual</th>
              <th className="py-2 px-2 text-right">Forecast</th>
              <th className="py-2 px-2 text-right">Prior</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2e39]/40">
            {filteredEvents.map((ev) => (
              <tr key={ev.id} className="hover:bg-[#2a2e39]/40 transition-colors">
                <td className="py-2 px-2 font-mono text-[#787b86] whitespace-nowrap">
                  <div className="text-white font-medium">{ev.time}</div>
                  <div className="text-[10px]">{ev.date}</div>
                </td>
                <td className="py-2 px-2 font-mono font-bold text-slate-300">
                  {ev.currency}
                </td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-0.5">
                    <span
                      className={`w-1.5 h-3 rounded-xs ${
                        ev.impact === 'high'
                          ? 'bg-rose-500'
                          : ev.impact === 'medium'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    ></span>
                    <span
                      className={`w-1.5 h-3 rounded-xs ${
                        ev.impact === 'high' || ev.impact === 'medium'
                          ? ev.impact === 'high'
                            ? 'bg-rose-500'
                            : 'bg-amber-400'
                          : 'bg-slate-700'
                      }`}
                    ></span>
                    <span
                      className={`w-1.5 h-3 rounded-xs ${
                        ev.impact === 'high' ? 'bg-rose-500' : 'bg-slate-700'
                      }`}
                    ></span>
                  </div>
                </td>
                <td className="py-2 px-2 font-medium text-slate-200">{ev.event}</td>
                <td className="py-2 px-2 text-right font-mono font-bold text-white tabular-nums">
                  {ev.actual}
                </td>
                <td className="py-2 px-2 text-right font-mono text-[#787b86] tabular-nums">
                  {ev.forecast}
                </td>
                <td className="py-2 px-2 text-right font-mono text-[#787b86] tabular-nums">
                  {ev.previous}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
