from django.urls import path
from . import views

urlpatterns = [
    path('<int:landmark_id>', views.GetUserCountView.as_view(), name='get_user_count'),
    path('<int:landmark_id>/increment', views.IncrementUserCountView.as_view(), name='increment_user_count'),
    path('<int:landmark_id>/decrement', views.DecrementUserCountView.as_view(), name='decrement_user_count'),
]
