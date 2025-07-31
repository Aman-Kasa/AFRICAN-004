from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import PurchaseOrder
from .serializers import PurchaseOrderSerializer
from django.http import HttpResponse
import csv
from django.db import models
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class PurchaseOrderListCreateView(generics.ListCreateAPIView):
    queryset = PurchaseOrder.objects.all().order_by('-created_at')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        supplier = self.request.query_params.get('supplier')
        item = self.request.query_params.get('item')
        status_param = self.request.query_params.get('status')
        if supplier:
            queryset = queryset.filter(supplier__name__icontains=supplier)
        if item:
            queryset = queryset.filter(item__name__icontains=item)
        if status_param:
            queryset = queryset.filter(status__iexact=status_param)
        return queryset

class PurchaseOrderRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

class PurchaseOrderApproveRejectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            order = PurchaseOrder.objects.get(pk=pk)
        except PurchaseOrder.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        action = request.data.get('action')
        if action == 'approve':
            order.status = 'APPROVED'
        elif action == 'reject':
            order.status = 'REJECTED'
        else:
            return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)
        order.save()
        return Response(PurchaseOrderSerializer(order).data)

class OrderCSVExportView(APIView):
    """
    API endpoint to export all purchase orders as a CSV file.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="orders_export.csv"'
        writer = csv.writer(response)
        writer.writerow(['supplier', 'item', 'quantity', 'status', 'created_at', 'updated_at'])
        for order in PurchaseOrder.objects.all():
            writer.writerow([
                order.supplier, order.item, order.quantity, order.status,
                order.created_at.isoformat(), order.updated_at.isoformat()
            ])
        return response

class OrderPDFExportView(APIView):
    """
    Export all purchase orders as a PDF file.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = PurchaseOrder.objects.all().order_by('-created_at')
        html = render_to_string('orders_pdf_template.html', {'orders': orders})
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="orders_report.pdf"'
        pisa_status = pisa.CreatePDF(html, dest=response)
        if pisa_status.err:
            return HttpResponse('Error generating PDF', status=500)
        return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_analytics(request):
    status_counts = (
        PurchaseOrder.objects.values('status')
        .order_by('status')
        .annotate(count=models.Count('id'))
    )
    return Response({'status_distribution': list(status_counts)})
