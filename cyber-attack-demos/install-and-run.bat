@echo off
echo ========================================
echo  Cyber Attack Demos - Setup Script
echo ========================================
echo.

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo Please make sure Node.js is installed on your system.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo Starting the development server...
echo The application will open in your browser automatically.
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.

call npm run dev

pause