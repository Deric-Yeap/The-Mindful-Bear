from django.urls import path
from .views import UserCreateView, UserUpdateDestroyView, LoginView, UserGetMeView, UserExercisesView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('create', UserCreateView.as_view(), name='user-create'),
    path('login', LoginView.as_view(), name='user-login'),
    path('update-delete', UserUpdateDestroyView.as_view(), name='user-update-destroy'),
    path('getMe', UserGetMeView.as_view(), name='user-get-me'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('exercises/', UserExercisesView.as_view(), name='user-exercises'),
] 