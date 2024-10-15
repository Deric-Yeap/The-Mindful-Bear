from rest_framework import generics, status
from rest_framework.response import Response
from .models import Session
from .serializer import SessionSerializer, SessionUpdateSerializer, SessionSplitSerializer

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
    
