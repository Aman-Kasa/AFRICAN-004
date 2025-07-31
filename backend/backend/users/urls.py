from django.urls import path
from .views import RegisterView, UserInfoView, UserAdminListCreateView, UserAdminRetrieveUpdateDestroyView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserInfoView.as_view(), name='user-info'),
    path('admin/', UserAdminListCreateView.as_view(), name='user-admin-list-create'),
    path('admin/<int:pk>/', UserAdminRetrieveUpdateDestroyView.as_view(), name='user-admin-detail'),
] 