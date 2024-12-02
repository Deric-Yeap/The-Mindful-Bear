from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from ..user.models import CustomUser
from ..avatar.models import Avatar
from .models import UserAvatar
from .serializer import (
    UserAvatarCreateSerializer,
    UserAvatarSerializer,
    UserAvatarUpdateSerializer
)


class CreateUserAvatar(generics.CreateAPIView):
    """
    Create User Avatar

    Adds a new avatar for the user.
    """
    queryset = UserAvatar.objects.all()
    serializer_class = UserAvatarCreateSerializer


class ListUserAvatars(generics.ListAPIView):
    """
    List User Avatars

    Retrieves all user avatars.
    """
    queryset = UserAvatar.objects.all()
    serializer_class = UserAvatarSerializer


class RetrieveUserAvatar(generics.RetrieveAPIView):
    """
    Retrieve User Avatar

    Retrieves details of a specific user avatar.
    """
    queryset = UserAvatar.objects.all()
    serializer_class = UserAvatarSerializer
    lookup_field = "pk"


class RetrieveUserAvatarsByUserId(generics.ListAPIView):
    """
    Retrieve Avatars by User ID

    Retrieves all avatars for a specific user.
    """
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


class UpdateUserAvatar(generics.UpdateAPIView):
    """
    Update User Avatar

    Modifies details of a user avatar.
    """
    queryset = UserAvatar.objects.all()
    serializer_class = UserAvatarUpdateSerializer
    lookup_field = "pk"


class DeleteUserAvatar(generics.DestroyAPIView):
    """
    Delete User Avatar

    Removes a user avatar.
    """
    queryset = UserAvatar.objects.all()
    serializer_class = UserAvatarUpdateSerializer
    lookup_field = "pk"
