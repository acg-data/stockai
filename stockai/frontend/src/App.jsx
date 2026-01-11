import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Search, Bell, User, Layout, Filter, Sparkles,
  Send, ArrowRight, ChevronDown, TrendingUp, Activity, Sun, Moon, ChevronUp
} from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import ConvexWrapper from './components/ConvexWrapper';
import DummyScreener from './pages/DummyScreener';

// Lazy load Convex-dependent pages with error handling
const ScreenerPage = lazy(() => 
  import('./pages/ScreenerPage').catch(() => ({
    default: () => null
  }))
);
const ConvexTest = lazy(() =>
  import('./pages/ConvexTest').catch(() => ({
    default: () => null
  }))
);

// --- MOCK DATA ---
const STOCK_DATA = [
  { t: 'AAPL', n: 'Apple Inc.', m: '3.1T', pe: '28.5', p: '192.52', c: 1.20, s: 'Buy' },
  { t: 'NVDA', n: 'NVIDIA Corp.', m: '2.4T', pe: '65.2', p: '942.30', c: 4.15, s: 'Strong Buy' },
  { t: 'TSLA', n: 'Tesla Inc.', m: '560B', pe: '42.1', p: '175.40', c: -3.45, s: 'Hold' },
  { t: 'MSFT', n: 'Microsoft', m: '3.0T', pe: '35.1', p: '415.10', c: 0.88, s: 'Buy' },
  { t: 'AMZN', n: 'Amazon.com', m: '1.9T', pe: '58.4', p: '185.40', c: 1.10, s: 'Neutral' },
  { t: 'META', n: 'Meta Platforms', m: '1.2T', pe: '32.1', p: '505.40', c: 1.85, s: 'Buy' },
  { t: 'GOOGL', n: 'Alphabet Inc.', m: '1.8T', pe: '24.1', p: '152.10', c: -0.45, s: 'Neutral' },
  { t: 'BRK.B', n: 'Berkshire Hathaway', m: '880B', pe: '12.4', p: '405.20', c: 0.15, s: 'Hold' },
  { t: 'AVGO', n: 'Broadcom Inc.', m: '640B', pe: '45.2', p: '1385.40', c: 2.45, s: 'Strong Buy' },
  { t: 'LLY', n: 'Eli Lilly & Co.', m: '740B', pe: '128.1', p: '782.10', c: -0.30, s: 'Hold' },
  { t: 'JPM', n: 'JP Morgan Chase', m: '560B', pe: '11.4', p: '195.40', c: 0.45, s: 'Buy' },
  { t: 'V', n: 'Visa Inc.', m: '480B', pe: '28.2', p: '275.40', c: 0.12, s: 'Hold' },
  { t: 'UNH', n: 'UnitedHealth', m: '450B', pe: '19.4', p: '492.15', c: 1.45, s: 'Buy' },
  { t: 'MA', n: 'Mastercard', m: '420B', pe: '34.2', p: '455.10', c: -0.20, s: 'Neutral' },
  { t: 'COST', n: 'Costco Wholesale', m: '320B', pe: '48.1', p: '725.40', c: 0.95, s: 'Buy' },
  { t: 'HD', n: 'Home Depot', m: '350B', pe: '22.4', p: '355.20', c: 0.55, s: 'Hold' },
  { t: 'PG', n: 'Procter & Gamble', m: '380B', pe: '26.1', p: '162.40', c: 0.10, s: 'Neutral' },
  { t: 'NFLX', n: 'Netflix Inc.', m: '270B', pe: '35.8', p: '615.20', c: 2.10, s: 'Buy' },
  { t: 'AMD', n: 'Adv. Micro Devices', m: '320B', pe: '210.5', p: '185.20', c: 3.10, s: 'Buy' },
  { t: 'BAC', n: 'Bank of America', m: '280B', pe: '10.2', p: '36.45', c: 0.75, s: 'Neutral' }
];

// --- COMPONENT: HEADER ---
const Header = ({ isDark, toggleTheme, currentPage, setCurrentPage }) => (
  <header className={`h-16 border-b sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8 transition-colors ${
    isDark
      ? 'border-slate-700 bg-slate-800/90 backdrop-blur-md'
      : 'border-slate-200 bg-white/80 backdrop-blur-md'
  }`}>
    <div className="flex items-center gap-10">
      <h1 className={`text-xl font-bold tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
        FINVIZ<span className="text-indigo-600">.</span>
      </h1>
      <nav className="hidden md:flex gap-6 text-[11px] font-bold uppercase tracking-widest">
        {[
          { name: 'Dashboard', page: 'dashboard' },
          { name: 'Screener', page: 'screener' },
          { name: 'Dummy Screener', page: 'dummy-screener' },
          { name: 'Maps', page: 'maps' },
          { name: 'Portfolio', page: 'portfolio' },
          { name: 'Insider', page: 'insider' },
          { name: 'Convex Test', page: 'convex-test' }
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => setCurrentPage(item.page)}
            className={`hover:text-indigo-600 transition-colors ${
              currentPage === item.page
                ? 'text-indigo-600'
                : isDark ? 'text-slate-400' : 'text-slate-400'
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>

    <div className="flex items-center gap-4">
      <div className="relative group hidden sm:block">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-indigo-500 transition-colors ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`} />
        <input
          type="text"
          placeholder="Search tickers..."
          className={`border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none ${
            isDark ? 'bg-slate-700/50 text-white placeholder:text-slate-400' : 'bg-slate-100'
          }`}
        />
      </div>
      <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${
        isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
      }`}>
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      <button className={`p-2 rounded-full transition-colors relative ${
        isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
      }`}>
        <Bell className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
      </button>
      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-200 cursor-pointer hover:scale-105 transition-transform">
        JD
      </div>
    </div>
  </header>
);

// --- COMPONENT: GEMINI SIDEBAR ---
const GeminiSidebar = ({ isDark }) => {
  return (
    <aside className={`w-full lg:w-[380px] backdrop-blur-xl border-l flex flex-col h-full shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] relative overflow-hidden ${
      isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/70 border-slate-200'
    }`}>
      {/* Decorative gradient blob */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -z-10 pointer-events-none ${
        isDark ? 'bg-indigo-900/10' : 'bg-indigo-500/5'
      }`} />

      <div className={`p-6 border-b flex items-center gap-3 ${
        isDark ? 'border-slate-700' : 'border-slate-100'
      }`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Gemini Assistant</h3>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* AI Message Bubble */}
        <div className={`rounded-2xl p-4 border shadow-sm ${
          isDark
            ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 text-slate-200'
            : 'bg-gradient-to-br from-indigo-50 to-white border-indigo-100 text-slate-700'
        }`}>
          <p className="text-xs leading-relaxed font-medium">
            <span className={`font-bold block mb-1 ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>Market Insight:</span>
            Tech stocks are showing unusual volume. I've highlighted 3 tickers with
            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}> RSI &lt; 30 (Oversold)</span>.
            Would you like to see the correlation matrix?
          </p>
        </div>

        {/* Suggested Actions */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400">Smart Screeners</p>
          {[
            { label: '🚀 High Momentum Tech', color: 'hover:border-indigo-400' },
            { label: '💎 Undervalued Dividends', color: 'hover:border-emerald-400' },
            { label: '⚠️ Volatility Alerts', color: 'hover:border-rose-400' }
          ].map((action, idx) => (
            <button
              key={idx}
              className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold hover:shadow-md transition-all flex items-center justify-between group ${
                isDark
                  ? `bg-slate-700/50 border-slate-600 text-slate-200 ${action.color}`
                  : `bg-white border-slate-200 text-slate-700 ${action.color}`
              }`}
            >
              {action.label}
              <ArrowRight className={`w-3.5 h-3.5 group-hover:text-indigo-500 transition-colors ${
                isDark ? 'text-slate-400' : 'text-slate-300'
              }`} />
            </button>
          ))}
        </div>
      </div>

      <div className={`p-6 border-t bg-white/50 ${
        isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-white/50'
      }`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Ask Gemini to filter..."
            className={`w-full rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm ${
              isDark
                ? 'bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400'
                : 'bg-white border-slate-200'
            }`}
          />
          <button className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors shadow-md">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

// --- COMPONENT: DATA TABLE ---
const StockTable = ({ data, sortColumn, sortDirection, onSort, isDark }) => {
  const columns = [
    { key: 't', label: 'Ticker', align: 'left', bg: 'bg-blue-50/20' },
    { key: 'n', label: 'Company', align: 'left', bg: 'bg-indigo-50/20' },
    { key: 'm', label: 'Mkt Cap', align: 'right', bg: 'bg-green-50/20' },
    { key: 'pe', label: 'P/E', align: 'right', bg: 'bg-amber-50/20' },
    { key: 'p', label: 'Price', align: 'right', bg: 'bg-rose-50/20' },
    { key: 'c', label: 'Change', align: 'right', bg: 'bg-violet-50/20' },
    { key: 's', label: 'AI Signal', align: 'center', bg: 'bg-emerald-50/20' }
  ];

  return (
    <div className={`border rounded-2xl shadow-sm overflow-hidden ${
      isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className={`border-b text-[10px] uppercase font-bold tracking-widest ${
            isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-500'
          }`}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors select-none ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                  onClick={() => onSort(col.key)}
                >
                  <div className="flex items-center gap-2 justify-center">
                    {col.align === 'left' && col.label}
                    {col.align === 'right' && (
                      <>
                        {col.label}
                        {sortColumn === col.key && (
                          sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                        )}
                      </>
                    )}
                    {col.align === 'center' && col.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${
            isDark ? 'divide-slate-700' : 'divide-slate-50'
          }`}>
            {data.map((stock, i) => {
              const isPositive = stock.c > 0;
              return (
                <tr key={stock.t} className={`transition-colors cursor-pointer group ${
                  isDark ? 'hover:bg-slate-700/30' : 'hover:bg-indigo-50/30'
                }`}>
                  {columns.map((col, colIndex) => {
                    const isLastColumn = colIndex === columns.length - 1;
                    const cellBg = isDark
                      ? columns[colIndex].bg.replace('/20', '/10').replace('50', '900')
                      : columns[colIndex].bg;

                    let content;
                    switch (col.key) {
                      case 't':
                        content = (
                          <span className={`font-bold ${isDark ? 'text-indigo-400 group-hover:text-indigo-300' : 'text-indigo-600 group-hover:text-indigo-700'}`}>
                            {stock.t}
                          </span>
                        );
                        break;
                      case 'n':
                        content = <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{stock.n}</span>;
                        break;
                      case 'm':
                        content = <span className={`tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stock.m}</span>;
                        break;
                      case 'pe':
                        content = <span className={`tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stock.pe}</span>;
                        break;
                      case 'p':
                        content = <span className={`font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>${stock.p}</span>;
                        break;
                      case 'c':
                        content = (
                          <span className={`inline-flex items-center px-2 py-1 rounded-md font-bold text-[11px] tabular-nums ${
                            isPositive
                              ? (isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                              : (isDark ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-50 text-rose-600')
                          }`}>
                            {isPositive ? '+' : ''}{stock.c}%
                          </span>
                        );
                        break;
                      case 's':
                        content = (
                          <span className={`inline-block text-[10px] font-black tracking-tighter uppercase px-2 py-1 border rounded-md min-w-[80px] ${
                            stock.s === 'Strong Buy'
                              ? (isDark ? 'bg-indigo-900/50 border-indigo-700 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600')
                              : stock.s === 'Buy'
                              ? (isDark ? 'bg-emerald-900/50 border-emerald-700 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600')
                              : (isDark ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500')
                          }`}>
                            {stock.s}
                          </span>
                        );
                        break;
                      default:
                        content = '';
                    }

                    return (
                      <td
                        key={col.key}
                        className={`px-6 py-4 ${cellBg} ${
                          col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- UTILITY FUNCTIONS ---
const parseMarketCap = (cap) => {
  const multiplier = cap.slice(-1);
  const value = parseFloat(cap.slice(0, -1));
  switch (multiplier) {
    case 'T': return value * 1000000000000;
    case 'B': return value * 1000000000;
    case 'M': return value * 1000000;
    default: return parseFloat(cap) || 0;
  }
};

const signalOrder = { 'Strong Buy': 4, 'Buy': 3, 'Neutral': 2, 'Hold': 1 };

// --- MAIN APP COMPONENT ---
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' or 'screener'
  const [filter, setFilter] = useState('All');
  const [sortColumn, setSortColumn] = useState('t');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDark, setIsDark] = useState(false);

  // Theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('stockai-theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('stockai-theme', newTheme ? 'dark' : 'light');
  };

  // Sort logic
  const sortedData = [...STOCK_DATA].sort((a, b) => {
    let aVal, bVal;
    switch (sortColumn) {
      case 't':
        aVal = a.t;
        bVal = b.t;
        break;
      case 'n':
        aVal = a.n;
        bVal = b.n;
        break;
      case 'm':
        aVal = parseMarketCap(a.m);
        bVal = parseMarketCap(b.m);
        break;
      case 'pe':
        aVal = parseFloat(a.pe);
        bVal = parseFloat(b.pe);
        break;
      case 'p':
        aVal = parseFloat(a.p);
        bVal = parseFloat(b.p);
        break;
      case 'c':
        aVal = parseFloat(a.c);
        bVal = parseFloat(b.c);
        break;
      case 's':
        aVal = signalOrder[a.s] || 0;
        bVal = signalOrder[b.s] || 0;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className={`flex flex-col h-screen font-sans overflow-hidden transition-colors ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {currentPage === 'screener' ? (
        <ErrorBoundary
          isDark={isDark}
          message="The Convex-based Screener page could not be loaded. Please try the Screener."
          fallback={() => (
            <div className={`h-full flex items-center justify-center ${
              isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
            }`}>
              <div className={`max-w-md p-8 rounded-2xl shadow-xl text-center ${
                isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
              }`}>
                <h2 className="text-2xl font-bold mb-2">Screener Unavailable</h2>
                <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  The Convex backend is not connected. Please use the Screener instead.
                </p>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        >
          <Suspense fallback={
            <div className={`h-full flex items-center justify-center ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading Screener...</p>
              </div>
            </div>
          }>
            <ScreenerPage isDark={isDark} toggleTheme={toggleTheme} />
          </Suspense>
        </ErrorBoundary>
      ) : currentPage === 'dummy-screener' ? (
        <ErrorBoundary
          isDark={isDark}
          message="The Dummy Screener encountered an error. Please try refreshing."
        >
          <DummyScreener isDark={isDark} toggleTheme={toggleTheme} />
        </ErrorBoundary>
      ) : currentPage === 'convex-test' ? (
        <ErrorBoundary
          isDark={isDark}
          message="The Convex Test page could not be loaded."
        >
          <Suspense fallback={
            <div className={`h-full flex items-center justify-center ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading...</p>
              </div>
            </div>
          }>
            <ConvexTest />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 lg:px-8 py-8 shrink-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className={`text-3xl font-extrabold tracking-tight flex items-center gap-3 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Market Screener
                  <span className={`text-xs px-2 py-1 rounded-full font-bold self-center ${
                    isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                  }`}>Live</span>
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Found 10,791 stocks matching your criteria.
                </p>
              </div>
              <div className="flex gap-2">
                <button className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:border-slate-300 transition-all shadow-sm ${
                  isDark
                    ? 'bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}>
                  <Layout className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} /> Presets
                </button>
                <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:translate-y-[-1px] transition-all">
                  Export Data
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {['Index: S&P 500', 'Sector: Technology', 'P/E: < 25', 'Volume: > 1M'].map((f) => (
                <button className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shrink-0 hover:border-indigo-400 hover:text-indigo-600 transition-colors ${
                  isDark
                    ? 'bg-slate-700/50 border-slate-600 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  {f} <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              ))}
              <button className={`text-xs font-bold hover:underline px-2 transition-colors ${
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                + Add Filter
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto px-6 lg:px-8 pb-8 custom-scrollbar">
            <StockTable
              data={sortedData}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              isDark={isDark}
            />
          </div>
        </main>

        {/* Right Sidebar */}
        <GeminiSidebar isDark={isDark} />
      </div>
      )}
    </div>
  );
};

const AppWithBoundary = () => (
  <ErrorBoundary
    message="The application encountered an unexpected error. Please refresh the page."
  >
    <App />
  </ErrorBoundary>
);

export default AppWithBoundary;