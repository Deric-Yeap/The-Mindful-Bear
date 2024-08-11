from rest_framework import serializers
from .models import Exercise
from ..common.validators import is_field_empty

# general serializer with no validation
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['exercise_id', 'audio_url', 'description']
# create serializer to validate empty fields
class ExerciseCreateSerializer(serializers.ModelSerializer):
    audio_url = serializers.URLField(validators=[is_field_empty], required = False)
    description = serializers.CharField(validators=[is_field_empty], required = True)
    class Meta:
        model = Exercise
        fields = ['exercise_id', 'audio_url', 'description']
# update serialiser to validate empty fields, with arguments optional
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
