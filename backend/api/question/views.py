from rest_framework import generics
from .models import Question, Form
from .serializer import QuestionSerializer, NewQuestionSerializer
from rest_framework.exceptions import ValidationError
from rest_framework import viewsets, status
from rest_framework.response import Response

# User Side
#This gets all questions for a particular form
class FormGetQuestions(generics.ListAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        form_id = self.kwargs.get('pk')
        return Question.objects.filter(formID=form_id)
    
# Admin Side
# Admin can create more questions
class GetQuestions(generics.ListAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    
class CreateQuestion(generics.CreateAPIView):
    serializer_class = QuestionSerializer

    def perform_create(self, serializer):
        form_id = self.request.data.get('FormID')
        #checks if form exists in form table before assigning question to the form
        if not Form.objects.filter(id=form_id).exists():
            raise ValidationError(f"Form with ID {form_id} does not exist.")
        serializer.save()

# Admin can Edit and Delete questions
class UpdateQuestion(generics.UpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = "QuestionID"  # Change to the primary key field in your model

class DeleteQuestion(generics.DestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = "QuestionID"  # Change to the primary key field in your model

# if above not using can delete?

# newcode
class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = NewQuestionSerializer
    queryset= Question.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_200_OK)
