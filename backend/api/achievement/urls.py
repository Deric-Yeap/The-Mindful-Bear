from django.urls import path
from . import views

urlpatterns = [
    path("create",views.AchievementCreateView.as_view(),name="achievement-create"),
    path("get",views.AchievementListView.as_view(),name="achievement-get"),
    path("getAchievementById/<int:pk>", views.AchievementGetByIdView.as_view(), name="achievement-get-achievement-by-id"),
    path("update/<int:pk>", views.AchievementUpdateDestroyView.as_view(), name="achievement-update"),
    path("delete/<int:pk>", views.AchievementUpdateDestroyView.as_view(), name="achievement-delete"),
    path('checkAchievements', views.checkAchievementAttainedView.as_view(), name='check-achievement'),

]