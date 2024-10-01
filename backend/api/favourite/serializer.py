from rest_framework import serializers
from .models import Favourite
from django.contrib.auth import get_user_model

User = get_user_model()

class FavouriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favourite
        fields = ['id']
        extra_kwargs = {
            'id': {'required': False},            
        }

    def create(self, validated_data):
        user = self.context['request'].user
        return Favourite.objects.create(user=user, **validated_data)
