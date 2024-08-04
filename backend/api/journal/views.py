from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Journal
from .serializer import JournalSerializer, JournalUploadFileSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Journal
from ..common.s3 import upload_fileobj, make_file_upload_path
from django.conf import settings


class JournalListView(APIView):
    def get(self, request):
        journals = Journal.objects.filter(user_id = request.user.user_id)
        serializer = JournalSerializer(journals, many=True)
        return Response(serializer.data)

    def post(self, request): #is it can create entry first then next time upload audio or together?
        serializer = JournalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class UploadFileView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = JournalUploadFileSerializer(data=request.data)
        if serializer.is_valid():
            file = request.FILES.get('audio_file')
            if file:
                file_name, object_path = make_file_upload_path(request.user, file.name)
                bucket = settings.AWS_STORAGE_BUCKET_NAME

                if upload_fileobj(file, bucket, object_path):
                    journal_entry = Journal.objects.create(
                        audio_file_path=object_path,
                        emotion_id=1, #change next time, hardcoded for now
                        user_id=request.user
                    )
                    return Response({'message': 'File uploaded successfully', 'journal_entry': JournalSerializer(journal_entry).data}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'error': 'File upload to S3 failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
