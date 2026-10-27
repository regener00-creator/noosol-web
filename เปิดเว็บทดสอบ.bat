@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo [!] Node.js is not installed yet.
    echo     Opening download page... Install the LTS version, then run this file again.
    start https://nodejs.org/
    pause
    exit /b
)

if not exist node_modules (
    echo.
    echo Installing packages - first time only, takes 2-5 minutes...
    call npm install
)

echo.
echo Starting local website...
echo Open:  http://localhost:3000
echo Stop:  close this window or press Ctrl+C
echo.
start "" "http://localhost:3000"
call npm run dev
pause
