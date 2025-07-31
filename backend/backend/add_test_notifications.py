#!/usr/bin/env python3
"""
Script to add test notifications to the IPMS system.
Run this from the backend/backend directory.
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from notifications.models import Notification
from users.models import User

def add_test_notifications():
    """Add sample notifications to demonstrate the system."""
    
    # Get the first user (or create one if none exists)
    try:
        user = User.objects.first()
        if not user:
            print("No users found. Please create a user first.")
            return
    except Exception as e:
        print(f"Error getting user: {e}")
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
            print(f"Created notification: {notification}")
        except Exception as e:
            print(f"Error creating notification: {e}")
    
    print(f"\n✅ Successfully created {created_count} test notifications!")
    print("Refresh your Notifications page to see them.")

if __name__ == '__main__':
    add_test_notifications() 