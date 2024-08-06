from django.shortcuts import render
from rest_framework import generics
from .models import Form
from .serializer import FormSerializer

class FormGet(generics.ListCreateAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer

class FormCreate(generics.CreateAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer

class FormUpdate(generics.UpdateAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    lookup_field = "pk"

class FormDestroy(generics.DestroyAPIView):
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    lookup_field = "pk"

    