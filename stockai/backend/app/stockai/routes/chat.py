from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.stockai.services.chat_service import ChatService

router = APIRouter()
chat_service = ChatService()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    stock_symbol: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = None

@router.post("/query")
async def chat(request: ChatRequest):
    messages_dict = [{"role": m.role, "content": m.content} for m in request.messages]
    response = await chat_service.chat(messages_dict, request.stock_symbol)
    return response

@router.post("/explain")
async def explain_metric(stock_symbol: str, metric: str):
    explanation = await chat_service.explain_metric(stock_symbol, metric)
    return {"explanation": explanation}

@router.post("/summarize")
async def summarize_stock(stock_symbol: str):
    summary = await chat_service.summarize_stock(stock_symbol)
    return {"summary": summary}
