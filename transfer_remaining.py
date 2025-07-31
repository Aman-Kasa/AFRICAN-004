#!/usr/bin/env python3
"""
Fixed data transfer with correct API endpoints
"""
import json
import requests

BACKEND_URL = "https://african-004-backend.onrender.com"

def get_admin_token():
    """Get authentication token"""
    url = f"{BACKEND_URL}/api/token/"
    data = {"username": "admin", "password": "admin123"}
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json()["access"]
        else:
            print(f"❌ Auth failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return None

def transfer_remaining_data():
    """Transfer the remaining data with correct endpoints"""
    print("🔧 Transferring remaining data with correct endpoints...")
    
    token = get_admin_token()
    if not token:
        return False
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # Read local data
    with open('local_data.json', 'r') as f:
        local_data = json.load(f)
    
    success_count = 0
    error_count = 0
    
    # Correct API endpoints
    api_endpoints = {
        'users.user': '/api/users/register/',  # Use register endpoint
        'inventory.inventoryitem': '/api/inventory/items/',  # Correct inventory endpoint
    }
    
    for item in local_data:
        model = item['model']
        fields = item['fields']
        
        # Only process users and inventory (others already transferred)
        if model not in api_endpoints:
            continue
            
        endpoint = f"{BACKEND_URL}{api_endpoints[model]}"
        
        try:
            if model == 'users.user':
                # Skip admin user
                if fields.get('username') == 'admin':
                    continue
                    
                user_data = {
                    'username': fields['username'],
                    'email': fields['email'],
                    'password': 'aman@123',
                    'role': fields.get('role', 'USER')
                }
                
                response = requests.post(endpoint, json=user_data, headers=headers)
                
            elif model == 'inventory.inventoryitem':
                # Prepare inventory data
                inventory_data = {
                    'name': fields['name'],
                    'description': fields.get('description', ''),
                    'sku': fields['sku'],
                    'quantity': fields['quantity'],
                    'unit_price': str(fields['unit_price']),
                    'category': fields.get('category', 'General'),
                    'minimum_stock_level': fields.get('minimum_stock_level', 10),
                    'supplier': fields.get('supplier')  # This might need supplier ID
                }
                
                response = requests.post(endpoint, json=inventory_data, headers=headers)
            
            if response.status_code in [200, 201]:
                name = fields.get('username') or fields.get('name') or 'record'
                print(f"✅ {model}: {name} transferred")
                success_count += 1
            else:
                print(f"❌ {model}: Failed - {response.text[:200]}")
                error_count += 1
                
        except Exception as e:
            print(f"❌ {model}: Error - {str(e)}")
            error_count += 1
    
    print(f"\n📊 Additional Transfer Results:")
    print(f"   ✅ Success: {success_count}")
    print(f"   ❌ Errors: {error_count}")
    
    return success_count > 0

if __name__ == "__main__":
    transfer_remaining_data()
