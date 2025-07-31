import json
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from users.models import User

class Command(BaseCommand):
    help = 'Reset user password to clear text password'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username to reset password for')
        parser.add_argument('password', type=str, help='New password')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        
        try:
            user = User.objects.get(username=username)
            user.password = make_password(password)
            user.save()
            
            self.stdout.write(
                self.style.SUCCESS(f'✅ Password reset for user: {username}')
            )
            
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'❌ User "{username}" not found')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error: {str(e)}')
            )
