import { useState, useEffect, useCallback } from 'react';
import { Layout, RefreshCw, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { StockTable } from '../components/StockTable';
import { FilterChips } from '../components/FilterChips';
import { AISidebar } from '../components/AISidebar';
import { massiveApi } from '../services/massiveApi';
import { api } from '../services/api';
import type { Stock, FilterChip } from '../types';

const MOCK_STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 192.52, change: 2.30, change_percent: 1.20, market_cap: 3.1e12, pe_ratio: 28.5, volume: 52340000, sector: 'Technology', industry: 'Consumer Electronics', ai_signal: 'Buy' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 942.30, change: 38.70, change_percent: 4.28, market_cap: 2.4e12, pe_ratio: 65.2, volume: 41200000, sector: 'Technology', industry: 'Semiconductors', ai_signal: 'Strong Buy' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 175.40, change: -6.30, change_percent: -3.45, market_cap: 560e9, pe_ratio: 42.1, volume: 87500000, sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', ai_signal: 'Hold' },
  { symbol: 'MSFT', name: 'Microsoft', price: 415.10, change: 3.60, change_percent: 0.88, market_cap: 3.0e12, pe_ratio: 35.1, volume: 15600000, sector: 'Technology', industry: 'Software', ai_signal: 'Buy' },
  { symbol: 'AMZN', name: 'Amazon.com', price: 185.40, change: 2.00, change_percent: 1.09, market_cap: 1.9e12, pe_ratio: 58.4, volume: 28400000, sector: 'Consumer Cyclical', industry: 'Internet Retail', ai_signal: 'Neutral' },
  { symbol: 'META', name: 'Meta Platforms', price: 505.40, change: 9.20, change_percent: 1.85, market_cap: 1.2e12, pe_ratio: 32.1, volume: 11200000, sector: 'Communication Services', industry: 'Internet Content', ai_signal: 'Buy' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 152.10, change: -0.70, change_percent: -0.46, market_cap: 1.8e12, pe_ratio: 24.1, volume: 18400000, sector: 'Communication Services', industry: 'Internet', ai_signal: 'Neutral' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 405.20, change: 0.60, change_percent: 0.15, market_cap: 880e9, pe_ratio: 12.4, volume: 3200000, sector: 'Financial', industry: 'Insurance', ai_signal: 'Hold' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', price: 1385.40, change: 33.20, change_percent: 2.45, market_cap: 640e9, pe_ratio: 45.2, volume: 2100000, sector: 'Technology', industry: 'Semiconductors', ai_signal: 'Strong Buy' },
  { symbol: 'LLY', name: 'Eli Lilly & Co.', price: 782.10, change: -2.30, change_percent: -0.29, market_cap: 740e9, pe_ratio: 128.1, volume: 3400000, sector: 'Healthcare', industry: 'Drug Manufacturers', ai_signal: 'Hold' },
  { symbol: 'JPM', name: 'JP Morgan Chase', price: 195.40, change: 0.88, change_percent: 0.45, market_cap: 560e9, pe_ratio: 11.4, volume: 8900000, sector: 'Financial', industry: 'Banks', ai_signal: 'Buy' },
  { symbol: 'V', name: 'Visa Inc.', price: 275.40, change: 0.33, change_percent: 0.12, market_cap: 480e9, pe_ratio: 28.2, volume: 5600000, sector: 'Financial', industry: 'Credit Services', ai_signal: 'Hold' },
  { symbol: 'UNH', name: 'UnitedHealth', price: 492.15, change: 7.05, change_percent: 1.45, market_cap: 450e9, pe_ratio: 19.4, volume: 3200000, sector: 'Healthcare', industry: 'Healthcare Plans', ai_signal: 'Buy' },
  { symbol: 'MA', name: 'Mastercard', price: 455.10, change: -0.90, change_percent: -0.20, market_cap: 420e9, pe_ratio: 34.2, volume: 2300000, sector: 'Financial', industry: 'Credit Services', ai_signal: 'Neutral' },
  { symbol: 'COST', name: 'Costco Wholesale', price: 725.40, change: 6.80, change_percent: 0.95, market_cap: 320e9, pe_ratio: 48.1, volume: 1800000, sector: 'Consumer Defensive', industry: 'Discount Stores', ai_signal: 'Buy' },
  { symbol: 'HD', name: 'Home Depot', price: 355.20, change: 1.95, change_percent: 0.55, market_cap: 350e9, pe_ratio: 22.4, volume: 3800000, sector: 'Consumer Cyclical', industry: 'Home Improvement Retail', ai_signal: 'Hold' },
  { symbol: 'PG', name: 'Procter & Gamble', price: 162.40, change: 0.16, change_percent: 0.10, market_cap: 380e9, pe_ratio: 26.1, volume: 4500000, sector: 'Consumer Defensive', industry: 'Household & Personal Products', ai_signal: 'Neutral' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 615.20, change: 12.60, change_percent: 2.09, market_cap: 270e9, pe_ratio: 35.8, volume: 5600000, sector: 'Communication Services', industry: 'Entertainment', ai_signal: 'Buy' },
  { symbol: 'AMD', name: 'Adv. Micro Devices', price: 185.20, change: 5.55, change_percent: 3.09, market_cap: 320e9, pe_ratio: 210.5, volume: 47000000, sector: 'Technology', industry: 'Semiconductors', ai_signal: 'Buy' },
  { symbol: 'BAC', name: 'Bank of America', price: 36.45, change: 0.27, change_percent: 0.75, market_cap: 280e9, pe_ratio: 10.2, volume: 45000000, sector: 'Financial', industry: 'Banks', ai_signal: 'Neutral' },
];

const filterMockStocks = (mockStocks: Stock[], filters: FilterChip[]): Stock[] => {
  const sectorFilter = filters.find((f) => f.label === 'Sector')?.selected;
  const peFilter = filters.find((f) => f.label === 'P/E')?.selected;
  const priceFilter = filters.find((f) => f.label === 'Price')?.selected;

  return mockStocks.filter((stock) => {
    if (sectorFilter && sectorFilter !== 'Any' && stock.sector !== sectorFilter) return false;

    if (peFilter && peFilter !== 'Any') {
      const pe = stock.pe_ratio || 0;
      if (peFilter === 'Under 15' && pe >= 15) return false;
      if (peFilter === '15-30' && (pe < 15 || pe > 30)) return false;
      if (peFilter === 'Over 30' && pe <= 30) return false;
    }

    if (priceFilter && priceFilter !== 'Any') {
      const price = stock.price || 0;
      if (priceFilter === 'Under $10' && price >= 10) return false;
      if (priceFilter === '$10-$50' && (price < 10 || price > 50)) return false;
      if (priceFilter === 'Over $50' && price <= 50) return false;
    }

    return true;
  });
};

export function Dashboard() {
  const [tab, setTab] = useState<'screener' | 'maps' | 'portfolio' | 'insider'>('screener');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  const [filters, setFilters] = useState<FilterChip[]>([
    { label: 'Index', value: 'S&P 500', options: ['S&P 500', 'NASDAQ', 'DOW', 'Russell 2000'], selected: 'S&P 500' },
    { label: 'Sector', value: 'Technology', options: ['Technology', 'Healthcare', 'Financial', 'Energy', 'Consumer'], selected: 'Technology' },
    { label: 'P/E', value: 'Any', options: ['Any', 'Under 15', '15-30', 'Over 30'], selected: 'Any' },
    { label: 'Price', value: 'Over $50', options: ['Any', 'Under $10', '$10-$50', 'Over $50'], selected: 'Over $50' },
  ]);

  const [insights, setInsights] = useState<Array<{ text: string; timestamp?: Date }>>([
    {
      text: 'Tech stocks are showing unusual volume. I\'ve highlighted 3 tickers with RSI < 30 (Oversold). Would you like to see the correlation matrix?',
      timestamp: new Date(),
    },
  ]);

  const [actions] = useState([
    { id: 'high-momentum', icon: '🚀', label: 'High Momentum Tech' },
    { id: 'dividend-plays', icon: '💎', label: 'Undervalued Dividends' },
    { id: 'volatility', icon: '⚠️', label: 'Volatility Alerts' },
  ]);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (useMockData) {
      const filteredMocks = filterMockStocks(MOCK_STOCKS, filters);
      const startIndex = (page - 1) * 20;
      const paginatedStocks = filteredMocks.slice(startIndex, startIndex + 20);
      setStocks(paginatedStocks);
      setTotal(filteredMocks.length);
      setLoading(false);
      return;
    }

    try {
      const sectorFilter = filters.find(f => f.label === 'Sector')?.selected;
      const peFilter = filters.find(f => f.label === 'P/E')?.selected;

      let peRange: [number, number] | undefined;
      if (peFilter === 'Under 15') peRange = [0, 15];
      else if (peFilter === '15-30') peRange = [15, 30];
      else if (peFilter === 'Over 30') peRange = [30, 999];

      const response = await massiveApi.getStocks({
        page,
        pageSize: 20,
        sector: sectorFilter === 'Any' ? undefined : sectorFilter,
        peRange,
      });

      const transformedStocks: Stock[] = response.data.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        change_percent: stock.change_percent,
        market_cap: stock.market_cap,
        pe_ratio: stock.pe_ratio,
        volume: stock.volume,
        sector: stock.sector,
        industry: stock.industry,
        ai_signal: stock.change_percent > 3 ? 'Strong Buy' : stock.change_percent > 1 ? 'Buy' : stock.change_percent > 0 ? 'Hold' : 'Neutral',
      }));

      setStocks(transformedStocks);
      setTotal(response.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load stock data';
      setError(errorMsg);
      setUseMockData(true);
      const filteredMocks = filterMockStocks(MOCK_STOCKS, filters);
      const startIndex = (page - 1) * 20;
      const paginatedStocks = filteredMocks.slice(startIndex, startIndex + 20);
      setStocks(paginatedStocks);
      setTotal(filteredMocks.length);
    } finally {
      setLoading(false);
    }
  }, [page, filters, useMockData]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  const handleFilterChange = (label: string, value: string) => {
    setFilters(prev =>
      prev.map(f => (f.label === label ? { ...f, selected: value } : f))
    );
    setPage(1);
  };

  const handlePromptSubmit = async (prompt: string) => {
    try {
      const response = await api.screener.naturalLanguage(prompt);
      const transformedStocks: Stock[] = response.results.map((stock: Stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        change_percent: stock.change_percent,
        market_cap: stock.market_cap,
        pe_ratio: stock.pe_ratio,
        ai_signal: stock.change_percent > 3 ? 'Strong Buy' : stock.change_percent > 1 ? 'Buy' : 'Hold',
      }));

      setStocks(transformedStocks);
      setTotal(response.results.length);

      if (response.interpretation) {
        setInsights(prev => [
          ...prev,
          {
            text: `Applied filter: ${response.interpretation}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('AI prompt error:', error);
    }
  };

  const handleActionClick = async (actionId: string) => {
    let query = '';
    switch (actionId) {
      case 'high-momentum':
        query = 'High momentum technology stocks with strong recent performance';
        break;
      case 'dividend-plays':
        query = 'Value dividend stocks with low P/E ratio and good yield';
        break;
      case 'volatility':
        query = 'Stocks with high volatility and large price swings';
        break;
    }
    await handlePromptSubmit(query);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Header currentTab={tab} onTabChange={setTab} />

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="px-6 lg:px-8 py-8 shrink-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  Market Screener
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold self-center">Live</span>
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Real-time data for {total > 0 ? `${total.toLocaleString()}` : 'searching...'} stocks found.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                  <Layout className="w-4 h-4 text-slate-500" /> Presets
                </button>
                <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:translate-y-[-1px] transition-all">
                  Export Data
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">API unavailable - using demo data</p>
                    <p className="text-xs text-amber-600 mt-0.5">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setUseMockData(false); setError(null); fetchStocks(); }}
                  className="flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors bg-white border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-100"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}

            <FilterChips filters={filters} onFilterChange={handleFilterChange} />
          </div>

          <div className="flex-1 overflow-auto px-6 lg:px-8 pb-8 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
              </div>
            ) : stocks.length > 0 ? (
              <>
                <StockTable stocks={stocks} />

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-slate-600">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500">No stocks found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>

        <AISidebar
          onPromptSubmit={handlePromptSubmit}
          insights={insights}
          actions={actions}
          onActionClick={handleActionClick}
        />
      </div>
    </div>
  );
}