from rest_framework import serializers
from .models import Landmark
from ..common.validators import is_field_empty, is_decimal_places, is_max_digits, is_num
class LandmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ['landmark_id', 'x_coordinates','y_coordinates', 'exercise']

class LandmarkCreateSerializer(serializers.ModelSerializer):
    x_coordinates = serializers.DecimalField(
        max_digits=9, decimal_places=6,
        validators=[is_field_empty, is_decimal_places, is_max_digits, is_num],
        required=True
    )
    y_coordinates = serializers.DecimalField(
        max_digits=9, decimal_places=6,
        validators=[is_field_empty, is_decimal_places, is_max_digits, is_num],
        required=True
    )
    #add validator for exercise relation
    class Meta:
        model = Landmark
        fields = ['landmark_id', 'x_coordinates', 'y_coordinates', 'exercise']
# update serialiser to validate empty fields, with arguments optional
class LandmarkUpdateSerializer(serializers.ModelSerializer):
    x_coordinates = serializers.DecimalField(
        max_digits=9, decimal_places=6,
        validators=[is_field_empty, is_decimal_places, is_max_digits, is_num],
        required=True
    )
    y_coordinates = serializers.DecimalField(
        max_digits=9, decimal_places=6,
        validators=[is_field_empty, is_decimal_places, is_max_digits, is_num],
        required=True
    )
    class Meta:
        model = Landmark
        fields = ['landmark_id', 'x_coordinates', 'y_coordinates', 'exercise']
        extra_kwargs = {
            'x_coordinates': {'required': False},
            'y_coordinates': {'required': False},
            'exercise': {'required': False}
        }