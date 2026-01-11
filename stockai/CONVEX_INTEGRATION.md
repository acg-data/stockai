# StockAI Backend with Massive.com API Integration

This document outlines the plan for integrating Massive.com's stock data API and Convex for user profiles into the StockAI backend.

## Massive.com API Integration

### API Key
- **API Key**: `EfgnZQXZdoMTNgTf6lp7PXqqmBb7xXVZ`
- **Base URL**: `https://api.massive.com`

### Endpoints to Implement

1. **GET /stocks** - Fetch paginated stock list
   - Query params: `page`, `page_size`, `sector`, `market_cap_min`, `pe_min`, `pe_max`
   - Returns: Stock data with pagination metadata

2. **GET /stocks/search** - Search stocks by symbol/name
   - Query params: `q` (search query)
   - Returns: Matching stocks

3. **GET /stocks/{symbol}** - Get detailed quote for a stock
   - Returns: Full stock quote data

### Implementation Plan

1. Create new service file: `backend/app/stockai/services/massive_service.py`
2. Add new routes in `backend/app/stockai/routes/stocks.py`:
   - `GET /api/v1/stocks/list` - Paginated stock list
   - `GET /api/v1/stocks/massive/{symbol}` - Massive.com quote

### Update to requirements.txt
Add:
```
httpx>=0.25.0
```

## Convex Integration (User Profiles)

### Setup
1. Install Convex dependencies:
```bash
pip install convex
```

2. Initialize Convex in backend:
```bash
npx convex dev
```

### Convex Schema

```convex
// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    preferences: v.optional(v.object({
      sectors: v.array(v.string()),
 favoriteStocks: v.array(v.string()),
    })),
    createdAt: v.number(),
    lastActive: v.number(),
  }).index("by_email", ["email"]),
  
  portfolios: defineTable({
    userId: v.id("users"),
    name: v.string(),
    stocks: v.array(v.object({
      symbol: v.string(),
      quantity: v.number(),
      avgCost: v.number(),
    })),
    totalValue: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
  
  watchlists: defineTable({
    userId: v.id("users"),
    name: v.string(),
    symbols: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
```

### New Backend Services

1. **user_service.py** - User profile operations
2. **portfolio_service.py** - Portfolio management
3. **watchlist_service.py** - Watchlist management

### New Backend Routes

1. **POST /api/v1/users** - Create/update user
2. **GET /api/v1/users/{id}** - Get user profile
3. **POST /api/v1/portfolios** - Create portfolio
4. **GET /api/v1/portfolios/{id}** - Get portfolio
5. **POST /api/v1/watchlists** - Create watchlist
6. **GET /api/v1/watchlists/{id}` - Get watchlist

## Next Steps

1. ✅ Frontend - Create massiveApi service
2. 🔄 Frontend - Implement Dashboard with Massive API
3. ⏳ Backend - Implement Massive.com service
4. ⏳ Backend - Set up Convex
5. ⏳ Backend - Implement user/profile endpoints
6. ⏳ Frontend - Add profile/portfolio UI