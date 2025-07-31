from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import InventoryItem
from .serializers import InventoryMetricsSerializer
from django.db import models
from rest_framework import generics, permissions
from .serializers import InventoryItemSerializer
from django.http import HttpResponse
import csv
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from rest_framework.generics import get_object_or_404
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from io import BytesIO

# Create your views here.

class InventoryMetricsView(APIView):
    """
    API endpoint for inventory dashboard metrics.
    Returns total items and low stock count.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Count total items and low stock items
        total_items = InventoryItem.objects.count()
        low_stock = InventoryItem.objects.filter(quantity__lte=models.F('reorder_level')).count()
        data = {'total_items': total_items, 'low_stock': low_stock}
        serializer = InventoryMetricsSerializer(data)
        return Response(serializer.data)

class InventoryItemListCreateView(generics.ListCreateAPIView):
    """
    List and create inventory items. Supports filtering by name and SKU via query params.
    """
    queryset = InventoryItem.objects.all().order_by('-created_at')
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        name = self.request.query_params.get('name')
        sku = self.request.query_params.get('sku')
        if name:
            queryset = queryset.filter(name__icontains=name)
        if sku:
            queryset = queryset.filter(sku__icontains=sku)
        return queryset

class InventoryItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a single inventory item.
    """
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class InventoryCSVExportView(APIView):
    """
    Export all inventory items as a CSV file.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Write all inventory items to CSV
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="inventory_export.csv"'
        writer = csv.writer(response)
        writer.writerow(['name', 'sku', 'quantity', 'reorder_level', 'created_at', 'updated_at'])
        for item in InventoryItem.objects.all():
            writer.writerow([
                item.name, item.sku, item.quantity, item.reorder_level,
                item.created_at.isoformat(), item.updated_at.isoformat()
            ])
        return response

class InventoryCSVImportView(APIView):
    """
    Import inventory items from a CSV file. Updates existing items by SKU or creates new ones.
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file uploaded.'}, status=400)
        decoded = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded)
        created, updated = 0, 0
        for row in reader:
            obj, exists = InventoryItem.objects.update_or_create(
                sku=row['sku'],
                defaults={
                    'name': row.get('name', ''),
                    'quantity': int(row.get('quantity', 0)),
                    'reorder_level': int(row.get('reorder_level', 0)),
                }
            )
            if exists:
                updated += 1
            else:
                created += 1
        return Response({'created': created, 'updated': updated})

class InventoryItemStockInView(APIView):
    """
    API endpoint to increment the quantity of an inventory item (stock in).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        item = get_object_or_404(InventoryItem, pk=pk)
        amount = int(request.data.get('amount', 1))
        item.quantity += amount
        item.save()
        return Response({'status': 'stocked in', 'item_id': item.id, 'new_quantity': item.quantity}, status=status.HTTP_200_OK)

class InventoryItemStockOutView(APIView):
    """
    API endpoint to decrement the quantity of an inventory item (stock out).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        item = get_object_or_404(InventoryItem, pk=pk)
        amount = int(request.data.get('amount', 1))
        if item.quantity - amount < 0:
            return Response({'error': 'Not enough stock.'}, status=status.HTTP_400_BAD_REQUEST)
        item.quantity -= amount
        item.save()
        return Response({'status': 'stocked out', 'item_id': item.id, 'new_quantity': item.quantity}, status=status.HTTP_200_OK)

class InventoryPDFExportView(APIView):
    """
    Export all inventory items as a PDF file.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = InventoryItem.objects.all().order_by('name')
        html = render_to_string('inventory_pdf_template.html', {'items': items})
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="inventory_report.pdf"'
        pisa_status = pisa.CreatePDF(html, dest=response)
        if pisa_status.err:
            return HttpResponse('Error generating PDF', status=500)
        return response
