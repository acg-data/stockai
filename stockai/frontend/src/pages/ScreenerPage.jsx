import React, { useState, useEffect } from 'react';
import {
  Search, Filter, ChevronDown, ChevronUp, Settings, Download,
  TrendingUp, DollarSign, BarChart3, Target, Users, Building,
  Zap, X
} from 'lucide-react';
import { massiveApi } from '../services/massiveApi';

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

const ScreenerPage = () => {
  const [activeCategory, setActiveCategory] = useState('valuation');
  const [activeFilters, setActiveFilters] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState('market_cap');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isDark, setIsDark] = useState(false);

  // Load results on mount
  useEffect(() => {
    loadInitialResults();
  }, []);

  const loadInitialResults = async () => {
    setLoading(true);
    try {
      const response = await massiveApi.getStocks({ page: 1, page_size: 50 });
      setResults(response.data || []);
    } catch (error) {
      console.error('Error loading initial results:', error);
      setResults([]);
    }
    setLoading(false);
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      // Convert frontend filter format to backend format
      const backendFilters = {};
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value && typeof value === 'object') {
          backendFilters[key] = value;
        } else if (value) {
          backendFilters[key] = { equals: value };
        }
      });

      const response = await massiveApi.screenStocks(backendFilters);
      setResults(response.data || []);
    } catch (error) {
      console.error('Error applying filters:', error);
      setResults([]);
    }
    setLoading(false);
  };

  const applyPreset = async (presetKey) => {
    const preset = PRESET_SCREENERS[presetKey];
    setActiveFilters(preset.filters);
    await applyFilters();
  };

  const updateFilter = (fieldKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const removeFilter = (fieldKey) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[fieldKey];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const sortedResults = [...results].sort((a, b) => {
    const aVal = a[sortColumn] || 0;
    const bVal = b[sortColumn] || 0;
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const exportToCSV = () => {
    if (results.length === 0) return;

    const headers = ['Symbol', 'Name', 'Price', 'Change %', 'Market Cap', 'P/E', 'AI Signal'];
    const csvContent = [
      headers.join(','),
      ...results.map(stock => [
        stock.symbol,
        `"${stock.name}"`,
        stock.price,
        stock.change_percent,
        stock.market_cap,
        stock.pe_ratio,
        stock.ai_signal || 'Neutral'
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
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-slate-700 bg-slate-800/90' : 'border-slate-200 bg-white/80'} backdrop-blur-md sticky top-0 z-20`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Stock Screener</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Found {results.length} stocks matching your criteria
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Filter Sidebar */}
          <div className="col-span-3">
            <div className={`rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'} p-6 sticky top-24`}>
              {/* Category Tabs */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Filter Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(FILTER_CATEGORIES).map(([key, category]) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${
                          activeCategory === key
                            ? 'bg-indigo-100 text-indigo-700'
                            : isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Filters */}
              {Object.keys(activeFilters).length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Active Filters</h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(activeFilters).map(([key, value]) => (
                      <div key={key} className={`flex items-center justify-between p-2 rounded-lg ${
                        isDark ? 'bg-slate-700' : 'bg-slate-100'
                      }`}>
                        <span className="text-xs font-medium">{key.replace(/_/g, ' ')}</span>
                        <button
                          onClick={() => removeFilter(key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset Screeners */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Preset Screeners</h3>
                <div className="space-y-2">
                  {Object.entries(PRESET_SCREENERS).map(([key, preset]) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => applyPreset(key)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium">{preset.name}</span>
                        </div>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={applyFilters}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Applying...' : 'Apply Filters'}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {/* Filter Controls for Active Category */}
            <div className={`rounded-xl border ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'} p-6 mb-6`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {React.createElement(FILTER_CATEGORIES[activeCategory].icon, { className: "w-5 h-5" })}
                {FILTER_CATEGORIES[activeCategory].label} Filters
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(FILTER_CATEGORIES[activeCategory].fields).map(([fieldKey, fieldConfig]) => (
                  <div key={fieldKey} className="space-y-2">
                    <label className="text-sm font-medium">{fieldConfig.label}</label>

                    {fieldConfig.type === 'range' ? (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={activeFilters[fieldKey]?.min || ''}
                          onChange={(e) => updateFilter(fieldKey, {
                            ...activeFilters[fieldKey],
                            min: e.target.value ? parseFloat(e.target.value) : undefined
                          })}
                          className={`flex-1 px-3 py-2 text-sm rounded border ${
                            isDark ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white'
                          }`}
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={activeFilters[fieldKey]?.max || ''}
                          onChange={(e) => updateFilter(fieldKey, {
                            ...activeFilters[fieldKey],
                            max: e.target.value ? parseFloat(e.target.value) : undefined
                          })}
                          className={`flex-1 px-3 py-2 text-sm rounded border ${
                            isDark ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white'
                          }`}
                        />
                      </div>
                    ) : fieldConfig.type === 'select' ? (
                      <select
                        value={activeFilters[fieldKey] || ''}
                        onChange={(e) => updateFilter(fieldKey, e.target.value || undefined)}
                        className={`w-full px-3 py-2 text-sm rounded border ${
                          isDark ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        <option value="">All</option>
                        {fieldConfig.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                ))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenerPage;