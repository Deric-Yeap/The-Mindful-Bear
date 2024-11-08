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

            # Set date range based on period
            end_date = datetime.now(tz=SGT)
            start_date = {
                'daily': end_date - timedelta(days=30),
                'monthly': end_date.replace(day=1) - timedelta(days=365),
                'yearly': end_date.replace(month=1, day=1) - timedelta(days=365 * 5)
            }.get(period, end_date - timedelta(days=30))  # Default to 30 days if period is invalid

            # Use get_sessions_by_period to get raw session data based on the period
            session_data = get_sessions_by_period(start_date, end_date, period)

            # Initialize SessionSplitSerializer with session data
            session_serializer = SessionSplitSerializer(data={'sessions': session_data})
            session_serializer.is_valid(raise_exception=True)

            # Get average_duration and average_daily_sessions from SessionSplitSerializer
            session_metrics = session_serializer.data  # This contains processed metrics

            # Extract calculated values
            average_duration = session_metrics.get('average_duration')
            average_daily_sessions = session_metrics.get('average_daily_sessions')

            # Now proceed with user classification based on calculated values
            active_thresholds = {"daily_sessions": 0.33, "average_duration": 3.93}
            active_users, inactive_users = self.classify_active_inactive_users(session_metrics, active_thresholds)

            # Prepare categorized scores
            result = {
                "stress_levels": {
                    view_type: self.get_score_categories(active_users, inactive_users, f"pss_{view_type}")
                },
                "mindfulness_levels": {
                    view_type: self.get_score_categories(active_users, inactive_users, f"sms_{view_type}")
                }
            }
            
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in FormSessionAggregatedView: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def classify_active_inactive_users(self, session_data, thresholds):
        """Classify sessions as active or inactive based on session metrics."""
        active_users = []
        inactive_users = []

        for date, data in session_data.items():
            avg_duration = data.get("average_duration", 0)
            daily_sessions = data.get("daily_sessions", 0)

            if daily_sessions >= thresholds["daily_sessions"] and avg_duration >= thresholds["average_duration"]:
                active_users.append(data)
            else:
                inactive_users.append(data)

        return active_users, inactive_users

    def get_score_categories(self, active_users, inactive_users, score_field):
        """
        Categorize scores into low, moderate, and high for both active and inactive users
        based on score type (PSS or SMS).
        """
        # Define thresholds based on PSS or SMS
        thresholds = {"low": 13, "high": 27} if "pss" in score_field else {"low": 28, "high": 56}
    
        def categorize(queryset, form_id):
            low = queryset.filter(FormID=form_id, aggregatedScore__lte=thresholds["low"]).count()
            high = queryset.filter(FormID=form_id, aggregatedScore__gte=thresholds["high"]).count()
            moderate = queryset.filter(FormID=form_id).count() - low - high
            return {"low": low, "moderate": moderate, "high": high}
        
        # Ensure session_ids are extracted as lists, not query objects
        active_session_ids = [session_id for data in active_users for session_id in data["session_ids"]]
        inactive_session_ids = [session_id for data in inactive_users for session_id in data["session_ids"]]
        
        # Get categorized scores for active users
        active_scores = FormSession.objects.filter(SessionID__in=active_session_ids)
        active_categories = categorize(active_scores, 3 if "pss" in score_field else 5)
        
        # Get categorized scores for inactive users
        inactive_scores = FormSession.objects.filter(SessionID__in=inactive_session_ids)
        inactive_categories = categorize(inactive_scores, 3 if "pss" in score_field else 5)

        return {
            "active": active_categories,
            "inactive": inactive_categories
        }