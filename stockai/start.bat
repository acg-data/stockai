@echo off
echo Starting StockAI...
echo.
echo Backend will run on http://localhost:8000
echo Frontend will run on http://localhost:5173
echo.
echo Note: AI features use OpenRouter API. Make sure OPENROUTER_API_KEY is set in backend/.env
echo.
echo Starting backend...
cd %~dp0backend
start "StockAI Backend" cmd /c "venv\Scripts\python -m uvicorn app.main:app --reload"
echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul
echo.
echo Starting frontend...
cd %~dp0frontend
start "StockAI Frontend" cmd /c "npm run dev"
echo.
echo StockAI is starting up!
echo Please wait a few seconds for both services to initialize.
