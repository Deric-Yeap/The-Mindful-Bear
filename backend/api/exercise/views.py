from django.shortcuts import render
from rest_framework import generics
from .models import Exercise
from .serializer import ExerciseSerializer
# Create your views here.


# Create your views here.
class ExerciseCreateView(generics.CreateAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer


class ExerciseListView(generics.ListAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

