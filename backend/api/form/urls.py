from django.urls import path
from . import views

urlpatterns = [
    path("get",views.FormGet.as_view(),name="form-get"),
    path("create",views.FormCreate.as_view(),name="form-create"),
    path("update/<int:pk>/",views.FormUpdate.as_view(),name="form-update"),
    path("delete/<int:pk>/",views.FormDestroy.as_view(),name="form-delete"),
]