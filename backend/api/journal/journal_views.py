# backend/api/journal/journal_views.py
# called by journal/urls.py

# When a user in the app submits a journal entry, it sends a POST request to this endpoint, 
# with the text of the journal entry included in the request body.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..common.topic_classifier import classify_text

class JournalClassificationView(APIView):
    def post(self, request):
        #Example of Front-End Data: When the user submits, request.data.get("text") contains the journal entry 
        # they typed in the app.
        text = request.data.get("text", "") 
        
        if not text:
            return Response({"error": "Text input is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Classify the input text
        predicted_labels = classify_text(text)

        # Return the predictions as a JSON response
        return Response({"predicted_labels": predicted_labels}, status=status.HTTP_200_OK)
