from rest_framework import serializers
from .models import FormSession
from ..session.models import Session
from ..formQuestion.models import FormQuestion
from django.conf import settings
from datetime import datetime, timedelta
from django.db.models import FloatField, Avg, F, Count, Q, Min, Max
from django.db.models.functions import Cast
import pytz
from pytz import UTC  # Make sure pytz is installed
from rest_framework import serializers

from django.utils.module_loading import import_string
# from api.session.serializer import SessionSerializer


def get_serialized_sessions(queryset):
    # Dynamically import SessionSerializer to avoid circular import
    SessionSerializer = import_string('api.session.serializer.SessionSerializer')
    return SessionSerializer(queryset, many=True).data


def get_sessions_by_period(start_date, end_date, period):
        

        SGT = pytz.timezone('Asia/Singapore')
        start_date_utc = start_date.astimezone(UTC)
        
        end_date_utc = end_date.astimezone(UTC)

        start_date_sgt = start_date.astimezone(SGT)
        end_date_sgt = end_date.astimezone(SGT)

       

        sessions = Session.objects.filter(
            start_datetime__gte=start_date_utc,
            start_datetime__lt=end_date_utc
        ).exclude(
            start_datetime=F('end_datetime')  # Exclude sessions where start and end times are the same
        )

        form_sessions = FormSession.objects.filter(SessionID__in=sessions)
        form_questions = FormQuestion.objects.filter(SessionID__in=sessions)
        
        # Group by SessionID and FormID, and count each group
        # Only keep SessionIDs where there are exactly 2 PSS and 2 SMS entries
        valid_sessions_professional = (
            form_sessions
            .filter(FormID__in=[3, 5])  # Filter only PSS and SMS forms
            .values('SessionID', 'FormID') 
            .annotate(count=Count('id'))
            .filter(count=2) # Ensure there are exactly 2 entries for each (SessionID, FormID) pair
            .values_list('SessionID', flat=True)
            .distinct()
        )

        valid_sessions_general = (
             form_questions
                .filter(QuestionID__in=[177, 178])  # Only questions 177 & 178
                .values('SessionID','QuestionID')
                .annotate(question_count=Count('id'))
                .filter(question_count=1)  # Ensure both questions 177 and 178 are completed
                .values_list('SessionID', flat=True)
                .distinct()
        )

        

         # Filter only valid sessions for averaging
        
        filtered_prof_sessions = sessions.filter(id__in=valid_sessions_professional)
        filtered_gen_sessions = sessions.filter(id__in=valid_sessions_general)
        


       
        
        session_dict = {}
        current_date = start_date_sgt.replace(hour=0, minute=0, second=0, microsecond=0)
        # Adjust the filter based on the period
        if period == 'daily':
            delta = timedelta(days=1)
            
        elif period == 'monthly':
            current_date = current_date.replace(day=1)  # Set to the first day of the month
        # No delta needed here since we'll calculate the next month on the fly
        elif period == 'yearly':
            current_date = current_date.replace(month=1, day=1)
        else:
            raise serializers.ValidationError("Invalid period specified.")
         # Loop through the date range by the specified period (daily, weekly, etc.)
        while current_date < end_date_sgt:
           
            if period == 'monthly':
                key = f"{current_date.year}-{current_date.month:02d}"  # Format as MMM-YY
                key = current_date.strftime("%b-%y").title()
                if current_date.month == 12:
                    next_date = datetime(current_date.year + 1, 1, 1, tzinfo=SGT)  # January next year
                else:
                    next_date = datetime(current_date.year, current_date.month + 1, 1, tzinfo=SGT)  # First day of next month
            elif period == 'yearly':
                key = f"{current_date.year}"
                next_date = datetime(current_date.year + 1, 1, 1, tzinfo=SGT)  # January next year
            else:
                next_date = current_date + delta
                key = f"{current_date.date()}"

            # Filter sessions for the current period
            print("current_date",current_date)
            
            period_prof_sessions = filtered_prof_sessions.filter(start_datetime__gte=current_date.astimezone(UTC), 
                                              start_datetime__lt=next_date.astimezone(UTC))
            period_gen_sessions = filtered_gen_sessions.filter(start_datetime__gte=current_date.astimezone(UTC), 
                                              start_datetime__lt=next_date.astimezone(UTC))
             
    
    #         # Filter sessions for the current period
            
            serialized_prof_sessions = get_serialized_sessions(period_prof_sessions)
            serialized_gen_sessions = get_serialized_sessions(period_gen_sessions)
            serialized_sessions = serialized_prof_sessions + serialized_gen_sessions
    # 
                        # Extract session IDs from the filtered period_sessions
            
            session_prof_ids = period_prof_sessions.values_list('id', flat=True)  # Extracting the session IDs
            session_gen_ids = period_gen_sessions.values_list('id', flat=True)
            session_ids =list(session_prof_ids) + list(session_gen_ids)
            session_count = len(session_ids)  # Counting the number of session IDs
            session_prof_count = session_prof_ids.count()
            session_gen_count = session_gen_ids.count()
            # Now filter FormSession based on these session IDs
            
            # Prepare the data for this period
            session_dict[key] = {
                'session_count': session_count,
                'session_ids': session_ids,  # return the session ids
                'session_prof_ids': session_prof_ids,  # return the session ids
                'session_prof_count': session_prof_count,
                'session_gen_ids': session_gen_ids,  # return the session ids
                'session_gen_count': session_gen_count,
                'sessions': serialized_sessions # Serialize the sessions

            }
            
            # Move to the next period
            current_date = next_date.astimezone(SGT)  # Ensure current_date is UTC

        return session_dict
