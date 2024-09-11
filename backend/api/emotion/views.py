from rest_framework import viewsets
from .models import Emotion
from .serializer import EmotionSerializer

# Create your views here.
class EmotionViewSet(viewsets.ModelViewSet):
    queryset = Emotion.objects.all()
    serializer_class = EmotionSerializer