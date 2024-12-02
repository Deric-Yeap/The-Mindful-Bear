from rest_framework import generics, status
from rest_framework.response import Response
from .models import FormSession
from .serializer import (
    ScoreAggregationProfSerializer, 
    ScoreAggregationProfPercentageSerializer,
    FormSessionSerializer
)


class FormSessionList(generics.ListCreateAPIView):
    """
    List and Create Form Sessions

    Retrieves a list of form sessions or allows the creation of a new session.
    """
    queryset = FormSession.objects.all()
    serializer_class = FormSessionSerializer


class FormSessionScoreView(generics.ListAPIView):
    """
    Aggregate Scores for Form Sessions

    Provides aggregated scores for form sessions using a custom serializer.
    """
    queryset = FormSession.objects.all()
    serializer_class = ScoreAggregationProfSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieve aggregated scores for form sessions.

        Returns the aggregated score data using the provided serializer.
        """
        try:
            serializer = self.get_serializer(context={'request': request})
            data = serializer.to_representation(None)
            return Response(data, status=status.HTTP_200_OK)
        except FormSession.DoesNotExist:
            return Response({'detail': 'FormSession not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FormSessionScorePercentageView(generics.ListAPIView):
    """
    Aggregate Score Percentages for Form Sessions

    Provides percentage-based score aggregation for form sessions using a custom serializer.
    """
    queryset = FormSession.objects.all()
    serializer_class = ScoreAggregationProfPercentageSerializer

    def get(self, request, *args, **kwargs):
        """
        Retrieve percentage-based aggregated scores for form sessions.

        Returns the percentage score data using the provided serializer.
        """
        try:
            serializer = self.get_serializer(context={'request': request})
            data = serializer.to_representation(None)
            return Response(data, status=status.HTTP_200_OK)
        except FormSession.DoesNotExist:
            return Response({'detail': 'FormSession not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
