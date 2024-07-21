from django.shortcuts import render
from rest_framework import generics
from .models import Landmark
from .serializer import LandmarkSerializer
# Create your views here.
class LandmarkCreateView(generics.CreateAPIView):
    queryset = Landmark.objects.all()
    serializer_class = LandmarkSerializer


class LandmarkListView(generics.ListAPIView):
    queryset = Landmark.objects.all()
    serializer_class = LandmarkSerializer

