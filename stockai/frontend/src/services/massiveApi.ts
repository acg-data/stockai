import axios from 'axios';

const MASSIVE_API_KEY = 'EfgnZQXZdoMTNgTf6lp7PXqqmBb7xXVZ';
const MASSIVE_BASE_URL = 'https://api.massive.com';

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
        `${MASSIVE_BASE_URL}/stocks`,
        {
          params: {
            api_key: MASSIVE_API_KEY,
            page,
            page_size: pageSize,
            sector,
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
      const response = await axios.get<MassiveResponse>(
        `${MASSIVE_BASE_URL}/stocks/search`,
        {
          params: {
            api_key: MASSIVE_API_KEY,
            q: query,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getQuote: async (symbol: string) => {
    try {
      const response = await axios.get<{ data: MassiveStock }>(
        `${MASSIVE_BASE_URL}/stocks/${symbol}`,
        {
          params: {
            api_key: MASSIVE_API_KEY,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};