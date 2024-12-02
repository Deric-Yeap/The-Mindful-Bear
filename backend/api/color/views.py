from rest_framework import viewsets
from drf_yasg.utils import swagger_auto_schema
from .models import Color
from .serializer import ColorSerializer

# Create your views here.
class ColorViewSet(viewsets.ModelViewSet):
    """
    Manage Colors

    Provides create, retrieve, update, delete, and list functionality for colors.
    """
    queryset = Color.objects.all()
    serializer_class = ColorSerializer

    @swagger_auto_schema(operation_summary="List Colors", operation_description="Retrieve a list of all colors.")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Create Color", operation_description="Create a new color.")
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Retrieve Color", operation_description="Retrieve details of a specific color by ID.")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Update Color", operation_description="Update the details of a specific color by ID.")
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Partial Update Color", operation_description="Partially update the details of a specific color by ID.")
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Delete Color", operation_description="Delete a specific color by ID.")
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
