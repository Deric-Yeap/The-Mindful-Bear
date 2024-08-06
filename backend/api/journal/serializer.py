from rest_framework import serializers
from .models import Journal
from django.conf import settings
from ..common.s3 import create_presigned_url

class JournalSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Journal
        fields = ['id', 'user_id', 'emotion_id', 'audio_file_path', 'audio_to_text', 'sentiment_analysis_result', 'file_url', 'upload_date']   

    def get_file_url(self, obj):
        if obj.audio_file_path:
            return create_presigned_url(settings.AWS_STORAGE_BUCKET_NAME, obj.audio_file_path)
        return None
    
class JournalUploadFileSerializer(serializers.Serializer):
    audio_file = serializers.FileField()

    def validate_audio_file(self, value):
        if not value.name.endswith('.mp3'):
            raise serializers.ValidationError("Audio file must be an MP3 file.")
        return value

class JournalUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ['audio_file_path','audio_to_text', 'sentiment_analysis_result']
        extra_kwargs = {
            'audio_file_path': {'required': False},
            'audio_to_text': {'required': False},
            'sentiment_analysis_result': {'required': False},
        }

