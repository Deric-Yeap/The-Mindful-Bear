from rest_framework import serializers
from .models import UserSession
from ..formSession.utils import get_sessions_by_period
from ..session.utils import get_average_duration
from datetime import datetime, timedelta
from pytz import UTC  # Make sure pytz is installed
import pytz


class UserSessionSerializer(serializers.ModelSerializer):
    # Adding SGT-converted fields
    start_datetime_sgt = serializers.SerializerMethodField()
    end_datetime_sgt = serializers.SerializerMethodField()
    class Meta:
        
        model = UserSession
         # Adding SGT-converted fields
        
        fields = ["id", "start_datetime", "end_datetime", "start_datetime_sgt", "end_datetime_sgt",
                  "user", "session", "landmark"]
        extra_kwargs = {
            "user": {"read_only": True}
        }  
    def validate_start_datetime(self, value):
        if self.instance and self.instance.start_datetime != value:
            raise serializers.ValidationError("start_datetime cannot be modified")
        return value
    def get_start_datetime_sgt(self, obj):
        SGT = pytz.timezone('Asia/Singapore')
        # Convert start_datetime to SGT
        return obj.start_datetime.astimezone(SGT).strftime('%Y-%m-%d %H:%M:%S')

    def get_end_datetime_sgt(self, obj):
        # Convert end_datetime to SGT
        SGT = pytz.timezone('Asia/Singapore')
        return obj.end_datetime.astimezone(SGT).strftime('%Y-%m-%d %H:%M:%S')


class UserSessionSplitSerializer(serializers.Serializer):
    def get_user_session_details(self, data):
        session_ids = [session['id'] for session in data['sessions']]
        user_sessions = UserSession.objects.filter(session_id__in=session_ids)
        serialized_user_sessions = UserSessionSerializer(user_sessions, many=True).data
        return serialized_user_sessions


    def to_representation(self, instance):
        request = self.context.get('request')
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        period = request.query_params.get('period', 'daily')  # Default to daily if no period is specified
        SGT = pytz.timezone('Asia/Singapore')
         # Get all sessions if year and month are not provided
        sessions = UserSession.objects.all()
        if period == 'daily':
             # Calculate start and end dates for the last 30 days
            end_date = datetime.now(tz=SGT)
            start_date = end_date - timedelta(days=30)
        else:
            if year and month:
                # If year and month are provided, filter by the month
                year = int(year)
                month = int(month)
                start_date = datetime(year, month, 1, tzinfo=SGT)

                if month == 12:
                    end_date = datetime(year + 1, 1, 1, tzinfo=SGT) - timedelta(microseconds=1)
                else:
                    end_date = datetime(year, month + 1, 1, tzinfo=SGT) - timedelta(microseconds=1)

                sessions = sessions.filter(start_datetime__gte=start_date, start_datetime__lt=end_date)
            else:
                # If no year and month, use the full date range of all sessions
                if sessions.exists():
                    start_date = sessions.order_by('start_datetime').first().start_datetime
                    end_date = sessions.order_by('-start_datetime').first().start_datetime
                else:
                    start_date = datetime.now(tz=SGT)
                    end_date = datetime.now(tz=SGT)

        # Get the session data for the specified period
        session_data = get_sessions_by_period(start_date, end_date, period)
        print("session data",session_data)
        result = {}
        session_dict =  get_average_duration(session_data)
        for period_key, data in session_dict.items():
            print("period_key",period_key)
            print("data",data)
            session_count = data['session_count']
            average_duration = data['average_duration']
            usersession_details = self.get_user_session_details(data)
            # form_averages = self.get_form_averages(data['session_ids'])
            result[period_key] = {
                'session_count': session_count,
                'average_duration': average_duration,
                'usersessions': usersession_details
            }
            
        
        data = {
            'period': period,
            'dates': result
        }
        # print("data",data)
        return data


class UserSessionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        exclude = ['start_datetime']