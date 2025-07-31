from django.urls import path
from .views import InventoryMetricsView, InventoryItemListCreateView, InventoryItemRetrieveUpdateDestroyView, InventoryCSVExportView, InventoryCSVImportView, InventoryItemStockInView, InventoryItemStockOutView, InventoryPDFExportView

urlpatterns = [
    path('metrics/', InventoryMetricsView.as_view(), name='inventory-metrics'),
    path('items/', InventoryItemListCreateView.as_view(), name='inventory-list-create'),
    path('items/<int:pk>/', InventoryItemRetrieveUpdateDestroyView.as_view(), name='inventory-detail'),
    path('items/export/csv/', InventoryCSVExportView.as_view(), name='inventory-export-csv'),
    path('items/export/pdf/', InventoryPDFExportView.as_view(), name='inventory-export-pdf'),
    path('items/import/csv/', InventoryCSVImportView.as_view(), name='inventory-import-csv'),
    path('items/<int:pk>/stock-in/', InventoryItemStockInView.as_view(), name='inventory-stock-in'),
    path('items/<int:pk>/stock-out/', InventoryItemStockOutView.as_view(), name='inventory-stock-out'),
] 