from django.urls import path
from . import views

urlpatterns = [
    path("create",views.UserFragmentCreateView.as_view(),name="user-fragment-create"),
    path("get",views.UserFragmentListView.as_view(),name="user-fragment-get"),
    path("getUserFragmentById/<int:pk>", views.UserFragmentGetByIdView.as_view(), name="user-fragment-get-by-id"),
    path("getUserFragmentByUserId/<int:user_id>", views.UserFragmentGetByUserIdView.as_view(), name="user-fragment-get-by-user-id"),
    path("update/<int:pk>", views.UserFragmentUpdateDestroyView.as_view(), name="user-fragment-update"),
    path("delete/<int:pk>", views.UserFragmentUpdateDestroyView.as_view(), name="user-fragment-delete"),
    path("gachaFragment", views.GachaFragmentView.as_view(), name="gacha-fragment"),
]