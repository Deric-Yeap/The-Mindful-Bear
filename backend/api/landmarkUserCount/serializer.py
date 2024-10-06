from rest_framework import serializers
from .models import LandmarkUserCount

class LandmarkUserCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandmarkUserCount
        fields = ['landmark', 'user_count']
        read_only_fields = ['landmark']
