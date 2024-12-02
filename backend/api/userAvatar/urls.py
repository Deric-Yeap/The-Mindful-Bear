from django.urls import path
from . import views

urlpatterns = [
    path("create",views.CreateUserAvatar.as_view(),name="user-avatar-create"),
    path("get",views.ListUserAvatars.as_view(),name="user-avatar-get"),
    path("getUserAvatarById/<int:pk>", views.RetrieveUserAvatar.as_view(), name="user-avatar-get-by-id"),
    path("getUserAvatarByUserId/<int:user_id>", views.RetrieveUserAvatarsByUserId.as_view(), name="user-avatar-get-by-user-id"),
    path("update/<int:pk>", views.UpdateUserAvatar.as_view(), name="user-avatar-update"),
    path("delete/<int:pk>", views.DeleteUserAvatar.as_view(), name="user-avatar-delete")
]