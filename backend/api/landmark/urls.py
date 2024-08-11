from django.urls import path
from . import views

urlpatterns = [
    path("create",views.LandmarkCreateView.as_view(),name="landmark-create"),
    path("get",views.LandmarkListView.as_view(),name="landmark-getLandmarks"),
    path("getLandmarkById/<int:pk>", views.LandmarkGetLandmarkByIdView.as_view(), name="landmark-get-landmark-by-id"),
    path("update/<int:pk>", views.LandmarkUpdateDestroyView.as_view(), name="landmark-update"),
    path("delete/<int:pk>", views.LandmarkUpdateDestroyView.as_view(), name="landmark-delete")
]