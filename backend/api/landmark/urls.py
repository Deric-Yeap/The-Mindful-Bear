from django.urls import path
from . import views

urlpatterns = [
    path("landmark/create",views.LandmarkCreateView.as_view(),name="landmark-create"),
    path("landmark/getLandmarks",views.LandmarkListView.as_view(),name="landmark-getLandmarks")
]