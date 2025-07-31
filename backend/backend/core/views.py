from rest_framework import generics, permissions
from django.db.models import Q
from django.utils.dateparse import parse_date
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