from rest_framework import serializers
from .models import Exercise
from ..landmark.models import Landmark
from ..common.validators import is_field_empty

class MinimalLandmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'landmark_image_url', 'x_coordinates', 'y_coordinates']
# general serializer with no validation
class ExerciseSerializer(serializers.ModelSerializer):
    landmarks = MinimalLandmarkSerializer(many=True, read_only=True)
    class Meta:
        model = Exercise
        fields = ['exercise_id','exercise_name', 'audio_url', 'description', 'landmarks']

class ExerciseCreateSerializer(serializers.ModelSerializer):
    audio_url = serializers.URLField(validators=[is_field_empty], required = False)
    landmarks = MinimalLandmarkSerializer(many=True,required = False)
        
    class Meta:
        model = Exercise
        fields = ['exercise_id','exercise_name', 'audio_url', 'description', 'landmarks']
# update serialiser to validate empty fields, with arguments optional
class ExerciseUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['exercise_name','audio_url', 'description', 'landmarks']
        extra_kwargs = {
            'exercise_name': {'required':False},
            'audio_url': {'required': False},
            'description': {'required': False},
        }
   

