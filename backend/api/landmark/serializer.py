from rest_framework import serializers
from ..exercise.serializer import ExerciseSerializer, ExerciseGetSerializer
from ..exercise.models import Exercise
from .models import Landmark
from ..common.validators import is_field_empty
from django.conf import settings
from ..common.s3 import create_presigned_url, upload_fileobj, make_file_upload_path, delete_s3_object
from urllib.parse import quote
from ..landmarkUserCount.models import LandmarkUserCount 

class LandmarkSerializer(serializers.ModelSerializer):
    exercise = ExerciseGetSerializer(read_only=True)
    image_file_url = serializers.SerializerMethodField()
    user_count = serializers.SerializerMethodField()  # New method to retrieve user_count

    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'landmark_image_url', 'landmark_description', 'x_coordinates', 'y_coordinates', 'exercise', 'image_file_url', 'user_count']

    def get_image_file_url(self, obj):
        if obj.landmark_image_url:
            return create_presigned_url(obj.landmark_image_url)
        return None

    def get_user_count(self, obj):        
        try:
            return obj.user_count.user_count
        except LandmarkUserCount.DoesNotExist:
            return 0
    
class LandmarkCreateSerializer(serializers.ModelSerializer):
    landmark_image_url = serializers.ImageField(write_only=True, required=True)

    class Meta: 
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'landmark_image_url', 'landmark_description', 'x_coordinates', 'y_coordinates', 'exercise']

    def validate_landmark_image_url(self, value):
        if not value.name.endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("Image file must be in JPG, JPEG, or PNG format.")
        return value

    def create(self, validated_data):
        landmark_image_file = validated_data.pop('landmark_image_url')        
        user = self.context['request'].user    
        file_name, object_path = make_file_upload_path("landmark", user, quote(landmark_image_file.name))                
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        file_url = upload_fileobj(landmark_image_file, bucket, object_path)
        if not file_url:        
            raise serializers.ValidationError("File upload to S3 failed")
        
        landmark = Landmark.objects.create(
            landmark_name=validated_data['landmark_name'],
            landmark_image_url=object_path,
            landmark_description=validated_data['landmark_description'],
            x_coordinates=validated_data['x_coordinates'],
            y_coordinates=validated_data['y_coordinates'],
            exercise=validated_data['exercise']
        )

        return landmark

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['landmark_image_url'] = instance.landmark_image_url  
        representation['exercise'] = ExerciseSerializer(instance.exercise).data
        return representation
    
class LandmarkUpdateSerializer(serializers.ModelSerializer):
    landmark_image_url = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Landmark
        fields = ['landmark_name', 'landmark_image_url', 'landmark_description', 'x_coordinates', 'y_coordinates', 'exercise']

    def validate_landmark_image_url(self, value):
        if not value.name.endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("Image file must be in JPG, JPEG, or PNG format.")
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user    
        if 'landmark_image_url' in validated_data:
            landmark_image_file = validated_data.pop('landmark_image_url')
            file_name, object_path = make_file_upload_path("landmark", user, quote(landmark_image_file.name))
            bucket = settings.AWS_STORAGE_BUCKET_NAME
            file_url = upload_fileobj(landmark_image_file, bucket, object_path)
            if not file_url:
                raise serializers.ValidationError("File upload to S3 failed")
            instance.landmark_image_url = object_path
    
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['landmark_image_url'] = instance.landmark_image_url
        representation['exercise'] = ExerciseSerializer(instance.exercise).data
        return representation

