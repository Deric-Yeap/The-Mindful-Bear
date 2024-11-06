from rest_framework import serializers

from .models import Achievement
from django.conf import settings
from ..common.s3 import create_presigned_url, upload_fileobj, make_file_upload_path, delete_s3_object
from urllib.parse import quote


class AchievementSerializer(serializers.ModelSerializer):
    achievement_badge_url = serializers.SerializerMethodField()
    class Meta:
        model = Achievement
        fields = ['achievement_id', 'description', 'streak_count', 'achievement_badge_url']

    def get_achievement_badge_url(self, obj):
        if obj.achievement_badge_url:
            return create_presigned_url(obj.achievement_badge_url)
        return None

class AchievementCreateSerializer(serializers.ModelSerializer):
    achievement_badge_url = serializers.FileField(write_only=True, required=True)

    class Meta: 
        model = Achievement
        fields = ['achievement_id', 'description', 'streak_count', 'achievement_badge_url']

    def validate_achievement_badge_url(self, value):
        if not value.name.endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("File must be in jpg, jpeg, or png format.")
        return value

    def create(self, validated_data):
        achievement_badge_file = validated_data.pop('achievement_badge_url')        
        user = self.context['request'].user    
        file_name, object_path = make_file_upload_path("achievement", user, quote(achievement_badge_file.name))                
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        file_url = upload_fileobj(achievement_badge_file, bucket, object_path)
        if not file_url:        
            raise serializers.ValidationError("File upload to S3 failed")
        
        achievement = Achievement.objects.create(
            achievement_badge_url=object_path,
            description=validated_data['description'],
            streak_count=validated_data['streak_count'],

        )

        return achievement

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['achievement_badge_url'] = instance.achievement_badge_url  
        return representation
    
class AchievementUpdateSerializer(serializers.ModelSerializer):
    achievement_badge_url = serializers.FileField(write_only=True, required=False)
    streak_count = serializers.IntegerField(required=False)
    description = serializers.CharField(required=False)

    class Meta:
        model = Achievement
        fields = ['achievement_id', 'description', 'streak_count', 'achievement_badge_url']

    def validate_achievement_badge_url(self, value):
        if not value.name.endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("File must be in jpg, jpeg, or png format.")
        return value


    def update(self, instance, validated_data):
        user = self.context['request'].user    
        if 'achievement_badge_url' in validated_data:
            achievement_badge_image_file = validated_data.pop('achievement_badge_url')
            file_name, object_path = make_file_upload_path("achievement", user, quote(achievement_badge_image_file.name))
            bucket = settings.AWS_STORAGE_BUCKET_NAME
            file_url = upload_fileobj(achievement_badge_image_file, bucket, object_path)
            if not file_url:
                raise serializers.ValidationError("File upload to S3 failed")
            instance.achievement_badge_url = object_path
    
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['achievement_badge_url'] = instance.achievement_badge_url
        return representation
    
    def delete(self, instance):
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        object_path = instance.achievement_badge_url
        if object_path: 
            delete_s3_object(bucket, object_path)
        
        instance.delete() 

