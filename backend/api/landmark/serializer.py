from rest_framework import serializers

from ..exercise.serializer import ExerciseSerializer

from ..exercise.models import Exercise
from .models import Landmark
from ..common.validators import is_field_empty
class LandmarkSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(many=False, read_only=True)
    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'landmark_image_url', 'x_coordinates','y_coordinates', 'exercise']

class LandmarkCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'landmark_image_url', 'x_coordinates', 'y_coordinates', 'exercise']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['exercise'] = ExerciseSerializer(instance.exercise).data
        return representation
class LandmarkUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'landmark_image_url', 'x_coordinates', 'y_coordinates', 'exercise']
        extra_kwargs = {
            'landmark_name' : {'required': True}, 
            'landmark_image_url' : {'required': False},
            'x_coordinates': {'required': False},
            'y_coordinates': {'required': False},
            'exercise': {'required': False}
        }
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Serialize the exercise field separately
        representation['exercise'] = ExerciseSerializer(instance.exercise).data
        return representation

    