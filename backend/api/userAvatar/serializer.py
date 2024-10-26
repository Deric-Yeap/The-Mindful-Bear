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
        fields = ['id','user', 'avatar','is_selected']


class UserAvatarCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    avatar = serializers.PrimaryKeyRelatedField(queryset=Avatar.objects.all())
    class Meta:
        model = UserAvatar
        fields = ['id','user', 'avatar','is_selected']
    def create(self, validated_data):
        request = self.context.get('request')
        user = validated_data['user']
        is_selected = validated_data.get('is_selected', False)
        if is_selected:
            UserAvatar.objects.filter(user=user).update(is_selected=False)
        if UserAvatar.objects.filter(user=user).count() == 0:
            validated_data['is_selected'] = True if validated_data['avatar'].id == 2 else False
        user_avatar = UserAvatar.objects.create(**validated_data)
        return user_avatar
    
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
        fields = ['id','user', 'avatar','is_selected']

    def update(self, instance, validated_data):
        request = self.context.get('request')
        is_selected = validated_data.get('is_selected', instance.is_selected)
        if 'user' in validated_data:
            user = validated_data['user'] 
        if isinstance(user, CustomUser):
            instance.user = user 
        else:
            return serializers.ValidationError({"user": "Invalid user provided"})
        if is_selected:
            UserAvatar.objects.filter(user=user).update(is_selected=False)
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
