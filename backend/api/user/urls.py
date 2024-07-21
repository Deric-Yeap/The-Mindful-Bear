from django.urls import path
from .views import UserCreateView, UserUpdateDestroyView, LoginView, UserGetMeView

urlpatterns = [
    path('users/create', UserCreateView.as_view(), name='user-create'),
    path('users/login', LoginView.as_view(), name='user-login'),
    path('users/update-delete', UserUpdateDestroyView.as_view(), name='user-update-destroy'),
    path('users/getMe', UserGetMeView.as_view(), name='user-get-me'),
]