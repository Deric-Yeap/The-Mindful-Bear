from django.urls import path
from . import views

urlpatterns = [
    path("create",views.AddResponse.as_view(),name="add-response"),
    path("update/<int:pk>/",views.UpdateResponse.as_view(),name="update-response"),
     path("delete/<int:pk>/",views.DeleteResponse.as_view(),name="delete-response"),

]