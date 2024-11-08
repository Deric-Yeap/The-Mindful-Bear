from rest_framework import serializers
from .models import FormSession
from api.session.models import Session
from django.conf import settings
from datetime import datetime, timedelta
from django.db.models import FloatField, Avg, F, Count, Q, Min, Max
from django.db.models.functions import Cast
import pytz
from pytz import UTC  # Make sure pytz is installed
from rest_framework import serializers
from api.session.serializer import SessionSplitSerializer

from django.utils.module_loading import import_string
# from api.session.serializer import SessionSerializer


#def get_serialized_sessions(queryset):
    # Dynamically import SessionSerializer to avoid circular import
    #SessionSerializer = import_string('api.session.serializer.SessionSerializer')
    #serialized_data = SessionSerializer(queryset, many=True).data
    #print(f"Serialized Sessions: {serialized_data}")
    #return serialized_data
    
SGT = pytz.timezone('Asia/Singapore')

def convert_to_sgt(dt):
    """Converts a datetime object to Singapore timezone."""
    if dt:
        return dt.astimezone(SGT).strftime('%Y-%m-%d %H:%M:%S')
    return None

def categorize_score(score, low_threshold, high_threshold):
    """Helper function to categorize a score into low, moderate, or high."""
    if score is None:
        print("Score is None")
        return None
    elif score <= low_threshold:
        print(f"Score {score} categorized as low")
        return "low"
    elif score > high_threshold:
        print(f"Score {score} categorized as high")
        return "high"
    else:
        print(f"Score {score} categorized as moderate")
        return "moderate"

def categorize_scores_by_level(session_ids, view_type="before"):
    LOW_PSS, HIGH_PSS = 13, 27
    LOW_SMS, HIGH_SMS = 28, 57

    thresholds = {
        "pss": (LOW_PSS, HIGH_PSS),
        "sms": (LOW_SMS, HIGH_SMS)
    }
    print(f"Categorizing scores for view_type {view_type} with thresholds: {thresholds}")

    sessions = Session.objects.filter(id__in=session_ids)
    print(f"Sessions Retrieved for Categorization: {sessions.count()}")

    categorized_data = {
        "pss": {"low": 0, "moderate": 0, "high": 0},
        "sms": {"low": 0, "moderate": 0, "high": 0}
    }

    for session in sessions:
        pss_score = getattr(session, f"pss_{view_type}", None)
        sms_score = getattr(session, f"sms_{view_type}", None)
        print(f"Session ID: {session.id}, PSS Score: {pss_score}, SMS Score: {sms_score}")

        if pss_score is not None:
            if pss_score <= thresholds["pss"][0]:
                categorized_data["pss"]["low"] += 1
            elif pss_score >= thresholds["pss"][1]:
                categorized_data["pss"]["high"] += 1
            else:
                categorized_data["pss"]["moderate"] += 1

        if sms_score is not None:
            if sms_score <= thresholds["sms"][0]:
                categorized_data["sms"]["low"] += 1
            elif sms_score >= thresholds["sms"][1]:
                categorized_data["sms"]["high"] += 1
            else:
                categorized_data["sms"]["moderate"] += 1

    print(f"Categorized Data: {categorized_data}")
    return categorized_data

def get_sessions_by_period(start_date, end_date, period):
    SGT = pytz.timezone('Asia/Singapore')
    start_date_utc = start_date.astimezone(UTC)
    end_date_utc = end_date.astimezone(UTC)
    print(f"Fetching sessions between {start_date_utc} and {end_date_utc} for period {period}")

    sessions = Session.objects.filter(
        start_datetime__gte=start_date_utc,
        start_datetime__lt=end_date_utc
    ).exclude(
        start_datetime=F('end_datetime')
    )
    print(f"Sessions Retrieved: {sessions.count()}")

    form_sessions = FormSession.objects.filter(SessionID__in=sessions)
    print(f"Form Sessions Retrieved: {form_sessions.count()}")

    valid_sessions = (
        form_sessions
        .filter(FormID__in=[3, 5])
        .values('SessionID', 'FormID')
        .annotate(count=Count('id'))
        .filter(count=2)
        .values_list('SessionID', flat=True)
        .distinct()
    )
    print(f"Valid Sessions IDs: {list(valid_sessions)}")

    filtered_sessions = sessions.filter(id__in=valid_sessions)
    session_dict = {}
    current_date = start_date.astimezone(SGT).replace(hour=0, minute=0, second=0, microsecond=0)
    print(f"Start Date (SGT): {current_date}")

    if period == 'daily':
        delta = timedelta(days=1)
    elif period == 'monthly':
        current_date = current_date.replace(day=1)
        delta = None
    elif period == 'yearly':
        current_date = current_date.replace(month=1, day=1)
        delta = None
    else:
        raise serializers.ValidationError("Invalid period specified.")

    while current_date < end_date.astimezone(SGT):
        print(f"Processing date range starting at {current_date}")

        if period == 'monthly':
            key = current_date.strftime("%b-%y")
            next_date = (datetime(current_date.year, current_date.month % 12 + 1, 1, tzinfo=SGT)
                         if current_date.month < 12 else datetime(current_date.year + 1, 1, 1, tzinfo=SGT))
        elif period == 'yearly':
            key = f"{current_date.year}"
            next_date = datetime(current_date.year + 1, 1, 1, tzinfo=SGT)
        else:
            next_date = current_date + delta
            key = f"{current_date.date()}"

        period_sessions = filtered_sessions.filter(
            start_datetime__gte=current_date.astimezone(UTC),
            start_datetime__lt=next_date.astimezone(UTC)
        )
        print(f"Sessions for period {key}: {period_sessions.count()}")

        session_serializer = SessionSplitSerializer()
        session_metrics = session_serializer.get_average_duration({'sessions': get_serialized_sessions(period_sessions), 'session_count': period_sessions.count()})
        print(f"Session Metrics: {session_metrics}")

        session_ids = period_sessions.values_list('id', flat=True)
        categorized_scores = categorize_scores_by_level(session_ids)
        print(f"Categorized Scores: {categorized_scores}")

        session_dict[key] = {
            'session_count': period_sessions.count(),
            'session_ids': list(session_ids),
            'categorized_scores': categorized_scores,
            'average_duration': session_metrics.get('average_duration', 0),
            'daily_sessions': session_metrics.get('average_daily_sessions', 0)
        }

        current_date = next_date.astimezone(SGT)

    print(f"Final Session Dictionary: {session_dict}")
    return session_dict