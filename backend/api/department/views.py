from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Department
from .serializer import DepartmentSerializer
from drf_yasg.utils import swagger_auto_schema

# Create your views here.
class DepartmentViewSet(viewsets.ModelViewSet):
    """
    Manage Departments

    Provides create, retrieve, update, delete, and list functionality for departments, with permissions based on the action.
    """
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @swagger_auto_schema(
        operation_summary="List Departments",
        operation_description="Retrieve a list of all departments. No authentication required.",
        responses={200: DepartmentSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Retrieve a Department",
        operation_description="Retrieve details of a specific department by ID. No authentication required.",
        responses={200: DepartmentSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create a Department",
        operation_description="Create a new department. Requires authentication.",
        request_body=DepartmentSerializer,
        responses={201: DepartmentSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update a Department",
        operation_description="Update an existing department. Requires authentication.",
        request_body=DepartmentSerializer,
        responses={200: DepartmentSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete a Department",
        operation_description="Delete a department by ID. Requires authentication.",
        responses={204: 'No Content'}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
