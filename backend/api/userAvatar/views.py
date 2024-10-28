from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from ..user.models import CustomUser
from ..avatar.models import Avatar
from .models import UserAvatar
from .serializer import UserAvatarCreateSerializer, UserAvatarSerializer, UserAvatarUpdateSerializer


class UserAvatarCreateView(generics.CreateAPIView):
    queryset = UserAvatar.objects.all()
    serializer_class = UserAvatarCreateSerializer

class UserAvatarListView(generics.ListAPIView):
    queryset = UserAvatar.objects.all()
    serializer_class = UserAvatarSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserAvatarGetByIdView(generics.RetrieveAPIView):
    queryset = UserAvatar.objects.all()
    serializer_class = UserAvatarSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        try:
            userAvatar = self.get_object()
            serializer = self.get_serializer(userAvatar)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserAvatar.DoesNotExist:
            return Response({'detail': 'User Avatar not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserAvatarGetByUserIdView(generics.ListAPIView):
    serializer_class = UserAvatarSerializer
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return UserAvatar.objects.filter(user_id=user_id)
    def list(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')
        queryset = self.get_queryset()
        if not queryset.exists():
            try:
                user = CustomUser.objects.get(user_id=user_id)
                default_avatar = Avatar.objects.get(avatar_id=2)
                UserAvatar.objects.create(user=user, avatar=default_avatar, is_selected=True)
                queryset = self.get_queryset()
            except (CustomUser.DoesNotExist, Avatar.DoesNotExist):
                return Response(
                    {'detail': 'User or default avatar does not exist.'},
                    status=status.HTTP_404_NOT_FOUND
                )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserAvatarUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = UserAvatar.objects.all()
    serializer_class = UserAvatarUpdateSerializer
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
        return Response(status=status.HTTP_200_OK)
