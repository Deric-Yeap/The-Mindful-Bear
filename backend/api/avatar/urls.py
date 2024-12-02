from django.urls import path
from . import views

urlpatterns = [
    path("create",views.AvatarCreateView.as_view(),name="avatar-create"),
    path("get",views.AvatarListView.as_view(),name="avatar-get"),
    path("getAvatarById/<int:pk>", views.AvatarGetByIdView.as_view(), name="avatar-get-avatar-by-id"),
    path("update/<int:pk>", views.AvatarUpdateView.as_view(), name="avatar-update"),
    path("delete/<int:pk>", views.AvatarDeleteView.as_view(), name="avatar-delete"),
]