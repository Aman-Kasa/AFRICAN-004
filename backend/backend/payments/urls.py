"""
URL patterns for payment management
"""
from django.urls import path
from .views import (
    PaymentRequestListCreateView, PaymentRequestDetailView, PaymentRequestStatusUpdateView,
    PaymentTransactionListView, PaymentAnalyticsView, PaymentSettingsView,
    GeneratePaymentLinkView, PaymentWebhookView
)

urlpatterns = [
    # Payment requests
    path('requests/', PaymentRequestListCreateView.as_view(), name='payment-request-list-create'),
    path('requests/<uuid:pk>/', PaymentRequestDetailView.as_view(), name='payment-request-detail'),
    path('requests/<uuid:pk>/status/', PaymentRequestStatusUpdateView.as_view(), name='payment-request-status-update'),
    
    # Payment transactions
    path('transactions/', PaymentTransactionListView.as_view(), name='payment-transaction-list'),
    
    # Payment analytics
    path('analytics/', PaymentAnalyticsView.as_view(), name='payment-analytics'),
    
    # Payment settings
    path('settings/', PaymentSettingsView.as_view(), name='payment-settings'),
    
    # Payment link generation
    path('generate-link/', GeneratePaymentLinkView.as_view(), name='generate-payment-link'),
    
    # Webhook for MTN MoMo
    path('webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
] 