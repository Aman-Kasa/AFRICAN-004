#!/usr/bin/env python3
import json
import requests
import sys

# Backend URL
BASE_URL = "https://african-004-backend.onrender.com"

def get_auth_token(username, password):
    """Get JWT token for authentication"""
    url = f"{BASE_URL}/api/token/"
    data = {"username": username, "password": password}
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json()["access"]
        else:
            print(f"❌ Failed to get token: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return None

def create_user_via_api():
    """Create the aman user via API"""
    url = f"{BASE_URL}/api/users/"
    data = {
        "username": "aman",
        "email": "aman@african004.com",
        "password": "aman@123",
        "first_name": "Aman",
        "last_name": "Kasa"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 201:
            print("✅ User 'aman' created successfully!")
            return True
        else:
            print(f"⚠️ User creation response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        return False

def upload_data_via_admin():
    """Instructions for manual data upload"""
    print("\n📋 Manual Data Upload Instructions:")
    print("=" * 50)
    print("1. Go to: https://african-004-backend.onrender.com/admin/")
    print("2. Login with: admin / admin123")
    print("3. For each data type, click 'Add' and manually enter:")
    
    # Read and parse local data
    try:
        with open('local_data.json', 'r') as f:
            data = json.load(f)
        
        # Count different model types
        models = {}
        for item in data:
            model = item['model']
            if model not in models:
                models[model] = 0
            models[model] += 1
        
        print("\n📊 Your Local Data Summary:")
        print("-" * 30)
        for model, count in models.items():
            if model != 'sessions.session':  # Skip session data
                print(f"   {model}: {count} items")
        
        print("\n🎯 Priority: Create these first:")
        print("   1. Users (including 'aman' user)")
        print("   2. Suppliers")
        print("   3. Inventory Items")
        print("   4. Purchase Orders")
        print("   5. Notifications")
        
    except Exception as e:
        print(f"❌ Error reading local data: {e}")

def main():
    print("🚀 African-004 Data Migration Tool")
    print("=" * 40)
    
    # Try to create aman user first
    print("Step 1: Creating 'aman' user...")
    if create_user_via_api():
        print("✅ You can now login with: aman / aman@123")
    
    # Show manual upload instructions
    upload_data_via_admin()
    
    print("\n🎯 Next Steps:")
    print("1. Visit your frontend: https://african-004-frontend.onrender.com")
    print("2. Login with: aman / aman@123")
    print("3. Start adding your data through the UI")
    print("4. Or use the admin panel for bulk data entry")

if __name__ == "__main__":
    main()
