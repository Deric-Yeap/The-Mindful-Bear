from rest_framework import serializers
from .models import Journal
from ..emotion.models import Emotion
from django.conf import settings
from ..common.s3 import create_presigned_url, upload_fileobj, make_file_upload_path, delete_s3_object
from ..emotion.serializer import EmotionSerializer
from datetime import datetime, timedelta


class JournalGetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    emotion_id = EmotionSerializer(many=True)
    
    class Meta:
        model = Journal
        fields = ['id', 'user_id', 'emotion_id', 'title', 'audio_file_path', 'journal_text', 'sentiment_analysis_result', 'file_url', 'upload_date']   

    def get_file_url(self, obj):
        if obj.audio_file_path:
            return create_presigned_url(obj.audio_file_path)
        return None

class JournalCreateSerializer(serializers.ModelSerializer):
    emotion_id = serializers.PrimaryKeyRelatedField(queryset=Emotion.objects.all(), many=True)

    class Meta:
        model = Journal
        fields = ['id', 'user_id', 'title', 'emotion_id', 'audio_file_path', 'journal_text', 'sentiment_analysis_result', 'upload_date']
        extra_kwargs = {
            'id': {'required': False},
            'user_id': {'required': False},
            'audio_file_path': {'required': False},
            'sentiment_analysis_result': {'required': False},
            'upload_date': {'required': False},
        }

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user else None
        emotions = validated_data.pop('emotion_id')
        journal = Journal.objects.create(user_id=user, **validated_data)
        journal.emotion_id.set(emotions)
        return journal

class JournalUploadFileSerializer(serializers.Serializer):
    audio_file = serializers.FileField()
    id = serializers.IntegerField(required=False)
    emotion_id = serializers.ListField(child=serializers.IntegerField(), required=False)

    def validate_audio_file(self, value):
        if not value.name.endswith('.mp3'):
            raise serializers.ValidationError("Audio file must be an MP3 file.")
        return value

    def save(self):
        file = self.validated_data['audio_file']
        user = self.context['request'].user
        id = self.validated_data['id'] if 'id' in self.validated_data else None
        emotion_ids = self.validated_data['emotion_id'] if 'emotion_id' in self.validated_data else []

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
                if emotion_ids:
                    emotions = Emotion.objects.filter(id__in=emotion_ids)
                    journal_entry.emotion_id.set(emotions)
            except Journal.DoesNotExist:
                raise serializers.ValidationError("Journal entry does not exist.")
            except Exception as e:
                raise serializers.ValidationError(e)
        else:
            emotions = Emotion.objects.filter(id__in=emotion_ids)
            journal_entry = Journal.objects.create(
                audio_file_path=object_path,
                user_id=user
            )
            journal_entry.emotion_id.set(emotions)
        
        return journal_entry

class JournalUpdateSerializer(serializers.ModelSerializer):
    emotion_id = serializers.PrimaryKeyRelatedField(queryset=Emotion.objects.all(), many=True, required=False)

    class Meta:
        model = Journal
        fields = ['audio_file_path', 'journal_text', 'sentiment_analysis_result', 'title', 'emotion_id']
        extra_kwargs = {
            'audio_file_path': {'required': False},
            'journal_text': {'required': False},
            'sentiment_analysis_result': {'required': False},
            'title': {'required': False},
            'emotion_id': {'required': False},
        }

    def update(self, instance, validated_data):
        emotions = validated_data.pop('emotion_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if emotions is not None:
            instance.emotion_id.set(emotions)
        instance.save()
        return instance

class JournalSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ['id', 'upload_date', 'sentiment_analysis_result']

class JournalCalendarSerializer(serializers.Serializer):
    weeks = serializers.ListField(child=serializers.ListField(child=serializers.JSONField()))

    def get_weekly_matrix(self, year, month):
        start_date = datetime(year, month, 1)
        end_date = (start_date + timedelta(days=31)).replace(day=1) - timedelta(days=1)

        weeks = [[] for _ in range(6)]
        journals = Journal.objects.filter(upload_date__year=year, upload_date__month=month)

        current_date = start_date
        week_index = 0

        
        for _ in range(start_date.weekday()): # null to account for starting days
            weeks[week_index].append(None)

        while current_date <= end_date:
            if current_date.weekday() == 0 and current_date != start_date:
                week_index += 1

            day_journals = journals.filter(upload_date__date=current_date.date())
            if day_journals.exists():
                weeks[week_index].append(day_journals.first())
            else:
                weeks[week_index].append({'date': current_date.date(), 'sentiment_analysis_result': None})

            current_date += timedelta(days=1)

        while len(weeks[-1]) < 7: #null for remainding days
            weeks[-1].append(None)

        return weeks

    def to_representation(self, instance):
        request = self.context.get('request')
        year = request.data.get('year')
        month = request.data.get('month')

        weeks = self.get_weekly_matrix(int(year), int(month))
        
        data = {
            'weeks': [[JournalSummarySerializer(journal).data if isinstance(journal, Journal) else journal for journal in week] for week in weeks]
        }
        
        return data