from django.urls import path
from .views import JournalListView, UploadFileView, JournalCalendarView, CountYearJournalView

urlpatterns = [
    path('create/', JournalListView.as_view()),
    path('get_all/', JournalListView.as_view()),
    path('upload/', UploadFileView.as_view()),
    path('calendar/', JournalCalendarView.as_view()),
    path("journal_count_year/", CountYearJournalView.as_view())
]
