from rest_framework import serializers
from .models import Department

class DepartmentSerializer(serializers.ModelSerializer):
    key = serializers.IntegerField(source='id')
    value = serializers.CharField(source='description')

    class Meta:
        model = Department
        fields = ['key', 'value', 'disable']
