# PythonAnywhere Deployment Instructions

## After creating your PythonAnywhere account:

### Step 1: Upload Your Code
1. Go to your PythonAnywhere dashboard
2. Open a Bash console
3. Run: git clone https://github.com/Aman-Kasa/AFRICAN-004.git
4. Run: cd AFRICAN-004

### Step 2: Create Virtual Environment
1. Run: python3.10 -m venv venv
2. Run: source venv/bin/activate
3. Run: pip install -r requirements.txt

### Step 3: Configure Web App
1. Go to Web tab in dashboard
2. Click "Add a new web app"
3. Choose "Manual configuration"
4. Choose Python 3.10
5. Set source code: /home/yourusername/AFRICAN-004
6. Set working directory: /home/yourusername/AFRICAN-004/backend/backend
7. Set WSGI file: copy contents from wsgi_pythonanywhere.py

### Step 4: Set Environment Variables
In the Web tab, add these environment variables:
- SECRET_KEY=your-secret-key-here
- DEBUG=False

### Step 5: Static Files
- Static files URL: /static/
- Static files directory: /home/yourusername/AFRICAN-004/backend/backend/staticfiles

### Step 6: Database Setup
1. Open Bash console
2. Run: cd AFRICAN-004/backend/backend
3. Run: source ../../venv/bin/activate
4. Run: python manage.py migrate
5. Run: python manage.py collectstatic

Your app will be live at: yourusername.pythonanywhere.com
