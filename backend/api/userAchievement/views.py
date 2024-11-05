from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import View
from rest_framework.response import Response

from ..achievement.views import checkAchievementAttainedView
from .models import UserAchievement
from .serializer import UserAchievementSerializer, UserAchievementCreateSerializer, UserAchievementUpdateSerializer
from ..achievement.models import Achievement



class UserAchievementCreateView(generics.CreateAPIView):
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementCreateSerializer

class UserAchievementListView(generics.ListAPIView):
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserAchievementGetByIdView(generics.RetrieveAPIView):
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        try:
            userAchievement = self.get_object()
            serializer = self.get_serializer(userAchievement)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserAchievement.DoesNotExist:
            return Response({'detail': 'User Achievement not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserAchievementGetByUserIdView(generics.ListAPIView):
    serializer_class = UserAchievementSerializer
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        print(user_id)
        return UserAchievement.objects.filter(user_id=user_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({'detail': 'No Achievements found for this user.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserAchievementUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = UserAchievement.objects.all()
    serializer_class = UserAchievementUpdateSerializer
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



class checkUserAchievementsView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        http_request = request._request

        check_view = checkAchievementAttainedView.as_view()
        response = check_view(http_request, *args, **kwargs).data

        user = request.user
        attained_achievements = response.get('attained_achievements', [])

        for achievement_data in attained_achievements:
            achievement_id = achievement_data['id']
            try:
                achievement = Achievement.objects.get(pk=achievement_id)
                user_achievement, created = UserAchievement.objects.get_or_create(
                    user=user,
                    achievement=achievement,
                )
                if created:
                    print(f"Created new UserAchievement for user {user.user_id} and achievement {achievement_id}.")
                else:
                    print(f"UserAchievement already exists for user {user.user_id} and achievement {achievement_id}.")
            except Achievement.DoesNotExist:
                continue  

        user_achievements = UserAchievement.objects.filter(user=user)
        serializer = UserAchievementSerializer(user_achievements, many=True)

        return Response({
            'current_journal_streak': response.get('current_journal_streak'),
            'current_login_streak': response.get('current_login_streak'),
            'attained_achievements': attained_achievements,
            'user_achievements': serializer.data
        }, status=status.HTTP_200_OK)