from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import FormQuestion
from api.question.models import Question
from .serializer import FormQuestionSerializer, ScoreAggregationGenSerializer
from rest_framework.exceptions import ValidationError
from .serializer import BulkFormQuestionSerializer
from api.session.models import Session

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
    
# class ExerciseLandmarkRatingDistribution(APIView):
    

class FormQuestionScoreGenView(generics.ListAPIView):
    # def get(self, request):
    #     # Define question IDs related to exercises and landmarks
    #     question_ids = [177,178]  # Adjust as necessary

    #     # Fetch and aggregate rating counts for each question ID
    #     rating_counts = (
    #         FormQuestion.objects
    #         .filter(QuestionID__in=question_ids, Response__in=['yes','no'])
    #         .values('QuestionID', 'Response')
    #         .annotate(count=Count('Response'))
    #         .order_by('QuestionID', 'Response')
    #     )

    #     # Structure the response to show counts for each rating (1–5) by question ID
    #     data = {}
    #     for item in rating_counts:
    #         question_id = item['QuestionID']
    #         if question_id not in data:
    #             data[question_id] = {str(i): 0 for i in range(0, 5)}  # Initialize counts for ratings 0 - 4
    #         data[question_id][item['Response']] = item['count']

    #     return Response(data, status=status.HTTP_200_OK)
    queryset = FormQuestion.objects.all()
    serializer_class = ScoreAggregationGenSerializer

    def get(self, request, *args, **kwargs):
        try:
            # Initialize the serializer with context including the request
            serializer = self.get_serializer(context={'request': request})

            # Get the serialized data
            data = serializer.to_representation(None)
            
            return Response(data, status=status.HTTP_200_OK)
        except FormQuestion.DoesNotExist:
            return Response({'detail': 'FormSession not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
