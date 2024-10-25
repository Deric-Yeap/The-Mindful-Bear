from rest_framework import serializers

from ..avatar.serializer import AvatarSerializer
from ..user.serializer import CustomUserSerializer
from rest_framework.exceptions import ValidationError
from .models import UserAvatar
from ..user.models import CustomUser
from ..avatar.models import Avatar



class UserAvatarSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    avatar = AvatarSerializer()
    class Meta:
        model = UserAvatar
        fields = ['id','user', 'avatar']




class UserAvatarCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    avatar = serializers.PrimaryKeyRelatedField(queryset=Avatar.objects.all())
    class Meta:
        model = UserAvatar
        fields = ['id','user', 'avatar']
    def create(self, validated_data):
        request = self.context.get('request')
        user = validated_data['user']
        userAvatar = UserAvatar.objects.create(
            avatar=validated_data['avatar'],
            user=user,  
        )
        return userAvatar
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = CustomUserSerializer(instance.user).data
        representation['avatar'] = AvatarSerializer(instance.avatar).data
        return representation



class UserAvatarUpdateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    avatar = serializers.PrimaryKeyRelatedField(queryset=Avatar.objects.all())
    class Meta:
        model = UserAvatar
        fields = ['id','user', 'avatar']

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
