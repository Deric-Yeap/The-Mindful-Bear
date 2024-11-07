from django.urls import path
from . import views


urlpatterns = [
    path('get/', views.FormSessionList.as_view(), name='form-session-list'),
    path('score/', views.FormSessionScoreView.as_view(), name='form-session-score')
]

 