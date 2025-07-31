#!/bin/bash

# Build script for Render deployment

set -o errexit  # exit on error

echo "🚀 Starting African-004 deployment build..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Navigate to Django backend
cd backend/backend

echo "🔄 Running Django migrations..."
python manage.py migrate --noinput

echo "� Creating superuser..."
echo "from users.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'a.kasa@alustudent.com', 'admin123', role='ADMIN')" | python manage.py shell

echo "�📂 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Backend build completed!"

# Build React frontend
echo "⚛️ Building React frontend..."
cd ../../frontend
npm install
npm run build

echo "✅ Frontend build completed!"
echo "🎉 Deployment build finished successfully!"
