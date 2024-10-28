# backend/api/journal/journal_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..common.topic_classifier import classify_text

class JournalClassificationView(APIView):
    def post(self, request):
        text = request.data.get("text", "")
        
        if not text:
            return Response({"error": "Text input is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Classify the input text
        predicted_labels = classify_text(text)

        # Return the predictions as a JSON response
        return Response({"predicted_labels": predicted_labels}, status=status.HTTP_200_OK)
