#!/usr/bin/env python3
"""
Script to upload local data to Render deployment
"""

import requests
import json
import os
import time

def upload_data_to_render():
    """Upload local data to Render deployment"""
    
    print("🚀 Uploading data to Render deployment...")
    
    # Render backend URL
    backend_url = "https://african-004-backend.onrender.com"
    
    # Check if backend is accessible
    try:
        response = requests.get(f"{backend_url}/api/", timeout=10)
        if response.status_code == 200:
            print("✅ Backend is accessible")
        else:
            print(f"⚠️ Backend responded with status: {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False
    
    # Load local data
    data_file = "local_data.json"
    if not os.path.exists(data_file):
        print(f"❌ Data file not found: {data_file}")
        return False
    
    try:
        with open(data_file, 'r') as f:
            data = json.load(f)
        
        print(f"📊 Found {len(data)} records to upload")
        
        # Extract users for API creation
        users = [item for item in data if item.get('model') == 'users.user']
        inventory_items = [item for item in data if item.get('model') == 'inventory.inventoryitem']
        suppliers = [item for item in data if item.get('model') == 'suppliers.supplier']
        orders = [item for item in data if item.get('model') == 'orders.purchaseorder']
        
        print(f"   👥 Users: {len(users)}")
        print(f"   📦 Inventory Items: {len(inventory_items)}")
        print(f"   🏭 Suppliers: {len(suppliers)}")
        print(f"   📋 Orders: {len(orders)}")
        
        # Create admin user first
        admin_data = {
            "username": "aman",
            "email": "a.kasa@alustudent.com",
            "password": "aman@123",
            "role": "ADMIN"
        }
        
        print("\n👤 Creating admin user...")
        try:
            response = requests.post(
                f"{backend_url}/api/users/admin/",
                json=admin_data,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            if response.status_code in [200, 201]:
                print("✅ Admin user created successfully")
            else:
                print(f"⚠️ Admin user creation response: {response.status_code}")
        except Exception as e:
            print(f"⚠️ Error creating admin user: {e}")
        
        # Create other users
        for user in users:
            if user['fields']['username'] != 'aman':
                user_data = {
                    "username": user['fields']['username'],
                    "email": user['fields']['email'],
                    "password": "Testpass123",
                    "role": user['fields']['role']
                }
                
                try:
                    response = requests.post(
                        f"{backend_url}/api/users/admin/",
                        json=user_data,
                        headers={'Content-Type': 'application/json'},
                        timeout=30
                    )
                    if response.status_code in [200, 201]:
                        print(f"✅ Created user: {user['fields']['username']}")
                    else:
                        print(f"⚠️ Failed to create user {user['fields']['username']}: {response.status_code}")
                except Exception as e:
                    print(f"⚠️ Error creating user {user['fields']['username']}: {e}")
        
        # Upload inventory items
        print("\n📦 Uploading inventory items...")
        for item in inventory_items:
            item_data = {
                "name": item['fields']['name'],
                "sku": item['fields']['sku'],
                "quantity": item['fields']['quantity'],
                "reorder_level": item['fields']['reorder_level']
            }
            
            try:
                response = requests.post(
                    f"{backend_url}/api/inventory/items/",
                    json=item_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=30
                )
                if response.status_code in [200, 201]:
                    print(f"✅ Created inventory item: {item['fields']['name']}")
                else:
                    print(f"⚠️ Failed to create inventory item {item['fields']['name']}: {response.status_code}")
            except Exception as e:
                print(f"⚠️ Error creating inventory item {item['fields']['name']}: {e}")
        
        # Upload suppliers
        print("\n🏭 Uploading suppliers...")
        for supplier in suppliers:
            supplier_data = {
                "name": supplier['fields']['name'],
                "email": supplier['fields']['email'],
                "phone": supplier['fields']['phone'],
                "address": supplier['fields']['address']
            }
            
            try:
                response = requests.post(
                    f"{backend_url}/api/suppliers/",
                    json=supplier_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=30
                )
                if response.status_code in [200, 201]:
                    print(f"✅ Created supplier: {supplier['fields']['name']}")
                else:
                    print(f"⚠️ Failed to create supplier {supplier['fields']['name']}: {response.status_code}")
            except Exception as e:
                print(f"⚠️ Error creating supplier {supplier['fields']['name']}: {e}")
        
        print("\n🎉 Data upload completed!")
        print("\n🔗 Access your application:")
        print(f"   🌐 Frontend: https://african-004-frontend.onrender.com")
        print(f"   🔧 Backend API: {backend_url}")
        print(f"   👨‍💼 Admin Panel: {backend_url}/admin/")
        
        print("\n🎯 Login Credentials:")
        print("   👤 aman / aman@123 (Admin)")
        print("   👤 manager1 / Testpass123 (Manager)")
        print("   👤 staff1 / Testpass123 (Staff)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error uploading data: {e}")
        return False

if __name__ == "__main__":
    upload_data_to_render() 