from django.urls import path
from . import views

urlpatterns = [
    path("create",views.UserAvatarCreateView.as_view(),name="user-avatar-create"),
    path("get",views.UserAvatarListView.as_view(),name="user-avatar-get"),
    path("getUserAvatarById/<int:pk>", views.UserAvatarGetByIdView.as_view(), name="user-avatar-get-by-id"),
    path("getUserAvatarByUserId/<int:user_id>", views.UserAvatarGetByUserIdView.as_view(), name="user-avatar-get-by-user-id"),
    path("update/<int:pk>", views.UserAvatarUpdateDestroyView.as_view(), name="user-avatar-update"),
    path("delete/<int:pk>", views.UserAvatarUpdateDestroyView.as_view(), name="user-avatar-delete")
]