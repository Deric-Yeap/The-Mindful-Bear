from rest_framework import serializers
from .models import OptionSet
from ..option.models import Option

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = '__all__'
        ref_name = "OptionSerializerOptionSet"

class OptionSetSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = OptionSet
        fields = '__all__'
