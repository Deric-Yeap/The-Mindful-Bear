# Create your views here.
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Avatar
from .serializer import AvatarSerializer, AvatarCreateSerializer, AvatarUpdateSerializer
from ..common.permission import CustomDjangoModelPermissions

class AvatarCreateView(generics.CreateAPIView):
    """
    Create Avatar

    Allows creating a new avatar with relevant attributes.
    """
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Avatar.objects.all()
    serializer_class = AvatarCreateSerializer

class AvatarListView(generics.ListAPIView):
    """
    List Avatars

    Retrieves all avatars from the database.
    """
    queryset = Avatar.objects.all()
    serializer_class = AvatarSerializer

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AvatarGetByIdView(generics.RetrieveAPIView):
    """
    Retrieve Avatar by ID

    Fetches the details of a specific avatar using its unique identifier.
    """
    queryset = Avatar.objects.all()
    serializer_class = AvatarSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        try:
            avatar = self.get_object()
            serializer = self.get_serializer(avatar)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Avatar.DoesNotExist:
            return Response({'detail': 'Avatar not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AvatarUpdateView(generics.UpdateAPIView):
    """
    Update Avatar

    Updates avatar details.
    """
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Avatar.objects.all()
    serializer_class = AvatarUpdateSerializer
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class AvatarDeleteView(generics.DestroyAPIView):
    """
    Delete Avatar

    Deletes a specific avatar.
    """
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Avatar.objects.all()
    lookup_field = "pk"

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_200_OK)