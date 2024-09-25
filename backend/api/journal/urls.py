from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (JournalListView, UploadFileView, JournalCalendarView, CountYearJournalView,SpeechToTextView, JournalEntriesByDateView, JournalEntriesByPeriodView, JournalEntryViewSet)

router = DefaultRouter()
router.register(r'journal_entry', JournalEntryViewSet, basename='journal-entry')

urlpatterns = [
    path('create/', JournalListView.as_view()),
    path('get_all/', JournalListView.as_view()),
    path('upload/', UploadFileView.as_view()),
    path('calendar/', JournalCalendarView.as_view()),
    path("journal_count_year/", CountYearJournalView.as_view()),
    path("speech_to_text/", SpeechToTextView.as_view()),
    path("journal_entries_by_date/", JournalEntriesByDateView.as_view()),
    path('journal_entries_by_period/', JournalEntriesByPeriodView.as_view(), name='journal-entries-by-period'),
    path('', include(router.urls)),
]