from rest_framework import serializers
from .models import FormSession

class FormSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormSession
        fields = '__all__' 