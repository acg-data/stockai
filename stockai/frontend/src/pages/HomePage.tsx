import { useEffect, useState } from 'react';
import { StockList } from '../components';
import { api } from '../services/api';
import type { Stock } from '../types';
import { TrendingUp, Loader2, Sparkles } from 'lucide-react';

export function HomePage() {
  const [trending, setTrending] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await api.stocks.getTrending();
        setTrending(data);
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">AI-Powered Stock Intelligence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Your Intelligent
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"> Stock Assistant</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Research stocks, screen opportunities, and get AI-powered insights—all in one platform.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Trending Stocks
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <StockList stocks={trending} />
          )}
        </div>
      </div>
    </div>
  );
}
