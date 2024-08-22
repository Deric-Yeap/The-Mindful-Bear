from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import FormQuestion
from api.question.models import Question
from .serializer import FormQuestionSerializer

class FormQuestionList(generics.ListAPIView):
    serializer_class = FormQuestionSerializer

    def get_queryset(self):
        queryset = FormQuestion.objects.all()
        session_id = self.request.query_params.get('session_id', None)
        question_id = self.request.query_params.get('question_id', None)

        # Filter queryset by session_id if provided
        if session_id is not None:
            queryset = queryset.filter(SessionID=session_id)
        # Filter queryset by question_id if provided
        if question_id is not None:
            queryset = queryset.filter(QuestionID=question_id)

        return queryset

class FormQuestionCreate(generics.CreateAPIView):
    queryset = FormQuestion.objects.all()
    serializer_class = FormQuestionSerializer

    def perform_create(self, serializer):
        question = Question.objects.get(pk=self.request.data['QuestionID'])
        # Check if store_responses is True for the given question
        if question.store_responses:
            serializer.save()
        else:
            raise ValueError("store_responses is False for the given question.")

class FormQuestionUpdate(generics.UpdateAPIView):
    queryset = FormQuestion.objects.all()
    serializer_class = FormQuestionSerializer

    def put(self, request, *args, **kwargs):
        question_id = request.data.get('QuestionID')
        session_id = request.session.get('session_id')
        response_data = request.data.get('Response')

        # Retrieve the FormQuestion object based on QuestionID and SessionID
        try:
            form_question = FormQuestion.objects.get(QuestionID=question_id, SessionID=session_id)
        except FormQuestion.DoesNotExist:
            return Response({"detail": "FormQuestion not found."}, status=status.HTTP_404_NOT_FOUND)

        # Update the response
        form_question.Response = response_data
        form_question.save()

        serializer = self.get_serializer(form_question)
        return Response(serializer.data, status=status.HTTP_200_OK)