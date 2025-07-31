#!/usr/bin/env python3
"""
Test email functionality for IPMS
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from core.email_service import EmailService
from django.conf import settings

def test_email_configuration():
    """Test email configuration"""
    print("Testing IPMS Email Configuration...")
    print(f"Email Host: {settings.EMAIL_HOST}")
    print(f"Email Port: {settings.EMAIL_PORT}")
    print(f"Email User: {settings.EMAIL_HOST_USER}")
    print(f"From Email: {settings.DEFAULT_FROM_EMAIL}")
    print(f"TLS Enabled: {settings.EMAIL_USE_TLS}")
    
    try:
        # Test sending a simple email
        success = EmailService.send_notification_email(
            user_email='a.kasa@alustudent.com',  # Send to yourself for testing
            notification_type='INFO',
            message='This is a test email from IPMS to verify email configuration is working correctly.',
            action_url='http://localhost:3001/payments'
        )
        
        if success:
            print("✅ Email sent successfully!")
            print("Check your inbox at a.kasa@alustudent.com")
        else:
            print("❌ Failed to send email")
            
    except Exception as e:
        print(f"❌ Error sending email: {str(e)}")
        print("This might be due to:")
        print("1. Email credentials not configured correctly")
        print("2. Network connectivity issues")
        print("3. Email provider restrictions")

def test_payment_notification():
    """Test payment notification email"""
    print("\nTesting Payment Notification Email...")
    
    try:
        success = EmailService.send_notification_email_async(
            user_email='a.kasa@alustudent.com',
            notification_type='INFO',
            message='Payment request IPMS-ABC123 created successfully. Amount: GHS 500.00',
            action_url='http://localhost:3001/payments'
        )
        
        if success:
            print("✅ Payment notification email queued successfully!")
        else:
            print("❌ Failed to queue payment notification email")
            
    except Exception as e:
        print(f"❌ Error sending payment notification: {str(e)}")

def test_inventory_alert():
    """Test inventory alert email"""
    print("\nTesting Inventory Alert Email...")
    
    try:
        success = EmailService.send_inventory_notification(
            user_email='a.kasa@alustudent.com',
            item_name='Safety Gloves',
            message='Safety Gloves stock is critically low (5 units remaining). Please reorder immediately.'
        )
        
        if success:
            print("✅ Inventory alert email queued successfully!")
        else:
            print("❌ Failed to queue inventory alert email")
            
    except Exception as e:
        print(f"❌ Error sending inventory alert: {str(e)}")

if __name__ == '__main__':
    print("=" * 50)
    print("IPMS Email Configuration Test")
    print("=" * 50)
    
    test_email_configuration()
    test_payment_notification()
    test_inventory_alert()
    
    print("\n" + "=" * 50)
    print("Test completed!")
    print("=" * 50) 