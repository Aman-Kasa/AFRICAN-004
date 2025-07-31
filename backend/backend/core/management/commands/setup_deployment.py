from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.management import call_command
from inventory.models import InventoryItem
from suppliers.models import Supplier
from orders.models import PurchaseOrder
from notifications.models import Notification
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Setup deployment with admin user and sample data'

    def handle(self, *args, **options):
        self.stdout.write('🚀 Setting up deployment...')
        
        # Create superuser
        self.stdout.write('👤 Creating admin user...')
        try:
            user, created = User.objects.get_or_create(
                username='aman',
                defaults={
                    'email': 'a.kasa@alustudent.com',
                    'is_staff': True,
                    'is_superuser': True,
                    'role': 'ADMIN'
                }
            )
            if created:
                user.set_password('aman@123')
                user.save()
                self.stdout.write(self.style.SUCCESS('✅ Admin user created successfully'))
            else:
                user.set_password('aman@123')
                user.save()
                self.stdout.write(self.style.SUCCESS('✅ Admin user updated'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error creating admin user: {e}'))
        
        # Create sample users
        self.stdout.write('👥 Creating sample users...')
        sample_users = [
            {
                'username': 'manager1',
                'email': 'manager1@example.com',
                'password': 'Testpass123',
                'role': 'MANAGER'
            },
            {
                'username': 'staff1',
                'email': 'staff1@example.com',
                'password': 'Testpass123',
                'role': 'STAFF'
            }
        ]
        
        for user_data in sample_users:
            try:
                user, created = User.objects.get_or_create(
                    username=user_data['username'],
                    defaults={
                        'email': user_data['email'],
                        'role': user_data['role']
                    }
                )
                if created:
                    user.set_password(user_data['password'])
                    user.save()
                    self.stdout.write(f'✅ Created user: {user_data["username"]}')
                else:
                    self.stdout.write(f'⚠️ User already exists: {user_data["username"]}')
            except Exception as e:
                self.stdout.write(f'❌ Error creating user {user_data["username"]}: {e}')
        
        # Create sample inventory items
        self.stdout.write('📦 Creating sample inventory items...')
        sample_items = [
            {
                'name': 'Industrial Drill',
                'sku': 'DRL-1001',
                'quantity': 50,
                'reorder_level': 10
            },
            {
                'name': 'Safety Gloves',
                'sku': 'GLV-2002',
                'quantity': 200,
                'reorder_level': 50
            },
            {
                'name': 'Welding Helmet',
                'sku': 'HLT-3003',
                'quantity': 75,
                'reorder_level': 15
            },
            {
                'name': 'hammer',
                'sku': 'HMR-4004',
                'quantity': 100,
                'reorder_level': 20
            }
        ]
        
        for item_data in sample_items:
            try:
                item, created = InventoryItem.objects.get_or_create(
                    sku=item_data['sku'],
                    defaults=item_data
                )
                if created:
                    self.stdout.write(f'✅ Created inventory item: {item_data["name"]}')
                else:
                    self.stdout.write(f'⚠️ Inventory item already exists: {item_data["name"]}')
            except Exception as e:
                self.stdout.write(f'❌ Error creating inventory item {item_data["name"]}: {e}')
        
        # Create sample suppliers
        self.stdout.write('🏭 Creating sample suppliers...')
        sample_suppliers = [
            {
                'name': 'ABC Industrial Supplies',
                'email': 'contact@abcindustrial.com',
                'phone': '+1234567890',
                'address': '123 Industrial Ave, Manufacturing City, MC 12345'
            },
            {
                'name': 'Safety Equipment Co.',
                'email': 'info@safetyequipment.com',
                'phone': '+1987654321',
                'address': '456 Safety Street, Protection Town, PT 67890'
            },
            {
                'name': 'Tool Masters Ltd.',
                'email': 'sales@toolmasters.com',
                'phone': '+1122334455',
                'address': '789 Tool Boulevard, Craft City, CC 11111'
            }
        ]
        
        for supplier_data in sample_suppliers:
            try:
                supplier, created = Supplier.objects.get_or_create(
                    name=supplier_data['name'],
                    defaults=supplier_data
                )
                if created:
                    self.stdout.write(f'✅ Created supplier: {supplier_data["name"]}')
                else:
                    self.stdout.write(f'⚠️ Supplier already exists: {supplier_data["name"]}')
            except Exception as e:
                self.stdout.write(f'❌ Error creating supplier {supplier_data["name"]}: {e}')
        
        # Create sample purchase orders
        self.stdout.write('📋 Creating sample purchase orders...')
        try:
            # Get first supplier for orders
            supplier = Supplier.objects.first()
            if supplier:
                sample_orders = [
                    {
                        'supplier': supplier,
                        'order_number': 'PO-2024-001',
                        'total_amount': 1500.00,
                        'status': 'APPROVED',
                        'description': 'Industrial Drill purchase'
                    },
                    {
                        'supplier': supplier,
                        'order_number': 'PO-2024-002',
                        'total_amount': 800.00,
                        'status': 'PENDING',
                        'description': 'Safety equipment order'
                    },
                    {
                        'supplier': supplier,
                        'order_number': 'PO-2024-003',
                        'total_amount': 1200.00,
                        'status': 'APPROVED',
                        'description': 'Welding supplies'
                    }
                ]
                
                for order_data in sample_orders:
                    try:
                        order, created = PurchaseOrder.objects.get_or_create(
                            order_number=order_data['order_number'],
                            defaults=order_data
                        )
                        if created:
                            self.stdout.write(f'✅ Created order: {order_data["order_number"]}')
                        else:
                            self.stdout.write(f'⚠️ Order already exists: {order_data["order_number"]}')
                    except Exception as e:
                        self.stdout.write(f'❌ Error creating order {order_data["order_number"]}: {e}')
            else:
                self.stdout.write('⚠️ No suppliers available to create orders')
        except Exception as e:
            self.stdout.write(f'❌ Error creating orders: {e}')
        
        # Create sample notifications
        self.stdout.write('🔔 Creating sample notifications...')
        sample_notifications = [
            {
                'title': 'System Maintenance',
                'message': 'Scheduled system maintenance will occur tonight at 2 AM.',
                'notification_type': 'SYSTEM',
                'is_read': False
            },
            {
                'title': 'Low Stock Alert',
                'message': 'Safety Gloves are running low. Current quantity: 45',
                'notification_type': 'INVENTORY',
                'is_read': False
            },
            {
                'title': 'Order Approved',
                'message': 'Purchase order PO-2024-001 has been approved.',
                'notification_type': 'ORDER',
                'is_read': False
            }
        ]
        
        for notif_data in sample_notifications:
            try:
                notification, created = Notification.objects.get_or_create(
                    title=notif_data['title'],
                    defaults=notif_data
                )
                if created:
                    self.stdout.write(f'✅ Created notification: {notif_data["title"]}')
                else:
                    self.stdout.write(f'⚠️ Notification already exists: {notif_data["title"]}')
            except Exception as e:
                self.stdout.write(f'❌ Error creating notification {notif_data["title"]}: {e}')
        
        # Summary
        self.stdout.write('\n📊 Setup Summary:')
        self.stdout.write(f'   👥 Users: {User.objects.count()}')
        self.stdout.write(f'   📦 Inventory Items: {InventoryItem.objects.count()}')
        self.stdout.write(f'   🏭 Suppliers: {Supplier.objects.count()}')
        self.stdout.write(f'   📋 Purchase Orders: {PurchaseOrder.objects.count()}')
        self.stdout.write(f'   🔔 Notifications: {Notification.objects.count()}')
        
        self.stdout.write('\n🎯 Login Credentials:')
        self.stdout.write('   👤 aman / aman@123 (Admin)')
        self.stdout.write('   👤 manager1 / Testpass123 (Manager)')
        self.stdout.write('   👤 staff1 / Testpass123 (Staff)')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Deployment setup completed successfully!')) 