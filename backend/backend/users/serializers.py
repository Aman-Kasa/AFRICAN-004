from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom User model.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data.get('role', User.Roles.STAFF),
            password=validated_data['password']
        )
        return user

class UserAdminSerializer(serializers.ModelSerializer):
    """
    Serializer for admin user management.
    """
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'is_active', 'is_staff', 'is_superuser', 'date_joined'
        ] 