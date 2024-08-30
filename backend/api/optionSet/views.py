from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets
from .sterializer import OptionSetSerializer
from .models import OptionSet

# Create your views here.
class OptionSetViewSet(viewsets.ModelViewSet):
    serializer_class = OptionSetSerializer
    queryset= OptionSet.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]