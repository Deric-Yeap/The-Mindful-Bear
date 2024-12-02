from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from ..achievement.views import checkAchievementAttainedView
from .models import UserAchievement
from .serializer import (
    UserAchievementSerializer,
    UserAchievementCreateSerializer,
    UserAchievementUpdateSerializer
)
from ..achievement.models import Achievement


class UserAchievementCreateView(generics.CreateAPIView):
    """
    Create User Achievement

    Creates a new user achievement record.
    """
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementCreateSerializer


class UserAchievementListView(generics.ListAPIView):
    """
    List User Achievements

    Retrieves all user achievement records.
    """
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementSerializer

    def list(self, request, *args, **kwargs):
        """
        List Achievements

        Returns all user achievements.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserAchievementGetByIdView(generics.RetrieveAPIView):
    """
    Get User Achievement by ID

    Retrieves details of a specific user achievement.
    """
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        """
        Retrieve Achievement by ID

        Returns user achievement details for the given ID.
        """
        try:
            userAchievement = self.get_object()
            serializer = self.get_serializer(userAchievement)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserAchievement.DoesNotExist:
            return Response({'detail': 'User Achievement not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserAchievementGetByUserIdView(generics.ListAPIView):
    """
    Get User Achievements by User ID

    Retrieves all achievements for a specific user.
    """
    serializer_class = UserAchievementSerializer

    def get_queryset(self):
        """
        Filter by User ID

        Returns achievements filtered by user ID.
        """
        user_id = self.kwargs.get('user_id')
        return UserAchievement.objects.filter(user_id=user_id)

    def list(self, request, *args, **kwargs):
        """
        List Achievements by User ID

        Returns all achievements for the given user ID.
        """
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({'detail': 'No Achievements found for this user.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserAchievementUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    """
    Update or Delete User Achievement

    Updates or deletes a specific user achievement.
    """
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementUpdateSerializer
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        """
        Update Achievement

        Modifies the details of a user achievement.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        """
        Delete Achievement

        Removes a user achievement record.
        """
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_200_OK)


class checkUserAchievementsView(generics.GenericAPIView):
    """
    Check User Achievements

    Verifies and updates user achievements based on attained milestones.
    """
    def get(self, request, *args, **kwargs):
        """
        Verify Achievements

        Checks and updates the user's achievements.
        """
        http_request = request._request
        check_view = checkAchievementAttainedView.as_view()
        response = check_view(http_request, *args, **kwargs).data

        user = request.user
        attained_achievements = response.get('attained_achievements', [])

        newly_created_achievements = []

        for achievement_data in attained_achievements:
            achievement_id = achievement_data['id']
            try:
                achievement = Achievement.objects.get(pk=achievement_id)
                user_achievement, created = UserAchievement.objects.get_or_create(
                    user=user,
                    achievement=achievement,
                )
                if created:
                    newly_created_achievements.append(achievement_id)
            except Achievement.DoesNotExist:
                continue

        user_achievements = UserAchievement.objects.filter(user=user)
        serializer = UserAchievementSerializer(user_achievements, many=True)

        return Response({
            'user_achievements': serializer.data,
            'newly_created_achievements': newly_created_achievements
        }, status=status.HTTP_200_OK)
