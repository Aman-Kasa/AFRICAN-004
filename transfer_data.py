#!/usr/bin/env python3
"""
Direct data transfer from local SQLite to deployed PostgreSQL
"""
import json
import requests
import sys

# Your live backend URL
BACKEND_URL = "https://african-004-backend.onrender.com"

def get_admin_token():
    """Get authentication token using admin credentials"""
    url = f"{BACKEND_URL}/api/token/"
    data = {"username": "admin", "password": "admin123"}
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json()["access"]
        else:
            print(f"❌ Failed to authenticate: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return None

def transfer_data():
    """Transfer local data to live database"""
    print("🚀 Starting data transfer from local to deployed database...")
    
    # Get authentication token
    token = get_admin_token()
    if not token:
        print("❌ Cannot authenticate with live server")
        return False
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # Read local data
    try:
        with open('local_data.json', 'r') as f:
            local_data = json.load(f)
    except Exception as e:
        print(f"❌ Error reading local_data.json: {e}")
        return False
    
    success_count = 0
    error_count = 0
    
    print(f"📦 Found {len(local_data)} records to transfer...")
    
    # Process each record
    for item in local_data:
        model = item['model']
        fields = item['fields']
        
        # Skip sessions (not needed)
        if model == 'sessions.session':
            continue
            
        # Map model to API endpoint
        api_endpoints = {
            'users.user': '/api/users/',
            'suppliers.supplier': '/api/suppliers/',
            'inventory.inventoryitem': '/api/inventory/',
            'orders.purchaseorder': '/api/orders/',
            'notifications.notification': '/api/notifications/',
            'core.auditlog': '/api/audit-logs/create/',
        }
        
        if model not in api_endpoints:
            print(f"⚠️ No endpoint for {model}, skipping...")
            continue
            
        endpoint = f"{BACKEND_URL}{api_endpoints[model]}"
        
        try:
            # Special handling for users
            if model == 'users.user':
                # Skip if username is admin (already exists)
                if fields.get('username') == 'admin':
                    continue
                    
                # Prepare user data
                user_data = {
                    'username': fields['username'],
                    'email': fields['email'],
                    'password': 'aman@123',  # Set known password
                    'first_name': fields.get('first_name', ''),
                    'last_name': fields.get('last_name', ''),
                    'role': fields.get('role', 'USER'),
                    'is_staff': fields.get('is_staff', False),
                    'is_superuser': fields.get('is_superuser', False),
                    'is_active': fields.get('is_active', True)
                }
                
                response = requests.post(endpoint, json=user_data, headers=headers)
            else:
                # For other models, send fields as-is
                response = requests.post(endpoint, json=fields, headers=headers)
            
            if response.status_code in [200, 201]:
                print(f"✅ {model}: {fields.get('username', fields.get('name', 'record'))} transferred")
                success_count += 1
            else:
                print(f"❌ {model}: Failed - {response.text[:100]}")
                error_count += 1
                
        except Exception as e:
            print(f"❌ {model}: Error - {str(e)}")
            error_count += 1
    
    print(f"\n📊 Transfer Complete:")
    print(f"   ✅ Success: {success_count}")
    print(f"   ❌ Errors: {error_count}")
    
    if success_count > 0:
        print(f"\n🎯 Next Steps:")
        print(f"1. Visit: https://african-004-frontend.onrender.com")
        print(f"2. Login with: aman / aman@123")
        print(f"3. Check your transferred data!")
        
    return success_count > 0

if __name__ == "__main__":
    transfer_data()
