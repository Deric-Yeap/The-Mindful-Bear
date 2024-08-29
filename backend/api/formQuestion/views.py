from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import FormQuestion
from api.question.models import Question
from .serializer import FormQuestionSerializer
from rest_framework.exceptions import ValidationError

class FormQuestionList(generics.ListAPIView):
    serializer_class = FormQuestionSerializer

    def get_queryset(self):
        queryset = FormQuestion.objects.all()
        session_id = self.request.query_params.get('session_id', None)
        question_id = self.request.query_params.get('question_id', None)

        if session_id is not None:
            queryset = queryset.filter(SessionID=session_id)
        if question_id is not None:
            queryset = queryset.filter(QuestionID=question_id)

        return queryset

class FormQuestionCreate(generics.CreateAPIView):
    queryset = FormQuestion.objects.all()
    serializer_class = FormQuestionSerializer

    def perform_create(self, serializer):
        session_id = self.request.data.get('session_id')
        question_id = self.request.data.get('question_id')

        if not session_id or not question_id:
            raise ValidationError({"error": "session_id and question_id are required."})

        try:
            question = Question.objects.get(pk=question_id)
        except Question.DoesNotExist:
            raise ValidationError({"error": "Question not found."})

        # Check if the associated form allows storing responses
        form = question.form_id  # Assuming the Question model has a ForeignKey to Form
        if not form.store_responses:
            raise ValidationError({"error": "Responses cannot be stored for this form."})

        # Save the FormQuestion instance
        serializer.save(question=question)


class FormQuestionUpdate(generics.UpdateAPIView):
    queryset = FormQuestion.objects.all()
    serializer_class = FormQuestionSerializer

    def put(self, request, *args, **kwargs):
        question_id = request.data.get('QuestionID')
        session_id = request.session.get('session_id')
        response_data = request.data.get('Response')

        try:
            form_question = FormQuestion.objects.get(QuestionID=question_id, SessionID=session_id)
        except FormQuestion.DoesNotExist:
            return Response({"detail": "FormQuestion not found."}, status=status.HTTP_404_NOT_FOUND)

        form_question.Response = response_data
        form_question.save()

        serializer = self.get_serializer(form_question)
        return Response(serializer.data, status=status.HTTP_200_OK)
