from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Journal
from .serializer import JournalGetSerializer, JournalUploadFileSerializer, JournalCreateSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Journal
from ..common.s3 import rsa_signer


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