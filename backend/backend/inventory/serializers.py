from rest_framework import serializers
from .models import InventoryItem

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'sku', 'quantity', 'reorder_level', 'created_at', 'updated_at']

class InventoryMetricsSerializer(serializers.Serializer):
    total_items = serializers.IntegerField()
    low_stock = serializers.IntegerField() 