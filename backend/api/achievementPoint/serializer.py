from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db.models import Sum
from .models import AchievementPoint

class AchievementPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = AchievementPoint
        fields = '__all__'
        extra_kwargs = {
            'userId': {'required': False}
        }

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user else None
        if user:
            validated_data['userId'] = user

            points = validated_data.get('points', 0)
            if points < 0:
                total_points = AchievementPoint.objects.filter(userId=user).aggregate(total=Sum('points'))['total'] or 0
                if total_points + points < 0:
                    raise ValidationError("Insufficient points")

        return super().create(validated_data)