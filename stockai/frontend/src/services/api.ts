import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export const api = {
  stocks: {
    getQuote: async (symbol: string) => {
      const response = await axios.get(`${API_BASE}/stocks/quote/${symbol}`);
      return response.data;
    },
    getProfile: async (symbol: string) => {
      const response = await axios.get(`${API_BASE}/stocks/profile/${symbol}`);
      return response.data;
    },
    search: async (query: string) => {
      const response = await axios.get(`${API_BASE}/stocks/search/${query}`);
      return response.data;
    },
    getTrending: async () => {
      const response = await axios.get(`${API_BASE}/stocks/trending`);
      return response.data;
    },
  },
  screener: {
    run: async (filters: Record<string, unknown>) => {
      const response = await axios.post(`${API_BASE}/screener/query`, { filters });
      return response.data;
    },
    naturalLanguage: async (query: string) => {
      const response = await axios.post(`${API_BASE}/screener/natural-language`, { query });
      return response.data;
    },
    getPresets: async () => {
      const response = await axios.get(`${API_BASE}/screener/presets`);
      return response.data;
    },
  },
  chat: {
    query: async (messages: { role: string; content: string }[], stockSymbol?: string) => {
      const response = await axios.post(`${API_BASE}/chat/query`, { messages, stock_symbol: stockSymbol });
      return response.data;
    },
    summarize: async (symbol: string) => {
      const response = await axios.post(`${API_BASE}/chat/summarize`, { stock_symbol: symbol });
      return response.data;
    },
  },
  analysis: {
    full: async (symbol: string) => {
      const response = await axios.post(`${API_BASE}/analysis/full`, { stock_symbol: symbol });
      return response.data;
    },
    generateReport: async (symbol: string) => {
      const response = await axios.post(`${API_BASE}/analysis/generate-report`, { stock_symbol: symbol });
      return response.data;
    },
  },
};
