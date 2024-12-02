from rest_framework import viewsets
from .models import Emotion
from .serializer import EmotionSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_yasg.utils import swagger_auto_schema

# Create your views here.
class EmotionViewSet(viewsets.ModelViewSet):
    """
    Manage Emotions

    Provides create, retrieve, update, delete, and list functionality for emotions.
    """
    queryset = Emotion.objects.all()
    serializer_class = EmotionSerializer

    @swagger_auto_schema(
        operation_summary="List Emotions",
        operation_description="Retrieve a list of all emotions. No authentication required.",
        responses={200: EmotionSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Retrieve an Emotion",
        operation_description="Retrieve details of a specific emotion by ID. No authentication required.",
        responses={200: EmotionSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create an Emotion",
        operation_description="Create a new emotion. Requires authentication.",
        request_body=EmotionSerializer,
        responses={201: EmotionSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update an Emotion",
        operation_description="Update an existing emotion. Requires authentication.",
        request_body=EmotionSerializer,
        responses={200: EmotionSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete an Emotion",
        operation_description="Delete an emotion by ID. Requires authentication.",
        responses={204: 'No Content'}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def get_permissions(self): #remove later
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]