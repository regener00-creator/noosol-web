@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo [!] Node.js is not installed. Install from https://nodejs.org first.
    start https://nodejs.org/
    pause
    exit /b
)

echo.
echo ============================================
echo   Deploy NOOSOL website to Vercel
echo   (no GitHub needed)
echo ============================================
echo.
echo If asked to log in: choose "Continue with GitHub"
echo or "Continue with Email" and follow the browser.
echo.

call npx vercel@latest deploy --prod

echo.
echo Done! Website: https://noosol-web.vercel.app
pause
