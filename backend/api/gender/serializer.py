from rest_framework import serializers
from .models import Gender

class GenderSerializer(serializers.ModelSerializer):
    key = serializers.IntegerField(source='id')
    value = serializers.CharField(source='description')
    class Meta:
        model = Gender
        fields = ['key', 'value', 'disable']  
