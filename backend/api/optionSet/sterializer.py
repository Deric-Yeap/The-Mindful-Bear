from rest_framework import serializers
from .models import OptionSet

class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptionSet
        fields = '__all__' 