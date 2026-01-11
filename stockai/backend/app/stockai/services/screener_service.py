from typing import Dict, Any, List
from app.stockai.services.stock_service import StockService

class ScreenerService:
    def __init__(self):
        self.stock_service = StockService()

    FILTER_SCHEMA = {
        "valuation": {
            "market_cap": {"type": "range", "unit": "currency", "label": "Market Cap"},
            "pe_ratio": {"type": "range", "label": "P/E Ratio"},
            "forward_pe": {"type": "range", "label": "Forward P/E"},
            "peg_ratio": {"type": "range", "label": "PEG Ratio"},
            "price_to_book": {"type": "range", "label": "Price/Book"},
            "price_to_sales": {"type": "range", "label": "Price/Sales"},
            "ev_to_ebitda": {"type": "range", "label": "EV/EBITDA"},
            "ev_to_revenue": {"type": "range", "label": "EV/Revenue"},
        },
        "growth": {
            "revenue_growth": {"type": "range", "unit": "percent", "label": "Revenue Growth"},
            "earnings_growth": {"type": "range", "unit": "percent", "label": "Earnings Growth"},
            "eps_growth_this_year": {"type": "range", "unit": "percent", "label": "EPS Growth (This Year)"},
            "eps_growth_next_year": {"type": "range", "unit": "percent", "label": "EPS Growth (Next Year)"},
            "sales_growth": {"type": "range", "unit": "percent", "label": "Sales Growth"},
        },
        "profitability": {
            "gross_margin": {"type": "range", "unit": "percent", "label": "Gross Margin"},
            "operating_margin": {"type": "range", "unit": "percent", "label": "Operating Margin"},
            "profit_margin": {"type": "range", "unit": "percent", "label": "Net Profit Margin"},
            "return_on_assets": {"type": "range", "unit": "percent", "label": "Return on Assets"},
            "return_on_equity": {"type": "range", "unit": "percent", "label": "Return on Equity"},
            "return_on_invested_capital": {"type": "range", "unit": "percent", "label": "Return on Invested Capital"},
        },
        "dividend": {
            "dividend_yield": {"type": "range", "unit": "percent", "label": "Dividend Yield"},
            "dividend_growth": {"type": "range", "unit": "percent", "label": "Dividend Growth"},
            "payout_ratio": {"type": "range", "unit": "percent", "label": "Payout Ratio"},
        },
        "liquidity": {
            "current_ratio": {"type": "range", "label": "Current Ratio"},
            "quick_ratio": {"type": "range", "label": "Quick Ratio"},
            "debt_to_equity": {"type": "range", "label": "Debt/Equity"},
            "lt_debt_to_equity": {"type": "range", "label": "LT Debt/Equity"},
        },
        "technical": {
            "rsi_14": {"type": "range", "label": "RSI (14)"},
            "price_change_1m": {"type": "range", "unit": "percent", "label": "1M Price Change"},
            "price_change_3m": {"type": "range", "unit": "percent", "label": "3M Price Change"},
            "price_change_6m": {"type": "range", "unit": "percent", "label": "6M Price Change"},
            "beta": {"type": "range", "label": "Beta"},
            "distance_52w_high": {"type": "range", "unit": "percent", "label": "Distance from 52W High"},
            "distance_52w_low": {"type": "range", "unit": "percent", "label": "Distance from 52W Low"},
        },
        "classification": {
            "sector": {"type": "select", "label": "Sector"},
            "industry": {"type": "select", "label": "Industry"},
            "exchange": {"type": "select", "label": "Exchange"},
            "country": {"type": "select", "label": "Country"},
        },
    }

    PRESETS = {
        "high_growth": {
            "name": "High Growth Stocks",
            "description": "Stocks with strong revenue and earnings growth",
            "filters": {
                "revenue_growth": {"min": 20},
                "earnings_growth": {"min": 15},
                "market_cap": {"min": 500000000}
            }
        },
        "undervalued": {
            "name": "Undervalued Value",
            "description": "Stocks with low PE ratios and reasonable dividend yields",
            "filters": {
                "pe_ratio": {"max": 15},
                "price_to_book": {"max": 1.5},
                "dividend_yield": {"min": 1}
            }
        },
        "momentum": {
            "name": "Strong Momentum",
            "description": "Stocks with positive price momentum and oversold technicals",
            "filters": {
                "price_change_3m": {"min": 10},
                "rsi_14": {"min": 50, "max": 80},
                "beta": {"min": 1.0}
            }
        },
        "dividend_kings": {
            "name": "Dividend Aristocrats",
            "description": "High-quality dividend stocks with sustainable payouts",
            "filters": {
                "dividend_yield": {"min": 2.5},
                "payout_ratio": {"max": 75},
                "return_on_equity": {"min": 10}
            }
        },
        "small_cap_growth": {
            "name": "Small Cap Growth",
            "description": "High growth small cap stocks with strong fundamentals",
            "filters": {
                "market_cap": {"min": 300000000, "max": 2000000000},
                "revenue_growth": {"min": 20},
                "earnings_growth": {"min": 15}
            }
        },
        "deep_value": {
            "name": "Deep Value",
            "description": "Extremely undervalued stocks with strong balance sheets",
            "filters": {
                "pe_ratio": {"max": 10},
                "price_to_book": {"max": 1.0},
                "debt_to_equity": {"max": 0.5},
                "current_ratio": {"min": 1.5}
            }
        },
        "quality_growth": {
            "name": "Quality Growth",
            "description": "High-quality growth stocks with strong margins",
            "filters": {
                "return_on_equity": {"min": 15},
                "gross_margin": {"min": 40},
                "revenue_growth": {"min": 10},
                "debt_to_equity": {"max": 1.0}
            }
        }
    }

    async def screen(self, filters: Dict[str, Any], limit: int = 50) -> List[Dict[str, Any]]:
        all_tickers = self._get_all_tickers()
        results = []

        for symbol in all_tickers[:200]:  # Check more stocks for better results
            try:
                quote = await self.stock_service.get_quote(symbol)
                if not quote:
                    continue

                # Add technical indicators if any technical filters are applied
                tech_filters = ['rsi_14', 'price_change_1m', 'price_change_3m', 'price_change_6m',
                               'beta', 'distance_52w_high', 'distance_52w_low']
                if any(f in filters for f in tech_filters):
                    tech_data = await self.stock_service.get_technical_indicators(symbol)
                    if tech_data:
                        quote.update(tech_data)

                if self._match_filters(quote, filters):
                    # Add AI signal based on various metrics
                    quote['ai_signal'] = self._calculate_ai_signal(quote)
                    results.append(quote)
            except Exception as e:
                print(f"Error screening {symbol}: {e}")
                continue

        # Sort by relevance (strongest matches first)
        results = self._sort_by_relevance(results, filters)
        return results[:limit]

    def _match_filters(self, stock: Dict[str, Any], filters: Dict[str, Any]) -> bool:
        for key, condition in filters.items():
            if key not in stock:
                continue
            value = stock.get(key)
            if value is None:
                continue

            if isinstance(condition, dict):
                if "min" in condition and value < condition["min"]:
                    return False
                if "max" in condition and value > condition["max"]:
                    return False
                if "equals" in condition and value != condition["equals"]:
                    return False
            elif isinstance(condition, (int, float)):
                if value != condition:
                    return False
            elif isinstance(condition, str):
                # For categorical filters (sector, industry, etc.)
                if value != condition:
                    return False
        return True

    def _calculate_ai_signal(self, stock: Dict[str, Any]) -> str:
        """Calculate AI signal based on multiple factors"""
        score = 0

        # Valuation factors
        pe = stock.get('pe_ratio')
        if pe and pe < 15:
            score += 2
        elif pe and pe > 30:
            score -= 1

        # Growth factors
        revenue_growth = stock.get('revenue_growth')
        if revenue_growth and revenue_growth > 20:
            score += 2
        elif revenue_growth and revenue_growth < 5:
            score -= 1

        # Technical factors
        rsi = stock.get('rsi_14')
        if rsi and rsi < 30:
            score += 1  # Oversold
        elif rsi and rsi > 70:
            score -= 1  # Overbought

        price_change_3m = stock.get('price_change_3m')
        if price_change_3m and price_change_3m > 15:
            score += 1
        elif price_change_3m and price_change_3m < -10:
            score -= 1

        # Quality factors
        roe = stock.get('return_on_equity')
        if roe and roe > 15:
            score += 1

        dividend_yield = stock.get('dividend_yield')
        if dividend_yield and dividend_yield > 2:
            score += 1

        # Determine signal
        if score >= 4:
            return "Strong Buy"
        elif score >= 2:
            return "Buy"
        elif score >= 0:
            return "Neutral"
        elif score >= -2:
            return "Hold"
        else:
            return "Sell"

    def _sort_by_relevance(self, stocks: List[Dict[str, Any]], filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Sort stocks by relevance to the applied filters"""
        def relevance_score(stock):
            score = 0
            for key, condition in filters.items():
                if key not in stock or stock[key] is None:
                    continue

                value = stock[key]
                if isinstance(condition, dict):
                    if "min" in condition:
                        # Closer to minimum = higher relevance
                        min_val = condition["min"]
                        if value >= min_val:
                            score += max(0, 1 - abs(value - min_val) / max(min_val, 1))
                    if "max" in condition:
                        # Closer to maximum = higher relevance
                        max_val = condition["max"]
                        if value <= max_val:
                            score += max(0, 1 - abs(value - max_val) / max(max_val, 1))

            # Prefer higher AI signal scores
            signal_priority = {"Strong Buy": 4, "Buy": 3, "Neutral": 2, "Hold": 1, "Sell": 0}
            score += signal_priority.get(stock.get('ai_signal', 'Neutral'), 2) * 0.5

            return score

        return sorted(stocks, key=relevance_score, reverse=True)

    def _get_all_tickers(self) -> List[str]:
        return [
            "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK.B", "JPM", "V",
            "JNJ", "WMT", "PG", "MA", "UNH", "HD", "DIS", "BAC", "ADBE", "CRM",
            "NFLX", "PYPL", "INTC", "CSCO", "PFE", "TMO", "ABT", "ABBV", "ACN", "MCD",
            "NKE", "MRK", "PEP", "KO", "COST", "AVGO", "TXN", "QCOM", "HON", "UPS",
            "AMD", "IBM", "ORCL", "NOW", "AMAT", "MU", "LRCX", "ADI", "MCHP", "FISV"
        ]

    def get_presets(self) -> Dict[str, Dict[str, Any]]:
        return self.PRESETS

    async def natural_language_screen(self, query: str) -> Dict[str, Any]:
        from app.stockai.services.ai_service import AIService
        ai_service = AIService()

        interpretation = await ai_service.interpret_screener_query(query)

        results = await self.screen(interpretation.get("filters", {}))

        return {
            "original_query": query,
            "interpreted_filters": interpretation.get("filters", {}),
            "interpretation": interpretation.get("explanation", ""),
            "results": results,
            "count": len(results)
        }
