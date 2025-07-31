from django.db import models

# Create your models here.

class PurchaseOrder(models.Model):
    """
    Model representing a purchase order.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    supplier = models.CharField(max_length=255)
    item = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order for {self.item} from {self.supplier} ({self.status})"
