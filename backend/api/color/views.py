from rest_framework import viewsets
from .models import Color
from .serializer import ColorSerializer

# Create your views here.
class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer