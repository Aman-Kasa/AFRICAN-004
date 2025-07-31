"""
Serializers for payment models
"""
from rest_framework import serializers
from .models import PaymentRequest, PaymentTransaction, PaymentSettings

class PaymentRequestSerializer(serializers.ModelSerializer):
    """Serializer for PaymentRequest model"""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    order_reference = serializers.CharField(source='order.id', read_only=True)
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    
    class Meta:
        model = PaymentRequest
        fields = [
            'id', 'user', 'user_email', 'user_name', 'payment_type', 'amount', 
            'currency', 'description', 'momo_phone', 'reference_id', 'status',
            'payment_url', 'transaction_id', 'order', 'order_reference', 
            'supplier', 'supplier_name', 'created_at', 'updated_at', 
            'completed_at', 'notes', 'error_message'
        ]
        read_only_fields = ['id', 'reference_id', 'status', 'payment_url', 
                           'transaction_id', 'created_at', 'updated_at', 
                           'completed_at', 'error_message']
    
    def create(self, validated_data):
        """Create a new payment request"""
        # Set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class PaymentTransactionSerializer(serializers.ModelSerializer):
    """Serializer for PaymentTransaction model"""
    
    payment_request_reference = serializers.CharField(source='payment_request.reference_id', read_only=True)
    
    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'payment_request', 'payment_request_reference', 'transaction_type',
            'amount', 'currency', 'momo_transaction_id', 'momo_phone', 'status',
            'created_at', 'updated_at', 'description', 'metadata'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PaymentSettingsSerializer(serializers.ModelSerializer):
    """Serializer for PaymentSettings model"""
    
    class Meta:
        model = PaymentSettings
        fields = ['id', 'key', 'value', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class PaymentRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payment requests"""
    
    class Meta:
        model = PaymentRequest
        fields = [
            'payment_type', 'amount', 'currency', 'description', 'momo_phone',
            'order', 'supplier', 'notes'
        ]
    
    def validate_momo_phone(self, value):
        """Validate MTN MoMo phone number format"""
        # Basic validation for Ghana phone numbers
        if not value.startswith('+233') and not value.startswith('233'):
            raise serializers.ValidationError("Phone number must be in Ghana format (+233XXXXXXXXX)")
        return value
    
    def validate_amount(self, value):
        """Validate payment amount"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero")
        return value

class PaymentStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating payment status"""
    
    status = serializers.ChoiceField(choices=PaymentRequest.PAYMENT_STATUS_CHOICES)
    transaction_id = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    error_message = serializers.CharField(required=False, allow_blank=True) 