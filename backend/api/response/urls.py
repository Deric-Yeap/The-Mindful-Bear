from django.urls import path
from . import views

urlpatterns = [
    path("create",views.AddResponse.as_view(),name="add-response"),

]