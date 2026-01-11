import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

interface MassiveStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  market_cap: number;
  pe_ratio: number;
  volume: number;
  sector: string;
  industry: string;
}

interface MassiveResponse {
  data: MassiveStock[];
  pagination?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('Massive API Error Response:', error.response.status, error.response.data);
      const message = (error.response.data as { message?: string })?.message || error.response.statusText;
      return new Error(`API Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      console.error('Massive API No Response:', error.message);
      return new Error('API server is not responding. Please check if the backend is running.');
    }
  }
  console.error('Massive API Unknown Error:', error);
  return new Error('Failed to connect to the stock data service.');
};

export const massiveApi = {
  getStocks: async ({
    page = 1,
    pageSize = 20,
    sector,
    marketCapMin,
    peRange,
  }: {
    page?: number;
    pageSize?: number;
    sector?: string;
    marketCapMin?: number;
    peRange?: [number, number];
  } = {}) => {
    try {
      const response = await axios.get<MassiveResponse>(
        `${API_BASE_URL}/stocks/list`,
        {
          params: {
            page,
            page_size: pageSize,
            sector: sector === 'Any' ? undefined : sector,
            market_cap_min: marketCapMin,
            pe_min: peRange?.[0],
            pe_max: peRange?.[1],
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  searchStocks: async (query: string) => {
    try {
      const response = await axios.get<{ results: MassiveStock[] }>(
        `${API_BASE_URL}/stocks/search/${encodeURIComponent(query)}`
      );
      return { data: response.data.results, pagination: { total: response.data.results.length } };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getQuote: async (symbol: string) => {
    try {
      const response = await axios.get<MassiveStock>(
        `${API_BASE_URL}/stocks/quote/${symbol.toUpperCase()}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};