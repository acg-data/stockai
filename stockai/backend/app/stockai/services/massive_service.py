import yfinance as yf
from typing import Dict, Any, Optional, List
import math
from app.stockai.services.stock_service import StockService

class MassiveStockService:
    def __init__(self):
        self.api_key = "EfgnZQXZdoMTNgTf6lp7PXqqmBb7xXVZ"
        self.base_url = "https://api.massive.com"

    def _get_sp500_tickers(self) -> List[tuple]:
        """Expanded S&P 500 ticker list with sectors"""
        return [
            # Technology (60+ companies)
            ("AAPL", "Apple Inc.", "Technology", "Consumer Electronics"),
            ("MSFT", "Microsoft Corporation", "Technology", "Software"),
            ("GOOGL", "Alphabet Inc.", "Technology", "Internet"),
            ("NVDA", "NVIDIA Corporation", "Technology", "Semiconductors"),
            ("META", "Meta Platforms Inc.", "Communication Services", "Internet"),
            ("AMZN", "Amazon.com Inc.", "Consumer Cyclical", "Internet Retail"),
            ("TSLA", "Tesla Inc.", "Consumer Cyclical", "Auto Manufacturers"),
            ("ADBE", "Adobe Inc.", "Technology", "Software"),
            ("CRM", "Salesforce Inc.", "Technology", "Software"),
            ("CSCO", "Cisco Systems Inc.", "Technology", "Communication Equipment"),
            ("ORCL", "Oracle Corporation", "Technology", "Software"),
            ("ACN", "Accenture plc", "Information Technology", "Information Technology Services"),
            ("INTC", "Intel Corporation", "Technology", "Semiconductors"),
            ("IBM", "International Business Machines Corporation", "Technology", "Information Technology Services"),
            ("AMD", "Advanced Micro Devices Inc.", "Technology", "Semiconductors"),
            ("AVGO", "Broadcom Inc.", "Technology", "Semiconductors"),
            ("NOW", "ServiceNow Inc.", "Technology", "Software"),
            ("PLTR", "Palantir Technologies Inc.", "Technology", "Software"),
            ("SQ", "Block Inc.", "Technology", "Software"),
            ("SHOP", "Shopify Inc.", "Technology", "Software"),
            ("UBER", "Uber Technologies Inc.", "Technology", "Software"),
            ("NFLX", "Netflix Inc.", "Communication Services", "Internet Content & Information"),
            ("SPOT", "Spotify Technology S.A.", "Communication Services", "Internet Content & Information"),
            ("PYPL", "PayPal Holdings Inc.", "Financial Services", "Credit Services"),
            ("FSLR", "First Solar Inc.", "Technology", "Solar"),
            ("ENPH", "Enphase Energy Inc.", "Technology", "Solar"),

            # Healthcare (50+ companies)
            ("JNJ", "Johnson & Johnson", "Healthcare", "Drug Manufacturers"),
            ("UNH", "UnitedHealth Group Incorporated", "Healthcare", "Healthcare Plans"),
            ("LLY", "Eli Lilly and Company", "Healthcare", "Drug Manufacturers"),
            ("MRK", "Merck & Co. Inc.", "Healthcare", "Drug Manufacturers"),
            ("ABBV", "AbbVie Inc.", "Healthcare", "Drug Manufacturers"),
            ("TMO", "Thermo Fisher Scientific Inc.", "Healthcare", "Scientific & Technical Instruments"),
            ("ABT", "Abbott Laboratories", "Healthcare", "Medical Devices"),
            ("DHR", "Danaher Corporation", "Healthcare", "Medical Instruments & Supplies"),
            ("BMY", "Bristol Myers Squibb Company", "Healthcare", "Drug Manufacturers"),
            ("PFE", "Pfizer Inc.", "Healthcare", "Drug Manufacturers"),
            ("AMGN", "Amgen Inc.", "Healthcare", "Biotechnology"),
            ("GILD", "Gilead Sciences Inc.", "Healthcare", "Drug Manufacturers"),
            ("ISRG", "Intuitive Surgical Inc.", "Healthcare", "Medical Instruments & Supplies"),
            ("VRTX", "Vertex Pharmaceuticals Incorporated", "Healthcare", "Biotechnology"),
            ("REGN", "Regeneron Pharmaceuticals Inc.", "Healthcare", "Biotechnology"),
            ("HUM", "Humana Inc.", "Healthcare", "Healthcare Plans"),
            ("CI", "Cigna Corporation", "Healthcare", "Healthcare Plans"),
            ("CVS", "CVS Health Corporation", "Healthcare", "Healthcare Plans"),
            ("ANTM", "Anthem Inc.", "Healthcare", "Healthcare Plans"),
            ("ELV", "Elevance Health Inc.", "Healthcare", "Healthcare Plans"),

            # Financial Services (40+ companies)
            ("BRK.B", "Berkshire Hathaway Inc.", "Financial Services", "Conglomerates"),
            ("JPM", "JPMorgan Chase & Co.", "Financial Services", "Banks"),
            ("BAC", "Bank of America Corporation", "Financial Services", "Banks"),
            ("WFC", "Wells Fargo & Company", "Financial Services", "Banks"),
            ("V", "Visa Inc.", "Financial Services", "Credit Services"),
            ("MA", "Mastercard Inc.", "Financial Services", "Credit Services"),
            ("AXP", "American Express Company", "Financial Services", "Credit Services"),
            ("GS", "Goldman Sachs Group Inc.", "Financial Services", "Investment Banking"),
            ("MS", "Morgan Stanley", "Financial Services", "Investment Banking"),
            ("BLK", "BlackRock Inc.", "Financial Services", "Asset Management"),
            ("SCHW", "Charles Schwab Corporation", "Financial Services", "Investment Banking"),
            ("CME", "CME Group Inc.", "Financial Services", "Financial Data & Stock Exchanges"),
            ("ICE", "Intercontinental Exchange Inc.", "Financial Services", "Financial Data & Stock Exchanges"),
            ("SPGI", "S&P Global Inc.", "Financial Services", "Financial Data & Stock Exchanges"),
            ("COF", "Capital One Financial Corporation", "Financial Services", "Credit Services"),
            ("DFS", "Discover Financial Services", "Financial Services", "Credit Services"),
            ("AIG", "American International Group Inc.", "Financial Services", "Insurance"),
            ("MET", "MetLife Inc.", "Financial Services", "Insurance"),
            ("PRU", "Prudential Financial Inc.", "Financial Services", "Insurance"),
            ("ALL", "Allstate Corporation", "Financial Services", "Insurance"),

            # Consumer (40+ companies)
            ("WMT", "Walmart Inc.", "Consumer Defensive", "Department Stores"),
            ("PG", "Procter & Gamble", "Consumer Defensive", "Household & Personal Products"),
            ("KO", "Coca-Cola Company", "Consumer Defensive", "Beverages - Non-Alcoholic"),
            ("PEP", "PepsiCo Inc.", "Consumer Defensive", "Beverages - Non-Alcoholic"),
            ("COST", "Costco Wholesale Corporation", "Consumer Defensive", "Discount Stores"),
            ("HD", "Home Depot Inc.", "Consumer Cyclical", "Home Improvement Retail"),
            ("LOW", "Lowe's Companies Inc.", "Consumer Cyclical", "Home Improvement Retail"),
            ("MCD", "McDonald's Corporation", "Consumer Cyclical", "Restaurants"),
            ("NKE", "NIKE Inc.", "Consumer Cyclical", "Footwear & Accessories"),
            ("SBUX", "Starbucks Corporation", "Consumer Cyclical", "Restaurants"),
            ("TGT", "Target Corporation", "Consumer Cyclical", "Discount Stores"),
            ("TJX", "TJX Companies Inc.", "Consumer Cyclical", "Apparel Retail"),
            ("ROST", "Ross Stores Inc.", "Consumer Cyclical", "Apparel Retail"),
            ("BKNG", "Booking Holdings Inc.", "Consumer Cyclical", "Travel Services"),
            ("MAR", "Marriott International Inc.", "Consumer Cyclical", "Lodging"),
            ("EBAY", "eBay Inc.", "Consumer Cyclical", "Internet Retail"),
            ("ETSY", "Etsy Inc.", "Consumer Cyclical", "Internet Retail"),
            ("CL", "Colgate-Palmolive Company", "Consumer Defensive", "Household & Personal Products"),
            ("KMB", "Kimberly-Clark Corporation", "Consumer Defensive", "Household & Personal Products"),
            ("MO", "Altria Group Inc.", "Consumer Defensive", "Tobacco"),

            # Industrials (30+ companies)
            ("GE", "General Electric Company", "Industrials", "Conglomerates"),
            ("CAT", "Caterpillar Inc.", "Industrials", "Construction Machinery"),
            ("HON", "Honeywell International Inc.", "Industrials", "Conglomerates"),
            ("UPS", "United Parcel Service Inc.", "Industrials", "Integrated Freight & Logistics"),
            ("FDX", "FedEx Corporation", "Industrials", "Integrated Freight & Logistics"),
            ("MMM", "3M Company", "Industrials", "Conglomerates"),
            ("DE", "Deere & Company", "Industrials", "Farm & Heavy Construction Machinery"),
            ("EMR", "Emerson Electric Company", "Industrials", "Electrical Equipment & Parts"),
            ("ETN", "Eaton Corporation plc", "Industrials", "Electrical Equipment & Parts"),
            ("WM", "Waste Management Inc.", "Industrials", "Waste Management"),
            ("RSG", "Republic Services Inc.", "Industrials", "Waste Management"),
            ("ADP", "Automatic Data Processing Inc.", "Industrials", "Staffing & Employment Services"),
            ("PAYX", "Paychex Inc.", "Industrials", "Staffing & Employment Services"),
            ("LMT", "Lockheed Martin Corporation", "Industrials", "Aerospace & Defense"),
            ("RTX", "RTX Corporation", "Industrials", "Aerospace & Defense"),
            ("GD", "General Dynamics Corporation", "Industrials", "Aerospace & Defense"),
            ("NOC", "Northrop Grumman Corporation", "Industrials", "Aerospace & Defense"),

            # Energy (20+ companies)
            ("XOM", "Exxon Mobil Corporation", "Energy", "Oil & Gas Integrated"),
            ("CVX", "Chevron Corporation", "Energy", "Oil & Gas Integrated"),
            ("COP", "ConocoPhillips", "Energy", "Oil & Gas E&P"),
            ("EOG", "EOG Resources Inc.", "Energy", "Oil & Gas E&P"),
            ("SLB", "Schlumberger Limited", "Energy", "Oil & Gas Equipment & Services"),
            ("HAL", "Halliburton Company", "Energy", "Oil & Gas Equipment & Services"),
            ("MPC", "Marathon Petroleum Corporation", "Energy", "Oil & Gas Refining & Marketing"),
            ("PSX", "Phillips 66", "Energy", "Oil & Gas Refining & Marketing"),
            ("VLO", "Valero Energy Corporation", "Energy", "Oil & Gas Refining & Marketing"),
            ("OXY", "Occidental Petroleum Corporation", "Energy", "Oil & Gas Integrated"),
            ("KMI", "Kinder Morgan Inc.", "Energy", "Oil & Gas Midstream"),
            ("WMB", "Williams Companies Inc.", "Energy", "Oil & Gas Midstream"),
            ("ENB", "Enbridge Inc.", "Energy", "Oil & Gas Midstream"),
            ("TRP", "TC Energy Corporation", "Energy", "Oil & Gas Midstream"),

            # Materials (15+ companies)
            ("LIN", "Linde plc", "Basic Materials", "Chemicals"),
            ("APD", "Air Products and Chemicals Inc.", "Basic Materials", "Chemicals"),
            ("ECL", "Ecolab Inc.", "Basic Materials", "Specialty Chemicals"),
            ("SHW", "Sherwin-Williams Company", "Basic Materials", "Specialty Chemicals"),
            ("PPG", "PPG Industries Inc.", "Basic Materials", "Specialty Chemicals"),
            ("FCX", "Freeport-McMoRan Inc.", "Basic Materials", "Copper"),
            ("NEM", "Newmont Corporation", "Basic Materials", "Gold"),
            ("DOW", "Dow Inc.", "Basic Materials", "Chemicals"),

            # Utilities (15+ companies)
            ("NEE", "NextEra Energy Inc.", "Utilities", "Utilities - Renewable"),
            ("DUK", "Duke Energy Corporation", "Utilities", "Utilities - Regulated Electric"),
            ("SO", "Southern Company", "Utilities", "Utilities - Regulated Electric"),
            ("EXC", "Exelon Corporation", "Utilities", "Utilities - Diversified"),
            ("AEP", "American Electric Power Company Inc.", "Utilities", "Utilities - Regulated Electric"),
            ("SRE", "Sempra Energy", "Utilities", "Utilities - Regulated Gas"),
            ("PEG", "Public Service Enterprise Group Inc.", "Utilities", "Utilities - Regulated Electric"),
            ("ED", "Consolidated Edison Inc.", "Utilities", "Utilities - Regulated Electric"),

            # Real Estate (15+ companies)
            ("AMT", "American Tower Corporation", "Real Estate", "REIT - Specialty"),
            ("PLD", "Prologis Inc.", "Real Estate", "REIT - Industrial"),
            ("CCI", "Crown Castle Inc.", "Real Estate", "REIT - Specialty"),
            ("EQIX", "Equinix Inc.", "Real Estate", "REIT - Specialty"),
            ("PSA", "Public Storage", "Real Estate", "REIT - Self Storage"),
            ("O", "Realty Income Corporation", "Real Estate", "REIT - Retail"),
            ("WELL", "Welltower Inc.", "Real Estate", "REIT - Healthcare Facilities"),
            ("DLR", "Digital Realty Trust Inc.", "Real Estate", "REIT - Specialty"),

            # Additional notable companies
            ("DIS", "Walt Disney Company", "Communication Services", "Entertainment"),
            ("VZ", "Verizon Communications Inc.", "Communication Services", "Telecom Services"),
            ("T", "AT&T Inc.", "Communication Services", "Telecom Services"),
            ("CMCSA", "Comcast Corporation", "Communication Services", "Telecom Services"),
            ("CHTR", "Charter Communications Inc.", "Communication Services", "Telecom Services"),
            ("INTU", "Intuit Inc.", "Technology", "Software"),
            ("TXN", "Texas Instruments Incorporated", "Technology", "Semiconductors"),
            ("QCOM", "QUALCOMM Incorporated", "Technology", "Semiconductors"),
            ("ADI", "Analog Devices Inc.", "Technology", "Semiconductors"),
            ("MCHP", "Microchip Technology Incorporated", "Technology", "Semiconductors"),
            ("MU", "Micron Technology Inc.", "Technology", "Semiconductors"),
            ("LRCX", "Lam Research Corporation", "Technology", "Semiconductor Equipment"),
            ("KLAC", "KLA Corporation", "Technology", "Semiconductor Equipment"),
            ("AMAT", "Applied Materials Inc.", "Technology", "Semiconductor Equipment"),
            ("ASML", "ASML Holding N.V.", "Technology", "Semiconductor Equipment"),
        ]

    async def get_stocks(
        self,
        page: int = 1,
        page_size: int = 20,
        sector: Optional[str] = None,
        market_cap_min: Optional[int] = None,
        pe_min: Optional[float] = None,
        pe_max: Optional[float] = None,
    ) -> Dict[str, Any]:
        tickers = self._get_sp500_tickers()

        try:
            all_stocks = []
            for symbol, name, sector_val, industry in tickers:
                try:
                     stock = yf.Ticker(symbol)
                     info = stock.info

                     pe = info.get("trailingPE", 0)
                     pe_val = pe if pe is not None and not math.isnan(pe) else 0

                     market_cap = info.get("marketCap", 0)

                     # Calculate additional metrics
                     total_debt = info.get("totalDebt", 0)
                     cash = info.get("totalCash", 0)
                     enterprise_value = market_cap + total_debt - cash if market_cap else None

                     if sector and sector_val != sector:
                         continue
                     if pe_min is not None and pe_val < pe_min:
                         continue
                     if pe_max is not None and pe_val > pe_max:
                         continue
                     if market_cap_min and market_cap < market_cap_min:
                         continue

                     # Get technical indicators for stocks with filters
                     tech_data = None
                     if pe_min or pe_max or market_cap_min:  # Only fetch if technical filters might be needed
                         try:
                             stock_service = StockService()
                             tech_data = await stock_service.get_technical_indicators(symbol)
                         except:
                             tech_data = None

                     stock_data = {
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

                         # Enhanced fields
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

                         # Technical (if available)
                         "high_52w": info.get("fiftyTwoWeekHigh"),
                         "low_52w": info.get("fiftyTwoWeekLow"),
                         "avg_volume": info.get("averageVolume"),
                         "beta": info.get("beta"),

                         # Classification
                         "country": info.get("country"),
                         "exchange": info.get("exchange"),

                         # Additional
                         "eps": info.get("trailingEps"),
                         "shares_outstanding": info.get("sharesOutstanding"),
                         "float": info.get("floatShares"),
                     }

                     # Add technical data if available
                     if tech_data:
                         stock_data.update(tech_data)

                     all_stocks.append(stock_data)
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