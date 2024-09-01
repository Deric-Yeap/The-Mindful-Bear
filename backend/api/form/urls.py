from django.urls import path
from . import views

urlpatterns = [
    path("get",views.FormGet.as_view(),name="form-get"),
    path("create",views.FormCreate.as_view(),name="form-create"),
    path("update/<int:pk>",views.FormUpdate.as_view(),name="form-update"),
    path("delete/<int:pk>",views.FormDestroy.as_view(),name="form-delete"),
    path("create-form-and-questions",views.FormAndQuestionCreateView.as_view(),name="create-form-and-questions"),
    path("get-form-and-questions/<int:pk>",views.FormAndQuestionView.as_view(),name="get-form-and-questions"),
]