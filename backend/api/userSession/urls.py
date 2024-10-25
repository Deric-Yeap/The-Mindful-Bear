from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.UserSessionCreate.as_view(), name='usersession-create'),
    path('get/', views.UserSessionList.as_view(), name='get-all-usersession-list'),
    path('get/<int:pk>/', views.UserSessionDetail.as_view(), name='usersession-detail'),
    path('update/<int:pk>/', views.UpdateUserSessionDetail.as_view(), name='update-usersession-detail'),   
    path('split/', views.UserSessionSplitView.as_view(), name='usersession-period-split')
]

 