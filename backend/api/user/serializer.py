from rest_framework import serializers
from .models import CustomUser
from ..gender.serializer import GenderSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    gender = GenderSerializer()
    class Meta:
        model = CustomUser
        fields = ['user_id', 'email', 'date_of_birth', 'gender', 'department']

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'date_of_birth', 'gender', 'department', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            date_of_birth=validated_data['date_of_birth'],
            gender=validated_data['gender'],
            department=validated_data['department'],
            password=validated_data.get('password') 
        )
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'date_of_birth', 'gender', 'department']
        extra_kwargs = {
            'email': {'required': False},
            'date_of_birth': {'required': False},
            'gender': {'required': False},
            'department': {'required': False},
        }