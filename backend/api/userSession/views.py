from rest_framework import generics, status
from rest_framework.response import Response
from .models import UserSession  
from .serializer import UserSessionSerializer, UserSessionSplitSerializer, UserSessionUpdateSerializer

class UserSessionCreate(generics.CreateAPIView):
    # Create a new session
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer

class UserSessionList(generics.ListCreateAPIView):
   
    # Get all sessions and create a new session
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer

class UserSessionDetail(generics.RetrieveAPIView):
   
    # Retrieve a session
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        try:
            session = self.get_object()
            serializer = self.get_serializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserSession.DoesNotExist:
            return Response({'detail': 'Landmark not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class UserSessionSplitView(generics.ListAPIView):
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSplitSerializer

    def get(self, request, *args, **kwargs):
        try:
            # Initialize the serializer with context including the request
            serializer = self.get_serializer(context={'request': request})

            # Get the serialized data
            data = serializer.to_representation(None)
            
            return Response(data, status=status.HTTP_200_OK)
        except UserSession.DoesNotExist:
            return Response({'detail': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    

class UpdateUserSessionDetail(generics.RetrieveUpdateAPIView):
   
    # Retrieve and update a session without modifying start_datetime
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserSessionUpdateSerializer
        return UserSessionSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        # Return the full session data using the main SessionSerializer
        return_serializer = UserSessionSerializer(instance)
        return Response(return_serializer.data)
    
