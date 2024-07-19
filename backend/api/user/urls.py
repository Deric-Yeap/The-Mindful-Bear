from django.urls import path
from .views import UserListView, UserCreateView, UserRetrieveUpdateDestroyView, LoginView

urlpatterns = [
    path('users/create', UserCreateView.as_view(), name='user-create'),
    path('users/userList', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserRetrieveUpdateDestroyView.as_view(), name='user-detail'),
    path('users/login', LoginView.as_view(), name='user-login'),
]