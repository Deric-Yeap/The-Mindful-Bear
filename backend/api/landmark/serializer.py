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

    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'image_file', 'x_coordinates', 'y_coordinates', 'exercise']

    def get_file_url(self, obj):
        if obj.image_file:
            return create_presigned_url(obj.image_file)
        return None

class LandmarkCreateSerializer(serializers.ModelSerializer):
    image_file = serializers.ImageField(write_only=True, required=True)

    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'image_file', 'x_coordinates', 'y_coordinates', 'exercise']

    def validate_image_file(self, value):
        if not value.name.endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("Image file must be in JPG, JPEG, or PNG format.")
        return value

    def create(self, validated_data):
        image_file = validated_data.pop('image_file')
        user = self.context['request'].user  # Assumes the request is available in the context

        file_name, object_path = make_file_upload_path(user, image_file.name)
        bucket = settings.AWS_STORAGE_BUCKET_NAME

        if not upload_fileobj(image_file, bucket, object_path):
            raise serializers.ValidationError("File upload to S3 failed")
        file_location = quote(create_presigned_url(image_file), safe=':/')           
        landmark = Landmark.objects.create(
            landmark_name=validated_data['landmark_name'],
            image_file=file_location,
            x_coordinates=validated_data['x_coordinates'],
            y_coordinates=validated_data['y_coordinates'],
            exercise=validated_data['exercise']
        )

        return landmark

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # representation['image_file'] = quote(create_presigned_url(instance.image_file), safe=':/')
        representation['image_file'] = create_presigned_url(instance.image_file)
        representation['exercise'] = ExerciseSerializer(instance.exercise).data
        return representation



class LandmarkUpdateSerializer(serializers.ModelSerializer):
    image_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'image_file', 'x_coordinates', 'y_coordinates', 'exercise']
        extra_kwargs = {
            'landmark_name': {'required': True},
            'image_file': {'required': False},
            'x_coordinates': {'required': False},
            'y_coordinates': {'required': False},
            'exercise': {'required': False}
        }

    def validate_image_file(self, value):
        if value and not value.name.endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("Image file must be in JPG, JPEG, or PNG format.")
        return value

    def update(self, instance, validated_data):
        image_file = validated_data.pop('image_file', None)
        user = self.context['request'].user  # Assumes the request is available in the context

        if image_file:
            file_name, object_path = make_file_upload_path(user, image_file.name)
            bucket = settings.AWS_STORAGE_BUCKET_NAME

            if not upload_fileobj(image_file, bucket, object_path):
                raise serializers.ValidationError("File upload to S3 failed")
            file_location = quote(create_presigned_url(object_path), safe=':/')
            instance.image_file = file_location

        # Update the remaining fields
        instance.landmark_name = validated_data.get('landmark_name', instance.landmark_name)
        instance.x_coordinates = validated_data.get('x_coordinates', instance.x_coordinates)
        instance.y_coordinates = validated_data.get('y_coordinates', instance.y_coordinates)
        instance.exercise = validated_data.get('exercise', instance.exercise)

        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Serialize the exercise field separately
        representation['exercise'] = ExerciseSerializer(instance.exercise).data
        representation['image_file'] = create_presigned_url(instance.image_file)
        return representation
    