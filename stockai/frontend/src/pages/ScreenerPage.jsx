import React, { useState, useEffect } from 'react';
import {
  Search, Filter, ChevronDown, ChevronUp, Settings, Download,
  TrendingUp, DollarSign, BarChart3, Target, Users, Building,
  Zap, X, Sun, Moon, MessageSquare, BarChart4, Brain,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { Pane, SplitPane } from 'react-split-pane';
import { Transition } from '@headlessui/react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useStockList, useScreenStocks, usePresets, useChatQuery, useExplainMetric, useGenerateSummary, useFullAnalysis } from '../services/convexApi';

// Filter categories and their fields
const FILTER_CATEGORIES = {
  valuation: {
    icon: DollarSign,
    label: 'Valuation',
    fields: {
      market_cap: { label: 'Market Cap', type: 'range', unit: 'currency' },
      pe_ratio: { label: 'P/E Ratio', type: 'range' },
      forward_pe: { label: 'Forward P/E', type: 'range' },
      peg_ratio: { label: 'PEG Ratio', type: 'range' },
      price_to_book: { label: 'Price/Book', type: 'range' },
      price_to_sales: { label: 'Price/Sales', type: 'range' },
      ev_to_ebitda: { label: 'EV/EBITDA', type: 'range' },
      ev_to_revenue: { label: 'EV/Revenue', type: 'range' }
    }
  },
  growth: {
    icon: TrendingUp,
    label: 'Growth',
    fields: {
      revenue_growth: { label: 'Revenue Growth', type: 'range', unit: 'percent' },
      earnings_growth: { label: 'Earnings Growth', type: 'range', unit: 'percent' },
      eps_growth_this_year: { label: 'EPS Growth (This Year)', type: 'range', unit: 'percent' },
      eps_growth_next_year: { label: 'EPS Growth (Next Year)', type: 'range', unit: 'percent' },
      sales_growth: { label: 'Sales Growth', type: 'range', unit: 'percent' }
    }
  },
  profitability: {
    icon: BarChart3,
    label: 'Profitability',
    fields: {
      gross_margin: { label: 'Gross Margin', type: 'range', unit: 'percent' },
      operating_margin: { label: 'Operating Margin', type: 'range', unit: 'percent' },
      profit_margin: { label: 'Net Profit Margin', type: 'range', unit: 'percent' },
      return_on_assets: { label: 'Return on Assets', type: 'range', unit: 'percent' },
      return_on_equity: { label: 'Return on Equity', type: 'range', unit: 'percent' },
      return_on_invested_capital: { label: 'Return on Invested Capital', type: 'range', unit: 'percent' }
    }
  },
  dividend: {
    icon: Target,
    label: 'Dividend',
    fields: {
      dividend_yield: { label: 'Dividend Yield', type: 'range', unit: 'percent' },
      dividend_growth: { label: 'Dividend Growth', type: 'range', unit: 'percent' },
      payout_ratio: { label: 'Payout Ratio', type: 'range', unit: 'percent' }
    }
  },
  liquidity: {
    icon: Users,
    label: 'Balance Sheet',
    fields: {
      current_ratio: { label: 'Current Ratio', type: 'range' },
      quick_ratio: { label: 'Quick Ratio', type: 'range' },
      debt_to_equity: { label: 'Debt/Equity', type: 'range' },
      lt_debt_to_equity: { label: 'LT Debt/Equity', type: 'range' }
    }
  },
  technical: {
    icon: Zap,
    label: 'Technical',
    fields: {
      rsi_14: { label: 'RSI (14)', type: 'range' },
      price_change_1m: { label: '1M Price Change', type: 'range', unit: 'percent' },
      price_change_3m: { label: '3M Price Change', type: 'range', unit: 'percent' },
      price_change_6m: { label: '6M Price Change', type: 'range', unit: 'percent' },
      beta: { label: 'Beta', type: 'range' }
    }
  },
  classification: {
    icon: Building,
    label: 'Classification',
    fields: {
      sector: { label: 'Sector', type: 'select', options: [
        'Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical',
        'Consumer Defensive', 'Industrials', 'Energy', 'Basic Materials',
        'Communication Services', 'Utilities', 'Real Estate'
      ]},
      industry: { label: 'Industry', type: 'select', options: [] }, // Will be populated dynamically
      exchange: { label: 'Exchange', type: 'select', options: ['NYSE', 'NASDAQ', 'AMEX'] }
    }
  }
};

// Preset screeners
const PRESET_SCREENERS = {
  high_growth: {
    name: 'High Growth Stocks',
    description: 'Stocks with strong revenue and earnings growth',
    icon: TrendingUp,
    filters: {
      revenue_growth: { min: 20 },
      earnings_growth: { min: 15 },
      market_cap: { min: 500000000 }
    }
  },
  undervalued: {
    name: 'Undervalued Value',
    description: 'Stocks with low PE ratios and reasonable dividend yields',
    icon: DollarSign,
    filters: {
      pe_ratio: { max: 15 },
      price_to_book: { max: 1.5 },
      dividend_yield: { min: 1 }
    }
  },
  momentum: {
    name: 'Strong Momentum',
    description: 'Stocks with positive price momentum',
    icon: BarChart3,
    filters: {
      price_change_3m: { min: 10 },
      rsi_14: { min: 50, max: 80 }
    }
  },
  dividend_kings: {
    name: 'Dividend Aristocrats',
    description: 'High-quality dividend stocks',
    icon: Target,
    filters: {
      dividend_yield: { min: 2.5 },
      payout_ratio: { max: 75 },
      return_on_equity: { min: 10 }
    }
  },
  small_cap_growth: {
    name: 'Small Cap Growth',
    description: 'High growth small cap stocks',
    icon: Zap,
    filters: {
      market_cap: { min: 300000000, max: 2000000000 },
      revenue_growth: { min: 20 },
      earnings_growth: { min: 15 }
    }
  },
  quality_growth: {
    name: 'Quality Growth',
    description: 'High-quality growth stocks with strong margins',
    icon: Building,
    filters: {
      return_on_equity: { min: 15 },
      gross_margin: { min: 40 },
      revenue_growth: { min: 10 },
      debt_to_equity: { max: 1.0 }
    }
  }
};



const ScreenerPage = ({ isDark, toggleTheme }) => {
  // Layout state
  const [sidebarSize, setSidebarSize] = useState(400);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data state
  const [activeFilters, setActiveFilters] = useState({});
  const [sortColumn, setSortColumn] = useState('marketCap');
  const [sortDirection, setSortDirection] = useState('desc');

  // AI state
  const [selectedStock, setSelectedStock] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('chat');

  // Convex hooks
  const stockData = useStockList({
    limit: 100,
    sortBy: sortColumn,
    sortOrder: sortDirection
  });
  const filteredStocks = useScreenStocks(activeFilters);
  const presets = usePresets();

  // AI actions
  const chatAction = useChatQuery();
  const explainAction = useExplainMetric();
  const summaryAction = useGenerateSummary();
  const analysisAction = useFullAnalysis();

  // Keyboard shortcuts
  useHotkeys('ctrl+k', (e) => {
    e.preventDefault();
    // Focus search input
  });

  useHotkeys('esc', () => {
    setSidebarCollapsed(!sidebarCollapsed);
  });

  // Filter management
  const updateFilter = (fieldKey, value) => {
    const processedValue = value === '' ? undefined : value;
    setActiveFilters(prev => ({
      ...prev,
      [fieldKey]: processedValue
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  // Stock selection
  const selectStock = (stock) => {
    setSelectedStock(stock);
    setSidebarCollapsed(false);
  };

  // AI Chat
  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !selectedStock) return;

    const userMessage = chatMessage;
    setChatMessage('');

    // Add user message to chat
    const newMessage = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, newMessage]);

    try {
      // Call Convex chat action
      const response = await chatAction({
        message: userMessage,
        sessionId: `stock-${selectedStock.symbol}`,
        stockSymbol: selectedStock.symbol
      });

      // Add AI response to chat
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  // AI Actions
  const explainMetric = async (metric) => {
    try {
      const response = await explainAction(metric, selectedStock?.symbol);
      const explanation = {
        id: Date.now(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, explanation]);
    } catch (error) {
      console.error('Explain error:', error);
    }
  };

  const getStockSummary = async () => {
    try {
      const response = await summaryAction(selectedStock.symbol);
      const summary = {
        id: Date.now(),
        role: 'assistant',
        content: response.summary,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, summary]);
    } catch (error) {
      console.error('Summary error:', error);
    }
  };

  // Get display data
  const displayStocks = filteredStocks?.stocks || stockData?.stocks || [];

  const exportToCSV = () => {
    if (displayStocks.length === 0) return;

    const headers = ['Symbol', 'Name', 'Price', 'Change %', 'Market Cap', 'P/E', 'AI Signal'];
    const csvContent = [
      headers.join(','),
      ...displayStocks.map(stock => [
        stock.symbol,
        `"${stock.name}"`,
        stock.price,
        stock.changePercent || 0,
        stock.marketCap,
        stock.peRatio,
        stock.aiSignal || 'Neutral'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock-screener-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-slate-700 bg-slate-800/90' : 'border-slate-200 bg-white/80'} backdrop-blur-md z-20`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Stock Screener</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Found {displayStocks.length} stocks matching your criteria
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                title="Toggle AI Panel (Esc)"
              >
                {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <SplitPane
          split="vertical"
          defaultSize={sidebarCollapsed ? '100%' : `calc(100% - ${sidebarSize}px)`}
          size={sidebarCollapsed ? '100%' : undefined}
          minSize={600}
          maxSize={sidebarCollapsed ? undefined : '90%'}
          onChange={(size) => setSidebarSize(window.innerWidth - size)}
          paneStyle={{ overflow: 'hidden' }}
          resizerStyle={{
            width: '2px',
            background: isDark ? '#374151' : '#e5e7eb',
            cursor: 'col-resize'
          }}
        >
          {/* Main Content */}
          <div className="flex flex-col h-full">
            {/* Inline Filter Bar */}
            <div className={`border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} p-4`}>
              <div className="flex items-center gap-6 overflow-x-auto">
                {Object.entries(FILTER_CATEGORIES).map(([categoryKey, category]) => {
                  const Icon = category.icon;
                  return (
                    <div key={categoryKey} className="flex items-center gap-3 flex-shrink-0">
                      <Icon className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                      <span className="text-sm font-medium whitespace-nowrap">{category.label}:</span>
                      <div className="flex items-center gap-2">
                        {Object.entries(category.fields).map(([fieldKey, field]) => (
                          <input
                            key={fieldKey}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={activeFilters[fieldKey] || ''}
                            onChange={(e) => updateFilter(fieldKey, e.target.value)}
                            className={`w-20 px-2 py-1 text-xs rounded border ${
                              isDark
                                ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400'
                                : 'border-slate-300 bg-white'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 flex-shrink-0"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Screener Table */}
            <div className="flex-1 overflow-auto">
              <div className={`m-4 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`border-b ${isDark ? 'border-slate-700 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                      <tr>
                        {[
                          { key: 'symbol', label: 'Symbol', sortable: true },
                          { key: 'name', label: 'Name', sortable: false },
                          { key: 'price', label: 'Price', sortable: true },
                          { key: 'changePercent', label: 'Change %', sortable: true },
                          { key: 'marketCap', label: 'Market Cap', sortable: true },
                          { key: 'peRatio', label: 'P/E', sortable: true },
                          { key: 'aiSignal', label: 'AI Signal', sortable: false }
                        ].map(col => (
                          <th
                            key={col.key}
                            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 ${
                              isDark ? 'text-slate-300' : 'text-slate-600'
                            } ${col.sortable ? 'select-none' : ''}`}
                            onClick={col.sortable ? () => {
                              if (sortColumn === col.key) {
                                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                              } else {
                                setSortColumn(col.key);
                                setSortDirection('desc');
                              }
                            } : undefined}
                          >
                            <div className="flex items-center gap-1">
                              {col.label}
                              {col.sortable && sortColumn === col.key && (
                                sortDirection === 'asc' ?
                                  <ChevronUp className="w-3 h-3" /> :
                                  <ChevronDown className="w-3 h-3" />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                      {displayStocks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center">
                            <div className="text-slate-500">No stocks found. Try adjusting your filters.</div>
                          </td>
                        </tr>
                      ) : (
                        displayStocks.map(stock => (
                          <tr
                            key={stock.symbol || stock._id}
                            onClick={() => selectStock(stock)}
                            className={`hover:bg-indigo-50/30 transition-colors cursor-pointer ${
                              isDark ? 'hover:bg-slate-700/30' : ''
                            } ${selectedStock?.symbol === stock.symbol ? 'bg-indigo-100/20 dark:bg-indigo-900/20' : ''}`}
                          >
                            <td className="px-4 py-3 font-bold text-indigo-600">{stock.symbol}</td>
                            <td className={`px-4 py-3 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                              {stock.name}
                            </td>
                            <td className={`px-4 py-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              ${stock.price?.toFixed(2)}
                            </td>
                            <td className={`px-4 py-3 ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                            </td>
                            <td className={`px-4 py-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {stock.marketCap ? `$${(stock.marketCap / 1000000000).toFixed(1)}B` : 'N/A'}
                            </td>
                            <td className={`px-4 py-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {stock.peRatio?.toFixed(1) || 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                stock.aiSignal === 'Strong Buy' ? 'bg-green-100 text-green-800' :
                                stock.aiSignal === 'Buy' ? 'bg-blue-100 text-blue-800' :
                                stock.aiSignal === 'Hold' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {stock.aiSignal || 'Neutral'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className={`rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'} overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${isDark ? 'border-slate-700 bg-slate-700' : 'border-slate-200 bg-slate-50'}`}>
                    <tr>
                      {[
                        { key: 'symbol', label: 'Symbol', sortable: true },
                        { key: 'name', label: 'Name', sortable: false },
                        { key: 'price', label: 'Price', sortable: true },
                        { key: 'change_percent', label: 'Change %', sortable: true },
                        { key: 'market_cap', label: 'Market Cap', sortable: true },
                        { key: 'pe_ratio', label: 'P/E', sortable: true },
                        { key: 'ai_signal', label: 'AI Signal', sortable: false }
                      ].map(col => (
                        <th
                          key={col.key}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          } ${col.sortable ? 'cursor-pointer hover:text-indigo-600' : ''}`}
                          onClick={col.sortable ? () => {
                            if (sortColumn === col.key) {
                              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSortColumn(col.key);
                              setSortDirection('desc');
                            }
                          } : undefined}
                        >
                          <div className="flex items-center gap-1">
                            {col.label}
                            {col.sortable && sortColumn === col.key && (
                              sortDirection === 'asc' ?
                                <ChevronUp className="w-3 h-3" /> :
                                <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                            <span className="ml-2">Loading results...</span>
                          </div>
                        </td>
                      </tr>
                    ) : sortedResults.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                          No stocks match your criteria. Try adjusting your filters.
                        </td>
                      </tr>
                    ) : (
                      sortedResults.map(stock => (
                        <tr key={stock.symbol} className={`hover:bg-indigo-50/30 transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-slate-700/30' : ''
                        }`}>
                          <td className="px-4 py-3 font-bold text-indigo-600">{stock.symbol}</td>
                          <td className={`px-4 py-3 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                            {stock.name}
                          </td>
                          <td className={`px-4 py-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            ${stock.price?.toFixed(2)}
                          </td>
                          <td className={`px-4 py-3 ${stock.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent?.toFixed(2)}%
                          </td>
                          <td className={`px-4 py-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {stock.market_cap ? `$${(stock.market_cap / 1000000000).toFixed(1)}B` : 'N/A'}
                          </td>
                          <td className={`px-4 py-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {stock.pe_ratio?.toFixed(1) || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              stock.ai_signal === 'Strong Buy' ? 'bg-green-100 text-green-800' :
                              stock.ai_signal === 'Buy' ? 'bg-blue-100 text-blue-800' :
                              stock.ai_signal === 'Hold' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {stock.ai_signal || 'Neutral'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Preset Bar */}
            <div className={`border-t ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} p-4`}>
              <div className="flex items-center gap-4 overflow-x-auto">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 flex-shrink-0">Presets:</span>
                {presets?.map(preset => {
                  const Icon = TrendingUp; // Default icon
                  return (
                    <button
                      key={preset.name}
                      onClick={() => setActiveFilters(preset.filters)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                        isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* AI Sidebar */}
          <Transition
            show={!sidebarCollapsed}
            enter="transition-transform duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className={`h-full border-l ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} flex flex-col`}>
              {selectedStock ? (
                <>
                  {/* Stock Header */}
                  <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{selectedStock.symbol}</h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{selectedStock.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${selectedStock.price?.toFixed(2)}</div>
                        <div className={`text-sm ${selectedStock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Tabs */}
                  <div className={`border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex">
                      {[
                        { id: 'chat', label: 'Chat', icon: MessageSquare },
                        { id: 'analysis', label: 'Analysis', icon: Brain },
                        { id: 'charts', label: 'Charts', icon: BarChart4 }
                      ].map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveAnalysisTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                              activeAnalysisTab === tab.id
                                ? 'border-indigo-600 text-indigo-600'
                                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-800'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-hidden">
                    {activeAnalysisTab === 'chat' && (
                      <div className="flex flex-col h-full">
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {chatHistory.map(message => (
                            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs px-4 py-2 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-indigo-600 text-white'
                                  : isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-800'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex gap-2 mb-3">
                            <button
                              onClick={() => explainMetric('peRatio')}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Explain P/E
                            </button>
                            <button
                              onClick={getStockSummary}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Summary
                            </button>
                          </div>
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                              placeholder="Ask about this stock..."
                              className={`flex-1 px-3 py-2 text-sm rounded border ${
                                isDark ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white'
                              }`}
                            />
                            <button
                              onClick={sendChatMessage}
                              disabled={!chatMessage.trim()}
                              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeAnalysisTab === 'analysis' && (
                      <div className="p-4">
                        <div className="space-y-4">
                          <div className="text-center py-8">
                            <Brain className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-500">Analysis panel coming soon...</p>
                            <p className="text-xs text-slate-400 mt-2">Will include fundamentals, sentiment, and technical analysis</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeAnalysisTab === 'charts' && (
                      <div className="p-4">
                        <div className="text-center py-8">
                          <BarChart4 className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                          <p className="text-slate-500">Charts panel coming soon...</p>
                          <p className="text-xs text-slate-400 mt-2">Will include price charts and technical indicators</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-500">Select a stock to start analyzing</p>
                    <p className="text-xs text-slate-400 mt-2">Click on any stock in the table</p>
                  </div>
                </div>
              )}
            </div>
          </Transition>
        </SplitPane>
      </div>
    </div>
  );
};

export default ScreenerPage;