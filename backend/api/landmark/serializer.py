from rest_framework import serializers
from .models import Landmark

class LandmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ['landmark_id', 'x_coordinates','y_coordinates', 'exercise_id']

