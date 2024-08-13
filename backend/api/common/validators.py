import decimal
from rest_framework import serializers

def is_field_empty(value):
    if value is None:
        return serializers.ValidationError('Field cannot be empty!')
    if isinstance(value, (str, list)) and len(value) == 0:
        return serializers.ValidationError('Field cannot be empty!')
    if isinstance(value, (int, float, decimal.Decimal)):
        if value == 0:
            return serializers.ValidationError('Field cannot be empty!')
