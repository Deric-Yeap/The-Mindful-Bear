from rest_framework import serializers
from .models import Session
from datetime import datetime, timedelta
from pytz import UTC  # Make sure pytz is installed


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__' 
    def validate_start_datetime(self, value):
        if self.instance and self.instance.start_datetime != value:
            raise serializers.ValidationError("start_datetime cannot be modified")
        return value
    
# class SessionByDateSerializer(serializers.Serializer):
#     def get_sessions_by_date(self, year, month):
#         start_date = datetime(year, month, 1,tzinfo=UTC)
#         end_date = (start_date + timedelta(days=31)).replace(day=1) - timedelta(days=1)

#         sessions = Session.objects.filter(start_datetime__year=year, start_datetime__month=month)
#         session_dict = {}

#         current_date = start_date
#         while current_date <= end_date:
#             day_sessions = sessions.filter(start_datetime__date=current_date.date()).order_by('-start_datetime')
#             session_dict[str(current_date.date())] = SessionSerializer(day_sessions, many=True).data
#             current_date += timedelta(days=1)

#         return session_dict

#     def to_representation(self, instance):
#         request = self.context.get('request')
#         year = request.query_params.get('year')
#         month = request.query_params.get('month')

#         if not year or not month:
#             raise serializers.ValidationError("Year and month are required parameters.")

#         session_dict = self.get_sessions_by_date(int(year), int(month))
        
#         data = {
#             'dates': session_dict
#         }
        
#         return data


class SessionByDateSerializer(serializers.Serializer):
    def get_sessions_by_date(self, year, month):
        # Convert the year and month to the start and end of the month in UTC
        start_date = datetime(year, month, 1, tzinfo=UTC)  # Start of the month in UTC
        # Calculate the end of the month (accounting for varying month lengths)
        if month == 12:
            next_month = datetime(year + 1, 1, 1, tzinfo=UTC)
        else:
            next_month = datetime(year, month + 1, 1, tzinfo=UTC)

        # End date is one microsecond before the next month's start
        end_date = next_month - timedelta(microseconds=1)

        # Filter sessions between start and end date (inclusive)
        sessions = Session.objects.filter(
            start_datetime__gte=start_date,
            start_datetime__lt=next_month  # Next month start is exclusive
        )

        print(f"Total sessions found for {year}-{month}: {sessions.count()}")  # Debugging statement


        session_dict = {}

        current_date = start_date
        while current_date <= end_date:
            # Filter day-by-day within the UTC-aware datetimes
            day_sessions = sessions.filter(start_datetime__date=current_date.date()).order_by('-start_datetime')
            session_dict[str(current_date.date())] = SessionSerializer(day_sessions, many=True).data
            current_date += timedelta(days=1)
        print(session_dict)
        return session_dict

    def to_representation(self, instance):
        request = self.context.get('request')
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        request = self.context.get('request')
    

        print(f"Received year: {year}, month: {month}")  # Add this to debug

    

        if not year or not month:
            raise serializers.ValidationError("Year and month are required parameters.")

        # Convert year and month to integers
        session_dict = self.get_sessions_by_date(int(year), int(month))
        
        data = {
            'dates': session_dict
        }
        
        return data


class SessionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        exclude = ['start_datetime']