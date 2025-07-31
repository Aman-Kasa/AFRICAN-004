from rest_framework import generics, permissions
from django.db.models import Q
from django.utils.dateparse import parse_date
from django.http import HttpResponse
from .models import AuditLog
from .serializers import AuditLogSerializer

class AuditLogListView(generics.ListAPIView):
    """
    List all audit logs, most recent first.
    Supports filtering by user, action, object_type, and date range.
    """
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = AuditLog.objects.all().order_by('-created_at')
        
        # Filter by user
        user = self.request.query_params.get('user', None)
        if user:
            queryset = queryset.filter(user__username__icontains=user)
        
        # Filter by action
        action = self.request.query_params.get('action', None)
        if action:
            queryset = queryset.filter(action__icontains=action)
        
        # Filter by object_type
        object_type = self.request.query_params.get('object_type', None)
        if object_type:
            queryset = queryset.filter(object_type__icontains=object_type)
        
        # Filter by start date
        start_date = self.request.query_params.get('start_date', None)
        if start_date:
            parsed_start_date = parse_date(start_date)
            if parsed_start_date:
                queryset = queryset.filter(created_at__date__gte=parsed_start_date)
        
        # Filter by end date
        end_date = self.request.query_params.get('end_date', None)
        if end_date:
            parsed_end_date = parse_date(end_date)
            if parsed_end_date:
                queryset = queryset.filter(created_at__date__lte=parsed_end_date)
        
        return queryset

class AuditLogCreateView(generics.CreateAPIView):
    """
    Create a new audit log entry.
    """
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated] 

def home_view(request):
    """
    Simple homepage showing API information.
    """
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>African-004 Management System</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
            h2 { color: #34495e; margin-top: 25px; }
            .api-endpoint { background: #ecf0f1; padding: 10px; margin: 5px 0; border-radius: 4px; font-family: monospace; }
            .admin-link { background: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
            .admin-link:hover { background: #c0392b; }
            .status { color: #27ae60; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌍 African-004 Management System</h1>
            <p class="status">✅ System Status: Online and Running</p>
            
            <h2>🔧 Admin Panel</h2>
            <a href="/admin/" class="admin-link">Access Admin Dashboard</a>
            
            <h2>📡 Available API Endpoints</h2>
            
            <h3>👥 Users Management</h3>
            <div class="api-endpoint">GET/POST /api/users/</div>
            
            <h3>📦 Inventory Management</h3>
            <div class="api-endpoint">GET/POST /api/inventory/</div>
            
            <h3>📋 Orders Management</h3>
            <div class="api-endpoint">GET/POST /api/orders/</div>
            
            <h3>🏭 Suppliers Management</h3>
            <div class="api-endpoint">GET/POST /api/suppliers/</div>
            
            <h3>🔔 Notifications</h3>
            <div class="api-endpoint">GET/POST /api/notifications/</div>
            
            <h3>💳 Payments</h3>
            <div class="api-endpoint">GET/POST /api/payments/</div>
            
            <h3>📊 Audit Logs</h3>
            <div class="api-endpoint">GET /api/audit-logs/</div>
            <div class="api-endpoint">POST /api/audit-logs/create/</div>
            
            <h3>🔑 Authentication</h3>
            <div class="api-endpoint">POST /api/token/ (Login)</div>
            <div class="api-endpoint">POST /api/token/refresh/ (Refresh Token)</div>
            
            <h2>📚 Documentation</h2>
            <p>This is a Django REST API backend for inventory and order management system.</p>
            <p>All API endpoints require authentication except for the token endpoint.</p>
            
            <h2>🚀 Getting Started</h2>
            <ol>
                <li>Access the <a href="/admin/">Admin Panel</a> to manage data</li>
                <li>Use the API endpoints with proper authentication</li>
                <li>Contact administrator for API access credentials</li>
            </ol>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html_content) 