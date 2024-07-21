from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_id', 'username', 'date_of_birth', 'gender', 'department']

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'date_of_birth', 'gender', 'department', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            date_of_birth=validated_data['date_of_birth'],
            gender=validated_data['gender'],
            department=validated_data['department'],
            password=validated_data.get('password') 
        )
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'date_of_birth', 'gender', 'department']
        extra_kwargs = {
            'username': {'required': False},
            'date_of_birth': {'required': False},
            'gender': {'required': False},
            'department': {'required': False},
        }