#!/bin/bash

echo "============================================"
echo "Starting AI Agent Pilot Run"
echo "============================================"
echo "This script will simulate a user conversation to verify proactive behavior."
echo "Target: ws://localhost:8004"
echo "--------------------------------------------"

# Check if AI service is running
if ! lsof -i :8004 > /dev/null; then
    echo "ERROR: AI Service is not running on port 8004."
    echo "Please start it first."
    exit 1
fi

echo "Running interaction test..."
echo ""

# Run the python test script
cd ai-service
python test_agent_interaction.py
cd ..

echo ""
echo "============================================"
echo "Pilot Run Complete"
echo "============================================"
