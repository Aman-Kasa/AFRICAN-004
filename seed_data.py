#!/usr/bin/env python
"""
Demo data seeder for AFRICAN-004 IPMS
Run this script to populate the database with sample data
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('/home/kasa/Documents/African-004/backend/backend')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User
from suppliers.models import Supplier
from inventory.models import InventoryItem
from orders.models import PurchaseOrder
from notifications.models import Notification
from decimal import Decimal
from datetime import datetime, timedelta

def create_sample_data():
    print("🌱 Seeding sample data...")
    
    # Create sample suppliers
    suppliers_data = [
        {
            'name': 'Tech Solutions Ltd',
            'contact_person': 'John Doe',
            'email': 'john@techsolutions.com',
            'phone': '+1-555-0101',
            'address': '123 Tech Street, Silicon Valley, CA'
        },
        {
            'name': 'Office Supplies Co',
            'contact_person': 'Jane Smith',
            'email': 'jane@officesupplies.com',
            'phone': '+1-555-0102',
            'address': '456 Business Ave, New York, NY'
        },
        {
            'name': 'Electronics World',
            'contact_person': 'Mike Johnson',
            'email': 'mike@electronicsworld.com',
            'phone': '+1-555-0103',
            'address': '789 Circuit Rd, Austin, TX'
        }
    ]
    
    suppliers = []
    for supplier_data in suppliers_data:
        supplier, created = Supplier.objects.get_or_create(
            name=supplier_data['name'],
            defaults=supplier_data
        )
        suppliers.append(supplier)
        if created:
            print(f"✅ Created supplier: {supplier.name}")
    
    # Create sample inventory items
    inventory_data = [
        {
            'name': 'Dell Laptop',
            'description': 'High-performance business laptop',
            'sku': 'LAP001',
            'quantity': 25,
            'unit_price': Decimal('999.99'),
            'supplier': suppliers[0]
        },
        {
            'name': 'Office Chair',
            'description': 'Ergonomic office chair with lumbar support',
            'sku': 'CHR001',
            'quantity': 50,
            'unit_price': Decimal('299.99'),
            'supplier': suppliers[1]
        },
        {
            'name': 'Wireless Mouse',
            'description': 'Bluetooth wireless mouse',
            'sku': 'MOU001',
            'quantity': 100,
            'unit_price': Decimal('29.99'),
            'supplier': suppliers[2]
        },
        {
            'name': 'Monitor 24"',
            'description': '24-inch Full HD monitor',
            'sku': 'MON001',
            'quantity': 30,
            'unit_price': Decimal('199.99'),
            'supplier': suppliers[2]
        },
        {
            'name': 'Desk Lamp',
            'description': 'LED desk lamp with adjustable brightness',
            'sku': 'LAM001',
            'quantity': 75,
            'unit_price': Decimal('49.99'),
            'supplier': suppliers[1]
        }
    ]
    
    items = []
    for item_data in inventory_data:
        item, created = InventoryItem.objects.get_or_create(
            sku=item_data['sku'],
            defaults=item_data
        )
        items.append(item)
        if created:
            print(f"✅ Created inventory item: {item.name}")
    
    # Create sample purchase orders
    try:
        admin_user = User.objects.get(username='admin')
    except User.DoesNotExist:
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@company.com',
            password='admin123',
            role='ADMIN'
        )
    
    order_data = [
        {
            'supplier': suppliers[0],
            'status': 'PENDING',
            'total_amount': Decimal('2999.97'),
            'created_by': admin_user,
            'notes': 'Quarterly laptop purchase'
        },
        {
            'supplier': suppliers[1],
            'status': 'APPROVED',
            'total_amount': Decimal('1799.94'),
            'created_by': admin_user,
            'notes': 'Office furniture and supplies'
        },
        {
            'supplier': suppliers[2],
            'status': 'COMPLETED',
            'total_amount': Decimal('899.94'),
            'created_by': admin_user,
            'notes': 'Electronics accessories'
        }
    ]
    
    for order_info in order_data:
        order, created = PurchaseOrder.objects.get_or_create(
            supplier=order_info['supplier'],
            total_amount=order_info['total_amount'],
            defaults=order_info
        )
        if created:
            print(f"✅ Created purchase order: {order.id}")
    
    # Create sample notifications
    notifications_data = [
        {
            'title': 'Low Stock Alert',
            'message': 'Wireless Mouse stock is running low (10 items remaining)',
            'type': 'WARNING',
            'user': admin_user
        },
        {
            'title': 'Order Approved',
            'message': 'Purchase order #2 has been approved',
            'type': 'SUCCESS',
            'user': admin_user
        },
        {
            'title': 'New Supplier Added',
            'message': 'Electronics World has been added as a new supplier',
            'type': 'INFO',
            'user': admin_user
        }
    ]
    
    for notif_data in notifications_data:
        notification, created = Notification.objects.get_or_create(
            title=notif_data['title'],
            defaults=notif_data
        )
        if created:
            print(f"✅ Created notification: {notification.title}")
    
    print("\n🎉 Sample data seeding completed!")
    print("\n📊 Summary:")
    print(f"   Suppliers: {Supplier.objects.count()}")
    print(f"   Inventory Items: {InventoryItem.objects.count()}")
    print(f"   Purchase Orders: {PurchaseOrder.objects.count()}")
    print(f"   Notifications: {Notification.objects.count()}")
    print(f"   Users: {User.objects.count()}")

if __name__ == '__main__':
    create_sample_data()
