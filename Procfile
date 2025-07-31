web: cd backend/backend && gunicorn core.wsgi:application --host 0.0.0.0 --port $PORT
release: cd backend/backend && python manage.py migrate
