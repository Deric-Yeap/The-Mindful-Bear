from rest_framework import serializers
from .models import FormSession
from ..session.models import Session
from django.conf import settings
from datetime import datetime, timedelta
from django.db.models import FloatField,  Count, Min, Max, Case, When, IntegerField
from django.db.models.functions import Cast
from .utils import get_sessions_by_period, get_sessions

import pytz
from pytz import UTC  # Make sure pytz is installed
from rest_framework import serializers

class FormSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormSession
        fields = '__all__'


class ScoreAggregationProfSerializer(serializers.Serializer):
    average_pss_before = serializers.FloatField()
    average_pss_after = serializers.FloatField()
    average_sms_before = serializers.FloatField()
    average_sms_after = serializers.FloatField()
    
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
        # Use the current year if no year is provided
        if not year and not month:
        # No year and no month provided, use the full date range of all sessions
            if sessions.exists():
                start_date = sessions.order_by('start_datetime').first().start_datetime
                end_date = sessions.order_by('-start_datetime').first().start_datetime
            else:
                # If no sessions are available, use the current date
                start_date = datetime.now(tz=SGT)
                end_date = datetime.now(tz=SGT)
                
        elif year and not month:
            # Only year provided, take all months in that year
            year = int(year)
            start_date = datetime(year, 1, 1, tzinfo=SGT)
            end_date = datetime(year + 1, 1, 1, tzinfo=SGT) - timedelta(microseconds=1)
            
        elif month and not year:
            # Only month provided, take the specified month across all years
            month = int(month)
            start_date = sessions.filter(start_datetime__month=month).order_by('start_datetime').first().start_datetime
            end_date = sessions.filter(start_datetime__month=month).order_by('-start_datetime').first().start_datetime

        else:
            # Both year and month are provided
            year = int(year)
            month = int(month)
            start_date = datetime(year, month, 1, tzinfo=SGT)
            if month == 12:
                end_date = datetime(year + 1, 1, 1, tzinfo=SGT) - timedelta(microseconds=1)
            else:
                end_date = datetime(year, month + 1, 1, tzinfo=SGT) - timedelta(microseconds=1)

        # Get the session data for the specified period
        # Get sessions aggregated by period
         # Iterate over each period and calculate form averages
         # Get sessions aggregated by period
        session_data = get_sessions_by_period(start_date, end_date, period)
        print("session data",session_data)
        result = {}
        for period_key, data in session_data.items():
            form_averages = self.get_form_averages(data['session_prof_ids'])
            result[period_key] = {
                **form_averages,
                'session_prof_ids': data['session_prof_ids'],
            }

        return result

class ScoreAggregationProfPercentageSerializer(serializers.Serializer):

    session_id = serializers.IntegerField()
    pss_percentage_change = serializers.SerializerMethodField()
    sms_percentage_change = serializers.SerializerMethodField()

    def get_pss_percentage_change(self, session_ids,count,pss_threshold=None):
        filtered_sessions = FormSession.objects.filter(SessionID__in=session_ids)

        
        # Get the new session count
        session_count = filtered_sessions.values('SessionID').distinct().count()

        # If there are no valid sessions, return 0 
        if session_count == 0:
           return {
            'session_count_pss': 0,
            'session_count_percent_pss': 0,
            'percentage_changes_pss': {}  # No sessions, so no percentage change
            }
        else: 
             # Step 1: Retrieve "before" and "after" score IDs for each session
            pss_scores = (
                filtered_sessions
                .filter(FormID=3)  # Only PSS form
                .values('SessionID')
                .annotate(before_score_id=Min('id'), after_score_id=Max('id'))  # First and last entry per session
                .values('SessionID', 'before_score_id', 'after_score_id')
            )

            print("pss_scores",pss_scores)

            # Step 2: Calculate percentage change for each session
            percentage_changes_pss = {}
            pss_filter_count = 0

            for session in pss_scores:
                before_score = float(filtered_sessions.get(id=session['before_score_id']).aggregatedScore)
                after_score = float(filtered_sessions.get(id=session['after_score_id']).aggregatedScore)
                session_id = session['SessionID']

                #extract session id as an int from the queryset
                session_obj = Session.objects.filter(id=session_id)
                session_id = session_obj.values_list('id', flat=True).first()
                # Calculate percentage change

                #Calculate the percentage change
                if before_score:  # Avoid division by zero
                    percentage_score = ((after_score - before_score) / before_score) * 100
                    
                else:
                    percentage_score = 0  # If before_score is zero, define change as 0%

                # Apply threshold filter only if threshold is provided
                if pss_threshold is None or percentage_score >= float(pss_threshold):
                    percentage_changes_pss[session_id] = percentage_score
                    pss_filter_count += 1

            session_count_percent_pss = pss_filter_count / count * 100
                
                

            return {
                'session_count_pss':pss_filter_count,
                'session_count_percent_pss': session_count_percent_pss,
                'session_count_percent_pss_no': 100-session_count_percent_pss,
                'percentage_changes_pss': percentage_changes_pss
            }
                 

    def get_sms_percentage_change(self, session_ids,count,sms_threshold=None):
        filtered_sessions = FormSession.objects.filter(SessionID__in=session_ids)

        
        # Get the new session count
        session_count = filtered_sessions.values('SessionID').distinct().count()

        # If there are no valid sessions, return 0 
        if session_count == 0:
           return {
            'session_count_sms': 0,
            'session_count_percent_sms': 0,
            'percentage_changes_sms': {}  # No sessions, so no percentage change
            }
        else: 
             # Step 1: Retrieve "before" and "after" score IDs for each session
            sms_scores = (
                filtered_sessions
                .filter(FormID=5)  # Only PSS form
                .values('SessionID')
                .annotate(before_score_id=Min('id'), after_score_id=Max('id'))  # First and last entry per session
                .values('SessionID', 'before_score_id', 'after_score_id')
            )

            print("sms_scores",sms_scores)

            # Step 2: Calculate percentage change for each session
            percentage_changes_sms= {}
            sms_filter_count = 0

            for session in sms_scores:
                before_score = float(filtered_sessions.get(id=session['before_score_id']).aggregatedScore)
                after_score = float(filtered_sessions.get(id=session['after_score_id']).aggregatedScore)
                session_id = session['SessionID']

                #extract session id as an int from the queryset
                session_obj = Session.objects.filter(id=session_id)
                session_id = session_obj.values_list('id', flat=True).first()
                #Calculate the percentage change
                if before_score:  # Avoid division by zero
                    percentage_score = ((after_score - before_score) / before_score) * 100
                else:
                    percentage_score = 0  # If before_score is zero, define change as 0%

                # Apply threshold filter only if threshold is provided
                if sms_threshold is None or percentage_score <= float(sms_threshold):
                    percentage_changes_sms[session_id] = percentage_score
                    sms_filter_count += 1
            
            session_count_percent_sms = sms_filter_count / count * 100


            return {
                'session_count_sms': sms_filter_count,
                'session_count_percent_sms': session_count_percent_sms,
                'session_count_percent_sms_no': 100-session_count_percent_sms,
                'percentage_changes_sms': percentage_changes_sms
            }
                 

    def to_representation(self, instance):
        request = self.context.get('request')
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        
        pss = request.query_params.get('pss')
        sms = request.query_params.get('sms')
       

        SGT = pytz.timezone('Asia/Singapore')
         # Get all sessions if year and month are not provided
        sessions = Session.objects.all()
        # Use the current year if no year is provided
        if not year and not month:
        # No year and no month provided, use the full date range of all sessions
            if sessions.exists():
                start_date = sessions.order_by('start_datetime').first().start_datetime
                end_date = sessions.order_by('-start_datetime').first().start_datetime
            else:
                # If no sessions are available, use the current date
                start_date = datetime.now(tz=SGT)
                end_date = datetime.now(tz=SGT)
                
        elif year and not month:
            # Only year provided, take all months in that year
            year = int(year)
            start_date = datetime(year, 1, 1, tzinfo=SGT)
            end_date = datetime(year + 1, 1, 1, tzinfo=SGT) - timedelta(microseconds=1)
            
        elif month and not year:
            # Only month provided, take the specified month across all years
            month = int(month)
            start_date = sessions.filter(start_datetime__month=month).order_by('start_datetime').first().start_datetime
            end_date = sessions.filter(start_datetime__month=month).order_by('-start_datetime').first().start_datetime

        else:
            # Both year and month are provided
            year = int(year)
            month = int(month)
            start_date = datetime(year, month, 1, tzinfo=SGT)
            if month == 12:
                end_date = datetime(year + 1, 1, 1, tzinfo=SGT) - timedelta(microseconds=1)
            else:
                end_date = datetime(year, month + 1, 1, tzinfo=SGT) - timedelta(microseconds=1)

        # Get the session data for the specified period
        # Get sessions aggregated by period
         # Iterate over each period and calculate form averages
         # Get sessions aggregated by period
        session_data = get_sessions(start_date, end_date)
        print("session_data",session_data)
        print("start_date",start_date)
        print("end_date",end_date)

        result = {}
        
        pss_percentage_scores = self.get_pss_percentage_change(session_data['session_prof_ids'],session_data['session_prof_count'],pss)
        sms_percentage_scores = self.get_sms_percentage_change(session_data['session_prof_ids'],session_data['session_prof_count'],sms)
        
        result = {
            **pss_percentage_scores,
            **sms_percentage_scores,
            'session_prof_ids': session_data['session_prof_ids'],
            'session_prof_count': session_data['session_prof_count']
            
        }

        return result
    


