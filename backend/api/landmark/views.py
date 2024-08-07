from django.shortcuts import render
from rest_framework import generics
from ..common.permission import CustomDjangoModelPermissions
from rest_framework.response import Response
from rest_framework import status
from .models import Landmark
from .serializer import LandmarkCreateSerializer, LandmarkSerializer, LandmarkUpdateSerializer
# Create your views here.
class LandmarkCreateView(generics.CreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Landmark.objects.all()
    serializer_class = LandmarkCreateSerializer
    # override default create
    def create(self, request):
        # initialises serializer based on data obtained from request
        serializer = self.get_serializer(data=request.data)
        # validates according to serializer rules
        serializer.is_valid(raise_exception=True)
        landmark = serializer.save()
        # creates a new serializer instance for the newly created Landmark object, to convert it to a JSON serializable format.
        landmarkSerializer = LandmarkCreateSerializer(landmark)
        return Response(landmarkSerializer.data, status=status.HTTP_201_CREATED)
# get all view
class LandmarkListView(generics.ListAPIView):
    queryset = Landmark.objects.all()
    serializer_class = LandmarkSerializer
    def list(self, request):
        queryset = Landmark.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# get by Id view
class LandmarkGetLandmarkByIdView(generics.RetrieveAPIView):
    queryset=Landmark.objects.all()
    serializer_class = LandmarkSerializer
    lookup_field = "pk"
    def get(self,request):
        try:
            landmark = request.landmark
            return Response(LandmarkSerializer(landmark).data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LandmarkUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset=Landmark.objects.all()
    lookup_field = "pk"
    def update(self, request):
        instance = self.get_object()
        serializer = LandmarkUpdateSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request): 
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)