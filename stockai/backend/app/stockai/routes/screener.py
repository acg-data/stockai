from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from app.stockai.services.screener_service import ScreenerService

router = APIRouter()
screener_service = ScreenerService()

class ScreenerRequest(BaseModel):
    filters: Dict[str, Any]

@router.post("/query")
async def run_screener(request: ScreenerRequest):
    results = await screener_service.screen(request.filters)
    return {"count": len(results), "results": results}

@router.get("/presets")
async def get_presets():
    return screener_service.get_presets()

@router.post("/natural-language")
async def natural_language_screener(query: str):
    results = await screener_service.natural_language_screen(query)
    return results

@router.get("/filters")
async def get_available_filters():
    return {
        "valuation": ["market_cap", "pe_ratio", "price_to_book", "price_to_sales", "ev_to_ebitda"],
        "growth": ["revenue_growth", "earnings_growth", "eps_growth", "sales_growth_5y"],
        "profitability": ["profit_margin", "operating_margin", "roe", "roa", "roic"],
        "dividend": ["dividend_yield", "payout_ratio", "dividend_growth"],
        "momentum": ["rsi_14", "price_change_1m", "price_change_3m", "price_change_6m"],
        "size": ["market_cap", "enterprise_value"],
        "technical": ["high_52w", "low_52w", "sma_50", "sma_200", "rsi_14"]
    }
