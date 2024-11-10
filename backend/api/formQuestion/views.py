from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import FormQuestion
from api.question.models import Question
from .serializer import FormQuestionSerializer
from rest_framework.exceptions import ValidationError
from .serializer import BulkFormQuestionSerializer
from api.session.models import Session

#added
from rest_framework.views import APIView
from django.db.models import Count
#added

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
        session_id = self.request.data.get('SessionID')
        question_id = self.request.data.get('QuestionID')

        if not session_id or not question_id:
            raise ValidationError({"error": "SessionID and QuestionID are required."})

        try:
            question = Question.objects.get(pk=question_id)
        except Question.DoesNotExist:
            raise ValidationError({"error": "Question not found."})

        form = question.formID  # Assuming the Question model has a ForeignKey to Form
        if not form.store_responses:
            raise ValidationError({"error": "Responses cannot be stored for this form."})

        # Save the FormQuestion instance, setting the QuestionID correctly
        serializer.save(QuestionID=question)


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
    
class BulkFormQuestionCreate(generics.CreateAPIView):
    serializer_class = BulkFormQuestionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

#rating of exercises and landmarks (newly added)
class ExerciseLandmarkRatingDistribution(APIView):
    def get(self, request):
        # Define question IDs related to exercises and landmarks
        rating_question_ids = [164, 165, 166, 167, 179, 180, 192, 193]  # Adjust as necessary

        # Fetch and aggregate rating counts for each question ID
        rating_counts = (
            FormQuestion.objects
            .filter(QuestionID__in=rating_question_ids, Response__in=['0', '1', '2', '3', '4'])
            .values('QuestionID', 'Response')
            .annotate(count=Count('Response'))
            .order_by('QuestionID', 'Response')
        )

        # Structure the response to show counts for each rating (1–5) by question ID
        data = {}
        for item in rating_counts:
            question_id = item['QuestionID']
            if question_id not in data:
                data[question_id] = {str(i): 0 for i in range(0, 5)}  # Initialize counts for ratings 0 - 4
            data[question_id][item['Response']] = item['count']

        return Response(data, status=status.HTTP_200_OK)
    
# newly added bar chart on likelihood of future use
class LikelihoodOfFutureUseDistribution(APIView):
    def get(self, request):
        question_id = 128  # "How likely are you to use this app again?"

        # Aggregate counts of each rating (1-5) for this question
        rating_counts = (
            FormQuestion.objects
            .filter(QuestionID=question_id, Response__in=['0', '1', '2', '3', '4'])
            .values('Response')
            .annotate(count=Count('Response'))
            .order_by('Response')
        )

        # Format the response data
        data = {str(i): 0 for i in range(0, 5)}  # Initialize counts for ratings 0 - 4
        for item in rating_counts:
            data[item['Response']] = item['count']

        return Response(data, status=status.HTTP_200_OK)

# newly added bar chart on overall experience rating
class OverallExperienceRatingDistribution(APIView):
    def get(self, request):
        question_id = 130  # "How would you rate your overall experience with us?"

        # Aggregate counts of each rating (1-5) for this question
        rating_counts = (
            FormQuestion.objects
            .filter(QuestionID=question_id, Response__in=['0', '1', '2', '3', '4'])
            .values('Response')
            .annotate(count=Count('Response'))
            .order_by('Response')
        )

        # Format the response data
        data = {str(i): 0 for i in range(0, 5)}  # Initialize counts for ratings 0 - 4
        for item in rating_counts:
            data[item['Response']] = item['count']

        return Response(data, status=status.HTTP_200_OK)
