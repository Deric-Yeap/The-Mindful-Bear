from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Landmark
from .serializer import LandmarkCreateSerializer, LandmarkSerializer, LandmarkUpdateSerializer
from ..common.permission import CustomDjangoModelPermissions

class LandmarkCreateView(generics.CreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Landmark.objects.all()
    serializer_class = LandmarkCreateSerializer

class LandmarkListView(generics.ListAPIView):
    queryset = Landmark.objects.all()
    serializer_class = LandmarkSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LandmarkGetByIdView(generics.RetrieveAPIView):
    queryset = Landmark.objects.all()
    serializer_class = LandmarkSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        try:
            landmark = self.get_object()
            serializer = self.get_serializer(landmark)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Landmark.DoesNotExist:
            return Response({'detail': 'Landmark not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LandmarkUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Landmark.objects.all()
    serializer_class = LandmarkUpdateSerializer
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
