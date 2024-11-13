from rest_framework import serializers
from .models import UserSession
from ..formSession.utils import get_sessions_by_period
from datetime import datetime, timedelta
from pytz import UTC  # Make sure pytz is installed
import pytz
from ..landmark.models import Landmark
from ..exercise.models import Exercise


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


class UserSessionLandmarkSplitSerializer(serializers.Serializer):
    def get_user_session_details(self, data):
        session_ids = [session['id'] for session in data['sessions']]
        user_sessions = UserSession.objects.filter(session_id__in=session_ids)
        serialized_user_sessions = UserSessionSerializer(user_sessions, many=True).data
        return serialized_user_sessions
    
    def get_average_duration_landmark(self, usersessions):
        sgt_format = '%Y-%m-%d %H:%M:%S'
        landmark_data = {}

        # Extract all available landmarks
        landmarks = Landmark.objects.all()
        for landmark in landmarks:
            landmark_data[landmark.landmark_id] = {'durations': [], 'count': 0, 'usersessions': []}

        # Iterate through sessions to update landmark data
        for session in usersessions:
            print(session)
            landmark_id = session['landmark']
            total_duration_seconds = (datetime.strptime(session['end_datetime_sgt'], sgt_format) - datetime.strptime(session['start_datetime_sgt'], sgt_format)).total_seconds()
            total_duration_minutes = total_duration_seconds / 60  # Convert to minutes

            landmark_data[landmark_id]['durations'].append(total_duration_minutes)
            landmark_data[landmark_id]['count'] += 1
            landmark_data[landmark_id]['usersessions'].append(session)
        

      # Calculate average durations
        landmark_session_details = {}
        for landmark_id, data in landmark_data.items():
            durations = data['durations']
            if len(durations) > 0:
                landmark_session_details[landmark_id] = {
                    'average_duration': sum(durations) / len(durations),
                    'count': data['count'],
                    'usersessions': data['usersessions']
                }
            else:
                landmark_session_details[landmark_id] = {
                    'average_duration': 0,
                    'count': 0,
                    'usersessions': []
                }
        return landmark_session_details
    


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
        # session_dict =  get_average_duration(session_data)
        for period_key, data in session_data.items():
            print("period_key",period_key)
            # print("data",data)
            # session_count = data['session_count']
            # average_duration = data['average_duration']
            usersession_details = self.get_user_session_details(data)
            # form_averages = self.get_form_averages(data['session_ids'])
            landmark_details = self.get_average_duration_landmark(usersession_details)


            result[period_key] = {
                
                'landmark_details': landmark_details,
                
            }
            
        
        data = {
            'period': period,
            'dates': result
        }
        return data
    
class UserSessionExerciseSplitSerializer(serializers.Serializer):
    def get_user_session_details(self, data):
        session_ids = [session['id'] for session in data['sessions']]
        user_sessions = UserSession.objects.filter(session_id__in=session_ids)
        serialized_user_sessions = UserSessionSerializer(user_sessions, many=True).data
        return serialized_user_sessions
    
    def get_average_duration_exercise(self, usersessions):
        sgt_format = '%Y-%m-%d %H:%M:%S'
        exercise_data = {}

        # Extract all available exercise
        exercises = Exercise.objects.all()
        landmarks = Landmark.objects.all()
        print("landmarks",landmarks)
        for exercise in exercises:
            exercise_data[exercise.exercise_id] = {'durations': [], 'count': 0, 'percent_count':0,'usersessions': []}

        print("exercise_data",exercise_data)

        # Iterate through sessions to update exercise data
        for session in usersessions:
            print(session)
            landmark_id = session['landmark']
            exercise_id = landmarks.filter(landmark_id=landmark_id).first().exercise.exercise_id
            total_duration_seconds = (datetime.strptime(session['end_datetime_sgt'], sgt_format) - datetime.strptime(session['start_datetime_sgt'], sgt_format)).total_seconds()
            total_duration_minutes = total_duration_seconds / 60  # Convert to minutes

            exercise_data[exercise_id]['durations'].append(total_duration_minutes)
            exercise_data[exercise_id]['count'] += 1
            exercise_data[exercise_id]['usersessions'].append(session)
            
       

      # Calculate average durations
        exercise_session_details = {}
        for exercise_id, data in exercise_data.items():
            durations = data['durations']
            count = len(durations)
            if len(durations) > 0:
                exercise_session_details[exercise_id] = {
                    'average_duration': sum(durations) / len(durations),
                    'count': count,
                    'usersessions': data['usersessions']
                }
            else:
                exercise_session_details[exercise_id] = {
                    'average_duration': 0,
                    'count': 0,
                    'usersessions': []
                }
        return {
            **exercise_session_details}
    


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
        result = {}
        # session_dict =  get_average_duration(session_data)
        for period_key, data in session_data.items():
            print("period_key",period_key)
            print("data",data)
            
            usersession_details = self.get_user_session_details(data)
            
            exercise_details = self.get_average_duration_exercise(usersession_details)


            result[period_key] = {
                'exercise_details': exercise_details,
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