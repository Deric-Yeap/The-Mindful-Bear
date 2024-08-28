from rest_framework import serializers
from .models import CustomUser
from ..gender.serializer import GenderSerializer
from ..department.serializer import DepartmentSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    gender = GenderSerializer()
    department = DepartmentSerializer()    
    class Meta:
        model = CustomUser
        fields = ['user_id', 'email', 'date_of_birth', 'gender', 'department', 'is_staff']

class UserCreateSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'date_of_birth', 'gender', 'department', 'password', 'confirm_password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            date_of_birth=validated_data['date_of_birth'],
            gender=validated_data['gender'],
            department=validated_data['department'],
            password=validated_data.get('password') 
        )
        return user
    
    def validate(self, data):
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError("Password and Confirm Password do not match.")
        
        return data
    
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters long.')
        return value

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