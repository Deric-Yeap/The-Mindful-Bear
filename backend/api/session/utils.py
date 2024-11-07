# utils.py
from datetime import timedelta
from django.db.models import Count 

def calculate_session_metrics(sessions, form_sessions, daily_threshold, duration_threshold):
    LOW_THRESHOLD = 28
    HIGH_THRESHOLD = 56
    
    result = {
        "active": {"low": 0, "moderate": 0, "high": 0},
        "inactive": {"low": 0, "moderate": 0, "high": 0}
    }

    valid_sessions = (
        form_sessions
        .values('SessionID', 'FormID')
        .annotate(count=Count('id'))
        .filter(count=2)
        .values_list('SessionID', flat=True)
        .distinct()
    )

    for session_id in valid_sessions:
        sms_scores = form_sessions.filter(SessionID=session_id, FormID=3).values_list('aggregatedScore', flat=True)
        if len(sms_scores) == 2:
            avg_sms_score = sum(int(score) for score in sms_scores) / 2

            mindfulness_level = (
                "low" if avg_sms_score <= LOW_THRESHOLD else
                "moderate" if avg_sms_score <= HIGH_THRESHOLD else
                "high"
            )

            session = sessions.get(id=session_id)
            total_sessions = sessions.filter(start_datetime__date=session.start_datetime.date()).count()
            days_active = (session.end_datetime - session.start_datetime).days + 1
            avg_daily_sessions = total_sessions / days_active if days_active > 0 else 0

            total_duration = (session.end_datetime - session.start_datetime).total_seconds() / 60
            avg_duration = total_duration / total_sessions if total_sessions > 0 else 0

            status = "active" if avg_daily_sessions >= daily_threshold and avg_duration >= duration_threshold else "inactive"
            result[status][mindfulness_level] += 1

    return result
