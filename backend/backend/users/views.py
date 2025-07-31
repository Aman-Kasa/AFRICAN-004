from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import User
from .serializers import RegisterSerializer, UserSerializer, UserAdminSerializer

# Create your views here.

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class UserInfoView(generics.RetrieveAPIView):
    """
    API endpoint to get the current user's info.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserAdminListCreateView(generics.ListCreateAPIView):
    """
    Admin: List all users and create new users.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserAdminSerializer
    permission_classes = [permissions.IsAdminUser]

class UserAdminRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin: Retrieve, update, or delete a user.
    """
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [permissions.IsAdminUser]
