from rest_framework import generics
from .models import Question, Form
from .serializer import QuestionSerializer
from rest_framework.exceptions import ValidationError

# User Side
#This gets all questions for a particular form
class FormGetQuestions(generics.ListAPIView):
    serializer_class = QuestionSerializer

    def get_queryset(self):
        form_id = self.kwargs.get('pk')
        return Question.objects.filter(FormID=form_id)
    
# Admin Side
# Admin can create more questions
class CreateQuestion(generics.CreateAPIView):
    serializer_class = QuestionSerializer

    def perform_create(self, serializer):
        form_id = self.request.data.get('FormID')
        #checks if form exists in form table before assigning question to the form
        if not Form.objects.filter(id=form_id).exists():
            raise ValidationError(f"Form with ID {form_id} does not exist.")
        serializer.save()

# Admin can Edit questions
class UpdateQuestion(generics.UpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = "pk"

# Admin can Delete questions
class DeleteQuestion(generics.DestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = "pk"