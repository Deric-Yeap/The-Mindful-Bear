# Create your views here.
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Achievement
from .serializer import AchievementSerializer, AchievementCreateSerializer, AchievementUpdateSerializer
from ..common.permission import CustomDjangoModelPermissions
from ..journal.models import Journal
from ..user.models import CustomUser

class AchievementCreateView(generics.CreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Achievement.objects.all()
    serializer_class = AchievementCreateSerializer
    
class AchievementListView(generics.ListAPIView):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AchievementGetByIdView(generics.RetrieveAPIView):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        try:
            achievement = self.get_object()
            serializer = self.get_serializer(avatar)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Achievement.DoesNotExist:
            return Response({'detail': 'Achievement not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AchievementUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Achievement.objects.all()
    serializer_class = AchievementUpdateSerializer
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

class checkAchievementAttainedView(generics.GenericAPIView):
    queryset = Achievement.objects.all()
    def get(self, request):
        user = request.user
        journals = Journal.objects.filter(user_id=user.user_id).order_by('-upload_date')
        journal_current_streak = 0
        last_date = None
        
        for journal in journals:
            if last_date is None:
                last_date = journal.upload_date
                journal_current_streak = 1
            else:
                if (last_date.date() - journal.upload_date.date()).days == 1:
                    journal_current_streak += 1
                elif (last_date.date() - journal.upload_date.date()).days > 1:
                    break
                last_date = journal.upload_date
        
        login_streak = user.login_streak
        achievements = Achievement.objects.all()
        attained_achievements = []

        for achievement in achievements:
            if (achievement.description == "journal_streak" and journal_current_streak >= achievement.streak_count) or \
            (achievement.description == "login_streak" and login_streak >= achievement.streak_count):
                attained_achievements.append({
                    'id': achievement.achievement_id,
                    'description': achievement.description,
                    'badge_url': achievement.achievement_badge_url
                })

        
        return Response({
            'current_journal_streak': journal_current_streak,
            'current_login_streak': login_streak,
            'attained_achievements': attained_achievements
        }, status=status.HTTP_200_OK)