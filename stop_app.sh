#!/bin/bash

echo "============================================"
echo "Stopping Kayak Project Deployment"
echo "============================================"

# Function to kill process by port
kill_port() {
    PORT=$1
    NAME=$2
    PID=$(lsof -t -i:$PORT)
    if [ -n "$PID" ]; then
        echo "Stopping $NAME (PID: $PID)..."
        kill $PID
    else
        echo "$NAME is not running (Port $PORT free)."
    fi
}

# 1. Stop Web Services
echo "[1/3] Stopping Web Services..."
kill_port 3000 "Frontend Application"
kill_port 3001 "API Gateway"
kill_port 8004 "AI Service"

# 2. Stop Background Consumers
echo "[2/3] Stopping Background Consumers..."
pkill -f "services/user_consumer.js" && echo "  - User Consumer stopped"
pkill -f "services/admin_consumer.js" && echo "  - Admin Consumer stopped"
pkill -f "services/booking_consumer.js" && echo "  - Booking Consumer stopped"

# 3. Stop Infrastructure
echo "[3/3] Stopping Docker Infrastructure..."
docker-compose down

echo "============================================"
echo "All services and infrastructure stopped."
echo "============================================"
