from rest_framework import viewsets
from .models import Emotion
from .serializer import EmotionSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

# Create your views here.
class EmotionViewSet(viewsets.ModelViewSet):
    queryset = Emotion.objects.all()
    serializer_class = EmotionSerializer

    def get_permissions(self): #remove later
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]