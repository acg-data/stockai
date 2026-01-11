from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from app.stockai.services.analysis_service import AnalysisService

router = APIRouter()
analysis_service = AnalysisService()

class AnalysisRequest(BaseModel):
    stock_symbol: str

@router.post("/full")
async def full_analysis(request: AnalysisRequest):
    analysis = await analysis_service.get_full_analysis(request.stock_symbol)
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Analysis not available for {request.stock_symbol}")
    return analysis

@router.post("/sentiment")
async def sentiment_analysis(request: AnalysisRequest):
    sentiment = await analysis_service.get_sentiment(request.stock_symbol)
    return sentiment

@router.post("/fundamentals")
async def fundamental_analysis(request: AnalysisRequest):
    fundamentals = await analysis_service.get_fundamental_analysis(request.stock_symbol)
    return fundamentals

@router.post("/generate-report")
async def generate_report(stock_symbol: str):
    report = await analysis_service.generate_report(stock_symbol)
    return report
