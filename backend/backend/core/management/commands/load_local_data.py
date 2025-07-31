import json
from django.core.management.base import BaseCommand
from django.core.management import call_command
from users.models import User
from suppliers.models import Supplier
from inventory.models import InventoryItem
from orders.models import PurchaseOrder
from notifications.models import Notification

class Command(BaseCommand):
    help = 'Load sample data from exported JSON file'

    def handle(self, *args, **options):
        self.stdout.write('🔄 Loading exported data...')
        
        try:
            # Load the data using Django's loaddata command
            call_command('loaddata', 'local_data.json')
            
            self.stdout.write(
                self.style.SUCCESS('✅ Successfully loaded exported data!')
            )
            
            # Print summary
            self.stdout.write('\n📊 Data Summary:')
            self.stdout.write(f'   Users: {User.objects.count()}')
            self.stdout.write(f'   Suppliers: {Supplier.objects.count()}')
            self.stdout.write(f'   Inventory Items: {InventoryItem.objects.count()}')
            self.stdout.write(f'   Purchase Orders: {PurchaseOrder.objects.count()}')
            self.stdout.write(f'   Notifications: {Notification.objects.count()}')
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error loading data: {str(e)}')
            )
