from rest_framework import serializers
from .models import Exercise
from ..landmark.models import Landmark
from django.conf import settings
from ..common.validators import is_field_empty
from ..common.s3 import create_presigned_url, upload_fileobj, make_file_upload_path, delete_s3_object
from urllib.parse import quote

class MinimalLandmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ['landmark_id', 'landmark_name', 'landmark_image_url', 'x_coordinates', 'y_coordinates']
# general serializer with no validation
class ExerciseSerializer(serializers.ModelSerializer):
    landmarks = MinimalLandmarkSerializer(many=True, read_only=True)
    start_datetime = serializers.ReadOnlyField() 
    class Meta:
        model = Exercise
        fields = ['exercise_id','exercise_name', 'audio_url', 'description', 'landmarks', 'start_datetime']
class ExerciseGetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = ['exercise_id','exercise_name', 'audio_url', 'description', 'landmarks', 'file_url']

    def get_file_url(self, obj):
        if obj.audio_url:
            return create_presigned_url(obj.audio_url)
        return None
    
class ExerciseCreateSerializer(serializers.ModelSerializer):
    audio_url = serializers.URLField(validators=[is_field_empty], required = False)
    landmarks = MinimalLandmarkSerializer(many=True,required = False)
    audio_file = serializers.FileField(write_only=True, required=True)

    def validate_audio_file(self, value):
        if not value.name.endswith('.mp3'):
            raise serializers.ValidationError("Audio file must be an MP3 file.")
        return value
        
    def create(self, validated_data):
        print(self.validated_data)
        # Retrieve the audio file from the validated data
        file = validated_data.pop('audio_file')
        # file = self.validated_data['audio_url']
        print(file)
        user = self.context['request'].user
        id = self.validated_data['id'] if 'id' in self.validated_data else None

        file_name, object_path = make_file_upload_path("exercises", user, quote(file.name))
        bucket = settings.AWS_STORAGE_BUCKET_NAME

        if not upload_fileobj(file, bucket, object_path):
            raise serializers.ValidationError("File upload to S3 failed")
        
        exercise = Exercise.objects.create(audio_url=object_path, **validated_data)
        return exercise
        
    class Meta:
        model = Exercise
        fields = ['exercise_id','exercise_name', 'audio_url', 'description', 'landmarks', 'audio_file']
        extra_kwargs = {
            'audio_file': {'write_only': True},  # Don't return this field in the response
        }


class ExerciseUpdateSerializer(serializers.ModelSerializer):
    audio_url = serializers.URLField(validators=[is_field_empty], required=False)
    landmarks = MinimalLandmarkSerializer(many=True, required=False)
    audio_file = serializers.FileField(write_only=True, required=False)

    def validate_audio_file(self, value):
        if value and not value.name.endswith('.mp3'):
            raise serializers.ValidationError("Audio file must be an MP3 file.")
        return value

    def update(self, instance, validated_data):
        # If a new audio file is uploaded, process it
        if 'audio_file' in validated_data:
            file = validated_data.pop('audio_file')
            user = self.context['request'].user
            file_name, object_path = make_file_upload_path("exercises", user, quote(file.name))
            bucket = settings.AWS_STORAGE_BUCKET_NAME

            if not upload_fileobj(file, bucket, object_path):
                raise serializers.ValidationError("File upload to S3 failed")
            
            instance.audio_url = object_path  # Update the audio URL

        # Update other fields
        instance.exercise_name = validated_data.get('exercise_name', instance.exercise_name)
        instance.description = validated_data.get('description', instance.description)

        # Handle landmarks if provided
        if 'landmarks' in validated_data:
            instance.landmarks.set(validated_data['landmarks'])

        instance.save()
        return instance

    class Meta:
        model = Exercise
        fields = ['exercise_id', 'exercise_name', 'audio_url', 'description', 'landmarks', 'audio_file']
        extra_kwargs = {
            'audio_file': {'write_only': True},  # Don't return this field in the response
        }


class ExerciseUploadFileSerializer(serializers.Serializer):
    audio_file = serializers.FileField()
    id = serializers.IntegerField(required=False)

    def validate_audio_file(self, value):
        if not value.name.endswith('.mp3'):
            raise serializers.ValidationError("Audio file must be an MP3 file.")
        return value

    def save(self):
        file = self.validated_data['audio_url']
        user = self.context['request'].user
        id = self.validated_data['id'] if 'id' in self.validated_data else None

        file_name, object_path = make_file_upload_path("exercises", user, file.name)
        bucket = settings.AWS_STORAGE_BUCKET_NAME

        if not upload_fileobj(file, bucket, object_path):
            raise serializers.ValidationError("File upload to S3 failed")
        
        if id:
            try:
                exercise_entry = Exercise.objects.get(id=id, user_id=user)
                if exercise_entry.audio_file_path:
                    delete_s3_object(bucket, exercise_entry.audio_file_path)
                exercise_entry.audio_file_path = object_path
                exercise_entry.save()
            except Exercise.DoesNotExist:
                raise serializers.ValidationError("exercise entry does not exist.")
            except Exception as e:
                raise serializers.ValidationError(e)
        else:
            exercise_entry = Exercise.objects.create(
                audio_file_path=object_path,
                emotion_id=1,  # hardcoded for now, can be changed later
                user_id=user
            )
        
        return exercise_entry
   

