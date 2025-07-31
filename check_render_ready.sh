#!/bin/bash

echo "🔄 Checking if Render backend is ready..."

# Check if the backend is responding
response=$(curl -s -o /dev/null -w "%{http_code}" https://african-004-backend.onrender.com/api/)

if [ "$response" = "200" ]; then
    echo "✅ Backend is ready! Status: $response"
    echo ""
    echo "🚀 Now you can run the data migration:"
    echo "1. Go to Render Dashboard"
    echo "2. Open your backend service shell"
    echo "3. Run: python manage.py load_local_data"
    echo "4. Reset password: python manage.py reset_password aman aman@123"
    echo ""
    echo "📱 Or use the web shell at:"
    echo "https://dashboard.render.com/web/srv-[your-service-id]/shell"
else
    echo "⏳ Backend still deploying... Status: $response"
    echo "Wait a few more minutes and try again"
fi
