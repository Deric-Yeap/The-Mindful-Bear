from rest_framework import serializers
from .models import Session

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__' 

class SessionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        exclude = ['start_datetime']