from django.urls import path
from .views import SupplierListCreateView, SupplierRetrieveUpdateDestroyView, SupplierCSVExportView, SupplierAnalyticsView, SupplierPDFExportView, supplier_analytics

urlpatterns = [
    path('', SupplierListCreateView.as_view(), name='supplier-list-create'),
    path('<int:pk>/', SupplierRetrieveUpdateDestroyView.as_view(), name='supplier-detail'),
    path('export/csv/', SupplierCSVExportView.as_view(), name='supplier-export-csv'),
    path('export/pdf/', SupplierPDFExportView.as_view(), name='supplier-export-pdf'),
    path('analytics/', supplier_analytics, name='supplier-analytics'),
] 