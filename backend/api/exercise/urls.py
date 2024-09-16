from django.urls import path
from . import views

urlpatterns = [
    path("create",views.ExerciseCreateView.as_view(),name="exercise-create"),
    path("get",views.ExerciseListView.as_view(),name="exercise-getExercises"),
    path("getExerciseById/<int:pk>", views.ExerciseGetExerciseByIdView.as_view(), name="exercise-get-exercise-by-id"),
    path("update/<int:pk>", views.ExerciseUpdateView.as_view(), name="exercise-update"),
    path("delete/<int:pk>", views.ExerciseUpdateDestroyView.as_view(), name="exercise-delete"),
    path("upload-audio", views.ExerciseUploadAudioView.as_view(), name="exercise-upload-audio"),  # New URL pattern
]