from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from notifications.models import Notification

User = get_user_model()

class Command(BaseCommand):
    help = 'Add test notifications to the system for demonstration purposes'

    def handle(self, *args, **options):
        # Get the first user (or create one if none exists)
        try:
            user = User.objects.first()
            if not user:
                self.stdout.write(
                    self.style.ERROR('No users found. Please create a user first.')
                )
                return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error getting user: {e}')
            )
            return
        
        # Sample notifications
        test_notifications = [
            {
                'message': 'Welcome to IPMS! Your inventory management system is ready.',
                'type': 'INFO'
            },
            {
                'message': 'Low stock alert: Welding Helmet (HLT-3003) is below reorder level.',
                'type': 'WARNING'
            },
            {
                'message': 'New order #PO-2024-001 has been approved and is ready for processing.',
                'type': 'INFO'
            },
            {
                'message': 'Supplier ABC Industrial has updated their contact information.',
                'type': 'INFO'
            },
            {
                'message': 'Critical: Industrial Drill (DRL-1001) stock is critically low!',
                'type': 'ALERT'
            },
            {
                'message': 'Monthly inventory report is ready for review.',
                'type': 'INFO'
            },
            {
                'message': 'New user account created for warehouse manager.',
                'type': 'INFO'
            },
            {
                'message': 'System maintenance scheduled for tomorrow at 2:00 AM.',
                'type': 'WARNING'
            },
            {
                'message': 'Backup completed successfully. All data is secure.',
                'type': 'INFO'
            }
        ]
        
        # Create notifications
        created_count = 0
        for notif_data in test_notifications:
            try:
                notification = Notification.objects.create(
                    user=user,
                    message=notif_data['message'],
                    type=notif_data['type']
                )
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created notification: {notification}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating notification: {e}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n✅ Successfully created {created_count} test notifications!')
        )
        self.stdout.write(
            self.style.WARNING('Refresh your Notifications page to see them.')
        ) 