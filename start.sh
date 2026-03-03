#!/bin/bash

echo "🚀 Starting Smart Waste Management System..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    brew services start mongodb-community 2>/dev/null || sudo systemctl start mongodb 2>/dev/null || echo "Please start MongoDB manually"
    sleep 3
else
    echo "✅ MongoDB is running"
fi

# Start backend
echo ""
echo "🔧 Starting Backend Server..."
cd backend
npm install 2>/dev/null
node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Start frontend
echo ""
echo "🌐 Starting Frontend Server..."
python3 -m http.server 8000 &
FRONTEND_PID=$!

echo ""
echo "✅ System Started Successfully!"
echo ""
echo "📊 Backend API: http://localhost:5000"
echo "🌐 Frontend: http://localhost:8000"
echo "🔐 Login Page: http://localhost:8000/login.html"
echo ""
echo "👥 Demo Admin Accounts:"
echo "   ADMIN001 / admin123 (Super Admin)"
echo "   ADMIN002 / ops123 (Operations)"
echo "   ADMIN003 / analytics123 (Analytics)"
echo "   ADMIN004 / fleet123 (Fleet Manager)"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All servers stopped"
    exit 0
}

trap cleanup INT TERM

# Wait for user to stop
wait
