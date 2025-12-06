#!/bin/bash

# Test User Data
EMAIL="akshay.menon@usa.com"
SSN="123456789"
CC="1234567812345678"

echo "========================================"
echo "Starting Signup Pilot Run"
echo "========================================"
echo "Target: http://localhost:4000/api/users"
echo "Email: $EMAIL"
echo "SSN: $SSN"
echo "Credit Card: $CC"
echo "----------------------------------------"

# Send Request
RESPONSE=$(curl -s -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d "{
    \"first_name\": \"Pilot\",
    \"last_name\": \"User\",
    \"email\": \"$EMAIL\",
    \"password\": \"password123\",
    \"ssn\": \"$SSN\",
    \"credit_card_number\": \"$CC\",
    \"address\": \"123 Test Lane\",
    \"city\": \"Test City\",
    \"state\": \"TS\",
    \"zip_code\": \"12345\",
    \"phone_number\": \"555-0000\"
  }")

echo "Response: $RESPONSE"

# Check for success
if [[ "$RESPONSE" == *"User creation request queued"* ]]; then
  echo "----------------------------------------"
  echo "✅ SUCCESS: Signup request queued."
  echo "========================================"
else
  echo "----------------------------------------"
  echo "❌ FAILURE: Signup request failed."
  echo "========================================"
  exit 1
fi
