#!/bin/bash

echo "🔄 Testing if data migration is available on live server..."

# Test if the management command exists
response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"test": "ping"}' \
  https://african-004-backend.onrender.com/api/users/ 2>/dev/null || echo "connection_failed")

if [[ "$response" == *"connection_failed"* ]]; then
    echo "❌ Cannot connect to backend"
    exit 1
fi

echo "✅ Backend is accessible"
echo ""
echo "📋 Data Migration Options:"
echo ""
echo "Option 1 - Use Django Admin (Recommended):"
echo "  1. Go to: https://african-004-backend.onrender.com/admin/"
echo "  2. Login: admin / admin123"
echo "  3. Manually recreate your data or import via Django admin"
echo ""
echo "Option 2 - API Upload (if you have shell access):"
echo "  1. Upload local_data.json to the server"
echo "  2. Run: python manage.py loaddata local_data.json"
echo ""
echo "Option 3 - Frontend Recreation:"
echo "  1. Use your React frontend to recreate the data"
echo "  2. Add suppliers, inventory, orders through the UI"
echo ""
echo "🎯 Quick Start - Create aman user via API:"
echo "curl -X POST https://african-004-backend.onrender.com/api/users/ \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"username\":\"aman\",\"email\":\"aman@example.com\",\"password\":\"aman@123\"}'"
