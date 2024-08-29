from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets
from .models import Gender
from .serializer import GenderSerializer

# Create your views here.
class GenderViewSet(viewsets.ModelViewSet):
    serializer_class = GenderSerializer
    queryset= Gender.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]