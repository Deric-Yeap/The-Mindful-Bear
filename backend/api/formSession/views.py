from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import FormSession
from .serializer import ScoreAggregationSerializer, FormSessionSerializer
from api.session.serializer import SessionSplitSerializer
from .utils import get_sessions_by_period
from api.session.models import Session
from datetime import datetime, timedelta
import pytz
import logging

logger = logging.getLogger(__name__)
SGT = pytz.timezone('Asia/Singapore')

class FormSessionList(generics.ListAPIView):
    queryset = FormSession.objects.all()
    serializer_class = FormSessionSerializer

class FormSessionScoreView(generics.ListAPIView):
    queryset = FormSession.objects.all()
    serializer_class = ScoreAggregationSerializer

class FormSessionAggregatedView(APIView):
    """
    A view to provide aggregated PSS and SMS scores categorized by active and inactive users
    with filtering options for daily, monthly, and yearly intervals.
    """
    
    def get(self, request, *args, **kwargs):
        try:
            # Get period and view_type parameters
            period = request.query_params.get('period', 'daily')
            view_type = request.query_params.get('view', 'before')  # Options: "before" or "after"
            print(f"Period: {period}, View Type: {view_type}")

            # Set date range based on period
            end_date = datetime.now(tz=SGT)
            start_date = {
                'daily': end_date - timedelta(days=30),
                'monthly': end_date.replace(day=1) - timedelta(days=365),
                'yearly': end_date.replace(month=1, day=1) - timedelta(days=365 * 5)
            }.get(period, end_date - timedelta(days=30))  # Default to 30 days if period is invalid
            print(f"Start Date: {start_date}, End Date: {end_date}")

            # Use get_sessions_by_period to get session data
            session_data = get_sessions_by_period(start_date, end_date, period)
            print(f"Session Data: {session_data}")

            # Flatten session IDs for compatibility with the serializer
            session_ids = [session_id for date, data in session_data.items() for session_id in data["session_ids"]]
            print(f"Session IDs: {session_ids}")
            
            sessions = Session.objects.filter(id__in=session_ids)
            print(f"Sessions Retrieved: {sessions.count()}")

            # Initialize SessionSplitSerializer with flattened session data
            session_serializer = SessionSplitSerializer(sessions, many=True)
            session_metrics = session_serializer.data  # This now holds the list of session data with calculated fields
            print(f"Session Metrics: {session_metrics}")

            # Calculate overall average_duration and average_daily_sessions from session_metrics
            total_duration = sum(item['average_duration'] for item in session_metrics)
            total_daily_sessions = sum(item['average_daily_sessions'] for item in session_metrics)
            average_duration = total_duration / len(session_metrics) if session_metrics else 0
            average_daily_sessions = total_daily_sessions / len(session_metrics) if session_metrics else 0
            print(f"Average Duration: {average_duration}, Average Daily Sessions: {average_daily_sessions}")

            # Classify users based on thresholds
            active_thresholds = {"daily_sessions": 0.33, "average_duration": 3.93}
            active_users, inactive_users = self.classify_active_inactive_users(session_metrics, active_thresholds)
            print(f"Active Users: {len(active_users)}, Inactive Users: {len(inactive_users)}")

            # Prepare categorized scores for active/inactive users
            result = {
                "stress_levels": {
                    view_type: self.get_score_categories(active_users, inactive_users, f"pss_{view_type}")
                },
                "mindfulness_levels": {
                    view_type: self.get_score_categories(active_users, inactive_users, f"sms_{view_type}")
                }
            }
            print(f"Result: {result}")
            
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in FormSessionAggregatedView: {str(e)}")
            print(f"Exception: {str(e)}")  # Print the error for debugging
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def classify_active_inactive_users(self, session_data, thresholds):
    """Classify sessions as active or inactive based on session metrics."""
    active_users = []
    inactive_users = []

    print(f"Classifying users with thresholds: {thresholds}")
    for index, data in enumerate(session_data):
        print(f"Session {index + 1}: {data}")
        avg_duration = data.get("average_duration", 0)
        daily_sessions = data.get("average_daily_sessions", 0)
        print(f"Avg Duration: {avg_duration}, Daily Sessions: {daily_sessions}")

        if daily_sessions >= thresholds["daily_sessions"] and avg_duration >= thresholds["average_duration"]:
            active_users.append(data)
            print(f"Classified as Active")
        else:
            inactive_users.append(data)
            print(f"Classified as Inactive")

    print(f"Total Active Users: {len(active_users)}, Total Inactive Users: {len(inactive_users)}")
    return active_users, inactive_users

def get_score_categories(self, active_users, inactive_users, score_field):
    """
    Categorize scores into low, moderate, and high for both active and inactive users
    based on score type (PSS or SMS).
    """
    thresholds = {"low": 13, "high": 27} if "pss" in score_field else {"low": 28, "high": 56}
    print(f"Scoring thresholds for {score_field}: {thresholds}")
    
    def categorize(queryset, form_id):
        print(f"Categorizing for FormID {form_id}")
        low = queryset.filter(FormID=form_id, aggregatedScore__lte=thresholds["low"]).count()
        high = queryset.filter(FormID=form_id, aggregatedScore__gte=thresholds["high"]).count()
        moderate = queryset.filter(FormID=form_id).count() - low - high
        print(f"Low: {low}, Moderate: {moderate}, High: {high}")
        return {"low": low, "moderate": moderate, "high": high}
    
    active_session_ids = [session_id for data in active_users for session_id in data["session_ids"]]
    inactive_session_ids = [session_id for data in inactive_users for session_id in data["session_ids"]]
    print(f"Active Session IDs: {active_session_ids}")
    print(f"Inactive Session IDs: {inactive_session_ids}")
    
    active_scores = FormSession.objects.filter(SessionID__in=active_session_ids)
    active_categories = categorize(active_scores, 3 if "pss" in score_field else 5)
    
    inactive_scores = FormSession.objects.filter(SessionID__in=inactive_session_ids)
    inactive_categories = categorize(inactive_scores, 3 if "pss" in score_field else 5)

    print(f"Active Categories: {active_categories}")
    print(f"Inactive Categories: {inactive_categories}")

    return {
        "active": active_categories,
        "inactive": inactive_categories
    }