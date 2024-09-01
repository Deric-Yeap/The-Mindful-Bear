from rest_framework import serializers
from ..exercise.serializer import ExerciseSerializer
from ..exercise.models import Exercise
from .models import Landmark
from ..common.validators import is_field_empty
from django.conf import settings
from ..common.s3 import create_presigned_url, upload_fileobj, make_file_upload_path, delete_s3_object
from urllib.parse import quote


class LandmarkSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(many=False, read_only=True)
    image_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'landmark_image_url', 'x_coordinates', 'y_coordinates', 'exercise', 'image_file_url']

    def get_image_file_url(self, obj):
        if obj.landmark_image_url:
            return create_presigned_url(obj.landmark_image_url)
        return None
    
class LandmarkCreateSerializer(serializers.ModelSerializer):
    landmark_image_url = serializers.ImageField(write_only=True, required=True)

    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'landmark_image_url', 'x_coordinates', 'y_coordinates', 'exercise']

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
        fields = ['landmark_name', 'landmark_image_url', 'x_coordinates', 'y_coordinates', 'exercise']

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
        
        instance.landmark_name = validated_data.get('landmark_name', instance.landmark_name)
        instance.x_coordinates = validated_data.get('x_coordinates', instance.x_coordinates)
        instance.y_coordinates = validated_data.get('y_coordinates', instance.y_coordinates)
        instance.exercise = validated_data.get('exercise', instance.exercise)

        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['landmark_image_url'] = instance.landmark_image_url
        representation['exercise'] = ExerciseSerializer(instance.exercise).data
        return representation
