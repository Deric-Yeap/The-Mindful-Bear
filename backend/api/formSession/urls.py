from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.FormSessionList.as_view(), name='form-session-list'),
    path('prof-score/', views.FormSessionScoreView.as_view(), name='form-session-prof-score'),
    path('prof-percent-score/', views.FormSessionScoreView.as_view(), name='form-session-score'),
]

 