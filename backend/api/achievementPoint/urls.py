from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.AchievementPointViewSet, basename='AchievementPoint')

urlpatterns = [
    path('', include(router.urls)),
    path('sum-points', views.SumPointsView.as_view(), name='sum-points'),
    path('check-login-points', views.CheckLoginPointsView.as_view(), name='check-login-points')
]