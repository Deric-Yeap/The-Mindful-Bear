from rest_framework import generics
from .models import Exercise
from .serializer import *
from ..common.permission import CustomDjangoModelPermissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import viewsets
from drf_yasg.utils import swagger_auto_schema

class ExerciseViewSet(viewsets.ModelViewSet):
    """
    Manage Exercises

    Provides create, retrieve, update, delete, and list functionality for exercises.
    """
    queryset = Exercise.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return ExerciseCreateSerializer
        return ExerciseSerializer

    @swagger_auto_schema(
        operation_summary="List Exercises",
        operation_description="Retrieve a list of all exercises.",
        responses={200: ExerciseSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Retrieve an Exercise",
        operation_description="Retrieve details of a specific exercise by ID.",
        responses={200: ExerciseSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create an Exercise",
        operation_description="Create a new exercise.",
        request_body=ExerciseCreateSerializer,
        responses={201: ExerciseCreateSerializer()}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update an Exercise",
        operation_description="Update an existing exercise.",
        request_body=ExerciseUpdateSerializer,
        responses={200: ExerciseUpdateSerializer()}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete an Exercise",
        operation_description="Delete an exercise by ID.",
        responses={204: 'No Content'}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class ExerciseCreateView(generics.CreateAPIView):
    """
    Create Exercise

    Allows creating a new exercise with relevant attributes.
    """
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Exercise.objects.all()
    serializer_class = ExerciseCreateSerializer

class ExerciseListView(generics.ListAPIView):
    """
    List Exercises

    Retrieves a list of all exercises.
    """
    serializer_class = ExerciseGetSerializer

    def list(self, request):
        queryset = Exercise.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ExerciseGetExerciseByIdView(generics.RetrieveAPIView):
    """
    Retrieve Exercise by ID

    Fetches the details of a specific exercise using its unique identifier.
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    lookup_field = "pk"

class ExerciseUpdateView(generics.UpdateAPIView):
    """
    Update Exercise

    Allows updating specific fields of an exercise.
    """
    queryset = Exercise.objects.all()
    serializer_class = ExerciseUpdateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ExerciseDeleteView(generics.DestroyAPIView):
    """
    Update or Delete Exercise

    Allows updating or deleting an exercise by ID.
    """
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Exercise.objects.all()
    lookup_field = "pk"

class ExerciseUploadAudioView(APIView):
    """
    Upload Audio for Exercise

    Allows uploading audio files for exercises.
    """
    def post(self, request, *args, **kwargs):
        serializer = ExerciseUploadFileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            exercise_entry = serializer.save()
            return Response({'message': 'File uploaded successfully', 'exercise_id': exercise_entry.id}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
