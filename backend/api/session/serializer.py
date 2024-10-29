from rest_framework import serializers
from .models import Session
from ..formSession.utils import get_sessions_by_period
from datetime import datetime, timedelta
from pytz import UTC  # Make sure pytz is installed
import pytz


class SessionSerializer(serializers.ModelSerializer):
    # Adding SGT-converted fields
    start_datetime_sgt = serializers.SerializerMethodField()
    end_datetime_sgt = serializers.SerializerMethodField()
    class Meta:
        
        model = Session
         # Adding SGT-converted fields
        
        fields = ['id', 'start_datetime', 'end_datetime', 
            'pss_before', 'pss_after', 
            'sms_before', 'sms_after', 
            'physical_tiredness_before', 'physical_tiredness_after',
            'start_datetime_sgt', 'end_datetime_sgt']
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
    



class SessionSplitSerializer(serializers.Serializer):
    
    # def get_sessions_by_period(self, start_date, end_date, period):
    #     """
    #     This function takes start and end dates and the period (daily, weekly, monthly) 
    #     and returns a dictionary of sessions grouped by the period.
    #     """
    #     # Ensure start_date and end_date are in UTC
    #     SGT = pytz.timezone('Asia/Singapore')
    #     start_date_utc = start_date.astimezone(UTC)
        
    #     end_date_utc = end_date.astimezone(UTC)

    #     start_date_sgt = start_date.astimezone(SGT)
    #     end_date_sgt = end_date.astimezone(SGT)

    #     sessions = Session.objects.filter(
    #         start_datetime__gte=start_date_utc,
    #         start_datetime__lt=end_date_utc
    #     )

    #     print("sessions",sessions)
        
    #     session_dict = {}
    #     current_date = start_date_sgt.replace(hour=0, minute=0, second=0, microsecond=0)  # Start from midnight


    #     if period == 'daily':
    #         delta = timedelta(days=1)
    #         # remove weekly, add yearly
    #     # elif period == 'weekly':
    #     #     current_date -= timedelta(days=current_date.weekday())  # Adjust to previous Monday
    #     #     delta = timedelta(weeks=1)
    #     elif period == 'monthly':
    #         current_date = current_date.replace(day=1)  # Set to the first day of the month
    #     # No delta needed here since we'll calculate the next month on the fly
    #     elif period == 'yearly':
    #         current_date = current_date.replace(month=1, day=1)
    #     else:
    #         raise serializers.ValidationError("Invalid period specified.")

    #     # Loop through the date range by the specified period (daily, weekly, etc.)
    #     while current_date < end_date_sgt:
    #         # if period == 'weekly':
    #         #     next_date = current_date + timedelta(weeks=1)
    #         #     # dd/mm/YY
    #         #     key = f"{current_date.date()}"
    #         if period == 'monthly':
    #             key = f"{current_date.year}-{current_date.month:02d}"  # Format as MMM-YY
    #             key = current_date.strftime("%b-%y").title()
    #             if current_date.month == 12:
    #                 next_date = datetime(current_date.year + 1, 1, 1, tzinfo=SGT)  # January next year
    #             else:
    #                 next_date = datetime(current_date.year, current_date.month + 1, 1, tzinfo=SGT)  # First day of next month
    #         elif period == 'yearly':
    #             key = f"{current_date.year}"
    #             next_date = datetime(current_date.year + 1, 1, 1, tzinfo=SGT)  # January next year
    #         else:
    #             next_date = current_date + delta
    #             key = f"{current_date.date()}"

    #         # Filter sessions for the current period
    #         print("current_date",current_date)
    #         period_sessions = sessions.filter(start_datetime__gte=current_date.astimezone(UTC), 
    #                                           start_datetime__lt=next_date.astimezone(UTC))
        # def get_average_duration(self, sessions):
        #     session_dict = {}
        #     # Calculate the session count
        #     session_count = sessions['session_count']
        #     # Calculate the average duration of sessions
            
        #     # Calculate the total duration of sessions in minutes
        #     total_duration_seconds = sum([(session.end_datetime - session.start_datetime).total_seconds() for session in sessions])
        #     total_duration_minutes = total_duration_seconds / 60  # Convert to minutes

        #     avg_duration = total_duration_minutes / session_count if session_count > 0 else 0

        #     # Prepare the data for this period
        #     session_dict[key] = {
        #         'session_count': session_count,
        #         'average_duration': avg_duration,  # Convert to minutes
        #         'sessions': SessionSerializer(period_sessions, many=True).data  # Serialize the sessions
        #     }
            
        #     # Move to the next period
        #     current_date = next_date.astimezone(SGT)  # Ensure current_date is UTC

        # return session_dict

    def to_representation(self, instance):
        request = self.context.get('request')
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        period = request.query_params.get('period', 'daily')  # Default to daily if no period is specified
        SGT = pytz.timezone('Asia/Singapore')
         # Get all sessions if year and month are not provided
        sessions = Session.objects.all()
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
        session_dict = get_sessions_by_period(start_date, end_date, period)


        
        data = {
            'period': period,
            'dates': session_dict
        }
        # print("data",data)
        return data
# for validation: {
#                         "id": 336,
#                         "start_datetime": "2024-10-08T00:57:54.496000Z",
#                         "end_datetime": "2024-10-08T00:57:54.496000Z",
#                         "pss_before": 1.0,
#                         "pss_after": 1.0,
#                         "sms_before": null,
#                         "sms_after": null,
#                         "physical_tiredness_before": 1.0,
#                         "physical_tiredness_after": 1.0,
#                         "start_datetime_sgt": "2024-10-08 08:57:54",
#                         "end_datetime_sgt": "2024-10-08 08:57:54"
#                     },
#                     {
#                         "id": 337,
#                         "start_datetime": "2024-10-08T05:56:51.684000Z",
#                         "end_datetime": "2024-10-08T05:56:51.684000Z",
#                         "pss_before": 1.0,
#                         "pss_after": 1.0,
#                         "sms_before": null,
#                         "sms_after": null,
#                         "physical_tiredness_before": 1.0,
#                         "physical_tiredness_after": 1.0,
#                         "start_datetime_sgt": "2024-10-08 13:56:51",
#                         "end_datetime_sgt": "2024-10-08 13:56:51"
#                     },

class SessionUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        exclude = ['start_datetime']