from django.shortcuts import render
from rest_framework import generics
from .models import Exercise
from .serializer import *
from ..common.permission import CustomDjangoModelPermissions
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

# Create  View
class ExerciseCreateView(generics.CreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Exercise.objects.all()
    serializer_class = ExerciseCreateSerializer
    # override default create
    def create(self, request):
        # initialises serializer based on data obtained from request
        serializer = self.get_serializer(data=request.data)
        # validates according to serializer rules
        serializer.is_valid(raise_exception=True)
        exercise = serializer.save()
        # creates a new serializer instance for the newly created Exercise object, to convert it to a JSON serializable format.
        exerciseSerializer = ExerciseCreateSerializer(exercise)
        return Response(exerciseSerializer.data, status=status.HTTP_201_CREATED)
# get all view
class ExerciseListView(generics.ListAPIView):
    serializer_class = ExerciseSerializer
    def list(self, request):
        queryset = Exercise.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# get by Id view
class ExerciseGetExerciseByIdView(generics.RetrieveAPIView):
    queryset=Exercise.objects.all()
    serializer_class = ExerciseSerializer
    lookup_field = "pk"
    def get(self,request, *args, **kwargs):
        try:
            exercise = self.get_object()
            serializer = self.get_serializer(exercise)
            return Response(serializer.data)
        except Exercise.DoesNotExist:
            return Response({'detail': 'Exercise not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# update or delete view
class ExerciseUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset=Exercise.objects.all()
    lookup_field = "pk"
    def update(self, request,*args, **kwargs):
        instance = self.get_object()
        serializer = ExerciseUpdateSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, *args, **kwargs): 
        instance = self.get_object()
        serializer = ExerciseSerializer(instance)
        serialized_data = serializer.data
        instance.delete()
        return Response(serialized_data, status=status.HTTP_204_NO_CONTENT)





