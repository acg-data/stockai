from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from app.stockai.services.stock_service import StockService
from app.stockai.services.massive_service import MassiveStockService

router = APIRouter()
stock_service = StockService()
massive_service = MassiveStockService()

class StockQuote(BaseModel):
    symbol: str
    name: Optional[str] = None
    price: float
    change: float
    change_percent: float
    market_cap: Optional[float] = None
    pe_ratio: Optional[float] = None
    dividend: Optional[float] = None
    eps: Optional[float] = None
    high_52w: Optional[float] = None
    low_52w: Optional[float] = None

@router.get("/quote/{symbol}")
async def get_quote(symbol: str):
    quote = await stock_service.get_quote(symbol)
    if not quote:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
    return quote

@router.get("/profile/{symbol}")
async def get_profile(symbol: str):
    profile = await stock_service.get_profile(symbol)
    if not profile:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
    return profile

@router.get("/financials/{symbol}")
async def get_financials(symbol: str):
    financials = await stock_service.get_financials(symbol)
    if not financials:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
    return financials

@router.get("/search/{query}")
async def search_stocks(query: str):
    results = await stock_service.search(query)
    return {"results": results}

@router.get("/trending")
async def get_trending():
    return await stock_service.get_trending()

@router.get("/list")
async def get_stocks_list(
    page: int = 1,
    page_size: int = 20,
    sector: Optional[str] = None,
    market_cap_min: Optional[int] = None,
    pe_min: Optional[float] = None,
    pe_max: Optional[float] = None,
):
    return await massive_service.get_stocks(
        page=page,
        page_size=page_size,
        sector=sector,
        market_cap_min=market_cap_min,
        pe_min=pe_min,
        pe_max=pe_max,
    )

@router.get("/massive/{symbol}")
async def get_massive_quote(symbol: str):
    quote = await massive_service.get_quote(symbol)
    if not quote:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found in Massive API")
    return quote
