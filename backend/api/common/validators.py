import decimal
from rest_framework import serializers

def is_field_empty(value):
    if value is None:
        raise serializers.ValidationError('Field cannot be empty!')
    if isinstance(value, (str, list)) and len(value) == 0:
        raise serializers.ValidationError('Field cannot be empty!')
    if isinstance(value, (int, float, decimal.Decimal)):
        if value == 0:
            raise serializers.ValidationError('Field cannot be empty!')
def is_decimal_places(value):
    decimal_points = abs(decimal.Decimal(str(value)).as_tuple().exponent)
    if decimal_points != 6:
        return serializers.ValidationError('only numbers with 6 decimal places is allowed')

def is_max_digits(value):
    no_of_digits = len(str(value).replace('.', '').replace('-', ''))
    if no_of_digits>9:
         return serializers.ValidationError('only numbers with maximum 9 digits are allowed')
def is_num(value):
    if not isinstance(value, float):
        return serializers.ValidationError('only decimal numbers allowed')