from django.urls import path
from .views import SearchHistoryViewSet

urlpatterns = [
    path('record_search/', SearchHistoryViewSet.as_view({'post': 'record_search'}), name='record-search'),
    path('record_click/', SearchHistoryViewSet.as_view({'post': 'record_click'}), name='record-click'),
    path('user_history/', SearchHistoryViewSet.as_view({'get': 'user_history'}), name='user-history'),
    path('popular_searches/', SearchHistoryViewSet.as_view({'get': 'popular_searches'}), name='popular-searches'),
    path('clicked_articles/', SearchHistoryViewSet.as_view({'get': 'clicked_articles'}), name='clicked-articles'),
]