from django.shortcuts import render
from rest_framework import generics
from .models import Exercise
from .serializer import *
from ..common.permission import CustomDjangoModelPermissions
# Create your views here.


# Create your views here.
class ExerciseCreateView(generics.CreateAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class ExerciseListView(generics.ListAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class ExerciseGetExerciseView(generics.RetrieveAPIView):
    queryset=Exercise.objects.all()
    serializer_class = ExerciseSerializer
    lookup_field = "pk"

class ExerciseUpdateDestroyView(generics.GenericAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset=Exercise.objects.all()
    serializer_class = ExerciseUpdateSerializer
    lookup_field = "pk"

