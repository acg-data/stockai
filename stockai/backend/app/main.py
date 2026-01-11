from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="StockAI API",
    description="AI-Enhanced Stock Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.stockai.routes import stocks, screener, chat, analysis

app.include_router(stocks.router, prefix="/api/v1/stocks")
app.include_router(screener.router, prefix="/api/v1/screener")
app.include_router(chat.router, prefix="/api/v1/chat")
app.include_router(analysis.router, prefix="/api/v1/analysis")

@app.get("/")
async def root():
    return {"status": "ok", "message": "StockAI API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
