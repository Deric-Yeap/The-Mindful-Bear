from rest_framework import serializers
from .models import Journal
from django.conf import settings
from ..common.s3 import create_presigned_url, upload_fileobj, make_file_upload_path, delete_s3_object

class JournalGetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
 
    class Meta:
        model = Journal
        fields = ['id', 'user_id', 'emotion_id', 'audio_file_path', 'journal_text', 'sentiment_analysis_result', 'file_url', 'upload_date']   

    def get_file_url(self, obj):
        if obj.audio_file_path:
            return create_presigned_url(obj.audio_file_path)
        return None

class JournalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ['id', 'user_id', 'emotion_id', 'audio_file_path', 'journal_text', 'sentiment_analysis_result', 'upload_date']
        extra_kwargs = {
            'id': {'required': False},
            'user_id': {'required': False},
            'audio_file_path': {'required': False},
            'journal_text': {'required': False},
            'sentiment_analysis_result': {'required': False},
            'upload_date': {'required': False},
        }

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user else None
        return Journal.objects.create(user_id=user, **validated_data)

class JournalUploadFileSerializer(serializers.Serializer):
    audio_file = serializers.FileField()
    id = serializers.IntegerField(required=False)

    def validate_audio_file(self, value):
        if not value.name.endswith('.mp3'):
            raise serializers.ValidationError("Audio file must be an MP3 file.")
        return value

    def save(self):
        file = self.validated_data['audio_file']
        user = self.context['request'].user
        id = self.validated_data['id'] if 'id' in self.validated_data else None

        file_name, object_path = make_file_upload_path("journals", user, file.name)
        bucket = settings.AWS_STORAGE_BUCKET_NAME

        if not upload_fileobj(file, bucket, object_path):
            raise serializers.ValidationError("File upload to S3 failed")
        
        if id:
            try:
                journal_entry = Journal.objects.get(id=id, user_id=user)
                if journal_entry.audio_file_path:
                    delete_s3_object(bucket, journal_entry.audio_file_path)
                journal_entry.audio_file_path = object_path
                journal_entry.save()
            except Journal.DoesNotExist:
                raise serializers.ValidationError("Journal entry does not exist.")
            except Exception as e:
                raise serializers.ValidationError(e)
        else:
            journal_entry = Journal.objects.create(
                audio_file_path=object_path,
                emotion_id=1,  # hardcoded for now, can be changed later
                user_id=user
            )
        
        return journal_entry

class JournalUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ['audio_file_path','journal_text', 'sentiment_analysis_result']
        extra_kwargs = {
            'audio_file_path': {'required': False},
            'journal_text': {'required': False},
            'sentiment_analysis_result': {'required': False},
        }

