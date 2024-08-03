from rest_framework import generics
from rest_framework.response import Response
from .models import Session
from .serializer import SessionSerializer, SessionUpdateSerializer

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
    
