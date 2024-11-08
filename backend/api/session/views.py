from rest_framework import generics, status
from rest_framework.response import Response
from .models import Session
from .serializer import SessionSerializer, SessionUpdateSerializer, SessionSplitSerializer
from rest_framework.views import APIView
from api.formSession.utils import get_sessions_by_period

from datetime import datetime, timedelta
import pytz


class SessionCreate(generics.CreateAPIView):
    # Create a new session
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class SessionList(generics.ListCreateAPIView):
   
    # Get all sessions and create a new session
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class SessionDetail(generics.RetrieveAPIView):
   
    # Retrieve a session
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        try:
            session = self.get_object()
            serializer = self.get_serializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Session.DoesNotExist:
            return Response({'detail': 'Landmark not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# class SessionByDate(generics.ListAPIView):
#     queryset = Session.objects.all()

#     serializer_class = SessionByDateSerializer


#     def get(self, request, *args, **kwargs):
#         try:
#             serializer = self.get_serializer(context={'request': request})
#             data = serializer.to_representation(None)
#             print("data",data)
#             return Response(data, status=status.HTTP_200_OK)
#         except Session.DoesNotExist:
#             return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        


class SessionSplitView(generics.ListAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSplitSerializer

    def get(self, request, *args, **kwargs):
        try:
            # Initialize the serializer with context including the request
            serializer = self.get_serializer(context={'request': request})

            # Get the serialized data
            data = serializer.to_representation(None)
            
            return Response(data, status=status.HTTP_200_OK)
        except Session.DoesNotExist:
            return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateSessionDetail(generics.RetrieveUpdateAPIView):
   
    # Retrieve and update a session without modifying start_datetime
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return SessionUpdateSerializer
        return SessionSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        # Return the full session data using the main SessionSerializer
        return_serializer = SessionSerializer(instance)
        return Response(return_serializer.data)
    
    
SGT = pytz.timezone('Asia/Singapore')
class SessionAggregatedMetricsView(APIView):
    """
    A view to provide aggregated metrics for sessions, including average duration and daily count,
    categorized by active and inactive users with filtering options for daily, monthly, and yearly intervals.
    """
    
    def get(self, request, *args, **kwargs):
        try:
            # Retrieve query parameters for period (daily, monthly, yearly)
            period = request.query_params.get('period', 'daily')
            
            # Define date range for filtering based on the period
            end_date = datetime.now(tz=SGT)
            if period == 'daily':
                start_date = end_date - timedelta(days=30)
            elif period == 'monthly':
                start_date = end_date.replace(day=1) - timedelta(days=365)
            elif period == 'yearly':
                start_date = end_date.replace(month=1, day=1) - timedelta(days=365*5)  # last 5 years
            else:
                return Response({"detail": "Invalid period specified."}, status=status.HTTP_400_BAD_REQUEST)

            # Get sessions filtered by the specified period
            session_data = get_sessions_by_period(start_date, end_date, period)

            # Separate active and inactive users based on thresholds
            active_thresholds = {
                "daily_sessions": 0.33,
                "average_duration": 3.93
            }
            active_users, inactive_users = self.classify_active_inactive_users(session_data, active_thresholds)

            # Calculate average duration and daily session count for each category
            result = {
                "metrics": {
                    "active": self.calculate_metrics(active_users),
                    "inactive": self.calculate_metrics(inactive_users)
                }
            }

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def classify_active_inactive_users(self, session_data, thresholds):
        active_users = []
        inactive_users = []

        for date, data in session_data.items():
            avg_duration = data.get("average_duration", 0)
            daily_sessions = data.get("daily_sessions", 0)

            session_info = {
                "session_ids": data["session_ids"],
                "average_duration": avg_duration,
                "daily_sessions": daily_sessions
            }

            if daily_sessions >= thresholds["daily_sessions"] and avg_duration >= thresholds["average_duration"]:
                active_users.append(session_info)
            else:
                inactive_users.append(session_info)
        
        return active_users, inactive_users

    def calculate_metrics(self, sessions):
        """Calculate average duration and daily session count for a list of sessions."""
        total_duration = sum(session["average_duration"] for session in sessions)
        total_sessions = sum(session["daily_sessions"] for session in sessions)
        session_count = len(sessions)

        average_duration = total_duration / session_count if session_count > 0 else 0
        average_daily_sessions = total_sessions / session_count if session_count > 0 else 0

        return {
            "average_duration": average_duration,
            "average_daily_sessions": average_daily_sessions,
            "session_count": session_count
        }
    
