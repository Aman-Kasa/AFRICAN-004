from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    """
    Serializer for the AuditLog model.
    """
    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'action', 'object_type', 'object_id', 'message', 'created_at'] 