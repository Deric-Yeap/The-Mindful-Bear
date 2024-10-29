from rest_framework import serializers
from .models import FormSession
from ..session.models import Session
from django.conf import settings
from datetime import datetime, timedelta
from django.db.models import FloatField, Avg, F, Count, Q, Min, Max
from django.db.models.functions import Cast
from .utils import get_sessions_by_period

import pytz
from pytz import UTC  # Make sure pytz is installed
from rest_framework import serializers

class FormSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormSession
        fields = '__all__'


class ScoreAggregationSerializer(serializers.Serializer):
    average_pss_before = serializers.FloatField()
    average_pss_after = serializers.FloatField()
    average_sms_before = serializers.FloatField()
    average_sms_after = serializers.FloatField()

    # def get_sessions_by_period(self, start_date, end_date, period):
    #     SGT = pytz.timezone('Asia/Singapore')
    #     start_date_utc = start_date.astimezone(UTC)
        
    #     end_date_utc = end_date.astimezone(UTC)

    #     start_date_sgt = start_date.astimezone(SGT)
    #     end_date_sgt = end_date.astimezone(SGT)

    #     sessions = Session.objects.filter(
    #         start_datetime__gte=start_date_utc,
    #         start_datetime__lt=end_date_utc
    #     ).exclude(
    #         start_datetime=F('end_datetime')  # Exclude sessions where start and end times are the same
    #     )


    #     print("sessions",sessions)
        
    #     session_dict = {}
    #     current_date = start_date_sgt.replace(hour=0, minute=0, second=0, microsecond=0)
    #     # Adjust the filter based on the period
    #     if period == 'daily':
    #         delta = timedelta(days=1)
            
    #     elif period == 'monthly':
    #         current_date = current_date.replace(day=1)  # Set to the first day of the month
    #     # No delta needed here since we'll calculate the next month on the fly
    #     elif period == 'yearly':
    #         current_date = current_date.replace(month=1, day=1)
    #     else:
    #         raise serializers.ValidationError("Invalid period specified.")
    #      # Loop through the date range by the specified period (daily, weekly, etc.)
    #     while current_date < end_date_sgt:
           
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
            
    #                     # Extract session IDs from the filtered period_sessions
    #         session_ids = period_sessions.values_list('id', flat=True)  # Extracting the session IDs
    #         session_count = session_ids.count()  # Counting the number of session IDs

    #         # Now filter FormSession based on these session IDs
            
    #         # Prepare the data for this period
    #         session_dict[key] = {
    #             'session_count': session_count,
    #             'session_ids': session_ids  # return the session ids
    #         }
            
    #         # Move to the next period
    #         current_date = next_date.astimezone(SGT)  # Ensure current_date is UTC

    #     return session_dict


    
    def get_form_averages(self, session_ids):
        # Filter only valid sessions for averaging
        filtered_sessions = FormSession.objects.filter(SessionID__in=session_ids)
        # Group by SessionID and FormID, and count each group
        # Only keep SessionIDs where there are exactly 2 PSS and 2 SMS entries

        
        # Get the new session count
        session_count = filtered_sessions.values('SessionID').distinct().count()
        print("filtered_sessions",filtered_sessions)

        # If there are no valid sessions, return 0 for all averages
        if session_count == 0:
            return {
            'session_count': 0,
            'average_pss_before': 0,
            'average_pss_after': 0,
            'average_sms_before': 0,
            'average_sms_after': 0
        }
        else: 
         # Get "before" and "after" for PSS by filtering on FormID and id order
        # Get the "before" (first entry) and "after" (second entry) PSS scores
            pss_before_score_ids = list(
                filtered_sessions
                .filter(FormID=3)  # PSS form
                # .order_by('SessionID', 'id')  # Order by SessionID and id
                .values('SessionID')  # Group results by SessionID
                .annotate(before_score=Min('id'))  # Get the minimum id for each session
                .values_list('before_score', flat=True)  # This will give you a flat list of IDs            
                )
            print("pss_before_scores",pss_before_score_ids)
            # Extract the IDs from the dictionaries in pss_before_scores

            # Now, retrieve the aggregated scores corresponding to these IDs
            aggregated_pss_before = list(
                filtered_sessions
                .filter(id__in=pss_before_score_ids)  # Filter to only those entries with the specified IDs
                .values_list('aggregatedScore', flat=True)  # Get the aggregatedScore for those entries
            )
            # print("aggregated_pss_before",aggregated_pss_before)

            pss_after_score_ids = list(
                filtered_sessions
                .filter(FormID=3)  # PSS form
                # .order_by('SessionID', '-id')  # Order by SessionID and id
                .values('SessionID')  # Group results by SessionID
                .annotate(after_score=Max('id'))  # Get the max id for each session
                .values_list('after_score', flat=True)  # This will give you a flat list of IDs            
                )
            print("pss_after_scores",pss_after_score_ids)

            aggregated_pss_after = list(
                filtered_sessions
                .filter(id__in=pss_after_score_ids)  # Filter to only those entries with the minimum id
                .values_list('aggregatedScore', flat=True)  # Get the aggregatedScore for those entries
            )
            # Get the "before" and "after" SMS scores in the same way
            sms_before_score_ids = list(
                filtered_sessions
                .filter(FormID=5)  # SMS form
                # .order_by('SessionID', 'id')  # Order by SessionID and id
                .values('SessionID')  # Group results by SessionID
                .annotate(before_score=Min('id'))  # Get the minimum id for each session
                .values_list('before_score', flat=True)  # This will give you a flat list of IDs            
            )

            print("sms_before_scores",sms_before_score_ids)



            aggregated_sms_before = list(
                filtered_sessions
                .filter(id__in=sms_before_score_ids)  # Filter to only those entries with the minimum id
                .values_list('aggregatedScore', flat=True)  # Get the aggregatedScore for those entries
            )

            sms_after_score_ids = list(
                filtered_sessions
                .filter(FormID=5)  # SMS form
                # .order_by('SessionID', '-id')  # Order by SessionID and id
                .values('SessionID')  # Group results by SessionID
                .annotate(after_score=Max('id'))  # Get the max id for each session
                .values_list('after_score', flat=True)  # This will give you a flat list of IDs    
        )
            
            print("sms_after_scores",sms_after_score_ids)
            aggregated_sms_after = list(
                    filtered_sessions
                    .filter(id__in=sms_after_score_ids)  # Filter to only those entries with the minimum id
                    .values_list('aggregatedScore', flat=True) # Get the aggregatedScore for those entries
                )
            
            def average(values):
                # Convert each value to float before summing to avoid errors with strings
                values = [float(value) for value in values]
                return sum(values) / len(values) if values else 0

            
            print("aggregated_pss_before",aggregated_pss_before)
            print("aggregated_pss_after",aggregated_pss_after)
            print("aggregated_sms_before",aggregated_sms_before)
            print("aggregated_sms_after",aggregated_sms_after)

            # Final averages
            pss_before_avg = average(aggregated_pss_before)
            pss_after_avg = average(aggregated_pss_after)
            sms_before_avg = average(aggregated_sms_before)
            sms_after_avg = average(aggregated_sms_after)

            print("pss_before_avg",pss_before_avg)  
            print("pss_after_avg",pss_after_avg)
            print("sms_before_avg",sms_before_avg)
            print("sms_after_avg",sms_after_avg)
            
            return {
                'session_count': session_count,
                'average_pss_before': pss_before_avg,
                'average_pss_after': pss_after_avg,
                'average_sms_before': sms_before_avg,
                'average_sms_after': sms_after_avg
            }
                
    

    def to_representation(self, instance):
        request = self.context.get('request')
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        period = request.query_params.get('period', 'daily')
        print("period",period)

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
        # Get sessions aggregated by period
         # Iterate over each period and calculate form averages
         # Get sessions aggregated by period
        session_data = get_sessions_by_period(start_date, end_date, period)
        print("session data",session_data)
        result = {}
        for period_key, data in session_data.items():
            form_averages = self.get_form_averages(data['session_ids'])
            result[period_key] = {
                **form_averages
            }

        return result
