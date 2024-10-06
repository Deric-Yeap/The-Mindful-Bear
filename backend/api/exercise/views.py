from django.shortcuts import render
from rest_framework import generics
from .models import Exercise
from .serializer import *
from ..common.permission import CustomDjangoModelPermissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView


from rest_framework import status
from rest_framework import viewsets
 

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return ExerciseCreateSerializer
        return ExerciseSerializer
    
    # @action(detail=False, methods=['post'], url_path='upload-audio')
    # def upload_audio(self, request):
    #     serializer = ExerciseUploadFileSerializer(data=request.data, context={'request': request})
    #     if serializer.is_valid():
    #         exercise_entry = serializer.save()
    #         return Response({'message': 'File uploaded successfully', 'exercise_id': exercise_entry.id}, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
    serializer_class = ExerciseGetSerializer  # Use the desired serializer

    def list(self, request):
        # Get all Exercise objects
        queryset = Exercise.objects.all()
        
        # Serialize the queryset using ExerciseGetSerializer
        serializer = self.get_serializer(queryset, many=True)
        
        # Return the serialized data with 200 OK status
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
class ExerciseUpdateView(generics.UpdateAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseUpdateSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = self.get_serializer_context()
        return super().get_serializer(*args, **kwargs)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
class ExerciseUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset=Exercise.objects.all()
    lookup_field = "pk"
    def update(self, request,*args, **kwargs):
        instance = self.get_object()
        serializer = ExerciseUpdateSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            serializer.save()
            landmark_ids = validated_data.get('landmarks', [])
            if landmark_ids is not None:
                # If an empty list is provided, remove all landmarks associated with the exercise
                if not landmark_ids:
                    instance.landmarks.update(exercise=None)  # Remove all landmarks
                else:
                    current_landmarks = instance.landmarks.all()
                    for landmark_id in current_landmarks:
                        if landmark_id not in landmark_ids:
                            landmark = Landmark.objects.get(pk=landmark_id)
                            landmark.exercise = None  # Remove the association
                            landmark.save()
                    
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, *args, **kwargs): 
        instance = self.get_object()
        serializer = ExerciseSerializer(instance)
        serialized_data = serializer.data
        instance.delete()
        return Response(serialized_data, status=status.HTTP_200_OK)



class ExerciseUploadAudioView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ExerciseUploadFileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            exercise_entry = serializer.save()
            return Response({'message': 'File uploaded successfully', 'exercise_id': exercise_entry.id}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ExerciseCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ExerciseCreateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            try:
                exercise = serializer.save()
                return Response(
                    {"message": "Exercise created successfully!", "data": serializer.data},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

