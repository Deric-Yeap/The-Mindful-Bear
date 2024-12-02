from rest_framework import generics, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .models import Question, Form
from .serializer import QuestionSerializer, NewQuestionSerializer


# User Side
class FormGetQuestions(generics.ListAPIView):
    """
    Get Questions for Form

    Retrieves all questions associated with a specific form.
    """
    serializer_class = QuestionSerializer

    def get_queryset(self):
        """
        Filter questions by form ID.

        Extracts the form ID from the URL parameters.
        """
        form_id = self.kwargs.get('pk')
        return Question.objects.filter(formID=form_id)


# Admin Side
class GetQuestions(generics.ListAPIView):
    """
    Get All Questions

    Returns a list of all questions in the database.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class CreateQuestion(generics.CreateAPIView):
    """
    Create Question

    Adds a new question associated with a specific form.
    """
    serializer_class = QuestionSerializer

    def perform_create(self, serializer):
        """
        Validate form ID and save question.

        Ensures the form exists before associating the question.
        """
        form_id = self.request.data.get('FormID')
        if not Form.objects.filter(id=form_id).exists():
            raise ValidationError(f"Form with ID {form_id} does not exist.")
        serializer.save()


class UpdateQuestion(generics.UpdateAPIView):
    """
    Update Question

    Modifies details of a specific question.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = "QuestionID"


class DeleteQuestion(generics.DestroyAPIView):
    """
    Delete Question

    Removes a specific question from the database.
    """
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = "QuestionID"

