#!/usr/bin/env python3
"""
Manual data upload script for Render deployment
"""

import requests
import json
import time

def upload_data():
    """Upload local data to Render deployment"""
    
    print("🚀 Manual Data Upload to Render")
    print("=" * 40)
    
    # Load local data
    try:
        with open('local_data.json', 'r') as f:
            data = json.load(f)
        print(f"✅ Loaded {len(data)} records from local_data.json")
    except Exception as e:
        print(f"❌ Error loading local_data.json: {e}")
        return
    
    # Backend URL
    backend_url = "https://african-004-backend.onrender.com"
    
    # Test backend connectivity
    try:
        response = requests.get(f"{backend_url}/", timeout=10)
        print(f"✅ Backend is accessible (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return
    
    # Extract data by type
    users = [item for item in data if item.get('model') == 'users.user']
    inventory_items = [item for item in data if item.get('model') == 'inventory.inventoryitem']
    suppliers = [item for item in data if item.get('model') == 'suppliers.supplier']
    orders = [item for item in data if item.get('model') == 'orders.purchaseorder']
    notifications = [item for item in data if item.get('model') == 'notifications.notification']
    
    print(f"\n📊 Data Summary:")
    print(f"   👥 Users: {len(users)}")
    print(f"   📦 Inventory Items: {len(inventory_items)}")
    print(f"   🏭 Suppliers: {len(suppliers)}")
    print(f"   📋 Orders: {len(orders)}")
    print(f"   🔔 Notifications: {len(notifications)}")
    
    # Since API endpoints are not working, let's provide manual instructions
    print(f"\n⚠️ API endpoints are not accessible (404/401 errors)")
    print(f"This means the data needs to be loaded manually.")
    
    print(f"\n🎯 Manual Data Loading Instructions:")
    print(f"1. Go to: https://african-004-backend.onrender.com/admin/")
    print(f"2. Try to login with:")
    print(f"   - Username: admin / Password: admin123")
    print(f"   - Username: aman / Password: aman@123")
    print(f"3. If login fails, we need to create a superuser manually")
    
    print(f"\n📋 Data to manually recreate:")
    
    print(f"\n👥 Users:")
    for user in users:
        print(f"   - {user['fields']['username']} ({user['fields']['role']}) - {user['fields']['email']}")
    
    print(f"\n📦 Inventory Items:")
    for item in inventory_items:
        print(f"   - {item['fields']['name']} (SKU: {item['fields']['sku']}, Qty: {item['fields']['quantity']})")
    
    print(f"\n🏭 Suppliers:")
    for supplier in suppliers:
        print(f"   - {supplier['fields']['name']} ({supplier['fields']['contact_email']})")
    
    print(f"\n📋 Orders:")
    for order in orders:
        print(f"   - {order['fields']['item']} (Qty: {order['fields']['quantity']}, Status: {order['fields']['status']})")
    
    print(f"\n🔔 Alternative: Use Django Management Command")
    print(f"If you can access the Render shell (requires paid plan), run:")
    print(f"   cd backend/backend")
    print(f"   python manage.py setup_deployment")
    
    print(f"\n🔗 Your Application URLs:")
    print(f"   🌐 Frontend: https://african-004-frontend.onrender.com")
    print(f"   🔧 Backend: https://african-004-backend.onrender.com")
    print(f"   👨‍💼 Admin: https://african-004-backend.onrender.com/admin/")

if __name__ == "__main__":
    upload_data() 