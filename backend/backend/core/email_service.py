"""
Email service for IPMS notifications
Handles sending email notifications to users
"""
import logging
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from datetime import datetime
import threading

logger = logging.getLogger(__name__)

class EmailService:
    """Service class for sending email notifications"""
    
    @staticmethod
    def send_notification_email(user_email, notification_type, message, action_url=None):
        """
        Send a notification email to a user
        
        Args:
            user_email (str): Recipient email address
            notification_type (str): Type of notification (INFO, WARNING, ALERT)
            message (str): Notification message
            action_url (str, optional): URL for action button
        """
        try:
            # Prepare email context
            context = {
                'notification_type': notification_type,
                'message': message,
                'timestamp': timezone.now().strftime('%B %d, %Y at %I:%M %p'),
                'action_url': action_url,
            }
            
            # Render email template
            html_message = render_to_string('email_notification.html', context)
            
            # Email subject
            subject = f'IPMS Notification - {notification_type}'
            
            # Send email
            send_mail(
                subject=subject,
                message=message,  # Plain text version
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user_email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Email sent successfully to {user_email} for {notification_type} notification")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {user_email}: {str(e)}")
            return False
    
    @staticmethod
    def send_notification_email_async(user_email, notification_type, message, action_url=None):
        """
        Send email notification asynchronously (non-blocking)
        """
        def send_email():
            EmailService.send_notification_email(user_email, notification_type, message, action_url)
        
        # Start email sending in background thread
        thread = threading.Thread(target=send_email)
        thread.daemon = True
        thread.start()
    
    @staticmethod
    def send_order_notification(user_email, order_id, order_status, message):
        """Send order-related notification email"""
        action_url = f"{settings.FRONTEND_URL}/orders/{order_id}" if hasattr(settings, 'FRONTEND_URL') else None
        return EmailService.send_notification_email_async(
            user_email, 
            'INFO', 
            message,
            action_url
        )
    
    @staticmethod
    def send_inventory_notification(user_email, item_name, message):
        """Send inventory-related notification email"""
        action_url = f"{settings.FRONTEND_URL}/inventory" if hasattr(settings, 'FRONTEND_URL') else None
        return EmailService.send_notification_email_async(
            user_email, 
            'WARNING', 
            message,
            action_url
        )
    
    @staticmethod
    def send_supplier_notification(user_email, supplier_name, message):
        """Send supplier-related notification email"""
        action_url = f"{settings.FRONTEND_URL}/suppliers" if hasattr(settings, 'FRONTEND_URL') else None
        return EmailService.send_notification_email_async(
            user_email, 
            'INFO', 
            message,
            action_url
        )
    
    @staticmethod
    def send_system_notification(user_email, message, notification_type='INFO'):
        """Send system-related notification email"""
        return EmailService.send_notification_email_async(
            user_email, 
            notification_type, 
            message
        )

def send_notification_email(user_email, notification_type, message, action_url=None):
    """Convenience function for sending notification emails"""
    return EmailService.send_notification_email(user_email, notification_type, message, action_url)

def send_notification_email_async(user_email, notification_type, message, action_url=None):
    """Convenience function for sending notification emails asynchronously"""
    return EmailService.send_notification_email_async(user_email, notification_type, message, action_url) 