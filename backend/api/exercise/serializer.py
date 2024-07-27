from rest_framework import serializers
from .models import Exercise

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['exercise_id', 'audio_url', 'description']


class ExerciseUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['audio_url', 'description']
        extra_kwargs = {
            'audio_url': {'required': False},
            'description': {'required': False},
        }