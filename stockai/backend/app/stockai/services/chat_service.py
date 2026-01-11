from typing import List, Dict, Any, Optional
from app.stockai.services.stock_service import StockService
from app.stockai.services.ai_service import AIService

class ChatService:
    stock_service = StockService()
    ai_service = AIService()

    async def chat(self, messages: List[Dict[str, str]], stock_symbol: Optional[str] = None) -> Dict[str, Any]:
        if not messages:
            return {"response": "Please provide a message."}

        last_message = messages[-1]
        user_input = last_message.get("content", "")

        context = ""
        if stock_symbol:
            quote = await self.stock_service.get_quote(stock_symbol)
            if quote:
                context = f"Stock: {stock_symbol}\n" + "\n".join([f"{k}: {v}" for k, v in quote.items() if v])

        response = await self.ai_service.chat(context, user_input)

        return {
            "response": response,
            "sources": [f"yfinance data for {stock_symbol}"] if stock_symbol else []
        }

    async def explain_metric(self, stock_symbol: str, metric: str) -> str:
        quote = await self.stock_service.get_quote(stock_symbol)
        if not quote:
            return f"Stock {stock_symbol} not found"

        value = quote.get(metric)
        explanation = await self.ai_service.explain_metric(metric, value)
        return explanation

    async def summarize_stock(self, stock_symbol: str) -> str:
        quote = await self.stock_service.get_quote(stock_symbol)
        profile = await self.stock_service.get_profile(stock_symbol)

        context = {
            "quote": quote,
            "profile": profile
        }

        summary = await self.ai_service.summarize_stock(context)
        return summary
