import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  currentTab: 'screener' | 'maps' | 'portfolio' | 'insider';
  onTabChange: (tab: 'screener' | 'maps' | 'portfolio' | 'insider') => void;
}

export function Header({ currentTab, onTabChange }: HeaderProps) {
  const tabs = [
    { id: 'screener' as const, label: 'Screener' },
    { id: 'maps' as const, label: 'Maps' },
    { id: 'portfolio' as const, label: 'Portfolio' },
    { id: 'insider' as const, label: 'Insider' },
  ];

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-10">
        <h1 className="text-xl font-bold tracking-tighter text-slate-900">
          FINVIZ<span className="text-indigo-600">.</span>
        </h1>
        <nav className="hidden md:flex gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`hover:text-indigo-600 transition-colors ${
                currentTab === tab.id ? 'text-indigo-600' : ''
              }`}
            >
              {tab.label}
            </button>
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
          JA
        </div>
      </div>
    </header>
  );
}