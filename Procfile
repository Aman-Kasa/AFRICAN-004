web: cd backend/backend && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
release: cd backend/backend && python manage.py migrate
