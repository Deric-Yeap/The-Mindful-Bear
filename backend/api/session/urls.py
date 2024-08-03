from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.SessionCreate.as_view(), name='session-create'),
    path('get/', views.SessionList.as_view(), name='get-all-session-list'),
     path('get/<int:pk>/', views.SessionDetail.as_view(), name='session-detail'),
    path('update/<int:pk>/', views.UpdateSessionDetail.as_view(), name='update-session-detail'),   
]

