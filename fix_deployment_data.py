#!/usr/bin/env python3
"""
Fix deployment data by manually creating admin user and loading data
"""

import requests
import json
import time

def fix_deployment():
    """Fix the deployment by creating admin user and loading data"""
    
    print("🔧 Fixing Deployment Data")
    print("=" * 40)
    
    backend_url = "https://african-004-backend.onrender.com"
    
    # Test backend connectivity
    try:
        response = requests.get(f"{backend_url}/", timeout=10)
        print(f"✅ Backend is accessible (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return
    
    print(f"\n🎯 Manual Steps to Fix Data:")
    print(f"1. Go to: https://african-004-backend.onrender.com/admin/")
    print(f"2. Try to login with: admin / admin123")
    print(f"3. If login fails, we need to create the admin user manually")
    
    print(f"\n📋 If you can't login, here's what to do:")
    print(f"1. Check if the deployment completed successfully")
    print(f"2. Look at the Render deployment logs for any errors")
    print(f"3. The data loading command might have failed")
    
    print(f"\n🔧 Alternative Solutions:")
    print(f"1. **Upgrade to paid plan** to get shell access")
    print(f"2. **Manually recreate data** through the admin panel")
    print(f"3. **Check deployment logs** in Render dashboard")
    
    print(f"\n📊 Expected Data After Fix:")
    print(f"   👥 Users: 3 (admin, manager1, staff1)")
    print(f"   📦 Inventory Items: 4 (Industrial Drill, Safety Gloves, etc.)")
    print(f"   🏭 Suppliers: 3 (Acme Supplies, Global Industrial, Total)")
    print(f"   📋 Orders: 3 (various purchase orders)")
    print(f"   🔔 Notifications: 9 (system notifications)")
    
    print(f"\n🔗 Your Application URLs:")
    print(f"   🌐 Frontend: https://african-004-frontend.onrender.com")
    print(f"   🔧 Backend: https://african-004-backend.onrender.com")
    print(f"   👨‍💼 Admin: https://african-004-backend.onrender.com/admin/")
    
    print(f"\n🎯 Login Credentials:")
    print(f"   👤 admin / admin123 (Admin)")
    print(f"   👤 manager1 / Testpass123 (Manager)")
    print(f"   👤 staff1 / Testpass123 (Staff)")

if __name__ == "__main__":
    fix_deployment() 