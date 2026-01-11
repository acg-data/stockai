import yfinance as yf
from typing import Dict, Any, Optional, List

class StockService:
    async def get_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            return {
                "symbol": symbol.upper(),
                "name": info.get("shortName", info.get("companyName", symbol)),
                "price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
                "change": info.get("regularMarketChange", 0),
                "change_percent": info.get("regularMarketChangePercent", 0),
                "market_cap": info.get("marketCap"),
                "pe_ratio": info.get("trailingPE"),
                "dividend": info.get("dividendYield"),
                "eps": info.get("trailingEps"),
                "high_52w": info.get("fiftyTwoWeekHigh"),
                "low_52w": info.get("fiftyTwoWeekLow"),
                "volume": info.get("volume"),
                "avg_volume": info.get("averageVolume"),
                "sector": info.get("sector"),
                "industry": info.get("industry")
            }
        except Exception as e:
            print(f"Error getting quote for {symbol}: {e}")
            return None

    async def get_profile(self, symbol: str) -> Optional[Dict[str, Any]]:
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            return {
                "symbol": symbol.upper(),
                "name": info.get("shortName", symbol),
                "description": info.get("longBusinessSummary", ""),
                "sector": info.get("sector"),
                "industry": info.get("industry"),
                "website": info.get("website"),
                "employees": info.get("fullTimeEmployees"),
                "ceo": info.get("companyOfficers", [{}])[0].get("name") if info.get("companyOfficers") else None
            }
        except Exception as e:
            print(f"Error getting profile for {symbol}: {e}")
            return None

    async def get_financials(self, symbol: str) -> Optional[Dict[str, Any]]:
        try:
            stock = yf.Ticker(symbol)
            return {
                "income_statement": stock.income_stmt if hasattr(stock, 'income_stmt') else {},
                "balance_sheet": stock.balance_sheet if hasattr(stock, 'balance_sheet') else {},
                "cash_flow": stock.cashflow if hasattr(stock, 'cashflow') else {}
            }
        except Exception as e:
            print(f"Error getting financials for {symbol}: {e}")
            return None

    async def search(self, query: str) -> List[Dict[str, str]]:
        try:
            from yfinance import tickers
            results = tickers(query)
            return [{"symbol": t} for t in results]
        except Exception as e:
            print(f"Error searching for {query}: {e}")
            return []

    async def get_trending(self) -> List[Dict[str, Any]]:
        tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B", "JPM", "V"]
        results = []
        for symbol in tickers:
            quote = await self.get_quote(symbol)
            if quote:
                results.append(quote)
        return results
