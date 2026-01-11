import type { Stock } from '../types';

interface StockTableProps {
  stocks: Stock[];
  onStockClick?: (symbol: string) => void;
}

export function StockTable({ stocks, onStockClick }: StockTableProps) {
  const formatMarketCap = (value?: number): string => {
    if (!value) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold tracking-widest text-slate-500">
            <tr>
              <th className="px-6 py-4">Ticker</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4 text-right">Market Cap</th>
              <th className="px-6 py-4 text-right">P/E</th>
              <th className="px-6 py-4 text-right">Price</th>
              <th className="px-6 py-4 text-right">Change</th>
              <th className="px-6 py-4 text-center">AI Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {stocks.map((stock) => {
              const isPositive = stock.change >= 0;
              const signal = stock.ai_signal as 'Strong Buy' | 'Buy' | 'Hold' | 'Neutral' | 'Sell' | undefined;
              return (
                <tr
                  key={stock.symbol}
                  className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                  onClick={() => onStockClick?.(stock.symbol)}
                >
                  <td className="px-6 py-4 font-bold text-indigo-600 group-hover:text-indigo-700">{stock.symbol}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{stock.name}</td>
                  <td className="px-6 py-4 text-right tabular-nums text-slate-500">{formatMarketCap(stock.market_cap)}</td>
                  <td className="px-6 py-4 text-right tabular-nums text-slate-500">{stock.pe_ratio?.toFixed(1) || 'N/A'}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 tabular-nums">${stock.price?.toFixed(2) || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md font-bold text-[11px] tabular-nums ${
                      isPositive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      {isPositive ? '+' : ''}{stock.change_percent?.toFixed(2) || '0.00'}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {signal ? (
                      <span className={`inline-block text-[10px] font-black tracking-tighter uppercase px-2 py-1 border rounded-md min-w-[80px] ${
                        signal === 'Strong Buy' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' :
                        signal === 'Buy' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                        signal === 'Hold' || signal === 'Neutral' ? 'bg-slate-50 border-slate-200 text-slate-500' :
                        'bg-rose-50 border-rose-200 text-rose-600'
                      }`}>
                        {signal}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-300">--</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}