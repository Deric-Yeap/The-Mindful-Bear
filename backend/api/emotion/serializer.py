from rest_framework import serializers
from .models import Emotion
from ..color.serializer import ColorSerializer

class EmotionSerializer(serializers.ModelSerializer):
    colorID = ColorSerializer()
    class Meta:
        model = Emotion
        fields = '__all__'
