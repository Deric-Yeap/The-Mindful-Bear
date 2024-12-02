from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import models
from .models import AchievementPoint
from .serializer import AchievementPointSerializer
from rest_framework.exceptions import ValidationError
from datetime import datetime, timedelta, timezone
from drf_yasg.utils import swagger_auto_schema

class AchievementPointViewSet(viewsets.ModelViewSet):
    serializer_class = AchievementPointSerializer
    queryset = AchievementPoint.objects.all()

    def create(self, request, *args, **kwargs):
        """
        Create Achievement Point

        Creates a new Achievement Point using the provided data. Returns validation errors if the request is invalid.
        """
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            error_message = e.detail[0] if isinstance(e.detail, list) else str(e.detail)
            return Response({"detail": error_message}, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request, *args, **kwargs):
        """
        List Achievement Points

        Retrieves a list of Achievement Points for the authenticated user, ordered by date in descending order.
        """
        user = request.user
        queryset = AchievementPoint.objects.filter(userId=user).order_by('-date')
        serializer = AchievementPointSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @swagger_auto_schema(
        operation_summary="Retrieve Achievement Point",
        operation_description="Fetches the details of a specific Achievement Point using its ID."
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update Achievement Point",
        operation_description="Updates all fields of the specified Achievement Point."
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Partial Update Achievement Point",
        operation_description="Updates some fields of the specified Achievement Point."
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete Achievement Point",
        operation_description="Deletes the specified Achievement Point."
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
class SumPointsView(APIView):
    """
    Total Achievement Points

    Returns the total points accumulated by the authenticated user.
    """
    def get(self, request):
        user = request.user
        total_points = AchievementPoint.objects.filter(userId=user).aggregate(total=models.Sum('points'))['total']
        if total_points is None:
            total_points = 0

        return Response({'total_points': total_points}, status=status.HTTP_200_OK)

class CheckLoginPointsView(APIView):
    """
    Check Login Points Collected

    Determines if the user has already collected login points for the current day, based on Singapore time.
    """
    def get(self, request):
        user = request.user
        
        now = datetime.now(timezone.utc)
        singapore_time = now + timedelta(hours=8)
        start_of_day = singapore_time.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = singapore_time.replace(hour=23, minute=59, second=59, microsecond=999999)
        start_of_day_utc = start_of_day - timedelta(hours=8)
        end_of_day_utc = end_of_day - timedelta(hours=8)

        login_points_today = AchievementPoint.objects.filter(
            userId=user,
            description__icontains="login",
            date__range=(start_of_day_utc, end_of_day_utc)
        ).exists()

        return Response({"collected_login": login_points_today}, status=status.HTTP_200_OK)
