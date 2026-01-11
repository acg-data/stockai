from typing import Dict, Any, List, Optional
import os
import aiohttp

class AIService:
    async def chat(self, context: str, user_message: str) -> str:
        if not context:
            context = "No specific stock context provided."

        prompt = f"""You are a helpful financial assistant. Use the following context to answer the user's question.

Context:
{context}

User Question: {user_message}

Provide a helpful, accurate, and concise response. If you're providing investment advice, include appropriate disclaimers."""

        response = await self._call_llama(prompt)
        return response

    async def explain_metric(self, metric: str, value: Any) -> str:
        metric_descriptions = {
            "pe_ratio": "Price-to-Earnings ratio measures a company's current share price relative to its earnings per share. Lower values may indicate undervaluation.",
            "market_cap": "Market capitalization represents the total market value of a company's outstanding shares. It indicates company size.",
            "dividend": "Dividend yield shows the annual dividend payment as a percentage of the stock price.",
            "eps": "Earnings Per Share indicates a company's profitability on a per-share basis.",
            "revenue_growth": "Revenue growth shows how much a company's revenue has increased over time, indicating business momentum.",
            "profit_margin": "Profit margin measures what percentage of revenue becomes profit after all expenses.",
            "roe": "Return on Equity measures how efficiently a company uses shareholder equity to generate profits.",
            "rsi_14": "Relative Strength Index (14-day) measures momentum. Values above 70 may indicate overbought, below 30 may indicate oversold."
        }

        if metric in metric_descriptions:
            base_info = metric_descriptions[metric]
        else:
            base_info = f"The {metric} metric is a financial measure used to evaluate stocks."

        prompt = f"""Explain what {metric} means for a stock. Current value: {value}

{base_info}

Provide a clear explanation in 2-3 sentences."""
        return await self._call_llama(prompt)

    async def summarize_stock(self, context: Dict[str, Any]) -> str:
        quote = context.get("quote", {})
        profile = context.get("profile", {})

        prompt = f"""Summarize this stock in a brief overview:

Symbol: {quote.get('symbol', 'N/A')}
Name: {quote.get('name', 'N/A')}
Price: ${quote.get('price', 0)}
Change: {quote.get('change_percent', 0)}%
Market Cap: {quote.get('market_cap', 'N/A')}
Sector: {profile.get('sector', 'N/A')}
Industry: {profile.get('industry', 'N/A')}

Provide a 2-3 sentence summary covering the business, recent performance, and key characteristics."""
        return await self._call_llama(prompt)

    async def analyze_stock(self, quote: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""Analyze this stock and provide insights:

{quote}

Description: {profile.get('description', 'N/A')}

Provide analysis in JSON format with keys: outlook (bullish/bearish/neutral), key_strengths (array of 2-3 points), key_risks (array of 2-3 points), recommendation (buy/hold/sell/hold for now)"""

        response = await self._call_llama(prompt)
        try:
            import json
            return json.loads(response)
        except:
            return {
                "outlook": "neutral",
                "key_strengths": [],
                "key_risks": [],
                "recommendation": "hold"
            }

    async def analyze_sentiment(self, quote: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""Analyze market sentiment for this stock:

{quote}

Provide sentiment analysis including: overall_sentiment (bullish/bearish/neutral), momentum (strong/moderate/weak), and key_factors (array of 2-3 factors affecting sentiment)"""

        response = await self._call_llama(prompt)
        try:
            import json
            return json.loads(response)
        except:
            return {
                "overall_sentiment": "neutral",
                "momentum": "moderate",
                "key_factors": []
            }

    async def analyze_fundamentals(self, quote: Dict[str, Any]) -> Dict[str, Any]:
        prompt = f"""Analyze fundamentals for this stock:

{quote}

Provide fundamental analysis including: valuation (undervalued/fair/overvalued), financial_health (strong/moderate/weak), growth_prospects (high/moderate/low)"""

        response = await self._call_llama(prompt)
        try:
            import json
            return json.loads(response)
        except:
            return {
                "valuation": "fair",
                "financial_health": "moderate",
                "growth_prospects": "moderate"
            }

    async def generate_report_text(self, analysis: Dict[str, Any]) -> str:
        quote = analysis.get("quote", {})
        ai_summary = analysis.get("ai_summary", {})

        prompt = f"""Generate a professional stock analysis report for {quote.get('symbol', 'N/A')} ({quote.get('name', 'N/A')})

Current Price: ${quote.get('price', 0)}
Market Cap: {quote.get('market_cap', 'N/A')}
PE Ratio: {quote.get('pe_ratio', 'N/A')}
52-Week Range: ${quote.get('low_52w', 0)} - ${quote.get('high_52w', 0)}

AI Analysis Summary:
{ai_summary}

Generate a comprehensive report with sections: Executive Summary, Financial Overview, AI Insights, and Outlook."""

        return await self._call_llama(prompt)

    async def interpret_screener_query(self, query: str) -> Dict[str, Any]:
        prompt = f"""Interpret this natural language stock screener query and convert to filters:

Query: "{query}"

Return JSON with:
- filters: object with appropriate filter conditions (min/max values where applicable)
- explanation: brief description of what the query means

Example format:
{{"filters": {{"market_cap": {{"min": 1000000000}}, "pe_ratio": {{"max": 20}}}}, "explanation": "Large cap stocks with P/E under 20"}}"""

        response = await self._call_llama(prompt)
        try:
            import json
            return json.loads(response)
        except:
            return {"filters": {}, "explanation": "Could not interpret query"}

    async def _call_llama(self, prompt: str) -> str:
        api_key = os.environ.get("OPENROUTER_API_KEY")

        if not api_key:
            return self._fallback_response(prompt)

        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:5173",
                        "X-Title": "StockAI"
                    },
                    json={
                        "model": "meta-llama/llama-3-8b-instruct",
                        "messages": [{"role": "user", "content": prompt}],
                        "max_tokens": 500,
                        "temperature": 0.7
                    }
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result["choices"][0]["message"]["content"]
        except Exception as e:
            pass

        return self._fallback_response(prompt)

    def _fallback_response(self, prompt: str) -> str:
        return "AI analysis temporarily unavailable. Please try again later."
