from django.urls import path
from .views import JournalListView, UploadFileView

urlpatterns = [
    path('create/', JournalListView.as_view()),
    path('get_all/', JournalListView.as_view()),
    path('upload/', UploadFileView.as_view()),
]
