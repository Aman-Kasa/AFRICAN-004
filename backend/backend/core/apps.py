from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.contrib.auth import get_user_model
from django.core.management import call_command
import os

def create_admin_user(sender, **kwargs):
    """Create admin user after migrations"""
    User = get_user_model()  # Move this inside the function
    try:
        # Create admin user
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'is_staff': True,
                'is_superuser': True,
                'role': 'ADMIN'
            }
        )
        if created:
            user.set_password('admin123')
            user.save()
            print("✅ Admin user created successfully")
        else:
            user.set_password('admin123')
            user.save()
            print("✅ Admin user updated")
        
        # Try to load data if local_data.json exists
        data_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'local_data.json')
        if os.path.exists(data_file):
            try:
                call_command('loaddata', data_file, verbosity=0)
                print("✅ Data loaded successfully from local_data.json")
            except Exception as e:
                print(f"⚠️ Could not load data: {e}")
                # Create sample data instead
                create_sample_data()
        else:
            print("⚠️ local_data.json not found, creating sample data")
            create_sample_data()
            
    except Exception as e:
        print(f"❌ Error in post_migrate: {e}")

def create_sample_data():
    """Create sample data if local_data.json is not available"""
    try:
        from inventory.models import InventoryItem
        from suppliers.models import Supplier
        from orders.models import PurchaseOrder
        from notifications.models import Notification
        
        # Create sample inventory items
        sample_items = [
            {'name': 'Industrial Drill', 'sku': 'DRL-1001', 'quantity': 50, 'reorder_level': 10},
            {'name': 'Safety Gloves', 'sku': 'GLV-2002', 'quantity': 200, 'reorder_level': 50},
            {'name': 'Welding Helmet', 'sku': 'HLT-3003', 'quantity': 75, 'reorder_level': 15},
            {'name': 'hammer', 'sku': 'HMR-4004', 'quantity': 100, 'reorder_level': 20}
        ]
        
        for item_data in sample_items:
            item, created = InventoryItem.objects.get_or_create(
                sku=item_data['sku'],
                defaults=item_data
            )
            if created:
                print(f"✅ Created inventory item: {item_data['name']}")
        
        # Create sample suppliers
        sample_suppliers = [
            {'name': 'Acme Supplies', 'contact_email': 'alice@acme.com', 'contact_phone': '+1234567890', 'address': '123 Acme St, City'},
            {'name': 'Global Industrial', 'contact_email': 'bob@global.com', 'contact_phone': '+1987654321', 'address': '456 Global Ave, Metropolis'},
            {'name': 'Total', 'contact_email': 'mnte@total.org', 'contact_phone': '0798698988', 'address': 'kg 414'}
        ]
        
        for supplier_data in sample_suppliers:
            supplier, created = Supplier.objects.get_or_create(
                name=supplier_data['name'],
                defaults=supplier_data
            )
            if created:
                print(f"✅ Created supplier: {supplier_data['name']}")
        
        # Create sample notifications
        sample_notifications = [
            {'message': 'Welcome to IPMS! Your inventory management system is ready.', 'type': 'INFO'},
            {'message': 'Low stock alert: Welding Helmet (HLT-3003) is below reorder level.', 'type': 'WARNING'},
            {'message': 'New order #PO-2024-001 has been approved and is ready for processing.', 'type': 'INFO'}
        ]
        
        for notif_data in sample_notifications:
            notification, created = Notification.objects.get_or_create(
                message=notif_data['message'],
                defaults=notif_data
            )
            if created:
                print(f"✅ Created notification: {notif_data['message'][:50]}...")
                
        print("✅ Sample data created successfully")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        # Connect the signal
        post_migrate.connect(create_admin_user, sender=self) 