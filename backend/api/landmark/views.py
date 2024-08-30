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
    def get(self,request, *args, **kwargs):
        try:
            landmark = self.get_object()
            serializer = self.get_serializer(landmark)
            return Response(serializer.data)
        except Landmark.DoesNotExist:
            return Response({'detail': 'Landmark not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
#update and delete view
class LandmarkUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset=Landmark.objects.all()
    lookup_field = "pk"
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = LandmarkUpdateSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, *args, **kwargs): 
        instance = self.get_object()
        serializer = LandmarkSerializer(instance)
        serialized_data = serializer.data
        instance.delete()
        return Response(serialized_data, status=status.HTTP_204_NO_CONTENT)