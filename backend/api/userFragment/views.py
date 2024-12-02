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
    """
    Create User Fragment

    Adds a new fragment for the user.
    """
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentCreateSerializer


class UserFragmentListView(generics.ListAPIView):
    """
    List User Fragments

    Retrieves all user fragments.
    """
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentSerializer

    def list(self, request, *args, **kwargs):
        """
        List User Fragments

        Returns all user fragments with details.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserFragmentGetByIdView(generics.RetrieveAPIView):
    """
    Retrieve User Fragment

    Retrieves a specific user fragment by ID.
    """
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        """
        Retrieve User Fragment

        Fetches the details of the specified user fragment by ID.
        """
        try:
            userFragment = self.get_object()
            serializer = self.get_serializer(userFragment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserFragment.DoesNotExist:
            return Response({'detail': 'User Fragment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserFragmentGetByUserIdView(generics.ListAPIView):
    """
    Retrieve User Fragments by User ID

    Retrieves all fragments for a specific user.
    """
    serializer_class = UserFragmentSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return UserFragment.objects.filter(user_id=user_id)

    def list(self, request, *args, **kwargs):
        """
        List User Fragments by User ID

        Returns all fragments associated with a specific user.
        """
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({'detail': 'No fragments found for this user.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserFragmentUpdateView(generics.UpdateAPIView):
    """
    Update User Fragment

    Modifies details of a user fragment.
    """
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentUpdateSerializer
    lookup_field = "pk"


class UserFragmentDeleteView(generics.DestroyAPIView):
    """
    Delete User Fragment

    Removes a specified user fragment.
    """
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentUpdateSerializer
    lookup_field = "pk"
    
class GachaFragmentView(APIView):
    """
    Gacha Fragment

    Allows the user to perform a gacha for avatar fragments, deducting points and awarding fragments or points based on conditions.
    """
    def post(self, request):
        """
        Gacha Fragment

        Processes the gacha mechanic, deducts points, and updates user fragments or awards points based on avatar conditions.
        """
        gachaCost = 100
        user_id = request.user.user_id

        total_points = AchievementPoint.objects.filter(userId=user_id).aggregate(total=models.Sum('points'))['total']
        if total_points is None:
            total_points = 0

        if total_points < gachaCost:
            return Response({"detail": "You do not have sufficient points."}, status=status.HTTP_400_BAD_REQUEST)

        avatarList = Avatar.objects.all()
        avatar = gachaFragment(avatarList)
        if avatar is None:
            return Response({"detail": "There is no available avatars to unlock now"}, status=status.HTTP_400_BAD_REQUEST)

        avatar_data = AvatarSerializer(avatar).data
        AchievementPoint.objects.create(userId=request.user, points=-gachaCost, description="Avatar Fragment Gacha")
        user_fragment, created = UserFragment.objects.get_or_create(user_id=user_id, avatar_id=avatar.avatar_id)

        if created:
            user_fragment.quantity = 1
        elif user_fragment.quantity >= avatar.fragments_required:
            base_points = 10
            points = base_points + (1 - avatar.drop_rate) * 10 * 5
            AchievementPoint.objects.create(userId=request.user, points=points, description="Fragment is converted into points")
            return Response({
                "detail": f"You have already unlocked '{avatar_data['title']}'. Fragment is converted into points.",
                "points": points,
                "avatar_url": avatar_data['avatar_url']
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            user_fragment.quantity += 1

        user_fragment.save()
        return Response(avatar_data, status=status.HTTP_200_OK)
