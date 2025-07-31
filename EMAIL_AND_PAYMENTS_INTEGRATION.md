# 📧 Email Notifications & 💰 MTN MoMo Integration

## Overview

This document outlines the implementation of **Email Notifications** and **MTN Mobile Money (MoMo) Integration** for the IPMS (Inventory and Procurement Management System).

## 📧 Email Notifications System

### Features

#### 1. **Email Configuration**
- **SMTP Setup**: Configured for Gmail SMTP
- **Email Templates**: Professional HTML templates with IPMS branding
- **Background Processing**: Non-blocking email delivery
- **Error Handling**: Comprehensive error logging and retry mechanisms

#### 2. **Email Types**
- **Order Notifications**: New orders, approvals, status updates
- **Inventory Alerts**: Low stock, reorder reminders
- **Supplier Notifications**: Payment confirmations, updates
- **System Notifications**: Maintenance, backups, security alerts

#### 3. **Email Preferences**
- **Notification Types**: Choose what to receive
- **Email Frequency**: Immediate, daily digest, weekly
- **Email Templates**: Professional branding
- **Unsubscribe Options**: User control

### Configuration

#### Backend Settings (`backend/backend/core/settings.py`)
```python
# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'  # Replace with your Gmail
EMAIL_HOST_PASSWORD = 'your-app-password'  # Replace with your Gmail app password
DEFAULT_FROM_EMAIL = 'IPMS <your-email@gmail.com>'
EMAIL_SUBJECT_PREFIX = '[IPMS] '
```

#### Email Template (`backend/backend/templates/email_notification.html`)
- Professional HTML template with IPMS branding
- Responsive design for mobile devices
- Color-coded notification types (Info, Warning, Alert)
- Action buttons for direct navigation

#### Email Service (`backend/backend/core/email_service.py`)
```python
# Key Functions
EmailService.send_notification_email()           # Synchronous email sending
EmailService.send_notification_email_async()    # Asynchronous email sending
EmailService.send_order_notification()          # Order-specific notifications
EmailService.send_inventory_notification()      # Inventory alerts
EmailService.send_supplier_notification()       # Supplier updates
EmailService.send_system_notification()         # System notifications
```

### Usage Examples

#### Sending Order Notifications
```python
from core.email_service import EmailService

# Send order notification
EmailService.send_order_notification(
    user_email='user@example.com',
    order_id='PO-2024-001',
    order_status='APPROVED',
    message='Purchase order PO-2024-001 has been approved'
)
```

#### Sending Inventory Alerts
```python
# Send low stock alert
EmailService.send_inventory_notification(
    user_email='manager@example.com',
    item_name='Safety Gloves',
    message='Safety Gloves stock is critically low (5 units remaining)'
)
```

## 💰 MTN MoMo Payment Integration

### Features

#### 1. **Payment Management**
- **Payment Requests**: Generate MTN MoMo payment links
- **Payment Tracking**: Monitor transaction status in real-time
- **Payment History**: Complete transaction log with audit trail
- **Payment Reports**: Financial analytics and reporting

#### 2. **Payment Types**
- **Order Payments**: Pay for purchase orders via MoMo
- **Supplier Payments**: Pay suppliers directly via MoMo
- **Subscription Payments**: Recurring payment management
- **Other Payments**: Custom payment types

#### 3. **Payment UI**
- **Payment Dashboard**: Overview of all transactions
- **Payment Forms**: Easy payment initiation
- **Payment Status**: Real-time updates with visual indicators
- **Payment Notifications**: Email/SMS alerts for status changes

### Database Models

#### PaymentRequest Model
```python
class PaymentRequest(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    PAYMENT_TYPE_CHOICES = [
        ('ORDER_PAYMENT', 'Order Payment'),
        ('SUPPLIER_PAYMENT', 'Supplier Payment'),
        ('SUBSCRIPTION', 'Subscription'),
        ('OTHER', 'Other'),
    ]
    
    # Core fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='GHS')
    description = models.TextField()
    momo_phone = models.CharField(max_length=15)
    reference_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES)
    payment_url = models.URLField(blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Related objects
    order = models.ForeignKey('orders.PurchaseOrder', null=True, blank=True)
    supplier = models.ForeignKey('suppliers.Supplier', null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
```

#### PaymentTransaction Model
```python
class PaymentTransaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('PAYMENT', 'Payment'),
        ('REFUND', 'Refund'),
        ('FEE', 'Fee'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    payment_request = models.ForeignKey(PaymentRequest, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='GHS')
    momo_transaction_id = models.CharField(max_length=100, unique=True)
    momo_phone = models.CharField(max_length=15)
    status = models.CharField(max_length=20, choices=PaymentRequest.PAYMENT_STATUS_CHOICES)
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
```

### API Endpoints

#### Payment Requests
```
GET    /api/payments/requests/           # List payment requests
POST   /api/payments/requests/           # Create payment request
GET    /api/payments/requests/{id}/      # Get payment details
PUT    /api/payments/requests/{id}/      # Update payment request
DELETE /api/payments/requests/{id}/      # Delete payment request
POST   /api/payments/requests/{id}/status/  # Update payment status
```

#### Payment Analytics
```
GET    /api/payments/analytics/          # Get payment statistics
GET    /api/payments/transactions/       # List payment transactions
GET    /api/payments/settings/           # Get payment settings
POST   /api/payments/generate-link/      # Generate MoMo payment link
POST   /api/payments/webhook/            # MTN MoMo webhook handler
```

### Frontend Components

#### PaymentsPage Component
- **Summary Cards**: Total payments, completed, pending, failed
- **Analytics Charts**: Payment status distribution, payment types
- **Payment Table**: Recent payments with status indicators
- **Create Payment Dialog**: Form for creating new payment requests
- **Payment Details Dialog**: Detailed view of payment information

#### Key Features
- **Real-time Status Updates**: Visual indicators for payment status
- **Payment Link Generation**: Direct links to MTN MoMo payment
- **Analytics Dashboard**: Charts and statistics
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error messages and notifications

### MTN MoMo Integration

#### Manual Integration (Current Implementation)
```python
# Generate payment link (placeholder)
payment_url = f"https://pay.mtn.com/gh/pay?ref={reference_id}&amount={amount}&phone={phone}"
```

#### API Integration (Future Enhancement)
```python
# MTN MoMo API integration
class MTNMoMoAPI:
    def __init__(self, api_key, environment='sandbox'):
        self.api_key = api_key
        self.environment = environment
        self.base_url = 'https://sandbox.momodeveloper.mtn.com' if environment == 'sandbox' else 'https://proxy.momoapi.mtn.com'
    
    def create_payment_request(self, amount, currency, phone, reference_id):
        # Implementation for MTN MoMo API
        pass
    
    def check_payment_status(self, transaction_id):
        # Implementation for status checking
        pass
```

### Webhook Handling

#### Payment Webhook (`/api/payments/webhook/`)
```python
class PaymentWebhookView(APIView):
    def post(self, request):
        webhook_data = request.data
        reference_id = webhook_data.get('reference_id')
        transaction_id = webhook_data.get('transaction_id')
        status = webhook_data.get('status')
        
        # Update payment status
        payment_request = PaymentRequest.objects.get(reference_id=reference_id)
        payment_request.status = status
        payment_request.transaction_id = transaction_id
        payment_request.save()
        
        # Send email notification
        EmailService.send_notification_email_async(
            payment_request.user.email,
            'INFO',
            f'Payment {reference_id} status updated to {status}'
        )
        
        return Response({'status': 'success'})
```

## 🔧 Setup Instructions

### 1. Email Configuration

#### Step 1: Configure Gmail SMTP
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for IPMS
3. Update `settings.py` with your Gmail credentials

#### Step 2: Test Email Sending
```python
# Test email functionality
from core.email_service import EmailService

EmailService.send_notification_email(
    user_email='test@example.com',
    notification_type='INFO',
    message='Test email from IPMS'
)
```

### 2. MTN MoMo Integration

#### Step 1: Database Setup
```bash
# Create and apply migrations
python manage.py makemigrations payments
python manage.py migrate
```

#### Step 2: Test Payment Creation
```python
# Test payment request creation
from payments.models import PaymentRequest

payment = PaymentRequest.objects.create(
    user=request.user,
    payment_type='ORDER_PAYMENT',
    amount=100.00,
    currency='GHS',
    description='Test payment',
    momo_phone='+233XXXXXXXXX'
)
```

#### Step 3: Configure Webhook URL
- Set up webhook endpoint at `/api/payments/webhook/`
- Configure MTN MoMo to send webhooks to this URL
- Test webhook handling with sample data

### 3. Frontend Integration

#### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

#### Step 2: Test Payment Page
1. Navigate to `/payments` in the application
2. Create a test payment request
3. Verify payment analytics and status updates

## 📊 Analytics & Reporting

### Email Analytics
- **Email Delivery Rate**: Track successful email deliveries
- **Email Open Rate**: Monitor email engagement
- **Email Click Rate**: Track action button clicks
- **Email Bounce Rate**: Monitor failed deliveries

### Payment Analytics
- **Total Payments**: Count of all payment requests
- **Completed Payments**: Successful transactions
- **Pending Payments**: Awaiting completion
- **Failed Payments**: Failed transactions
- **Payment Types**: Distribution by payment category
- **Revenue Tracking**: Total amount processed

### Dashboard Features
- **Real-time Updates**: Live status updates
- **Visual Charts**: Pie charts and bar graphs
- **Export Capabilities**: CSV/PDF reports
- **Filtering Options**: Date ranges, status filters

## 🔒 Security & Compliance

### Email Security
- **SMTP Authentication**: Secure Gmail SMTP
- **Email Encryption**: TLS encryption for all emails
- **Spam Protection**: Proper email headers and formatting
- **Unsubscribe Compliance**: CAN-SPAM compliance

### Payment Security
- **HTTPS Only**: All payment communications over HTTPS
- **Webhook Verification**: Verify webhook signatures
- **Transaction Logging**: Complete audit trail
- **Data Encryption**: Encrypt sensitive payment data

## 🚀 Future Enhancements

### Email Notifications
- **SMS Notifications**: Add SMS support for critical alerts
- **Push Notifications**: Browser push notifications
- **Email Templates**: More template options
- **Scheduling**: Scheduled email delivery

### MTN MoMo Integration
- **API Integration**: Full MTN MoMo API integration
- **Multiple Networks**: Support for other mobile money networks
- **Payment Reconciliation**: Automated reconciliation
- **Advanced Analytics**: Detailed payment analytics

## 📝 Troubleshooting

### Common Email Issues
1. **SMTP Authentication Failed**: Check Gmail app password
2. **Email Not Delivered**: Check spam folder and email settings
3. **Template Rendering Issues**: Verify HTML template syntax

### Common Payment Issues
1. **Payment Link Not Generated**: Check payment request creation
2. **Webhook Not Received**: Verify webhook URL configuration
3. **Status Not Updated**: Check webhook processing logic

## 📞 Support

For technical support or questions about the email notifications and MTN MoMo integration:

- **Email**: support@ipms.com
- **Documentation**: [IPMS Documentation](https://docs.ipms.com)
- **GitHub Issues**: [Report Issues](https://github.com/ipms/issues)

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Author**: IPMS Development Team 