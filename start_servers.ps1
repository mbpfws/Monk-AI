# PowerShell script to start both servers for Monk-AI hackathon demo
Write-Host "🚀 Starting Monk-AI Multi-Agent System..." -ForegroundColor Green

# Kill any existing Python processes
Write-Host "Stopping existing servers..." -ForegroundColor Yellow
taskkill /F /IM python.exe 2>$null
taskkill /F /IM node.exe 2>$null
Start-Sleep 2

# Start backend server in background
Write-Host "Starting FastAPI backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; python -m uvicorn app.main:app --reload --port 8000" -WindowStyle Minimized

# Wait for backend to start
Start-Sleep 5

# Start frontend server
Write-Host "Starting React frontend server..." -ForegroundColor Cyan
Set-Location frontend
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npm start" -WindowStyle Minimized

# Return to root directory
Set-Location ..

Write-Host "✅ Both servers are starting up!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Multi-Agent Orchestrator: http://localhost:3000/multi-agent" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to stop all servers..." -ForegroundColor Red
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Stop all servers
Write-Host "Stopping all servers..." -ForegroundColor Yellow
taskkill /F /IM python.exe 2>$null
taskkill /F /IM node.exe 2>$null
Write-Host "All servers stopped." -ForegroundColor Green 