#!/bin/bash

echo "============================================"
echo "Starting Kayak Project Deployment"
echo "============================================"

# 1. Start Infrastructure
echo "[1/4] Starting Docker Infrastructure..."
docker-compose up -d
echo "Waiting for Kafka to be ready..."
sleep 10

# 2. Start Microservices
echo "Starting API Gateway (Port 4000)..."
nohup node backend/api-gateway/index.js > logs/gateway.log 2>&1 &

echo "Starting User Service (Port 4001)..."
nohup node backend/user-service/index.js > logs/user-service.log 2>&1 &

echo "Starting Listings Service (Port 4002)..."
nohup node backend/listings-service/index.js > logs/listings-service.log 2>&1 &

echo "Starting Booking Service (Port 4003)..."
nohup node backend/booking-service/index.js > logs/booking-service.log 2>&1 &

# Start Consumers (Background Workers)
echo "Starting Kafka Consumers..."

nohup node backend/services/user_consumer.js > logs/user_consumer.log 2>&1 &
echo "  - User Consumer started"

nohup node backend/services/admin_consumer.js > logs/admin_consumer.log 2>&1 &
echo "  - Admin Consumer started"

nohup node backend/services/booking_consumer.js > logs/booking_consumer.log 2>&1 &
echo "  - Booking Consumer started"

# 3. Start AI Service
echo "[3/4] Starting AI Service..."
cd ai-service
# Using port 8004 as determined during setup
nohup uvicorn main:app --reload --port 8004 > ../logs/ai_service.log 2>&1 &
echo "  - AI Service started (Port 8004)"
cd ..

# 4. Start Frontend
echo "[4/4] Starting Frontend Application..."
cd frontend
nohup npm run dev > ../logs/frontend.log 2>&1 &
echo "  - Frontend Application started (Port 3000)"
cd ..

echo "============================================"
echo "Deployment Complete!"
echo "Access the application at: http://localhost:3000"
echo "Logs are being written to *.log files in the project root."
echo "============================================"
