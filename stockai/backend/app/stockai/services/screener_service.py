from typing import Dict, Any, List
from app.stockai.services.stock_service import StockService

class ScreenerService:
    stock_service = StockService()

    PRESETS = {
        "high_growth": {
            "name": "High Growth Stocks",
            "description": "Stocks with strong revenue and earnings growth",
            "filters": {"revenue_growth": {"min": 20}, "eps_growth": {"min": 15}}
        },
        "undervalued": {
            "name": "Undervalued Value",
            "description": "Stocks with low PE ratios and high dividend yields",
            "filters": {"pe_ratio": {"max": 15}, "dividend_yield": {"min": 2}}
        },
        "momentum": {
            "name": "Strong Momentum",
            "description": "Stocks with positive price momentum",
            "filters": {"price_change_3m": {"min": 10}, "rsi_14": {"min": 50, "max": 80}}
        },
        "dividend_kings": {
            "name": "Dividend Kings",
            "description": "Stocks with high dividend yields and payout ratios",
            "filters": {"dividend_yield": {"min": 3}, "payout_ratio": {"max": 75}}
        },
        "small_cap_growth": {
            "name": "Small Cap Growth",
            "description": "High growth small cap stocks",
            "filters": {"market_cap": {"min": 300000000, "max": 10000000000}, "revenue_growth": {"min": 25}}
        }
    }

    async def screen(self, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        all_tickers = self._get_all_tickers()
        results = []

        for symbol in all_tickers[:100]:
            try:
                from app.stockai.services.stock_service import StockService
                stock_service = StockService()
                quote = await stock_service.get_quote(symbol)
                if quote and self._match_filters(quote, filters):
                    results.append(quote)
            except:
                continue

        return results[:50]

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
            elif isinstance(condition, (int, float)):
                if value != condition:
                    return False
        return True

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
