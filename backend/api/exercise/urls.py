from django.urls import path
from . import views

urlpatterns = [
    path("create",views.ExerciseCreateView.as_view(),name="exercise-create"),
    path("get",views.ExerciseListView.as_view(),name="exercise-getExercises"),
    path("getExerciseById", views.ExerciseGetExerciseByIdView.as_view(), name="exercise-get-exercise-by-id"),
    path("update-delete", views.ExerciseUpdateDestroyView.as_view(), name="exercise-update-delete")
]