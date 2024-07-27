from rest_framework import serializers
from .models import Exercise


def is_field_empty(value):
    if value is None or len(value) <=0:
        raise serializers.ValidationError('field to be updated cannot be empty!')
    
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['exercise_id', 'audio_url', 'description']


class ExerciseUpdateSerializer(serializers.ModelSerializer):
    audio_url = serializers.URLField(validators=[is_field_empty], required = False)
    description = serializers.CharField(validators=[is_field_empty], required = False)
    class Meta:
        model = Exercise
        fields = ['audio_url', 'description']
        extra_kwargs = {
            'audio_url': {'required': False},
            'description': {'required': False},
        }
    