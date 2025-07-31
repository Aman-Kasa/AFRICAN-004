from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings

User = get_user_model()

class Command(BaseCommand):
    help = 'Set up admin user with email configuration'

    def handle(self, *args, **options):
        self.stdout.write('Setting up admin user...')
        
        # Create or update admin user
        admin_user, created = User.objects.get_or_create(
            username='aman',
            defaults={
                'email': 'a.kasa@alustudent.com',
                'role': 'ADMIN',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True
            }
        )
        
        if created:
            admin_user.set_password('aman@123')
            admin_user.save()
            self.stdout.write(
                self.style.SUCCESS('✅ Admin user created successfully!')
            )
        else:
            # Update existing user
            admin_user.email = 'a.kasa@alustudent.com'
            admin_user.set_password('aman@123')
            admin_user.save()
            self.stdout.write(
                self.style.SUCCESS('✅ Admin user updated successfully!')
            )
        
        self.stdout.write(f'Username: aman')
        self.stdout.write(f'Email: a.kasa@alustudent.com')
        self.stdout.write(f'Password: aman@123')
        self.stdout.write(f'Role: ADMIN')
        
        # Test email configuration
        self.stdout.write('\nTesting email configuration...')
        try:
            send_mail(
                subject='IPMS Email Test',
                message='This is a test email from IPMS to verify email configuration.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=['a.kasa@alustudent.com'],
                fail_silently=False,
            )
            self.stdout.write(
                self.style.SUCCESS('✅ Email test sent successfully!')
            )
            self.stdout.write('Check your inbox at a.kasa@alustudent.com')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Email test failed: {str(e)}')
            )
            self.stdout.write('This might be due to:')
            self.stdout.write('1. Email credentials not configured correctly')
            self.stdout.write('2. Network connectivity issues')
            self.stdout.write('3. Email provider restrictions')
        
        self.stdout.write('\nSetup completed!') 