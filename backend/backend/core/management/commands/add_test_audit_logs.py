from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import AuditLog

User = get_user_model()

class Command(BaseCommand):
    help = 'Add test audit logs to the system for demonstration purposes'

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
        
        # Sample audit logs
        test_audit_logs = [
            {
                'user': user,
                'action': 'CREATE',
                'object_type': 'Inventory Item',
                'object_id': 'HLT-3003',
                'message': 'Created new inventory item: Welding Helmet'
            },
            {
                'user': user,
                'action': 'UPDATE',
                'object_type': 'Inventory Item',
                'object_id': 'GLV-2002',
                'message': 'Updated quantity for Safety Gloves from 150 to 200'
            },
            {
                'user': user,
                'action': 'DELETE',
                'object_type': 'Inventory Item',
                'object_id': 'OLD-9999',
                'message': 'Deleted obsolete inventory item: Old Equipment'
            },
            {
                'user': user,
                'action': 'CREATE',
                'object_type': 'Purchase Order',
                'object_id': 'PO-2024-001',
                'message': 'Created new purchase order for Industrial Drill'
            },
            {
                'user': user,
                'action': 'APPROVE',
                'object_type': 'Purchase Order',
                'object_id': 'PO-2024-001',
                'message': 'Approved purchase order PO-2024-001'
            },
            {
                'user': user,
                'action': 'CREATE',
                'object_type': 'Supplier',
                'object_id': 'SUP-001',
                'message': 'Added new supplier: ABC Industrial Supplies'
            },
            {
                'user': user,
                'action': 'UPDATE',
                'object_type': 'Supplier',
                'object_id': 'SUP-001',
                'message': 'Updated contact information for ABC Industrial Supplies'
            },
            {
                'user': user,
                'action': 'LOGIN',
                'object_type': 'User Session',
                'object_id': user.username,
                'message': f'User {user.username} logged in successfully'
            },
            {
                'user': user,
                'action': 'EXPORT',
                'object_type': 'Report',
                'object_id': 'INV-REP-2024',
                'message': 'Exported inventory report as PDF'
            },
            {
                'user': user,
                'action': 'IMPORT',
                'object_type': 'Inventory',
                'object_id': 'BULK-001',
                'message': 'Imported bulk inventory data from CSV file'
            },
            {
                'user': user,
                'action': 'BACKUP',
                'object_type': 'System',
                'object_id': 'DB-2024-01',
                'message': 'Database backup completed successfully'
            },
            {
                'user': user,
                'action': 'MAINTENANCE',
                'object_type': 'System',
                'object_id': 'SYS-001',
                'message': 'Scheduled system maintenance initiated'
            }
        ]
        
        # Create audit logs
        created_count = 0
        for log_data in test_audit_logs:
            try:
                audit_log = AuditLog.objects.create(**log_data)
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created audit log: {audit_log}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating audit log: {e}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n✅ Successfully created {created_count} test audit logs!')
        )
        self.stdout.write(
            self.style.WARNING('Refresh your Audit Logs page to see them.')
        ) 