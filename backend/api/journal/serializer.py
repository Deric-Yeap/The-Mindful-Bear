from rest_framework import serializers
from .models import Journal
from ..emotion.models import Emotion
from django.conf import settings
from ..common.s3 import create_presigned_url, upload_fileobj, make_file_upload_path, delete_s3_object
from ..emotion.serializer import EmotionSerializer
from datetime import datetime, timedelta
from collections import defaultdict
from collections import Counter
import pytz



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
    journal_text = serializers.CharField(required=True)
    title = serializers.CharField(required=False)

    # def validate_audio_file(self, value):
    #     if not value.name.endswith('.mp3'):
    #         raise serializers.ValidationError("Audio file must be an MP3 file.")
    #     return value

    def save(self):
        file = self.validated_data['audio_file']
        user = self.context['request'].user
        id = self.validated_data['id'] if 'id' in self.validated_data else None
        emotion_ids = self.validated_data['emotion_id'] if 'emotion_id' in self.validated_data else []
        journal_text = self.validated_data['journal_text'] if 'journal_text' in self.validated_data else None
        title = self.validated_data['title'] if 'title' in self.validated_data else None


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
                user_id=user,
                journal_text = journal_text, 
                title = title
            )
            journal_entry.emotion_id.set(emotions)
        
        return journal_entry

class JournalUpdateSerializer(serializers.ModelSerializer):
    emotion_id = serializers.PrimaryKeyRelatedField(queryset=Emotion.objects.all(), many=True, required=False)

    class Meta:
        model = Journal
        fields = ['journal_text', 'title', 'emotion_id']
        extra_kwargs = {
            'journal_text': {'required': False},
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
        request = self.context.get('request')
        user = request.user if request and request.user else None

        weeks = [[] for _ in range(6)]
        journals = Journal.objects.filter(user_id=user, upload_date__year=year, upload_date__month=month)

        adjusted_journals = []
        for journal in journals:
            journal.upload_date = journal.upload_date + timedelta(hours=8)
            adjusted_journals.append(journal)

        current_date = start_date
        week_index = 0

        # Fill initial nulls for the first week
        for _ in range(start_date.weekday()):
            weeks[week_index].append(None)

        while current_date <= end_date:
            if current_date.weekday() == 0 and current_date != start_date:
                week_index += 1

            day_journals = [journal for journal in adjusted_journals if journal.upload_date.date() == current_date.date()]
            if day_journals:
                journal = day_journals[0]

                sentiments = [j.sentiment_analysis_result for j in day_journals if j.sentiment_analysis_result]
                sentiment_counts = Counter(sentiments)

                positive_count = sentiment_counts.get('Positive', 0)
                negative_count = sentiment_counts.get('Negative', 0)
                neutral_count = sentiment_counts.get('Neutral', 0)

                if positive_count > negative_count:
                    highest_sentiment = 'Positive'
                elif negative_count > positive_count:
                    highest_sentiment = 'Negative'
                else:
                    highest_sentiment = 'Neutral'  # Adjusted condition for neutrality

                journal.sentiment_analysis_result = highest_sentiment

                journal_data = {
                    "id": journal.id,
                    "upload_date": journal.upload_date.isoformat(),
                    "sentiment_analysis_result": highest_sentiment
                }

                weeks[week_index].append(journal_data)
            else:
                weeks[week_index].append({'sentiment_analysis_result': None})

            current_date += timedelta(days=1)

        # Fill the last week with nulls if less than 7 days
        while len(weeks[-1]) < 7:
            weeks[-1].append(None)

        return weeks

    def to_representation(self, instance):
        request = self.context.get('request')
        year = request.data.get('year')
        month = request.data.get('month')

        weeks = self.get_weekly_matrix(int(year), int(month))

        data = {
            'weeks': [[JournalSummarySerializer(journal).data if isinstance(journal, dict) and 'id' in journal else journal for journal in week] for week in weeks]
        }

        return data
    
class JournalEntriesByDateSerializer(serializers.Serializer):

    def get_journal_entries_by_date(self, year, month):
        start_date = datetime(year, month, 1)
        end_date = (start_date + timedelta(days=31)).replace(day=1) - timedelta(days=1)
        request = self.context.get('request')
        user = request.user if request and request.user else None

        journals = Journal.objects.filter(user_id=user, upload_date__year=year, upload_date__month=month)

        for journal in journals:
            journal.upload_date = journal.upload_date + timedelta(hours=8)

        journal_dict = {}

        current_date = start_date
        while current_date <= end_date:
            day_journals = [journal for journal in journals if journal.upload_date.date() == current_date.date()]
            
            for journal in day_journals:
                journal.upload_date = journal.upload_date - timedelta(hours=8)
            
            journal_dict[str(current_date.date())] = JournalGetSerializer(day_journals, many=True).data
            current_date += timedelta(days=1)

        return journal_dict

    def to_representation(self, instance):
        request = self.context.get('request')
        year = request.data.get('year')
        month = request.data.get('month')

        journal_dict = self.get_journal_entries_by_date(int(year), int(month))

        data = {
            'dates': journal_dict
        }

        return data
    
  

class JournalEntriesByPeriodSerializer(serializers.Serializer):
    start_date = serializers.DateField()
    end_date = serializers.DateField()

    def get_journal_entries_by_date_range(self, start_date, end_date):
        request = self.context.get('request')
        user = request.user if request and request.user else None
        # Filter journals based on the date range provided
        journals = Journal.objects.filter(user_id = user, upload_date__date__range=(start_date, end_date))
        journal_dict = {}

        current_date = start_date
        while current_date <= end_date:
            # Retrieve journals for the current date and serialize them
            day_journals = journals.filter(upload_date__date=current_date).order_by('-upload_date')
            journal_dict[str(current_date.date())] = JournalGetSerializer(day_journals, many=True).data
            current_date += timedelta(days=1)

        return journal_dict

    def to_representation(self, instance):
        # Retrieve the start and end dates from the validated data
        start_date = self.validated_data['start_date']
        end_date = self.validated_data['end_date']

        # Get journal entries within the date range
        journal_dict = self.get_journal_entries_by_date_range(start_date, end_date)

        data = {
            'dates': journal_dict
        }

        return data