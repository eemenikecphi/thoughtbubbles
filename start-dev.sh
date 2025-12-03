#!/bin/bash

echo "🎭 Setting up MoboRev development environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ Node.js and npm detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Expo CLI is installed globally
if ! command -v expo &> /dev/null; then
    echo "📱 Installing Expo CLI globally..."
    npm install -g @expo/cli
fi

echo ""
echo "🔧 Building for web..."
npx expo export --platform web

echo ""
echo "🌐 Starting development server..."
echo ""
echo "🎉 MoboRev will open in your browser shortly..."
echo ""

# Start the web server
node web-server.js &
SERVER_PID=$!

# Wait a moment for the server to start
sleep 2

# Try to open in browser (works on most systems)
if command -v open &> /dev/null; then
    # macOS
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:3000
elif command -v start &> /dev/null; then
    # Windows
    start http://localhost:3000
else
    echo "🌐 Please open your browser and visit: http://localhost:3000"
fi

# Keep the script running
echo ""
echo "Press Ctrl+C to stop the development server"
wait $SERVER_PID