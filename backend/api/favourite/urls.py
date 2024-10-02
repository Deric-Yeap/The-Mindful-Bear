from django.urls import path
from .views import FavouriteCreateView, FavouriteDeleteView, FavouriteListView

urlpatterns = [
    path('create/<int:landmarkId>/', FavouriteCreateView.as_view(), name='favourite-create'),
    path('delete/<int:landmarkId>/', FavouriteDeleteView.as_view(), name='favourite-delete'),
    path('list/', FavouriteListView.as_view(), name='favourite-list'),    
]
