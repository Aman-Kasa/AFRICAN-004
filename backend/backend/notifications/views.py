from django.shortcuts import render
from django.db import models
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Notification
from .serializers import NotificationSerializer

# Create your views here.

class NotificationListView(generics.ListAPIView):
    """
    List all notifications for the current user and global notifications (user=None).
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(models.Q(user=user) | models.Q(user=None)).order_by('-created_at')

class NotificationCreateView(generics.CreateAPIView):
    """
    Create a new notification (system or user-specific).
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

class NotificationMarkReadView(APIView):
    """
    Mark a notification as read.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            notif = Notification.objects.get(pk=pk)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)
        notif.is_read = True
        notif.save()
        return Response(NotificationSerializer(notif).data)

class NotificationDeleteView(APIView):
    """
    Delete a notification.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            notif = Notification.objects.get(pk=pk)
            # Ensure user can only delete their own notifications
            if notif.user and notif.user != request.user:
                return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
            notif.delete()
            return Response({'message': 'Notification deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_read(request):
    """
    Mark all unread notifications as read for the current user.
    """
    user = request.user
    updated_count = Notification.objects.filter(
        models.Q(user=user) | models.Q(user=None),
        is_read=False
    ).update(is_read=True)
    
    return Response({
        'message': f'{updated_count} notifications marked as read.',
        'updated_count': updated_count
    })
