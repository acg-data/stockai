# StockAI

An AI-enhanced stock intelligence platform inspired by Finviz, with natural language querying, AI-powered screening, and intelligent analysis.

## Features

- **AI-Powered Chat**: Ask questions about stocks in plain English
- **Natural Language Screening**: Describe stocks you're looking for and let AI find them
- **Real-time Data**: Stock quotes, fundamentals, and market data
- **AI Analysis**: Automated insights and reports

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Python FastAPI, yfinance
- **AI**: Llama models (via OpenRouter)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Replicate API key (for AI features)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
py -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Environment Variables

**Backend (.env):**
```
OPENROUTER_API_KEY=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
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000/api/v1
```

## API Endpoints

### Stocks
- `GET /api/v1/stocks/quote/{symbol}` - Get stock quote
- `GET /api/v1/stocks/profile/{symbol}` - Get company profile
- `GET /api/v1/stocks/search/{query}` - Search stocks
- `GET /api/v1/stocks/trending` - Get trending stocks

### Screener
- `POST /api/v1/screener/query` - Run filter-based screener
- `POST /api/v1/screener/natural-language` - Natural language screener
- `GET /api/v1/screener/presets` - Get preset screens

### Chat
- `POST /api/v1/chat/query` - AI chat with stock context
- `POST /api/v1/chat/summarize` - Get AI summary of a stock

### Analysis
- `POST /api/v1/analysis/full` - Full AI analysis
- `POST /api/v1/analysis/generate-report` - Generate analysis report

## Running the App

1. Start the backend: `cd backend && uvicorn app.main:app --reload`
2. Start the frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
