from django.urls import path
from .views import PurchaseOrderListCreateView, PurchaseOrderRetrieveUpdateDestroyView, PurchaseOrderApproveRejectView, OrderCSVExportView, OrderPDFExportView, order_analytics

urlpatterns = [
    path('', PurchaseOrderListCreateView.as_view(), name='order-list-create'),
    path('<int:pk>/', PurchaseOrderRetrieveUpdateDestroyView.as_view(), name='order-detail'),
    path('<int:pk>/action/', PurchaseOrderApproveRejectView.as_view(), name='order-approve-reject'),
    path('export/csv/', OrderCSVExportView.as_view(), name='order-export-csv'),
    path('export/pdf/', OrderPDFExportView.as_view(), name='order-export-pdf'),
    path('analytics/', order_analytics, name='order-analytics'),
] 