from rest_framework import serializers
from ..avatar.serializer import AvatarSerializer
from ..user.serializer import CustomUserSerializer
from .models import UserFragment
from ..user.models import CustomUser
from ..avatar.models import Avatar



class UserFragmentSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    avatar = AvatarSerializer()
    class Meta:
        model = UserFragment
        fields = ['id','user', 'avatar', 'quantity']

class UserFragmentCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    avatar = serializers.PrimaryKeyRelatedField(queryset=Avatar.objects.all())
    class Meta:
        model = UserFragment
        fields = ['id','user', 'avatar', 'quantity']
    def create(self, validated_data):
        request = self.context.get('request')
        user = validated_data['user']
        userAvatar = UserFragment.objects.create(
            avatar=validated_data['avatar'],
            user=user,  
            quantity = validated_data['quantity']
        )
        return userAvatar
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = CustomUserSerializer(instance.user).data
        representation['avatar'] = AvatarSerializer(instance.avatar).data
        return representation



class UserFragmentUpdateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    avatar = serializers.PrimaryKeyRelatedField(queryset=Avatar.objects.all())
    class Meta:
        model = UserFragment
        fields = ['id','user', 'avatar', 'quantity']

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if 'user' in validated_data:
            user = validated_data['user'] 
        if isinstance(user, CustomUser):
            instance.user = user 
        else:
            return serializers.ValidationError({"user": "Invalid user provided"})

        for attr, value in validated_data.items():
            if attr != 'user':  
                setattr(instance, attr, value)
        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = CustomUserSerializer(instance.user).data
        representation['avatar'] = AvatarSerializer(instance.avatar).data
        return representation
