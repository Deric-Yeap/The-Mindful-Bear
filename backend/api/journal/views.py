import json
import pandas as pd
from textblob import TextBlob
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Journal
from .serializer import JournalGetSerializer, JournalUploadFileSerializer, JournalCreateSerializer, JournalCalendarSerializer, JournalSummarySerializer, JournalEntriesByDateSerializer,JournalEntriesByPeriodSerializer, JournalUpdateSerializer
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Journal
from ..common.audio import transcribe
from rest_framework.exceptions import APIException
# analyzer/views.py
from django.http import JsonResponse
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from datetime import timedelta


# Download VADER lexicon if not already downloaded
nltk.download('vader_lexicon')

class JournalListView(APIView):
    def get(self, request):
        journals = Journal.objects.filter(user_id = request.user.user_id)
        serializer = JournalGetSerializer(journals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):  # Can create an entry first, then upload audio next time, or do both together
        serializer = JournalCreateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            journal_text = serializer.validated_data['journal_text']
            sentiment_result = self.analyze_sentiment(journal_text)  # Remove self as the first argument
            serializer.validated_data['sentiment_analysis_result'] = sentiment_result
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    

    def analyze_sentiment(self, text):
        sid = SentimentIntensityAnalyzer()
        polarity_scores = sid.polarity_scores(text)
        
        if polarity_scores['compound'] >= 0.05:
            return 'Positive'
        elif polarity_scores['compound'] <= -0.05:
            return 'Negative'
        else:
            return 'Neutral'
    
class UploadFileView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = JournalUploadFileSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try: 
                journal_entry = serializer.save()
                return Response({'message': 'File uploaded successfully', 'journal_entry': JournalGetSerializer(journal_entry).data}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'message': 'File upload failed', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class JournalCalendarView(APIView):
    def post(self, request):
        year = request.data.get('year')
        month = request.data.get('month')

        if not year or not month:
            return Response({'error': 'Both year and month are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            year = int(year)
            month = int(month)
        except ValueError:
            return Response({'error': 'Year and month must be valid integers.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = JournalCalendarSerializer(context={'request': request})
        weeks = serializer.get_weekly_matrix(year, month)
        
        serialized_weeks = [
            [JournalSummarySerializer(journal, context={'request': request}).data if journal else None for journal in week]
            for week in weeks
        ]
        
        return Response({'weeks': serialized_weeks}, status=status.HTTP_200_OK)
    
class CountYearJournalView(APIView):
    def get(self, request):
        year = request.query_params.get('year', datetime.now().year)
        try:
            year = int(year)
        except ValueError:
            return Response({'error': 'Invalid year format'}, status=status.HTTP_400_BAD_REQUEST)

        journals = Journal.objects.filter(user_id=request.user.user_id, upload_date__year=year)
        return Response({'count': journals.count()}, status=status.HTTP_200_OK)

from datetime import datetime
from django.db.models import Count as JournalCount
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from datetime import datetime
from django.db.models import Count as JournalCount
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class Count(APIView):
    def get(self, request):
        # Get parameters from the request
        sentiment = request.query_params.get('sentiment', None)
        period = request.query_params.get('period', 'daily')  # Default to daily

        # # Filter journals by user
        # journals = Journal.objects.filter(user_id=request.user.user_id)
    
        journals = Journal.objects.all()

        # Filter by sentiment if provided
        if sentiment:
            journals = journals.filter(sentiment_analysis_result=sentiment)

        # Prepare response data
        response_data = {}

        # Apply period filtering
        if period == 'daily':
            daily_counts = (
                journals.values('upload_date__date')  # Group by the date part of upload_date
                .annotate(count=JournalCount('id'))
                .order_by('upload_date__date')
            )
            response_data['daily_counts'] = list(daily_counts)

        elif period == 'monthly':
            monthly_counts = (
                journals.values('upload_date__month')  # Group by the month part of upload_date
                .annotate(count=JournalCount('id'))
                .order_by('upload_date__month')
            )
            response_data['monthly_counts'] = list(monthly_counts)

        elif period == 'yearly':
            yearly_counts = (
                journals.values('upload_date__year')  # Group by the year part of upload_date
                .annotate(count=JournalCount('id'))  # Count journal entries per year
                .order_by('upload_date__year')
            )
            response_data['yearly_counts'] = list(yearly_counts)  # Return list of year and count

        else:
            return Response({'error': 'Invalid period specified'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(response_data, status=status.HTTP_200_OK)


    
class SpeechToTextView(APIView):
    def post(self, request):
        if 'audio_file' not in request.FILES:
            return Response({'error': 'No audio file provided.'}, status=status.HTTP_400_BAD_REQUEST)
    
        audio_file = request.FILES['audio_file']
        
        try:
            transcription = transcribe(audio_file)
            return Response({'transcription': transcription}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class JournalEntriesByDateView(APIView):
    def get(self, request, *args, **kwargs):
        year = request.query_params.get('year')
        month = request.query_params.get('month')

        if not year or not month:
            return Response({"error": "Year and month are required parameters."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            year = int(year)
            month = int(month)
        except ValueError:
            return Response({"error": "Year and month must be integers."}, status=status.HTTP_400_BAD_REQUEST)

        serializer_context = {
            'request': request,
        }
        serializer = JournalEntriesByDateSerializer(data={}, context=serializer_context)
        if serializer.is_valid():
            data = serializer.get_journal_entries_by_date(year, month)
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class JournalEntriesByPeriodView(APIView):
    def get(self, request, *args, **kwargs):
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

       
        if not start_date_str or not end_date_str:
            return Response({"error": "Start date and end date are required parameters."}, status=status.HTTP_400_BAD_REQUEST)

        try:
          
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

            if start_date > end_date:
                return Response({"error": "Start date must be before or equal to end date."}, status=status.HTTP_400_BAD_REQUEST)

     
            serializer_context = {'request': request}  # Include context if needed
            serializer = JournalEntriesByPeriodSerializer(context=serializer_context)
            data = serializer.get_journal_entries_by_date_range(start_date, end_date)

            return Response(data, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
    
            print(f"Exception occurred: {str(e)}")
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class JournalStreakView(APIView):
    def get(self, request):
        journals = Journal.objects.filter(user_id=request.user.user_id).order_by('-upload_date')
        current_streak = 0
        last_date = None

        for journal in journals:
            print(journal.upload_date, "user_id", journal.user_id.user_id)
            if last_date is None:
                last_date = journal.upload_date
                current_streak = 1  
            else:
                if (last_date.date() - journal.upload_date.date()).days == 1:
                    current_streak += 1 
                elif (last_date.date() - journal.upload_date.date()).days > 1:
                    break  
                last_date = journal.upload_date  
        return Response({'streak': current_streak}, status=status.HTTP_200_OK)
            
        
class JournalEntryViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk=None):
        journal = get_object_or_404(Journal, pk=pk)
        serializer = JournalGetSerializer(journal)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def update(self, request, pk=None):
        journal = get_object_or_404(Journal, pk=pk)
        serializer = JournalUpdateSerializer(journal, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        journal = get_object_or_404(Journal, pk=pk)
        journal.delete()
        return Response({'message': 'Journal entry deleted successfully.'}, status=status.HTTP_200_OK)
