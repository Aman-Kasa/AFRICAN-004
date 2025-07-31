# PythonAnywhere WSGI configuration for Django

import os
import sys

# Add your project directory to Python path
path = '/home/yourusername/AFRICAN-004/backend/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# Set Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
