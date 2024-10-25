from rest_framework import serializers

from .models import Avatar
from ..common.validators import is_field_empty
from django.conf import settings
from ..common.s3 import create_presigned_url, upload_fileobj, make_file_upload_path, delete_s3_object
from urllib.parse import quote


class AvatarSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    class Meta:
        model = Avatar
        fields = ['avatar_id', 'avatar_url', 'fragments_required', 'drop_rate']

    def get_avatar_url(self, obj):
        if obj.avatar_url:
            return create_presigned_url(obj.avatar_url)
        return None

class AvatarCreateSerializer(serializers.ModelSerializer):
    avatar_url = serializers.FileField(write_only=True, required=True)

    class Meta: 
        model = Avatar
        fields = ['avatar_id', 'avatar_url', 'fragments_required', 'drop_rate']

    def validate_avatar_url(self, value):
        if not value.name.endswith(('.json')):
            raise serializers.ValidationError("File must be in JSON.")
        return value

    def create(self, validated_data):
        avatar_image_file = validated_data.pop('avatar_url')        
        user = self.context['request'].user    
        file_name, object_path = make_file_upload_path("avatar", user, quote(avatar_image_file.name))                
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        file_url = upload_fileobj(avatar_image_file, bucket, object_path)
        if not file_url:        
            raise serializers.ValidationError("File upload to S3 failed")
        
        avatar = Avatar.objects.create(
            avatar_url=object_path,
            fragments_required=validated_data['fragments_required'],
            drop_rate=validated_data['drop_rate'],

        )

        return avatar

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['avatar_url'] = instance.avatar_url  
        return representation
    
class AvatarUpdateSerializer(serializers.ModelSerializer):
    avatar_url = serializers.FileField(write_only=True, required=False)
    fragments_required = serializers.IntegerField(required=False)
    drop_rate = serializers.DecimalField(max_digits=5, decimal_places=2,required=False)

    class Meta:
        model = Avatar
        fields = ['avatar_id', 'avatar_url', 'fragments_required', 'drop_rate']

    def validate_avatar_url(self, value):
        if not value.name.endswith(('.json')):
            raise serializers.ValidationError("File must be in JSON.")
        return value


    def update(self, instance, validated_data):
        user = self.context['request'].user    
        if 'avatar_url' in validated_data:
            avatar_image_file = validated_data.pop('avatar_url')
            file_name, object_path = make_file_upload_path("avatar", user, quote(avatar_image_file.name))
            bucket = settings.AWS_STORAGE_BUCKET_NAME
            file_url = upload_fileobj(avatar_image_file, bucket, object_path)
            if not file_url:
                raise serializers.ValidationError("File upload to S3 failed")
            instance.avatar_url = object_path
    
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['avatar_url'] = instance.avatar_url
        return representation

