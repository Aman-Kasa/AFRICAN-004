from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.management import call_command
import json
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Load local data into the live deployment'

    def handle(self, *args, **options):
        self.stdout.write('🔄 Loading local data into live deployment...')
        
        # Path to the local_data.json file
        data_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'local_data.json')
        
        if not os.path.exists(data_file):
            self.stdout.write(self.style.ERROR(f'❌ Data file not found: {data_file}'))
            return
        
        try:
            # Load the data
            with open(data_file, 'r') as f:
                data = json.load(f)
            
            self.stdout.write(f'📊 Found {len(data)} records to load')
            
            # Create a temporary file for loading
            temp_file = 'temp_load_data.json'
            with open(temp_file, 'w') as f:
                json.dump(data, f)
            
            # Load the data using Django's loaddata command
            call_command('loaddata', temp_file, verbosity=0)
            
            # Clean up
            os.remove(temp_file)
            
            self.stdout.write(self.style.SUCCESS('✅ Data loaded successfully!'))
            
            # Display summary
            self.stdout.write('\n📋 Data Summary:')
            user_count = User.objects.count()
            self.stdout.write(f'   👥 Users: {user_count}')
            
            # Count other models
            from inventory.models import InventoryItem
            from orders.models import PurchaseOrder
            from suppliers.models import Supplier
            
            inventory_count = InventoryItem.objects.count()
            orders_count = PurchaseOrder.objects.count()
            suppliers_count = Supplier.objects.count()
            
            self.stdout.write(f'   📦 Inventory Items: {inventory_count}')
            self.stdout.write(f'   📋 Purchase Orders: {orders_count}')
            self.stdout.write(f'   🏭 Suppliers: {suppliers_count}')
            
            self.stdout.write('\n🎯 Login Credentials:')
            self.stdout.write('   👤 aman / aman@123 (Admin)')
            self.stdout.write('   👤 manager1 / Testpass123 (Manager)')
            self.stdout.write('   👤 staff1 / Testpass123 (Staff)')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error loading data: {str(e)}'))
            if os.path.exists(temp_file):
                os.remove(temp_file)
