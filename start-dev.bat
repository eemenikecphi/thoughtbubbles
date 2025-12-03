@echo off
echo 🎭 Setting up MoboRev development environment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ and try again.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ Node.js and npm detected
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if Expo CLI is installed globally
expo --version >nul 2>&1
if errorlevel 1 (
    echo 📱 Installing Expo CLI globally...
    npm install -g @expo/cli
)

echo.
echo 🔧 Building for web...
npx expo export --platform web

echo.
echo 🌐 Starting development server...
echo.
echo 🎉 MoboRev will open in your browser shortly...
echo.

REM Start the web server in background
start /min node web-server.js

REM Wait a moment for the server to start
timeout /t 3 >nul

REM Open in browser
start http://localhost:3000

echo.
echo 🌐 If the browser didn't open automatically, visit: http://localhost:3000
echo.
echo Press any key to stop the development server
pause >nul

REM Kill the server process
taskkill /im node.exe /f >nul 2>&1