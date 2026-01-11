import yfinance as yf
import pandas as pd
import numpy as np
import time
from typing import Dict, Any, Optional, List

class StockService:
    def __init__(self):
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes

    def _get_cache(self, key: str) -> Optional[Any]:
        """Get item from cache if not expired"""
        if key in self.cache:
            data, timestamp = self.cache[key]
            if time.time() - timestamp < self.cache_ttl:
                return data
            else:
                del self.cache[key]
        return None

    def _set_cache(self, key: str, data: Any):
        """Store item in cache"""
        self.cache[key] = (data, time.time())
    async def get_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        cache_key = f"quote_{symbol.upper()}"
        cached_data = self._get_cache(cache_key)
        if cached_data:
            return cached_data

        try:
            stock = yf.Ticker(symbol)
            info = stock.info

            # Calculate additional metrics
            market_cap = info.get("marketCap")
            total_debt = info.get("totalDebt", 0)
            cash = info.get("totalCash", 0)
            enterprise_value = market_cap + total_debt - cash if market_cap else None

            return {
                # Basic Info
                "symbol": symbol.upper(),
                "name": info.get("shortName", info.get("companyName", symbol)),
                "price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
                "change": info.get("regularMarketChange", 0),
                "change_percent": info.get("regularMarketChangePercent", 0),

                # Valuation
                "market_cap": market_cap,
                "pe_ratio": info.get("trailingPE"),
                "forward_pe": info.get("forwardPE"),
                "peg_ratio": info.get("pegRatio"),
                "price_to_book": info.get("priceToBook"),
                "price_to_sales": info.get("priceToSalesTrailing12Months"),
                "enterprise_value": enterprise_value,
                "ev_to_ebitda": info.get("enterpriseToEbitda"),
                "ev_to_revenue": info.get("enterpriseToRevenue"),

                # Growth
                "revenue_growth": info.get("revenueGrowth"),
                "earnings_growth": info.get("earningsGrowth"),
                "eps_growth_this_year": info.get("epsForwardGrowth"),
                "eps_growth_next_year": info.get("epsForwardGrowth", 0) * 1.05,
                "sales_growth": info.get("revenueGrowth"),

                # Profitability
                "gross_margin": info.get("grossMargins"),
                "operating_margin": info.get("operatingMargins"),
                "profit_margin": info.get("profitMargins"),
                "return_on_assets": info.get("returnOnAssets"),
                "return_on_equity": info.get("returnOnEquity"),
                "return_on_invested_capital": info.get("returnOnEquity"),

                # Dividends
                "dividend_yield": info.get("dividendYield"),
                "dividend_growth": info.get("dividendGrowth"),
                "payout_ratio": info.get("payoutRatio"),

                # Balance Sheet
                "current_ratio": info.get("currentRatio"),
                "quick_ratio": info.get("quickRatio"),
                "debt_to_equity": info.get("debtToEquity"),
                "lt_debt_to_equity": info.get("debtToEquity"),

                # Technical
                "high_52w": info.get("fiftyTwoWeekHigh"),
                "low_52w": info.get("fiftyTwoWeekLow"),
                "volume": info.get("volume"),
                "avg_volume": info.get("averageVolume"),
                "beta": info.get("beta"),

                # Classification
                "sector": info.get("sector"),
                "industry": info.get("industry"),
                "country": info.get("country"),
                "exchange": info.get("exchange"),

                # Additional
                "eps": info.get("trailingEps"),
                "shares_outstanding": info.get("sharesOutstanding"),
                "float": info.get("floatShares"),
                "insider_percent": info.get("heldPercentInsiders"),
                "institutional_percent": info.get("heldPercentInstitutions"),
                "short_percent": info.get("shortPercentOfFloat"),
            }

            # Cache the result
            self._set_cache(cache_key, result)
            return result
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
            # yfinance doesn't have built-in search, return empty for now
            return []
        except Exception as e:
            print(f"Error searching for {query}: {e}")
            return []

    async def get_technical_indicators(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Calculate technical indicators for a stock"""
        try:
            stock = yf.Ticker(symbol)
            # Get 1 year of daily data
            hist = stock.history(period="1y")

            if hist.empty:
                return None

            close = hist['Close']
            high = hist['High']
            low = hist['Low']
            volume = hist['Volume']

            # RSI (14)
            rsi_14 = self._calculate_rsi(close, 14)

            # Simple Moving Averages
            sma_20 = close.rolling(window=20).mean().iloc[-1] if len(close) >= 20 else None
            sma_50 = close.rolling(window=50).mean().iloc[-1] if len(close) >= 50 else None
            sma_200 = close.rolling(window=200).mean().iloc[-1] if len(close) >= 200 else None

            # Price change calculations
            current_price = close.iloc[-1]
            price_1m_ago = close.iloc[-22] if len(close) >= 22 else close.iloc[0]
            price_3m_ago = close.iloc[-66] if len(close) >= 66 else close.iloc[0]
            price_6m_ago = close.iloc[-132] if len(close) >= 132 else close.iloc[0]

            price_change_1m = ((current_price - price_1m_ago) / price_1m_ago * 100) if price_1m_ago > 0 else 0
            price_change_3m = ((current_price - price_3m_ago) / price_3m_ago * 100) if price_3m_ago > 0 else 0
            price_change_6m = ((current_price - price_6m_ago) / price_6m_ago * 100) if price_6m_ago > 0 else 0

            # Gap calculation (difference between previous close and today's open)
            if len(hist) >= 2:
                prev_close = hist['Close'].iloc[-2]
                today_open = hist['Open'].iloc[-1]
                gap = ((today_open - prev_close) / prev_close * 100) if prev_close > 0 else 0
            else:
                gap = 0

            # Distance from 52-week high/low
            high_52w = high.max()
            low_52w = low.min()
            distance_52w_high = ((current_price - high_52w) / high_52w * 100) if high_52w > 0 else 0
            distance_52w_low = ((current_price - low_52w) / low_52w * 100) if low_52w > 0 else 0

            # Average True Range (ATR)
            atr = self._calculate_atr(high, low, close, 14)

            # Average volume
            avg_volume = volume.tail(30).mean() if len(volume) >= 30 else volume.mean()

            return {
                "rsi_14": rsi_14,
                "sma_20": sma_20,
                "sma_50": sma_50,
                "sma_200": sma_200,
                "price_change_1m": price_change_1m,
                "price_change_3m": price_change_3m,
                "price_change_6m": price_change_6m,
                "gap": gap,
                "distance_52w_high": distance_52w_high,
                "distance_52w_low": distance_52w_low,
                "atr": atr,
                "avg_volume": avg_volume,
                "current_volume": volume.iloc[-1] if not volume.empty else 0
            }
        except Exception as e:
            print(f"Error calculating technical indicators for {symbol}: {e}")
            return None

    def _calculate_rsi(self, prices, period=14):
        """Calculate RSI (Relative Strength Index)"""
        try:
            if len(prices) < period:
                return None
            delta = prices.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            return float(rsi.iloc[-1]) if not pd.isna(rsi.iloc[-1]) else None
        except:
            return None

    def _calculate_atr(self, high, low, close, period=14):
        """Calculate Average True Range (ATR)"""
        try:
            if len(high) < period:
                return None
            high_low = high - low
            high_close = np.abs(high - close.shift())
            low_close = np.abs(low - close.shift())
            ranges = pd.concat([high_low, high_close, low_close], axis=1)
            true_range = ranges.max(axis=1)
            atr = true_range.rolling(window=period).mean()
            return float(atr.iloc[-1]) if not pd.isna(atr.iloc[-1]) else None
        except:
            return None

    async def get_trending(self) -> List[Dict[str, Any]]:
        tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B", "JPM", "V"]
        results = []
        for symbol in tickers:
            quote = await self.get_quote(symbol)
            if quote:
                results.append(quote)
        return results