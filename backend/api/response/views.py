from django.shortcuts import render
from rest_framework import generics
from .models import Response, Question
from .serializer import ResponseSerializer
from rest_framework.exceptions import ValidationError

#Note: No need read responses as it would be done by analytics side.

# TODO: Double check on this table, need to store some kind of session id to it? 
   
# add user response only if store_response is true
class AddResponse(generics.CreateAPIView):
    serializer_class = ResponseSerializer

    def perform_create(self, serializer):
        question_id = self.request.data.get('QuestionID')
        
        # Check if the question exists
        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            raise ValidationError(f"Question with ID {question_id} does not exist.")
        
        # Check if the associated form's store_responses is True
        if not question.FormID.store_responses:
            raise ValidationError(f"Form associated with Question ID {question_id} does not need to be stored in database")
        
        serializer.save()
