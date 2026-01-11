import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, ChevronDown, ChevronUp, Download, ChevronRight,
  TrendingUp, DollarSign, BarChart3, Target, Zap, Building, Filter,
  Sun, Moon, MessageSquare, BarChart4, Brain,
  PanelLeftClose, PanelLeftOpen, Send
} from 'lucide-react';
import { Transition } from '@headlessui/react';

// Generate 100 dummy stocks
const DUMMY_STOCKS = Array.from({ length: 100 }, (_, i) => {
  const sectors = ['Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical',
    'Consumer Defensive', 'Industrials', 'Energy', 'Basic Materials', 'Communication Services'];
  const prefix = ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'JPM', 'V', 'MA',
    'KO', 'PEP', 'WMT', 'COST', 'HD', 'PG', 'JNJ', 'UNH', 'PFE', 'MRK', 'ABBV', 'BDX',
    'TMO', 'LLY', 'AVGO', 'CSCO', 'ADBE', 'CRM', 'ORCL', 'ACN', 'NFLX', 'AMD', 'INTC',
    'QCOM', 'TXN', 'IBM', 'MU', 'NOW', 'SNOW', 'PLTR', 'UI', 'DDOG', 'NET', 'ZS', 'COUP',
    'AYX', 'TEAM', 'DOCU', 'SQ', 'PYPL', 'SHOP', 'SPOT', 'TWTR', 'SNAP', 'ROKU', 'ZM',
    'ABNB', 'UBER', 'LYFT', 'DOORDASH', 'RBLX', 'COIN'];
  const symbol = prefix[i % prefix.length] + (i > 59 ? i : '');
  const basePrice = 10 + Math.random() * 990;
  const change = (Math.random() - 0.5) * 20;
  
  return {
    symbol,
    name: `${symbol} Corp`,
    price: parseFloat(basePrice.toFixed(2)),
    changePercent: parseFloat(change.toFixed(2)),
    marketCap: Math.floor((1 + Math.random() * 1000) * 1000000000),
    peRatio: parseFloat((5 + Math.random() * 95).toFixed(1)),
    pegRatio: parseFloat((0.5 + Math.random() * 4.5).toFixed(2)),
    priceToBook: parseFloat((0.5 + Math.random() * 15).toFixed(2)),
    debtToEquity: parseFloat((0 + Math.random() * 3).toFixed(2)),
    returnOnEquity: parseFloat((-10 + Math.random() * 40).toFixed(1)),
    revenueGrowth: parseFloat((-20 + Math.random() * 60).toFixed(1)),
    earningsGrowth: parseFloat((-30 + Math.random() * 80).toFixed(1)),
    dividendYield: parseFloat((0 + Math.random() * 8).toFixed(2)),
    rsi14: Math.floor(10 + Math.random() * 80),
    sector: sectors[i % sectors.length],
    aiSignal: change > 2 ? 'Strong Buy' : change > 0 ? 'Buy' : change > -2 ? 'Hold' : 'Sell'
  };
});

// Filter categories
const FILTER_CATEGORIES = {
  valuation: {
    icon: DollarSign,
    label: 'Valuation',
    fields: [
      { key: 'minPE', label: 'Min P/E', placeholder: 'Min P/E', type: 'number' },
      { key: 'maxPE', label: 'Max P/E', placeholder: 'Max P/E', type: 'number' }
    ]
  },
  growth: {
    icon: TrendingUp,
    label: 'Growth',
    fields: [
      { key: 'minRevGrowth', label: 'Min Rev%', placeholder: 'Min Rev%', type: 'number' },
      { key: 'minEarnGrowth', label: 'Min Earn%', placeholder: 'Min Earn%', type: 'number' }
    ]
  },
  profitability: {
    icon: BarChart3,
    label: 'Profitability',
    fields: [
      { key: 'minROE', label: 'Min ROE', placeholder: 'Min ROE', type: 'number' }
    ]
  },
  dividend: {
    icon: Target,
    label: 'Dividend',
    fields: [
      { key: 'minDivYield', label: 'Min Yield%', placeholder: 'Min Yield%', type: 'number' }
    ]
  },
  technical: {
    icon: Zap,
    label: 'Technical',
    fields: [
      { key: 'minRSI', label: 'Min RSI', placeholder: 'Min RSI', type: 'number' },
      { key: 'maxRSI', label: 'Max RSI', placeholder: 'Max RSI', type: 'number' }
    ]
  },
  classification: {
    icon: Building,
    label: 'Sector',
    fields: []
  }
};

// Preset screeners
const PRESET_SCREENERS = [
  { name: 'High Growth', filters: { minRevGrowth: 20, minEarnGrowth: 15 }, icon: TrendingUp },
  { name: 'Undervalued', filters: { maxPE: 20, minPE: 5 }, icon: DollarSign },
  { name: 'Strong Momentum', filters: { minRSI: 50, maxRSI: 80 }, icon: Zap },
  { name: 'Dividend Aristocrats', filters: { minDivYield: 2.5 }, icon: Target },
  { name: 'Small Cap Gems', filters: { marketCapMax: 2000000000 }, icon: Building }
];

// Dummy AI responses
const DUMMY_AI_RESPONSES = [
  "Based on the technical indicators, this stock shows strong momentum with bullish divergence forming. The RSI is approaching overbought territory, suggesting potential continuation if volume supports.",
  "The company's fundamentals look solid with improving margins year-over-year. Recent earnings beat expectations and guidance was raised, indicating management confidence.",
  "This stock presents an interesting opportunity from a valuation perspective. Trading below historical P/E averages with growth potential in the upcoming quarters.",
  "Risk factors include exposure to currency fluctuations and competitive pressures. However, the balance sheet remains healthy with strong cash flow generation."
];

// Filter field options
const FILTER_OPTIONS = {
  exchange: ['Any', 'NASDAQ', 'NYSE', 'AMEX', 'OTC'],
  index: ['Any', 'S&P 500', 'NASDAQ 100', 'DOW Jones', 'Russell 2000'],
  sector: ['Any', 'Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical',
           'Consumer Defensive', 'Industrials', 'Energy', 'Basic Materials', 'Communication Services'],
  industry: ['Any', 'Software', 'Biotechnology', 'Banks', 'Retail', 'Manufacturing'],
  country: ['Any', 'USA', 'Canada', 'UK', 'Germany', 'Japan', 'China'],
  marketCap: ['Any', 'Mega Cap ($$200B+)', 'Large Cap ($$10B-$$200B)', 'Mid Cap ($$2B-$$10B)', 'Small Cap ($$300M-$$2B)', 'Micro Cap (<$$300M)'],
  dividendYield: ['Any', '0% or None', '0-1%', '1-2%', '2-3%', '3-4%', '4-5%', '5%+'],
  shortFloat: ['Any', 'Low (<5%)', 'Medium (5-15%)', 'High (15-30%)', 'Very High (>30%)'],
  analystRecom: ['Any', 'Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'],
  optionShort: ['Any', 'Yes', 'No'],
  earningsDate: ['Any', 'This Week', 'Next Week', 'Next Month', 'Next Quarter'],
  avgVolume: ['Any', 'High (>$$5M)', 'Medium ($$1M-$$5M)', 'Low (<$$1M)'],
  relVolume: ['Any', 'Very High (>$$3x)', 'High ($$2-$$3x)', 'Normal ($$1-$$2x)', 'Low (<$$1x)'],
  currentVolume: ['Any', 'High (>$$3M)', 'Medium ($$1M-$$3M)', 'Low (<$$1M)'],
  trades: ['Any', 'Elite only'],
  price: ['Any', 'Under $$10', '$$10-$$50', '$$50-$$100', '$$100-$$500', '$$500+'],
  targetPrice: ['Any', 'Potential Upside (>$$20%)', 'Moderate Upside ($$10-$$20%)', 'Neutral (-$$10% to $$10%)', 'Potential Downside (<-$$20%)'],
  ipoDate: ['Any', 'Last 6 Months', 'Last 1 Year', 'Last 2 Years', 'Last 5 Years'],
  sharesOutstanding: ['Any', 'Low (<$$100M)', 'Medium ($$100M-$$500M)', 'High ($$500M-$$1B)', 'Very High (>$$1B)'],
  float: ['Any', 'Low (<$$50M)', 'Medium ($$50M-$$200M)', 'High ($$200M-$$500M)', 'Very High (>$$500M)'],
  theme: ['Any', 'AI & Machine Learning', 'Cloud Computing', 'Clean Energy', 'E-commerce', 'FinTech', 'Healthcare'],
  subTheme: ['Any', 'Generative AI', 'SaaS', 'Electric Vehicles', 'Digital Payments', 'Biotech', 'Telemedicine']
};

// Filter field definitions by category
const FILTER_FIELDS_BY_CATEGORY = {
  Descriptive: [
    { label: 'Exchange', key: 'exchange' },
    { label: 'Index', key: 'index' },
    { label: 'Sector', key: 'sector' },
    { label: 'Industry', key: 'industry' },
    { label: 'Country', key: 'country' },
    { label: 'Market Cap.', key: 'marketCap' },
    { label: 'Dividend Yield', key: 'dividendYield' },
    { label: 'Short Float', key: 'shortFloat' },
    { label: 'Analyst Recom.', key: 'analystRecom' },
    { label: 'Option/Short', key: 'optionShort' },
    { label: 'Earnings Date', key: 'earningsDate' }
  ],
  Fundamental: [
    { label: 'Average Volume', key: 'avgVolume' },
    { label: 'Shares Outstanding', key: 'sharesOutstanding' },
    { label: 'Float', key: 'float' },
    { label: 'P/E Ratio', key: 'peRatio' },
    { label: 'PEG Ratio', key: 'pegRatio' },
    { label: 'Price/Book', key: 'priceToBook' },
    { label: 'Debt/Equity', key: 'debtToEquity' },
    { label: 'ROE', key: 'returnOnEquity' },
    { label: 'Revenue Growth', key: 'revenueGrowth' },
    { label: 'Earnings Growth', key: 'earningsGrowth' }
  ],
  Technical: [
    { label: 'Relative Volume', key: 'relVolume' },
    { label: 'Current Volume', key: 'currentVolume' },
    { label: 'RSI (14)', key: 'rsi14' },
    { label: 'Price $', key: 'price' },
    { label: '52-Week High', key: 'week52High' },
    { label: '52-Week Low', key: 'week52Low' },
    { label: 'Beta', key: 'beta' },
    { label: 'Volatility', key: 'volatility' },
    { label: 'Moving Avg 50', key: 'ma50' },
    { label: 'Moving Avg 200', key: 'ma200' }
  ],
  News: [
    { label: 'News Sentiment', key: 'newsSentiment' },
    { label: 'Recent Headlines', key: 'recentHeadlines' },
    { label: 'Analyst Updates', key: 'analystUpdates' },
    { label: 'Surprise Events', key: 'surpriseEvents' },
    { label: 'Social Media Buzz', key: 'socialBuzz' }
  ],
  ETF: [
    { label: 'ETF Holdings', key: 'etfHoldings' },
    { label: 'ETF Category', key: 'etfCategory' },
    { label: 'Expense Ratio', key: 'expenseRatio' },
    { label: 'Yield', key: 'etfYield' },
    { label: 'AUM', key: 'aum' }
  ],
  All: [
    { label: 'Exchange', key: 'exchange' },
    { label: 'Index', key: 'index' },
    { label: 'Sector', key: 'sector' },
    { label: 'Industry', key: 'industry' },
    { label: 'Country', key: 'country' },
    { label: 'Market Cap.', key: 'marketCap' },
    { label: 'Dividend Yield', key: 'dividendYield' },
    { label: 'Short Float', key: 'shortFloat' },
    { label: 'Analyst Recom.', key: 'analystRecom' },
    { label: 'Option/Short', key: 'optionShort' },
    { label: 'Earnings Date', key: 'earningsDate' },
    { label: 'Average Volume', key: 'avgVolume' },
    { label: 'Shares Outstanding', key: 'sharesOutstanding' },
    { label: 'Float', key: 'float' },
    { label: 'P/E Ratio', key: 'peRatio' },
    { label: 'PEG Ratio', key: 'pegRatio' },
    { label: 'Price/Book', key: 'priceToBook' },
    { label: 'Debt/Equity', key: 'debtToEquity' },
    { label: 'ROE', key: 'returnOnEquity' },
    { label: 'Revenue Growth', key: 'revenueGrowth' },
    { label: 'Earnings Growth', key: 'earningsGrowth' },
    { label: 'Relative Volume', key: 'relVolume' },
    { label: 'Current Volume', key: 'currentVolume' },
    { label: 'RSI (14)', key: 'rsi14' },
    { label: 'Price $', key: 'price' },
    { label: '52-Week High', key: 'week52High' },
    { label: '52-Week Low', key: 'week52Low' },
    { label: 'Beta', key: 'beta' },
    { label: 'Volatility', key: 'volatility' },
    { label: 'Moving Avg 50', key: 'ma50' },
    { label: 'Moving Avg 200', key: 'ma200' },
    { label: 'News Sentiment', key: 'newsSentiment' },
    { label: 'Recent Headlines', key: 'recentHeadlines' },
    { label: 'Analyst Updates', key: 'analystUpdates' },
    { label: 'Surprise Events', key: 'surpriseEvents' },
    { label: 'Social Media Buzz', key: 'socialBuzz' },
    { label: 'ETF Holdings', key: 'etfHoldings' },
    { label: 'ETF Category', key: 'etfCategory' },
    { label: 'Expense Ratio', key: 'expenseRatio' },
    { label: 'Yield', key: 'etfYield' },
    { label: 'AUM', key: 'aum' }
  ]
};

// Filter tabs
const FILTER_TABS = ['Descriptive', 'Fundamental', 'Technical', 'News', 'ETF', 'All'];

// Bottom tabs
const BOTTOM_TABS = ['Overview', 'Valuation', 'Financial', 'Ownership', 'Performance', 'Technical', 'ETF', 'ETF Perf', 'Custom', 'Charts', 'Tickers', 'Basic', 'TA', 'News', 'Snapshot', 'Maps', 'Stats'];

const DummyScreener = ({ isDark, toggleTheme }) => {
  const [stocks] = useState(DUMMY_STOCKS);
  const [sidebarSize, setSidebarSize] = useState(400);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastValidWidth, setLastValidWidth] = useState(400);
  const [sortColumn, setSortColumn] = useState('marketCap');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedStock, setSelectedStock] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('chat');
  const [filters, setFilters] = useState({});
  const [activeFilterTab, setActiveFilterTab] = useState('Descriptive');
  const [activeBottomTab, setActiveBottomTab] = useState('Overview');
  const [filterDropdownValues, setFilterDropdownValues] = useState({});
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [tickersInput, setTickersInput] = useState('');
  const [orderBy, setOrderBy] = useState('Ticker');
  const [orderDirection, setOrderDirection] = useState('Asc');
  const [signalFilter, setSignalFilter] = useState('None (all stocks)');

  const toggleFilters = () => setFiltersExpanded(!filtersExpanded);

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const fdv = filterDropdownValues;

      if (fdv.exchange && fdv.exchange !== 'Any') return false;
      if (fdv.index && fdv.index !== 'Any') return false;
      if (fdv.sector && fdv.sector !== 'Any') {
        if (!stock.sector.toLowerCase().includes(fdv.sector.toLowerCase().replace('Any', ''))) return false;
      }
      if (fdv.industry && fdv.industry !== 'Any') return false;
      if (fdv.country && fdv.country !== 'Any') return false;
      if (fdv.marketCap && fdv.marketCap !== 'Any') {
        const mc = stock.marketCap / 1000000000;
        if (fdv.marketCap.includes('Mega') && mc < 200) return false;
        if (fdv.marketCap.includes('Large') && (mc < 10 || mc > 200)) return false;
        if (fdv.marketCap.includes('Mid') && (mc < 2 || mc > 10)) return false;
        if (fdv.marketCap.includes('Small') && (mc < 0.3 || mc > 2)) return false;
        if (fdv.marketCap.includes('Micro') && mc >= 0.3) return false;
      }
      if (fdv.dividendYield && fdv.dividendYield !== 'Any') {
        const dy = stock.dividendYield;
        if (fdv.dividendYield.includes('0% or None') && dy > 0) return false;
        if (fdv.dividendYield.includes('0-1') && (dy < 0 || dy > 1)) return false;
        if (fdv.dividendYield.includes('1-2') && (dy < 1 || dy > 2)) return false;
        if (fdv.dividendYield.includes('2-3') && (dy < 2 || dy > 3)) return false;
        if (fdv.dividendYield.includes('3-4') && (dy < 3 || dy > 4)) return false;
        if (fdv.dividendYield.includes('4-5') && (dy < 4 || dy > 5)) return false;
        if (fdv.dividendYield.includes('5%+') && dy < 5) return false;
      }
      if (fdv.shortFloat && fdv.shortFloat !== 'Any') return false;
      if (fdv.analystRecom && fdv.analystRecom !== 'Any') {
        const signalMapping = {
          'Strong Buy': 'Strong Buy',
          'Buy': 'Buy',
          'Hold': 'Hold',
          'Sell': 'Sell',
          'Strong Sell': 'Sell'
        };
        const expectedSignal = signalMapping[fdv.analystRecom];
        if (expectedSignal && stock.aiSignal !== expectedSignal) return false;
      }
      if (fdv.optionShort && fdv.optionShort !== 'Any') return false;
      if (fdv.earningsDate && fdv.earningsDate !== 'Any') return false;
      if (fdv.avgVolume && fdv.avgVolume !== 'Any') return false;
      if (fdv.relVolume && fdv.relVolume !== 'Any') return false;
      if (fdv.currentVolume && fdv.currentVolume !== 'Any') return false;
      if (fdv.trades && fdv.trades !== 'Any') return false;
      if (fdv.price && fdv.price !== 'Any') {
        if (fdv.price.includes('Under $10') && stock.price >= 10) return false;
        if (fdv.price.includes('$10-$50') && (stock.price < 10 || stock.price > 50)) return false;
        if (fdv.price.includes('$50-$100') && (stock.price < 50 || stock.price > 100)) return false;
        if (fdv.price.includes('$100-$500') && (stock.price < 100 || stock.price > 500)) return false;
        if (fdv.price.includes('$500+') && stock.price < 500) return false;
      }
      if (fdv.targetPrice && fdv.targetPrice !== 'Any') return false;
      if (fdv.ipoDate && fdv.ipoDate !== 'Any') return false;
      if (fdv.sharesOutstanding && fdv.sharesOutstanding !== 'Any') return false;
      if (fdv.float && fdv.float !== 'Any') return false;
      if (fdv.theme && fdv.theme !== 'Any') {
        if (fdv.theme.includes('AI') && stock.sector !== 'Technology') return false;
        if (fdv.theme.includes('Healthcare') && stock.sector !== 'Healthcare') return false;
      }
      if (fdv.subTheme && fdv.subTheme !== 'Any') return false;
      if (fdv.peRatio && fdv.peRatio !== 'Any') return false;
      if (fdv.pegRatio && fdv.pegRatio !== 'Any') return false;
      if (fdv.priceToBook && fdv.priceToBook !== 'Any') {
        const pb = stock.priceToBook;
        if (fdv.priceToBook.includes('Low') && pb > 1) return false;
        if (fdv.priceToBook.includes('Medium') && (pb < 1 || pb > 3)) return false;
        if (fdv.priceToBook.includes('High') && pb < 3) return false;
      }
      if (fdv.debtToEquity && fdv.debtToEquity !== 'Any') {
        const de = stock.debtToEquity;
        if (fdv.debtToEquity.includes('Low') && de > 0.5) return false;
        if (fdv.debtToEquity.includes('Medium') && (de < 0.5 || de > 1.5)) return false;
        if (fdv.debtToEquity.includes('High') && de < 1.5) return false;
      }
      if (fdv.returnOnEquity && fdv.returnOnEquity !== 'Any') {
        const roe = stock.returnOnEquity;
        if (fdv.returnOnEquity.includes('Low') && roe > 10) return false;
        if (fdv.returnOnEquity.includes('Medium') && (roe < 10 || roe > 20)) return false;
        if (fdv.returnOnEquity.includes('High') && roe < 20) return false;
      }
      if (fdv.revenueGrowth && fdv.revenueGrowth !== 'Any') {
        const rg = stock.revenueGrowth;
        if (fdv.revenueGrowth.includes('Low') && rg > 5) return false;
        if (fdv.revenueGrowth.includes('Medium') && (rg < 5 || rg > 20)) return false;
        if (fdv.revenueGrowth.includes('High') && rg < 20) return false;
      }
      if (fdv.earningsGrowth && fdv.earningsGrowth !== 'Any') return false;
      if (fdv.rsi14 && fdv.rsi14 !== 'Any') {
        const rsi = stock.rsi14;
        if (fdv.rsi14.includes('Low') && rsi > 30) return false;
        if (fdv.rsi14.includes('Medium') && (rsi < 30 || rsi > 70)) return false;
        if (fdv.rsi14.includes('High') && rsi < 70) return false;
      }
      if (fdv.week52High && fdv.week52High !== 'Any') return false;
      if (fdv.week52Low && fdv.week52Low !== 'Any') return false;
      if (fdv.beta && fdv.beta !== 'Any') return false;
      if (fdv.volatility && fdv.volatility !== 'Any') return false;
      if (fdv.ma50 && fdv.ma50 !== 'Any') return false;
      if (fdv.ma200 && fdv.ma200 !== 'Any') return false;
      if (fdv.newsSentiment && fdv.newsSentiment !== 'Any') return false;
      if (fdv.recentHeadlines && fdv.recentHeadlines !== 'Any') return false;
      if (fdv.analystUpdates && fdv.analystUpdates !== 'Any') return false;
      if (fdv.surpriseEvents && fdv.surpriseEvents !== 'Any') return false;
      if (fdv.socialBuzz && fdv.socialBuzz !== 'Any') return false;
      if (fdv.etfHoldings && fdv.etfHoldings !== 'Any') return false;
      if (fdv.etfCategory && fdv.etfCategory !== 'Any') return false;
      if (fdv.expenseRatio && fdv.expenseRatio !== 'Any') return false;
      if (fdv.etfYield && fdv.etfYield !== 'Any') return false;
      if (fdv.aum && fdv.aum !== 'Any') return false;

      if (tickersInput.trim()) {
        const tickerList = tickersInput.split(',').map(t => t.trim().toUpperCase());
        if (!tickerList.includes(stock.symbol)) return false;
      }

      if (signalFilter !== 'None (all stocks)') {
        const signalMap = {
          'Strong Buy': 'Strong Buy',
          'Buy': 'Buy',
          'Hold': 'Hold',
          'Sell': 'Sell'
        };
        if (signalMap[signalFilter] && stock.aiSignal !== signalMap[signalFilter]) return false;
      }

      if (filters.minPE && stock.peRatio < parseFloat(filters.minPE)) return false;
      if (filters.maxPE && stock.peRatio > parseFloat(filters.maxPE)) return false;
      if (filters.minRevGrowth && stock.revenueGrowth < parseFloat(filters.minRevGrowth)) return false;
      if (filters.minEarnGrowth && stock.earningsGrowth < parseFloat(filters.minEarnGrowth)) return false;
      if (filters.minROE && stock.returnOnEquity < parseFloat(filters.minROE)) return false;
      if (filters.minDivYield && stock.dividendYield < parseFloat(filters.minDivYield)) return false;
      if (filters.minRSI && stock.rsi14 < parseFloat(filters.minRSI)) return false;
      if (filters.maxRSI && stock.rsi14 > parseFloat(filters.maxRSI)) return false;

      return true;
    });
  }, [stocks, filters, filterDropdownValues, tickersInput, signalFilter]);

  const sortedStocks = useMemo(() => {
    return [...filteredStocks].sort((a, b) => {
      let aVal, bVal;
      switch (orderBy) {
        case 'Ticker': aVal = a.symbol; bVal = b.symbol; break;
        case 'price': aVal = a.price; bVal = b.price; break;
        case 'changePercent': aVal = a.changePercent; bVal = b.changePercent; break;
        case 'Market Cap': aVal = a.marketCap; bVal = b.marketCap; break;
        case 'peRatio': aVal = a.peRatio; bVal = b.peRatio; break;
        case 'Name': aVal = a.name; bVal = b.name; break;
        case 'RSI (14)': aVal = a.rsi14; bVal = b.rsi14; break;
        case 'Revenue Growth': aVal = a.revenueGrowth; bVal = b.revenueGrowth; break;
        case 'Dividend Yield': aVal = a.dividendYield; bVal = b.dividendYield; break;
        default: return 0;
      }
      if (orderDirection === 'Asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
  }, [filteredStocks, orderBy, orderDirection]);

  const handleSort = (column) => {
    if (orderBy === column) {
      setOrderDirection(orderDirection === 'Asc' ? 'Desc' : 'Asc');
    } else {
      setOrderBy(column);
      setOrderDirection('Desc');
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (presetFilters) => {
    setFilters(presetFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    setFilterDropdownValues({});
    setTickersInput('');
    setSignalFilter('None (all stocks)');
  };

  const updateFilterDropdown = (key, value) => {
    setFilterDropdownValues(prev => ({ ...prev, [key]: value }));
  };

  const selectStock = (stock) => {
    setSelectedStock(stock);
    setSidebarCollapsed(false);
  };

  const MIN_WIDTH = 250;
  const MAX_WIDTH = 800;

  const handleMouseDown = (e) => {
    e.preventDefault();
    setSidebarCollapsed(false);
    setIsDragging(true);

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = startX - moveEvent.clientX;
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + deltaX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toggleSidebar = () => {
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
      setSidebarWidth(lastValidWidth);
    } else {
      setLastValidWidth(sidebarWidth);
      setSidebarCollapsed(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      toggleSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarCollapsed, sidebarWidth]);

  const sendChatMessage = () => {
    if (!chatMessage.trim() || !selectedStock) return;

    const userMsg = chatMessage;
    setChatMessage('');

    setChatHistory(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      content: userMsg
    }]);

    setTimeout(() => {
      const randomResponse = DUMMY_AI_RESPONSES[Math.floor(Math.random() * DUMMY_AI_RESPONSES.length)];
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: randomResponse
      }]);
    }, 500);
  };

  const getQuickActionResponse = (type) => {
    if (!selectedStock) return;

    const responses = {
      'pe': `${selectedStock.symbol} has a P/E ratio of ${selectedStock.peRatio.toFixed(1)}. This is ${selectedStock.peRatio > 25 ? 'above' : 'below'} the industry average, suggesting ${
        selectedStock.peRatio > 25 ? 'the stock may be overvalued' : 'the stock may be undervalued'
      }. Consider comparing historical P/E ratios for better context.`,
      'summary': `${selectedStock.symbol} is currently trading at $${selectedStock.price.toFixed(2)} (${
        selectedStock.changePercent >= 0 ? '+' : ''
      }${selectedStock.changePercent.toFixed(2)}%). Market cap: $${(
        selectedStock.marketCap / 1000000000
      ).toFixed(1)}B. The company operates in ${selectedStock.sector} sector with ${
        selectedStock.aiSignal
      } sentiment from our AI analysis.`,
      'analysis': `Technical Analysis for ${selectedStock.symbol}:\n\n• RSI(14): ${selectedStock.rsi14} (${
        selectedStock.rsi14 < 30 ? 'Oversold - Potential buy signal' :
        selectedStock.rsi14 > 70 ? 'Overbought - Potential sell signal' :
        'Neutral zone'
      })\n• P/E Ratio: ${selectedStock.peRatio.toFixed(1)}\n• ROE: ${selectedStock.returnOnEquity.toFixed(1)}%\n• Revenue Growth: ${selectedStock.revenueGrowth.toFixed(1)}%\n\n${
        selectedStock.changePercent > 2 ? 'Strong momentum detected. Consider accumulating positions on pullbacks.' :
        selectedStock.changePercent > 0 ? 'Mild positive trend. Watch for volume confirmation.' :
        'Bearish sentiment. Wait for reversal signals before entering.'
      }`
    };

    setChatHistory(prev => [...prev, {
      id: Date.now(),
      role: 'assistant',
      content: responses[type] || 'Loading analysis...'
    }]);
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'border-slate-700 bg-slate-800/90' : 'border-slate-200 bg-white/80'} backdrop-blur-md z-20`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Stock AI Screener</h1>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Found {sortedStocks.length} stocks matching criteria
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                title="Toggle AI Panel (Esc)"
              >
                {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  const csv = [
                    ['Symbol', 'Name', 'Price', 'Change%', 'Market Cap', 'P/E', 'AI Signal'].join(','),
                    ...sortedStocks.map(s => [
                      s.symbol,
                      s.name,
                      s.price.toFixed(2),
                      s.changePercent.toFixed(2),
                      (s.marketCap / 1000000000).toFixed(1) + 'B',
                      s.peRatio.toFixed(1),
                      s.aiSignal
                    ].join(','))
                  ].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'stock-screener.csv';
                  a.click();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel */}
        <div className={`flex flex-col flex-1 ${sidebarCollapsed ? 'w-full' : ''} overflow-hidden`}>
          {/* StockScreener Control Bar */}
          <div className={`flex-shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b overflow-hidden`}>
            {/* Top Control Bar */}
            <div className={`flex items-center gap-3 px-3 py-2 ${isDark ? 'bg-slate-900/50' : 'bg-slate-100'} border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex items-center">
                <button className={`border rounded px-3 py-1 text-xs flex items-center gap-1 hover:opacity-80 ${
                  isDark ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-gray-300 bg-white text-gray-700'
                }`}>
                  My Presets <ChevronDown size={12} />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Order by</span>
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                  className={`text-xs border rounded px-2 py-1 focus:outline-none focus:border-blue-500 ${
                    isDark ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <option value="Ticker">Ticker</option>
                  <option value="Name">Name</option>
                  <option value="Market Cap">Market Cap</option>
                  <option value="price">Price</option>
                  <option value="changePercent">Change %</option>
                  <option value="peRatio">P/E</option>
                  <option value="RSI (14)">RSI (14)</option>
                  <option value="Revenue Growth">Revenue Growth</option>
                  <option value="Dividend Yield">Dividend Yield</option>
                </select>
                <select
                  value={orderDirection}
                  onChange={(e) => setOrderDirection(e.target.value)}
                  className={`text-xs border rounded px-2 py-1 focus:outline-none focus:border-blue-500 ${
                    isDark ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <option value="Asc">Asc</option>
                  <option value="Desc">Desc</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Signal</span>
                <select
                  value={signalFilter}
                  onChange={(e) => setSignalFilter(e.target.value)}
                  className={`text-xs border rounded px-2 py-1 focus:outline-none focus:border-blue-500 ${
                    isDark ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <option value="None (all stocks)">None (all stocks)</option>
                  <option value="Strong Buy">Strong Buy</option>
                  <option value="Buy">Buy</option>
                  <option value="Hold">Hold</option>
                  <option value="Sell">Sell</option>
                </select>
              </div>

              <div className="flex items-center gap-2 flex-grow max-w-xs">
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Tickers</span>
                <input
                  type="text"
                  value={tickersInput}
                  onChange={(e) => setTickersInput(e.target.value)}
                  placeholder="AAPL, MSFT, GOOGL..."
                  className={`flex-grow text-xs border rounded px-2 py-1 focus:outline-none focus:border-blue-500 ${
                    isDark ? 'border-slate-600 bg-slate-700 text-slate-200 placeholder-slate-500' : 'border-gray-300 bg-white text-gray-700 placeholder-gray-400'
                  }`}
                />
                <button className={`p-1 rounded hover:opacity-80 ${isDark ? 'hover:bg-slate-600' : 'hover:bg-gray-200'}`}>
                  <ChevronRight size={14} className={isDark ? 'text-slate-400' : 'text-gray-500'} />
                </button>
              </div>

              <button
                onClick={toggleFilters}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded border transition-colors ${
                  filtersExpanded
                    ? (isDark ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-blue-600 border-blue-500 text-white')
                    : (isDark ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300')
                }`}
              >
                <Filter size={12} />
                Filters
                {filtersExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              <button
                onClick={clearAllFilters}
                className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
                  isDark ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Clear All
              </button>
            </div>

            {/* Filter Category Tabs */}
            <div className={`flex justify-center border-b ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilterTab(tab)}
                  className={`px-4 py-1.5 text-xs font-medium border-t border-l border-r rounded-t transition-colors ${
                    activeFilterTab === tab
                      ? (isDark ? 'bg-slate-800 text-blue-400 border-slate-700 border-b-slate-800 -mb-px z-10' : 'bg-white text-blue-600 border-gray-200 border-b-white -mb-px z-10')
                      : (isDark ? 'bg-slate-900 text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200' : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100')
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filter Grid - Collapsible */}
            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${filtersExpanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className={`p-3 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-2">
                  {(FILTER_FIELDS_BY_CATEGORY[activeFilterTab] || []).map((field) => (
                    <div key={field.key} className="flex items-center justify-end gap-2">
                      <label className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'} whitespace-nowrap`}>{field.label}</label>
                      <div className="relative w-full max-w-[140px]">
                        <select
                          value={filterDropdownValues[field.key] || 'Any'}
                          onChange={(e) => updateFilterDropdown(field.key, e.target.value)}
                          className={`w-full text-xs border rounded px-2 py-1 pr-6 focus:outline-none focus:border-blue-500 cursor-pointer ${
                            isDark ? 'border-slate-600 bg-slate-700 text-slate-200 shadow-sm' : 'border-gray-300 bg-white text-gray-800 shadow-sm'
                          }`}
                        >
                          {(FILTER_OPTIONS[field.key] || ['Any']).map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                        </select>
                        <ChevronDown size={10} className={`absolute right-1.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'} pointer-events-none`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Navigation Tabs */}
            <div className={`flex items-center overflow-x-auto ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              {BOTTOM_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveBottomTab(tab)}
                  className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeBottomTab === tab
                      ? (isDark ? 'text-blue-400 bg-blue-900/20 border-b-2 border-blue-400' : 'text-blue-600 bg-blue-50 border-b-2 border-blue-600')
                      : (isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-700' : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50')
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table - Flex grow to fill remaining space */}
<div className="flex-1 overflow-hidden flex flex-col">
            <div className={`flex-1 overflow-auto p-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
              <div className={`rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} overflow-hidden shadow-lg`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`border-b fixed top-0 left-0 right-0 z-50 ${
                      isDark ? 'border-slate-700 bg-slate-700' : 'border-slate-200 bg-slate-50'
                    }`} style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 'calc(100% - 2rem)' }}>
                    <tr>
                      {[
                        { key: 'symbol', label: 'Symbol', width: 'w-24' },
                        { key: 'name', label: 'Name', width: 'w-48' },
                        { key: 'price', label: 'Price', width: 'w-24' },
                        { key: 'changePercent', label: 'Change %', width: 'w-28' },
                        { key: 'marketCap', label: 'Market Cap', width: 'w-28' },
                        { key: 'peRatio', label: 'P/E', width: 'w-20' },
                        { key: 'revenueGrowth', label: 'Rev Growth', width: 'w-28' },
                        { key: 'aiSignal', label: 'AI Signal', width: 'w-28' }
                      ].map(col => (
                        <th
                          key={col.key}
                          className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors select-none ${col.width} ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                          onClick={() => handleSort(col.key)}
                        >
                          <div className="flex items-center gap-1">
                            {col.label}
                            {orderBy === col.key && (
                              orderDirection === 'Asc' ?
                                <ChevronUp className="w-3 h-3" /> :
                                <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                    </thead>
                    <tbody className={`divide-y pt-12 ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                    {sortedStocks.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <BarChart3 className={`w-12 h-12 mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No stocks found</p>
                            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Try adjusting your filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sortedStocks.map((stock, index) => (
                        <tr
                          key={stock.symbol}
                          onClick={() => selectStock(stock)}
                          className={`hover:bg-indigo-50/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group ${
                            selectedStock?.symbol === stock.symbol ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''
                          } ${index % 2 === 0 ? '' : isDark ? 'bg-slate-800/50' : 'bg-slate-50/50'}`}
                        >
                          <td className="px-4 py-3 font-bold text-indigo-600 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300">
                            {stock.symbol}
                          </td>
                          <td className={`px-4 py-3 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                            {stock.name}
                          </td>
                          <td className={`px-4 py-3 font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            ${stock.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md font-bold text-xs tabular-nums ${
                              stock.changePercent >= 0
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </span>
                          </td>
                          <td className={`px-4 py-3 tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            ${(stock.marketCap / 1000000000).toFixed(1)}B
                          </td>
                          <td className={`px-4 py-3 tabular-nums ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {stock.peRatio.toFixed(1)}
                          </td>
                          <td className={`px-4 py-3 tabular-nums ${stock.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.revenueGrowth >= 0 ? '+' : ''}{stock.revenueGrowth.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              stock.aiSignal === 'Strong Buy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              stock.aiSignal === 'Buy' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                              stock.aiSignal === 'Hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {stock.aiSignal}
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

        {/* AI Sidebar */}
        <Transition
          show={!sidebarCollapsed}
          enter="transition-transform duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="h-full overflow-hidden"
        >
          <div className="flex h-full overflow-hidden">
            {/* Drag Handle */}
            <div
              onMouseDown={handleMouseDown}
              className={`w-[4px] h-full cursor-col-resize border-r transition-colors ${
                isDark
                  ? 'border-slate-600 hover:border-indigo-500 hover:shadow-[2px_0_8px_rgba(99,102,241,0.3)]'
                  : 'border-slate-300 hover:border-indigo-500 hover:shadow-[2px_0_8px_rgba(99,102,241,0.3)]'
              }`}
              style={{ backgroundColor: isDragging ? (isDark ? '#6366f1' : '#6366f1') : 'transparent' }}
            >
              {isDragging && (
                <div className={`fixed right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs font-bold ${
                  isDark ? 'bg-slate-700 text-white' : 'bg-slate-800 text-white'
                }`}>
                  {Math.round(sidebarWidth)}px
                </div>
              )}
            </div>

            <div 
              className={`h-full border-l flex flex-col shrink-0 ${
                isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
              }`}
              style={{ 
                width: `${sidebarWidth}px`,
                minWidth: `${MIN_WIDTH}px`,
                maxWidth: `${MAX_WIDTH}px`
              }}
            >
            {selectedStock ? (
              <>
                {/* Stock Header */}
                <div className={`border-b flex-shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-200'} p-4 bg-gradient-to-r ${
                  isDark ? 'from-slate-800 to-slate-700' : 'from-white to-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-indigo-600 dark:text-indigo-400">{selectedStock.symbol}</h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{selectedStock.name}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                        isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {selectedStock.sector}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-2xl">${selectedStock.price.toFixed(2)}</div>
                      <div className={`text-sm font-semibold ${selectedStock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <div>
                      <span className={`font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Mkt Cap:</span>
                      <span className={`ml-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        ${(selectedStock.marketCap / 1000000000).toFixed(1)}B
                      </span>
                    </div>
                    <div>
                      <span className={`font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>P/E:</span>
                      <span className={`ml-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {selectedStock.peRatio.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className={`font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Signal:</span>
                      <span className={`ml-1 font-semibold ${
                        selectedStock.aiSignal === 'Strong Buy' ? 'text-green-600' :
                        selectedStock.aiSignal === 'Buy' ? 'text-blue-600' :
                        selectedStock.aiSignal === 'Hold' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {selectedStock.aiSignal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analysis Tabs */}
                <div className={`border-b flex-shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
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
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                  {activeAnalysisTab === 'chat' && (
                    <div className="flex flex-col flex-1 min-h-0">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex-shrink-0">
                        {chatHistory.length === 0 ? (
                          <div className="text-center py-8">
                            <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Start a conversation about {selectedStock.symbol}
                            </p>
                          </div>
                        ) : (
                          chatHistory.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[85%] px-4 py-3 rounded-lg ${
                                msg.role === 'user'
                                  ? 'bg-indigo-600 text-white rounded-br-lg'
                                  : isDark
                                    ? 'bg-slate-700 text-slate-200 rounded-bl-lg'
                                    : 'bg-slate-100 text-slate-800 rounded-bl-lg'
                              }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className={`p-3 border-t flex-shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => getQuickActionResponse('pe')}
                            className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Explain P/E
                          </button>
                          <button
                            onClick={() => getQuickActionResponse('summary')}
                            className="flex-1 px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            Get Summary
                          </button>
                          <button
                            onClick={() => getQuickActionResponse('analysis')}
                            className="flex-1 px-3 py-2 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                          >
                            Analysis
                          </button>
                        </div>
                      </div>

                      {/* Chat Input */}
                      <div className={`p-4 border-t flex-shrink-0 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                            placeholder="Ask about this stock..."
                            className={`flex-1 px-4 py-2 text-sm rounded-lg border transition-colors ${
                              isDark
                                ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none'
                                : 'border-slate-300 bg-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none'
                            }`}
                          />
                          <button
                            onClick={sendChatMessage}
                            disabled={!chatMessage.trim()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeAnalysisTab === 'analysis' && (
                    <div className="p-4 overflow-y-auto">
                      <div className="space-y-4">
                        {[
                          { label: 'P/E Ratio', value: selectedStock.peRatio.toFixed(1), benchmark: 'Industry: 25.0' },
                          { label: 'PEG Ratio', value: selectedStock.pegRatio.toFixed(2), benchmark: 'Industry: 1.5' },
                          { label: 'Price/Book', value: selectedStock.priceToBook.toFixed(2), benchmark: 'Industry: 3.0' },
                          { label: 'Debt/Equity', value: selectedStock.debtToEquity.toFixed(2), benchmark: 'Industry: 1.0' },
                          { label: 'ROE', value: selectedStock.returnOnEquity.toFixed(1) + '%', benchmark: 'Industry: 15.0%' },
                          { label: 'Revenue Growth', value: selectedStock.revenueGrowth.toFixed(1) + '%', benchmark: 'Industry: 10.0%' },
                          { label: 'Earnings Growth', value: selectedStock.earningsGrowth.toFixed(1) + '%', benchmark: 'Industry: 12.0%' },
                          { label: 'Dividend Yield', value: selectedStock.dividendYield.toFixed(2) + '%', benchmark: 'Industry: 2.0%' },
                          { label: 'RSI (14)', value: selectedStock.rsi14, benchmark: 'Oversold: 30, Overbought: 70' }
                        ].map((metric, i) => (
                          <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium"> {metric.label}</span>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{metric.value}</span>
                            </div>
                            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{metric.benchmark}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeAnalysisTab === 'charts' && (
                    <div className="p-4 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart4 className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                        <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Charts coming soon
                        </p>
                        <p className={`text-sm mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Price charts and technical indicators
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8">
                  <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Select a stock to begin
                  </p>
                  <p className={`text-sm mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Click any stock row to view AI analysis
                  </p>
                </div>
              </div>
            )}
          </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default DummyScreener;