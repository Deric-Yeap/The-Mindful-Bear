from rest_framework import generics, status
from rest_framework.response import Response
from .models import FormSession
from .serializer import ScoreAggregationSerializer, FormSessionSerializer

class FormSessionList(generics.ListCreateAPIView):
    # Create a new session
    queryset = FormSession.objects.all()
    serializer_class = FormSessionSerializer

class FormSessionScoreView(generics.ListAPIView):
    queryset = FormSession.objects.all()
    serializer_class = ScoreAggregationSerializer

    def get(self, request, *args, **kwargs):
        try:
            # Initialize the serializer with context including the request
            serializer = self.get_serializer(context={'request': request})

            # Get the serialized data
            data = serializer.to_representation(None)
            
            return Response(data, status=status.HTTP_200_OK)
        except FormSession.DoesNotExist:
            return Response({'detail': 'FormSession not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
