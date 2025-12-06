#!/bin/bash

echo "1. Creating a new Flight Listing..."
curl -X POST http://localhost:4002/ \
  -H "Content-Type: application/json" \
  -d '{
    "type": "FLIGHT",
    "title": "SFO to JFK Business Class",
    "description": "Non-stop flight from San Francisco to New York",
    "location": "New York, NY",
    "price": 1200.00,
    "owner_id": 2,
    "airline": "Delta Airlines",
    "departure_time": "2023-12-25 08:00:00",
    "arrival_time": "2023-12-25 16:30:00",
    "origin": "SFO",
    "destination": "JFK",
    "flight_code": "DL123",
    "duration": "5h 30m",
    "flight_class": "BUSINESS",
    "available_seats": 20,
    "rating": 4.8
  }'

echo -e "\n\nWaiting for Kafka processing..."
sleep 2

echo "2. Searching for the created Flight..."
curl "http://localhost:4002/api/search?type=FLIGHT&destination=JFK" | json_pp

echo -e "\n\nDone."
