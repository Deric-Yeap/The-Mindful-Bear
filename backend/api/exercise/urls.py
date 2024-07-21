from django.urls import path
from . import views

urlpatterns = [
    path("exercise/create",views.ExerciseCreateView.as_view(),name="exercise-create"),
    path("exercise/getExercises",views.ExerciseListView.as_view(),name="exercise-getExercises")
]