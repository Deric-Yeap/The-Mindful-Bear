from api.common.fragment import gachaFragment
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import UserFragment
from .serializer import UserFragmentCreateSerializer, UserFragmentSerializer, UserFragmentUpdateSerializer
from ..avatar.models import Avatar
from ..avatar.serializer import AvatarSerializer
from ..achievementPoint.models import AchievementPoint
from rest_framework.views import APIView
from django.db import models


class UserFragmentCreateView(generics.CreateAPIView):
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentCreateSerializer

class UserFragmentListView(generics.ListAPIView):
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserFragmentGetByIdView(generics.RetrieveAPIView):
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        try:
            userFragment = self.get_object()
            serializer = self.get_serializer(userFragment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserFragment.DoesNotExist:
            return Response({'detail': 'User Fragment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserFragmentGetByUserIdView(generics.ListAPIView):
    serializer_class = UserFragmentSerializer
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        print(user_id)
        return UserFragment.objects.filter(user_id=user_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({'detail': 'No fragments found for this user.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserFragmentUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentUpdateSerializer
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

class GachaFragmentView(APIView):
    def post(self, request):
        gachaCost = 100
        user_id = request.user.user_id

        total_points = AchievementPoint.objects.filter(userId=user_id).aggregate(total=models.Sum('points'))['total']
        if total_points is None:
            total_points = 0

        if total_points < gachaCost:
            return Response({"detail":"You do not have enough points."}, status=status.HTTP_400_BAD_REQUEST)
        
        avatarList = Avatar.objects.all()
        avatar = gachaFragment(avatarList)
        if avatar is None:
            return Response({"detail":"There is no available avatars to unlock now"}, status=status.HTTP_400_BAD_REQUEST)
        
        AchievementPoint.objects.create(userId=request.user, points=-gachaCost, description="Avatar Fragment Gacha")
        user_fragment, created = UserFragment.objects.get_or_create(user_id=user_id, avatar_id=avatar.avatar_id)
        if created:
            user_fragment.quantity = 1
        elif user_fragment.quantity >= avatar.fragments_required:
            base_points = 10
            points = base_points + (1-avatar.drop_rate)*10 * 5
            AchievementPoint.objects.create(userId=request.user, points=points, description="Fragment is converted into points")
            return Response({"detail": {"detail": "You have already unlocked this avatar. Fragment is converted into points", "points":points}}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user_fragment.quantity += 1
        user_fragment.save()

        avatar_data = AvatarSerializer(avatar).data
            
        return Response(avatar_data, status=status.HTTP_200_OK)
