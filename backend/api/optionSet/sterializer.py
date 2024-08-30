from rest_framework import serializers
from .models import OptionSet

class OptionSetSerializer(serializers.ModelSerializer):
    key = serializers.IntegerField(source='id')
    value = serializers.CharField(source='description')
    class Meta:
        model = OptionSet
        fields = ['key', 'value']