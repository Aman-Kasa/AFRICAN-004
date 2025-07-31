"""
Views for payment management
"""
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from .models import PaymentRequest, PaymentTransaction, PaymentSettings
from .serializers import (
    PaymentRequestSerializer, PaymentTransactionSerializer, PaymentSettingsSerializer,
    PaymentRequestCreateSerializer, PaymentStatusUpdateSerializer
)
from core.email_service import EmailService
import uuid

class PaymentRequestListCreateView(generics.ListCreateAPIView):
    """List and create payment requests"""
    
    serializer_class = PaymentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter payment requests by user and status"""
        queryset = PaymentRequest.objects.filter(user=self.request.user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by payment type
        payment_type = self.request.query_params.get('payment_type')
        if payment_type:
            queryset = queryset.filter(payment_type=payment_type)
        
        return queryset.order_by('-created_at')
    
    def get_serializer_class(self):
        """Use different serializer for creation"""
        if self.request.method == 'POST':
            return PaymentRequestCreateSerializer
        return PaymentRequestSerializer

class PaymentRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a payment request"""
    
    serializer_class = PaymentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PaymentRequest.objects.filter(user=self.request.user)

class PaymentRequestStatusUpdateView(APIView):
    """Update payment request status"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """Update payment status"""
        payment_request = get_object_or_404(PaymentRequest, pk=pk, user=request.user)
        serializer = PaymentStatusUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            old_status = payment_request.status
            new_status = serializer.validated_data['status']
            
            # Update payment request
            payment_request.status = new_status
            payment_request.transaction_id = serializer.validated_data.get('transaction_id', '')
            payment_request.notes = serializer.validated_data.get('notes', '')
            payment_request.error_message = serializer.validated_data.get('error_message', '')
            
            # Set completed_at if payment is completed
            if new_status == 'COMPLETED':
                payment_request.completed_at = timezone.now()
            
            payment_request.save()
            
            # Send email notification for status change
            if old_status != new_status:
                EmailService.send_notification_email_async(
                    request.user.email,
                    'INFO',
                    f'Payment {payment_request.reference_id} status updated to {new_status}',
                    f'/payments/{payment_request.id}'
                )
            
            return Response(PaymentRequestSerializer(payment_request).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentTransactionListView(generics.ListAPIView):
    """List payment transactions"""
    
    serializer_class = PaymentTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter transactions by payment request"""
        payment_request_id = self.request.query_params.get('payment_request')
        if payment_request_id:
            return PaymentTransaction.objects.filter(
                payment_request_id=payment_request_id,
                payment_request__user=self.request.user
            )
        return PaymentTransaction.objects.filter(payment_request__user=self.request.user)

class PaymentAnalyticsView(APIView):
    """Get payment analytics"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get payment statistics"""
        user_payments = PaymentRequest.objects.filter(user=request.user)
        
        # Calculate statistics
        total_payments = user_payments.count()
        completed_payments = user_payments.filter(status='COMPLETED').count()
        pending_payments = user_payments.filter(status='PENDING').count()
        failed_payments = user_payments.filter(status='FAILED').count()
        
        # Calculate total amounts
        total_amount = user_payments.filter(status='COMPLETED').aggregate(
            total=models.Sum('amount')
        )['total'] or 0
        
        # Payment type distribution
        payment_types = user_payments.values('payment_type').annotate(
            count=models.Count('id')
        )
        
        # Recent payments
        recent_payments = user_payments.order_by('-created_at')[:5]
        
        return Response({
            'total_payments': total_payments,
            'completed_payments': completed_payments,
            'pending_payments': pending_payments,
            'failed_payments': failed_payments,
            'total_amount': float(total_amount),
            'payment_types': list(payment_types),
            'recent_payments': PaymentRequestSerializer(recent_payments, many=True).data
        })

class PaymentSettingsView(generics.ListCreateAPIView):
    """Manage payment settings"""
    
    serializer_class = PaymentSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PaymentSettings.objects.filter(is_active=True)
    
    def perform_create(self, serializer):
        """Create payment setting"""
        serializer.save()

class GeneratePaymentLinkView(APIView):
    """Generate MTN MoMo payment link"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Generate payment link for MTN MoMo"""
        serializer = PaymentRequestCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Create payment request
            payment_request = serializer.save(user=request.user)
            
            # Generate MoMo payment link (placeholder for now)
            # In a real implementation, this would integrate with MTN MoMo API
            payment_url = f"https://pay.mtn.com/gh/pay?ref={payment_request.reference_id}&amount={payment_request.amount}&phone={payment_request.momo_phone}"
            payment_request.payment_url = payment_url
            payment_request.save()
            
            # Send email notification
            EmailService.send_notification_email_async(
                request.user.email,
                'INFO',
                f'Payment request {payment_request.reference_id} created. Amount: {payment_request.amount} {payment_request.currency}',
                f'/payments/{payment_request.id}'
            )
            
            return Response({
                'payment_request': PaymentRequestSerializer(payment_request).data,
                'payment_url': payment_url,
                'message': 'Payment link generated successfully'
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentWebhookView(APIView):
    """Handle payment webhooks from MTN MoMo"""
    
    permission_classes = []  # No authentication for webhooks
    
    def post(self, request):
        """Process payment webhook"""
        # This would handle webhooks from MTN MoMo
        # For now, it's a placeholder implementation
        
        webhook_data = request.data
        reference_id = webhook_data.get('reference_id')
        transaction_id = webhook_data.get('transaction_id')
        status = webhook_data.get('status')
        
        try:
            payment_request = PaymentRequest.objects.get(reference_id=reference_id)
            
            # Update payment status
            payment_request.status = status
            payment_request.transaction_id = transaction_id
            
            if status == 'COMPLETED':
                payment_request.completed_at = timezone.now()
            
            payment_request.save()
            
            # Send email notification
            EmailService.send_notification_email_async(
                payment_request.user.email,
                'INFO',
                f'Payment {reference_id} status updated to {status}',
                f'/payments/{payment_request.id}'
            )
            
            return Response({'status': 'success'})
            
        except PaymentRequest.DoesNotExist:
            return Response({'error': 'Payment request not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 