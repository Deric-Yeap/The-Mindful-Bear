from django.urls import path
from .views import FavouriteCreateView, FavouriteDeleteView

urlpatterns = [
    path('create/<int:landmarkId>/', FavouriteCreateView.as_view(), name='favourite-create'),
    path('delete/<int:landmarkId>/', FavouriteDeleteView.as_view(), name='favourite-delete'),
]
