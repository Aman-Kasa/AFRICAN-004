from django.db import models
from django.contrib.auth import get_user_model

class AuditLog(models.Model):
    """
    Model for tracking key system actions for auditability.
    """
    user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100)
    object_type = models.CharField(max_length=100)
    object_id = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} on {self.object_type} ({self.object_id}) by {self.user or 'system'}" 