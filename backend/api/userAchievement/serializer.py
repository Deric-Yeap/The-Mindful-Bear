from rest_framework import serializers

from ..achievement.serializer import AchievementSerializer
from ..user.serializer import CustomUserSerializer
from rest_framework.exceptions import ValidationError
from .models import UserAchievement
from ..user.models import CustomUser
from ..achievement.models import Achievement



class UserAchievementSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    achievement = AchievementSerializer()
    class Meta:
        model = UserAchievement
        fields = ['id','user', 'achievement','date_obtained']


class UserAchievementCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)
    avatar = serializers.PrimaryKeyRelatedField(queryset=Achievement.objects.all())
    class Meta:
        model = UserAchievement
        fields = ['id','user', 'achievement', 'date_obtained'] 

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user else None

        user_achievement = UserAchievement.objects.create(
            achievement=validated_data['achievement'],
            user=user
        )
        return user_achievement

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = CustomUserSerializer(instance.user).data
        representation['achievement'] = AchievementSerializer(instance.achievement).data
        return representation

class UserAchievementUpdateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False)
    achievement = serializers.PrimaryKeyRelatedField(queryset=Achievement.objects.all(),required=False)
    class Meta:
        model = UserAchievement
        fields = ['id','user', 'achievement', 'date_obtained'] 

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user else None
        

        for attr, value in validated_data.items():
            if attr != 'user':  
                setattr(instance, attr, value)
        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = CustomUserSerializer(instance.user).data
        representation['achievement'] = AchievementSerializer(instance.achievement).data
        return representation
