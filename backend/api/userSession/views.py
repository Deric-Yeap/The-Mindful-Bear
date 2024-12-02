from rest_framework import generics, status
from rest_framework.response import Response
from .models import UserSession  
from .serializer import UserSessionSerializer, UserSessionLandmarkSplitSerializer, UserSessionExerciseSplitSerializer, UserSessionUpdateSerializer


class UserSessionCreate(generics.CreateAPIView):
    """
    Create User Session

    Adds a new user session.
    """
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer

    def perform_create(self, serializer):
        """
        Create User Session

        Associates the session with the logged-in user.
        """
        serializer.save(user=self.request.user)


class UserSessionList(generics.ListAPIView):
    """
    List User Sessions

    Retrieves all user sessions.
    """
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer


class UserSessionDetail(generics.RetrieveAPIView):
    """
    Retrieve User Session

    Fetches details of a specific user session by ID.
    """
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        """
        Retrieve User Session

        Returns the details of a specific user session.
        """
        try:
            session = self.get_object()
            serializer = self.get_serializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserSession.DoesNotExist:
            return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserSessionLandmarkSplitView(generics.ListAPIView):
    """
    List Session Landmark Split

    Retrieves data split by landmarks for user sessions.
    """
    queryset = UserSession.objects.all()
    serializer_class = UserSessionLandmarkSplitSerializer

    def get(self, request, *args, **kwargs):
        """
        List Session Landmark Split

        Returns serialized session data split by landmarks.
        """
        try:
            serializer = self.get_serializer(context={'request': request})
            data = serializer.to_representation(None)
            return Response(data, status=status.HTTP_200_OK)
        except UserSession.DoesNotExist:
            return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserSessionExerciseSplitView(generics.ListAPIView):
    """
    List Session Exercise Split

    Retrieves data split by exercises for user sessions.
    """
    queryset = UserSession.objects.all()
    serializer_class = UserSessionExerciseSplitSerializer

    def get(self, request, *args, **kwargs):
        """
        List Session Exercise Split

        Returns serialized session data split by exercises.
        """
        try:
            serializer = self.get_serializer(context={'request': request})
            data = serializer.to_representation(None)
            return Response(data, status=status.HTTP_200_OK)
        except UserSession.DoesNotExist:
            return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserSessionDetail(generics.UpdateAPIView):
    """
    Update User Session

    Retrieves and updates session details without modifying the start_datetime.
    """
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer

    def get_serializer_class(self):
        """
        Get Serializer Class

        Uses a different serializer for updates.
        """
        if self.request.method in ['PUT', 'PATCH']:
            return UserSessionUpdateSerializer
        return UserSessionSerializer

    def update(self, request, *args, **kwargs):
        """
        Update User Session

        Updates the session details and returns the full session data.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return_serializer = UserSessionSerializer(instance)
        return Response(return_serializer.data)
