from typing import Dict, Any, List, Optional
from app.stockai.services.stock_service import StockService
from app.stockai.services.ai_service import AIService

class AnalysisService:
    stock_service = StockService()
    ai_service = AIService()

    async def get_full_analysis(self, symbol: str) -> Optional[Dict[str, Any]]:
        quote = await self.stock_service.get_quote(symbol)
        profile = await self.stock_service.get_profile(symbol)
        financials = await self.stock_service.get_financials(symbol)

        if not quote:
            return None

        ai_summary = await self.ai_service.analyze_stock(quote, profile)

        return {
            "symbol": symbol,
            "quote": quote,
            "profile": profile,
            "ai_summary": ai_summary
        }

    async def get_sentiment(self, symbol: str) -> Dict[str, Any]:
        quote = await self.stock_service.get_quote(symbol)
        if not quote:
            return {"error": "Stock not found"}

        sentiment = await self.ai_service.analyze_sentiment(quote)

        return {
            "symbol": symbol,
            "sentiment": sentiment
        }

    async def get_fundamental_analysis(self, symbol: str) -> Dict[str, Any]:
        quote = await self.stock_service.get_quote(symbol)
        financials = await self.stock_service.get_financials(symbol)

        if not quote:
            return {"error": "Stock not found"}

        analysis = await self.ai_service.analyze_fundamentals(quote)

        return {
            "symbol": symbol,
            "quote": quote,
            "analysis": analysis
        }

    async def generate_report(self, symbol: str) -> Dict[str, Any]:
        full_analysis = await self.get_full_analysis(symbol)

        if not full_analysis:
            return {"error": "Could not generate report"}

        report_text = await self.ai_service.generate_report_text(full_analysis)

        return {
            "symbol": symbol,
            "report": report_text,
            "generated_at": "2024-01-10"
        }
