export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  market_cap?: number;
  pe_ratio?: number;
  dividend?: number;
  eps?: number;
  high_52w?: number;
  low_52w?: number;
  volume?: number;
  sector?: string;
  industry?: string;
  ai_signal?: 'Strong Buy' | 'Buy' | 'Hold' | 'Neutral' | 'Sell';
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ScreenerResult {
  symbol: string;
  name: string;
  price: number;
  change_percent: number;
  market_cap?: number;
  pe_ratio?: number;
}

export interface Analysis {
  symbol: string;
  quote: Stock;
  profile?: Record<string, unknown>;
  ai_summary?: {
    outlook: string;
    key_strengths: string[];
    key_risks: string[];
    recommendation: string;
  };
}

export interface FilterChip {
  label: string;
  value: string;
  options: string[];
  selected: string;
}

export interface AIInsight {
  text: string;
  timestamp?: Date;
}

export interface AIAction {
  id: string;
  icon: string;
  label: string;
  description?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
