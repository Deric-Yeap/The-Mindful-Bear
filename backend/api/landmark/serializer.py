import decimal
from rest_framework import serializers
from .models import Landmark

def is_field_empty(value):
    if value is None or len(value) <=0:
        raise serializers.ValidationError('field to be updated cannot be empty!')

def is_decimal_places(value):
    decimal_points = abs(decimal.Decimal(str(value)).as_tuple().exponent)
    if decimal_points != 6:
        return serializers.ValidationError('only numbers with 6 decimal places is allowed')

def is_max_digits(value):
    no_of_digits = len(str(value))
    if (no_of_digits - 1)>9:
         return serializers.ValidationError('only numbers with maximum 9 digits are allowed')
def is_num(value):
    if not isinstance(value, float):
        return serializers.ValidationError('only decimal numbers allowed')
    
class LandmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ['landmark_id', 'x_coordinates','y_coordinates', 'exercise_id']


class LandmarkCreateSerializer(serializers.ModelSerializer):
    x_coordinates = serializers.DecimalField(validators=[is_field_empty, is_decimal_places, is_max_digits, is_num], required = True)
    y_coordinates = serializers.DecimalField(validators=[is_field_empty, is_decimal_places, is_max_digits, is_num], required = True)

    class Meta:
        model = Landmark
        fields = ['landmark_id', 'x_coordinates', 'y_coordinates', 'exercise_id']
# update serialiser to validate empty fields, with arguments optional
class LandmarkUpdateSerializer(serializers.ModelSerializer):
    x_coordinates = serializers.DecimalField(validators=[is_field_empty, is_decimal_places, is_max_digits, is_num], required = False)
    y_coordinates = serializers.DecimalField(validators=[is_field_empty, is_decimal_places, is_max_digits, is_num], required = False)

    class Meta:
        model = Landmark
        fields = ['landmark_id', 'x_coordinates', 'y_coordinates', 'exercise_id']
        extra_kwargs = {
            'x_coordinates': {'required': False},
            'y_coordinates': {'required': False},
            'exercise_id': {'required': False}
        }