import yfinance as yf
from typing import Dict, Any, Optional, List
import math

class MassiveStockService:
    def __init__(self):
        self.api_key = "EfgnZQXZdoMTNgTf6lp7PXqqmBb7xXVZ"
        self.base_url = "https://api.massive.com"

    async def get_stocks(
        self,
        page: int = 1,
        page_size: int = 20,
        sector: Optional[str] = None,
        market_cap_min: Optional[int] = None,
        pe_min: Optional[float] = None,
        pe_max: Optional[float] = None,
    ) -> Dict[str, Any]:
        tickers = [
            ("AAPL", "Apple Inc.", "Technology", "Consumer Electronics"),
            ("MSFT", "Microsoft Corporation", "Technology", "Software"),
            ("GOOGL", "Alphabet Inc.", "Technology", "Internet"),
            ("AMZN", "Amazon.com Inc.", "Consumer Cyclical", "Internet Retail"),
            ("NVDA", "NVIDIA Corporation", "Technology", "Semiconductors"),
            ("META", "Meta Platforms Inc.", "Communication Services", "Internet"),
            ("TSLA", "Tesla Inc.", "Consumer Cyclical", "Auto Manufacturers"),
            ("BRK.B", "Berkshire Hathaway Inc.", "Financial Services", "Conglomerates"),
            ("JPM", "JPMorgan Chase & Co.", "Financial Services", "Banks"),
            ("V", "Visa Inc.", "Financial Services", "Credit Services"),
            ("JNJ", "Johnson & Johnson", "Healthcare", "Drug Manufacturers"),
            ("WMT", "Walmart Inc.", "Consumer Defensive", "Department Stores"),
            ("PG", "Procter & Gamble", "Consumer Defensive", "Household & Personal Products"),
            ("MA", "Mastercard Inc.", "Financial Services", "Credit Services"),
            ("UNH", "UnitedHealth Group Incorporated", "Healthcare", "Healthcare Plans"),
            ("HD", "Home Depot Inc.", "Consumer Cyclical", "Home Improvement Retail"),
            ("BAC", "Bank of America Corporation", "Financial Services", "Banks"),
            ("XOM", "Exxon Mobil Corporation", "Energy", "Oil & Gas Integrated"),
            ("CVX", "Chevron Corporation", "Energy", "Oil & Gas Integrated"),
            ("LLY", "Eli Lilly and Company", "Healthcare", "Drug Manufacturers"),
            ("MRK", "Merck & Co. Inc.", "Healthcare", "Drug Manufacturers"),
            ("ABBV", "AbbVie Inc.", "Healthcare", "Drug Manufacturers"),
            ("KO", "Coca-Cola Company", "Consumer Defensive", "Beverages - Non-Alcoholic"),
            ("PEP", "PepsiCo Inc.", "Consumer Defensive", "Beverages - Non-Alcoholic"),
            ("TMO", "Thermo Fisher Scientific Inc.", "Healthcare", "Scientific & Technical Instruments"),
            ("COST", "Costco Wholesale Corporation", "Consumer Defensive", "Discount Stores"),
            ("AVGO", "Broadcom Inc.", "Technology", "Semiconductors"),
            ("NFLX", "Netflix Inc.", "Communication Services", "Internet Content & Information"),
            ("AMD", "Advanced Micro Devices Inc.", "Technology", "Semiconductors"),
            ("LIN", "Linde plc", "Basic Materials", "Chemicals"),
            ("ADBE", "Adobe Inc.", "Technology", "Software"),
            ("CRM", "Salesforce Inc.", "Technology", "Software"),
            ("WFC", "Wells Fargo & Company", "Financial Services", "Banks"),
            ("CSCO", "Cisco Systems Inc.", "Technology", "Communication Equipment"),
            ("ORCL", "Oracle Corporation", "Technology", "Software"),
            ("ACN", "Accenture plc", "Information Technology", "Information Technology Services"),
            ("INTC", "Intel Corporation", "Technology", "Semiconductors"),
            ("IBM", "International Business Machines Corporation", "Technology", "Information Technology Services"),
            ("GE", "General Electric Company", "Industrials", "Conglomerates"),
            ("DIS", "Walt Disney Company", "Communication Services", "Entertainment"),
            ("NKE", "NIKE Inc.", "Consumer Cyclical", "Footwear & Accessories"),
            ("CAT", "Caterpillar Inc.", "Industrials", "Construction Machinery"),
        ]

        try:
            all_stocks = []
            for symbol, name, sector_val, industry in tickers:
                try:
                    stock = yf.Ticker(symbol)
                    info = stock.info
                    
                    pe = info.get("trailingPE", 0)
                    pe_val = pe if pe is not None and not math.isnan(pe) else 0
                    
                    market_cap = info.get("marketCap", 0)
                    
                    if sector and sector_val != sector:
                        continue
                    if pe_min is not None and pe_val < pe_min:
                        continue
                    if pe_max is not None and pe_val > pe_max:
                        continue
                    if market_cap_min and market_cap < market_cap_min:
                        continue

                    all_stocks.append({
                        "symbol": symbol,
                        "name": name,
                        "price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
                        "change": info.get("regularMarketChange", 0),
                        "change_percent": info.get("regularMarketChangePercent", 0) * 100 if info.get("regularMarketChangePercent") else 0,
                        "market_cap": market_cap,
                        "pe_ratio": pe_val,
                        "volume": info.get("volume", 0),
                        "sector": sector_val,
                        "industry": industry,
                    })
                except Exception as e:
                    print(f"Error fetching {symbol}: {e}")
                    continue

            start = (page - 1) * page_size
            end = start + page_size
            paginated_stocks = all_stocks[start:end]

            return {
                "data": paginated_stocks,
                "pagination": {
                    "page": page,
                    "page_size": page_size,
                    "total": len(all_stocks),
                    "total_pages": (len(all_stocks) + page_size - 1) // page_size,
                }
            }
        except Exception as e:
            print(f"Error in get_stocks: {e}")
            return {"data": [], "pagination": {"page": 1, "page_size": page_size, "total": 0, "total_pages": 0}}

    async def search_stocks(self, query: str) -> List[Dict[str, Any]]:
        return []

    async def get_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        try:
            stock = yf.Ticker(symbol)
            info = stock.info
            return {
                "symbol": symbol.upper(),
                "name": info.get("shortName", info.get("companyName", symbol)),
                "price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
                "change": info.get("regularMarketChange", 0),
                "change_percent": info.get("regularMarketChangePercent", 0) * 100 if info.get("regularMarketChangePercent") else 0,
                "market_cap": info.get("marketCap"),
                "pe_ratio": info.get("trailingPE"),
            }
        except Exception as e:
            print(f"Error getting quote for {symbol}: {e}")
            return None

    async def close(self):
        pass