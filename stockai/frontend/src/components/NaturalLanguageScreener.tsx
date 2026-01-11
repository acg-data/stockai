import { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import type { Stock } from '../types';

interface NaturalLanguageScreenerProps {
  onResults: (results: Stock[]) => void;
}

export function NaturalLanguageScreener({ onResults }: NaturalLanguageScreenerProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const result = await api.screener.naturalLanguage(query);
      setInterpretation(result.interpretation);
      onResults(result.results);
    } catch (error) {
      console.error('Screener error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    'Small tech stocks under $50 with high growth',
    'Dividend stocks with PE under 15',
    'High momentum stocks above 200-day SMA',
    'Undervalued healthcare companies',
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        AI-Powered Screener
      </h2>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Describe stocks in plain English..."
            className="ai-input w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Analyze
        </button>
      </div>

      {interpretation && (
        <div className="bg-indigo-50 rounded-xl p-3 mb-4 border border-indigo-100">
          <p className="text-sm text-slate-700">
            <span className="text-indigo-700 font-medium">AI Interpretation:</span> {interpretation}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500">Try:</span>
        {exampleQueries.map((eq) => (
          <button
            key={eq}
            onClick={() => {
              setQuery(eq);
              setTimeout(handleSearch, 0);
            }}
            className="text-xs bg-white border border-slate-200 hover:border-indigo-400 text-slate-600 px-2 py-1 rounded-full transition-colors"
          >
            {eq}
          </button>
        ))}
      </div>
    </div>
  );
}
