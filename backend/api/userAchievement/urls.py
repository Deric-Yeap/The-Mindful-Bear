from django.urls import path
from . import views

urlpatterns = [
    path("create",views.UserAchievementCreateView.as_view(),name="user-achievement-create"),
    path("get",views.UserAchievementListView.as_view(),name="user-achievement-get"),
    path("getUserAchievementById/<int:pk>", views.UserAchievementGetByIdView.as_view(), name="user-achievement-get-achievement-by-id"),
    path("getUserAchievementByUserId/<int:user_id>", views.UserAchievementGetByUserIdView.as_view(), name="user-achievement-get-by-user-id"),
    path("update/<int:pk>", views.UserAchievementUpdateDestroyView.as_view(), name="user-achievement-update"),
    path("delete/<int:pk>", views.UserAchievementUpdateDestroyView.as_view(), name="user-achievement-delete"),
    path('obtainAchievements', views.checkUserAchievementsView.as_view(), name='obtain-achievement'),
]