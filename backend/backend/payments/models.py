"""
Payment models for MTN MoMo integration
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()

class PaymentRequest(models.Model):
    """Model for tracking payment requests"""
    
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
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_requests')
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='GHS')
    description = models.TextField()
    momo_phone = models.CharField(max_length=15, help_text='MTN MoMo phone number')
    reference_id = models.CharField(max_length=100, unique=True, help_text='External reference ID')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    payment_url = models.URLField(blank=True, null=True, help_text='MoMo payment link')
    transaction_id = models.CharField(max_length=100, blank=True, null=True, help_text='MoMo transaction ID')
    
    # Related objects
    order = models.ForeignKey('orders.PurchaseOrder', on_delete=models.SET_NULL, null=True, blank=True)
    supplier = models.ForeignKey('suppliers.Supplier', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional fields
    notes = models.TextField(blank=True)
    error_message = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Payment Request'
        verbose_name_plural = 'Payment Requests'
    
    def __str__(self):
        return f"Payment {self.reference_id} - {self.amount} {self.currency}"
    
    def save(self, *args, **kwargs):
        if not self.reference_id:
            self.reference_id = f"IPMS-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    @property
    def is_completed(self):
        return self.status == 'COMPLETED'
    
    @property
    def is_pending(self):
        return self.status == 'PENDING'
    
    @property
    def is_failed(self):
        return self.status == 'FAILED'

class PaymentTransaction(models.Model):
    """Model for tracking payment transactions"""
    
    TRANSACTION_TYPE_CHOICES = [
        ('PAYMENT', 'Payment'),
        ('REFUND', 'Refund'),
        ('FEE', 'Fee'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment_request = models.ForeignKey(PaymentRequest, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='GHS')
    momo_transaction_id = models.CharField(max_length=100, unique=True)
    momo_phone = models.CharField(max_length=15)
    status = models.CharField(max_length=20, choices=PaymentRequest.PAYMENT_STATUS_CHOICES)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional fields
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Payment Transaction'
        verbose_name_plural = 'Payment Transactions'
    
    def __str__(self):
        return f"Transaction {self.momo_transaction_id} - {self.amount} {self.currency}"

class PaymentSettings(models.Model):
    """Model for storing payment configuration"""
    
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['key']
        verbose_name = 'Payment Setting'
        verbose_name_plural = 'Payment Settings'
    
    def __str__(self):
        return f"{self.key}: {self.value}" 