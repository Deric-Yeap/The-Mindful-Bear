from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Journal
from .serializer import JournalGetSerializer, JournalUploadFileSerializer, JournalCreateSerializer, JournalCalendarSerializer, JournalSummarySerializer, JournalEntriesByDateSerializer,JournalEntriesByPeriodSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Journal
from ..common.audio import transcribe
from rest_framework.exceptions import APIException


class JournalListView(APIView):
    def get(self, request):
        journals = Journal.objects.filter(user_id = request.user.user_id)
        serializer = JournalGetSerializer(journals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request): #is it can create entry first then next time upload audio or together?
        serializer = JournalCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
        try:
            start_date_str = request.query_params.get('start_date')
            end_date_str = request.query_params.get('end_date')

            if not start_date_str or not end_date_str:
                return Response({"error": "Start date and end date are required parameters."}, status=status.HTTP_400_BAD_REQUEST)

            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

            if start_date > end_date:
                return Response({"error": "Start date must be before or equal to end date."}, status=status.HTTP_400_BAD_REQUEST)

            # Call your serializer method here
            serializer = JournalEntriesByPeriodSerializer()
            data = serializer.get_journal_entries_by_date_range(start_date, end_date)
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class JournalEntryByIdView(APIView):
    def get(self, request, id):
        try:
            journal = Journal.objects.get(id=id)
        except Journal.DoesNotExist:
            return Response({'error': 'Journal entry not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = JournalGetSerializer(journal)
        return Response(serializer.data, status=status.HTTP_200_OK)
