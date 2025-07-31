from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Supplier
from .serializers import SupplierSerializer
from django.http import HttpResponse
import csv
from rest_framework.views import APIView
from rest_framework.response import Response
from orders.models import PurchaseOrder
from django.db import models
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class SupplierListCreateView(generics.ListCreateAPIView):
    queryset = Supplier.objects.all().order_by('-created_at')
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        name = self.request.query_params.get('name')
        contact_name = self.request.query_params.get('contact_name')
        contact_email = self.request.query_params.get('contact_email')
        if name:
            queryset = queryset.filter(name__icontains=name)
        if contact_name:
            queryset = queryset.filter(contact_name__icontains=contact_name)
        if contact_email:
            queryset = queryset.filter(contact_email__icontains=contact_email)
        return queryset

class SupplierRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]

class SupplierCSVExportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="suppliers_export.csv"'
        writer = csv.writer(response)
        writer.writerow(['name', 'contact_name', 'contact_email', 'contact_phone', 'address', 'created_at', 'updated_at'])
        for supplier in Supplier.objects.all():
            writer.writerow([
                supplier.name, supplier.contact_name, supplier.contact_email, supplier.contact_phone, supplier.address,
                supplier.created_at.isoformat(), supplier.updated_at.isoformat()
            ])
        return response

class SupplierPDFExportView(APIView):
    """
    Export all suppliers as a PDF file.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        suppliers = Supplier.objects.all().order_by('name')
        html = render_to_string('suppliers_pdf_template.html', {'suppliers': suppliers})
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="suppliers_report.pdf"'
        pisa_status = pisa.CreatePDF(html, dest=response)
        if pisa_status.err:
            return HttpResponse('Error generating PDF', status=500)
        return response

class SupplierAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_suppliers = Supplier.objects.count()
        # Top suppliers by order count
        top_suppliers = (
       PurchaseOrder.objects.values('supplier__name')
       .annotate(order_count=models.Count('id'))
       .order_by('-order_count')[:10]
        )
        top_suppliers = (
            PurchaseOrder.objects.values('supplier__name')
            .annotate(order_count=models.Count('id'))
            .order_by('-order_count')[:10]
        )
        return Response({
            'total_suppliers': total_suppliers,
            'top_suppliers': list(top_suppliers),
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def supplier_analytics(request):
    # Top suppliers by order count (using supplier as a string field)
    top_suppliers = (
        PurchaseOrder.objects.values('supplier')
        .annotate(order_count=models.Count('id'))
        .order_by('-order_count')[:10]
    )
    return Response({'top_suppliers': list(top_suppliers)})
