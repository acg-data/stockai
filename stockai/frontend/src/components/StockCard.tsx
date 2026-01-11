import type { Stock } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockCardProps {
  stock: Stock;
  onClick?: () => void;
}

export function StockCard({ stock, onClick }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{stock.symbol}</h3>
          <p className="text-sm text-slate-500 truncate max-w-[120px]">{stock.name}</p>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">{stock.change_percent.toFixed(2)}%</span>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900">${stock.price?.toFixed(2) || 'N/A'}</p>
        {stock.market_cap && (
          <p className="text-xs text-slate-400 mt-1">
            MCap: ${(stock.market_cap / 1e9).toFixed(2)}B
          </p>
        )}
      </div>
    </div>
  );
}

interface StockListProps {
  stocks: Stock[];
  onStockClick?: (symbol: string) => void;
}

export function StockList({ stocks, onStockClick }: StockListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stocks.map((stock) => (
        <StockCard
          key={stock.symbol}
          stock={stock}
          onClick={() => onStockClick?.(stock.symbol)}
        />
      ))}
    </div>
  );
}
