from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets
from drf_yasg.utils import swagger_auto_schema
from .models import Gender
from .serializer import GenderSerializer

# Create your views here.
class GenderViewSet(viewsets.ModelViewSet):
    """
    Manage Gender Data

    Provides create, retrieve, update, delete, and list functionality for gender data.
    """
    serializer_class = GenderSerializer
    queryset = Gender.objects.all()

    def get_permissions(self):
        """
        Assign permissions based on the action.

        Allows unrestricted access for `list` and `retrieve` actions, while requiring authentication for other actions.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @swagger_auto_schema(
        operation_summary="List Genders",
        operation_description="Retrieve a list of all gender entries.",
        responses={200: GenderSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Retrieve a Gender",
        operation_description="Retrieve details of a specific gender entry by ID.",
        responses={200: GenderSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create a Gender",
        operation_description="Create a new gender entry.",
        request_body=GenderSerializer,
        responses={201: GenderSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update a Gender",
        operation_description="Update an existing gender entry.",
        request_body=GenderSerializer,
        responses={200: GenderSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete a Gender",
        operation_description="Delete a specific gender entry by ID.",
        responses={204: 'No Content'}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
