import { useState } from 'react';
import { NaturalLanguageScreener, StockList } from '../components';
import type { Stock } from '../types';

export function ScreenerPage() {
  const [results, setResults] = useState<Stock[]>([]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Stock Screener</h1>
          <p className="text-slate-500">
            Describe what you're looking for in plain English, and let AI find the perfect stocks.
          </p>
        </div>

        <NaturalLanguageScreener onResults={setResults} />

        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Results ({results.length} stocks found)
            </h2>
            <StockList stocks={results} />
          </div>
        )}
      </div>
    </div>
  );
}
