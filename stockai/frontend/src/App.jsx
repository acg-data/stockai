import React, { useState } from 'react';
import {
  Search, Bell, User, Layout, Filter, Sparkles,
  Send, ArrowRight, ChevronDown, TrendingUp, Activity
} from 'lucide-react';

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
const Header = () => (
  <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8">
    <div className="flex items-center gap-10">
      <h1 className="text-xl font-bold tracking-tighter text-slate-900">
        FINVIZ<span className="text-indigo-600">.</span>
      </h1>
      <nav className="hidden md:flex gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {['Screener', 'Maps', 'Portfolio', 'Insider'].map((item) => (
          <a key={item} href="#" className="hover:text-indigo-600 transition-colors">{item}</a>
        ))}
      </nav>
    </div>

    <div className="flex items-center gap-4">
      <div className="relative group hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Search tickers..."
          className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
        />
      </div>
      <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
        <Bell className="w-5 h-5 text-slate-600" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
      </button>
      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-200 cursor-pointer hover:scale-105 transition-transform">
        JD
      </div>
    </div>
  </header>
);

// --- COMPONENT: GEMINI SIDEBAR ---
const GeminiSidebar = () => {
  return (
    <aside className="w-full lg:w-[380px] bg-white/70 backdrop-blur-xl border-l border-slate-200 flex flex-col h-full shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Gemini Assistant</h3>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* AI Message Bubble */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-4 border border-indigo-100 shadow-sm">
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            <span className="font-bold text-indigo-700 block mb-1">Market Insight:</span>
            Tech stocks are showing unusual volume. I've highlighted 3 tickers with
            <span className="font-bold text-slate-900"> RSI &lt; 30 (Oversold)</span>.
            Would you like to see the correlation matrix?
          </p>
        </div>

        {/* Suggested Actions */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Smart Screeners</p>
          {[
            { label: '🚀 High Momentum Tech', color: 'hover:border-indigo-400' },
            { label: '💎 Undervalued Dividends', color: 'hover:border-emerald-400' },
            { label: '⚠️ Volatility Alerts', color: 'hover:border-rose-400' }
          ].map((action, idx) => (
            <button
              key={idx}
              className={`w-full text-left p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold ${action.color} hover:shadow-md transition-all flex items-center justify-between group`}
            >
              {action.label}
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-white/50">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask Gemini to filter..."
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
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
const StockTable = ({ data }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold tracking-widest text-slate-500">
            <tr>
              <th className="px-6 py-4">Ticker</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4 text-right">Mkt Cap</th>
              <th className="px-6 py-4 text-right">P/E</th>
              <th className="px-6 py-4 text-right">Price</th>
              <th className="px-6 py-4 text-right">Change</th>
              <th className="px-6 py-4 text-center">AI Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {data.map((stock, i) => {
              const isPositive = stock.c > 0;
              return (
                <tr key={stock.t} className="hover:bg-indigo-50/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-bold text-indigo-600 group-hover:text-indigo-700">{stock.t}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{stock.n}</td>
                  <td className="px-6 py-4 text-right tabular-nums text-slate-500">{stock.m}</td>
                  <td className="px-6 py-4 text-right tabular-nums text-slate-500">{stock.pe}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 tabular-nums">${stock.p}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md font-bold text-[11px] tabular-nums ${
                      isPositive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      {isPositive ? '+' : ''}{stock.c}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block text-[10px] font-black tracking-tighter uppercase px-2 py-1 border rounded-md min-w-[80px] ${
                      stock.s === 'Strong Buy' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' :
                      stock.s === 'Buy' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                      'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      {stock.s}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [filter, setFilter] = useState('All');

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 lg:px-8 py-8 shrink-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  Market Screener
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold self-center">Live</span>
                </h2>
                <p className="text-slate-500 text-sm mt-1">Found 10,791 stocks matching your criteria.</p>
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

            {/* Filter Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {['Index: S&P 500', 'Sector: Technology', 'P/E: < 25', 'Volume: > 1M'].map((f) => (
                <button key={f} className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 text-slate-600 shrink-0 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                  {f} <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              ))}
              <button className="text-xs font-bold text-indigo-600 hover:underline px-2">
                + Add Filter
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto px-6 lg:px-8 pb-8 custom-scrollbar">
            <StockTable data={STOCK_DATA} />
          </div>
        </main>

        {/* Right Sidebar */}
        <GeminiSidebar />
      </div>
    </div>
  );
};

export default App;