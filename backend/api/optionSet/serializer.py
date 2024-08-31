from rest_framework import serializers
from .models import OptionSet

class OptionSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptionSet
        fields = '__all__' 