from rest_framework import serializers
from .models import Session
from ..formSession.utils import get_sessions_by_period
from datetime import datetime, timedelta
from pytz import UTC
import pytz
from api.formSession.models import FormSession
from django.db.models import Avg, Count
from .utils import calculate_session_metrics  # Ensure this import

class SessionSerializer(serializers.ModelSerializer):
    start_datetime_sgt = serializers.SerializerMethodField()
    end_datetime_sgt = serializers.SerializerMethodField()
    
    class Meta:
        model = Session
        fields = [
            'id', 'start_datetime', 'end_datetime', 'pss_before', 'pss_after', 
            'sms_before', 'sms_after', 'physical_tiredness_before', 'physical_tiredness_after',
            'start_datetime_sgt', 'end_datetime_sgt'
        ]

    def validate_start_datetime(self, value):
        if self.instance and self.instance.start_datetime != value:
            raise serializers.ValidationError("start_datetime cannot be modified")
        return value

    def get_start_datetime_sgt(self, obj):
        SGT = pytz.timezone('Asia/Singapore')
        return obj.start_datetime.astimezone(SGT).strftime('%Y-%m-%d %H:%M:%S')

    def get_end_datetime_sgt(self, obj):
        SGT = pytz.timezone('Asia/Singapore')
        return obj.end_datetime.astimezone(SGT).strftime('%Y-%m-%d %H:%M:%S')

class SessionSplitSerializer(serializers.Serializer):
    
    def get_average_duration(self, period_sessions):
        session_dict = {}
        sgt_format = '%Y-%m-%d %H:%M:%S'

        for key, data in period_sessions.items():
            session_details = data['sessions']
            total_duration_seconds = sum(
                (datetime.strptime(session['end_datetime_sgt'], sgt_format) - datetime.strptime(session['start_datetime_sgt'], sgt_format)).total_seconds()
                for session in data['sessions']
            )
            total_duration_minutes = total_duration_seconds / 60
            session_count = data['session_count']
            active_days = len(set(datetime.strptime(session['start_datetime_sgt'], sgt_format).date() for session in session_details))

            avg_duration = total_duration_minutes / session_count if session_count > 0 else 0
            avg_daily_sessions = session_count / active_days if active_days > 0 else 0

            session_dict[key] = {
                'session_count': session_count,
                'average_duration': avg_duration,
                'average_daily_sessions': avg_daily_sessions,
                'sessions': session_details
            }
        return session_dict

    def to_representation(self, instance):
        request = self.context.get('request')
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        period = request.query_params.get('period', 'daily')
        SGT = pytz.timezone('Asia/Singapore')
        
        sessions = Session.objects.all()
        if period == 'daily':
            end_date = datetime.now(tz=SGT)
            start_date = end_date - timedelta(days=30)
        else:
            if year and month:
                year, month = int(year), int(month)
                start_date = datetime(year, month, 1, tzinfo=SGT)
                end_date = datetime(year, month + 1, 1, tzinfo=SGT) - timedelta(microseconds=1) if month < 12 else datetime(year + 1, 1, 1, tzinfo=SGT) - timedelta(microseconds=1)
                sessions = sessions.filter(start_datetime__gte=start_date, start_datetime__lt=end_date)
            else:
                start_date = sessions.order_by('start_datetime').first().start_datetime if sessions.exists() else datetime.now(tz=SGT)
                end_date = sessions.order_by('-start_datetime').first().start_datetime if sessions.exists() else datetime.now(tz=SGT)

        session_data = get_sessions_by_period(start_date, end_date, period)
        session_dict = self.get_average_duration(session_data)

        data = {
            'period': period,
            'dates': session_dict
        }
        return data
    
    def categorize_scores_by_level(self, sessions):

        #Categorize 'before' and 'after' scores for PSS and SMS into 'low,' 'moderate,' and 'high' groups.

        # Define thresholds for PSS and SMS scores
        pss_thresholds = {"low": 13, "moderate": 26, "high": 40}
        sms_thresholds = {"low": 28, "moderate": 56, "high": 84}

        # Helper function to categorize scores
        def categorize_score(scores, thresholds):
            low = sum(1 for score in scores if score <= thresholds["low"])
            high = sum(1 for score in scores if score > thresholds["moderate"])
            moderate = len(scores) - low - high
            return {"low": low, "moderate": moderate, "high": high}

        # Extract "before" and "after" PSS and SMS scores from sessions
        pss_before_scores = sessions.values_list('pss_before', flat=True)
        pss_after_scores = sessions.values_list('pss_after', flat=True)
        sms_before_scores = sessions.values_list('sms_before', flat=True)
        sms_after_scores = sessions.values_list('sms_after', flat=True)

        # Categorize PSS and SMS scores into low, moderate, and high groups
        pss_before_categories = categorize_score([score for score in pss_before_scores if score is not None], pss_thresholds)
        pss_after_categories = categorize_score([score for score in pss_after_scores if score is not None], pss_thresholds)
        sms_before_categories = categorize_score([score for score in sms_before_scores if score is not None], sms_thresholds)
        sms_after_categories = categorize_score([score for score in sms_after_scores if score is not None], sms_thresholds)

        return {
            "stress_levels": {
                "before": pss_before_categories,
                "after": pss_after_categories
            },
            "mindfulness_levels": {
                "before": sms_before_categories,
                "after": sms_after_categories
            }
        }

class SessionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        exclude = ['start_datetime']
