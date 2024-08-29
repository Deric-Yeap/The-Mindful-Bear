from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Department
from .serializer import DepartmentSerializer

# Create your views here.
class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    queryset= Department.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]