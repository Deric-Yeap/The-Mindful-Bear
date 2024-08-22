from rest_framework import generics, status
from rest_framework.response import Response
from .models import FormQuestion
from .serializer import FormQuestionSerializer

# Get responses of a certain user based on a specific form with form_name='feedback'
# TODO: need to wait for User Session Table
# class UserFeedback(generics.ListAPIView):
#     serializer_class = FormQuestionSerializer

#     def get_queryset(self):
#         user_id = self.kwargs['user_id']
#         return FormQuestion.objects.filter(
#             SessionID__user_id=user_id,
#             SessionID__form_name__iexact='feedback'
#         )

# Get all feedback responses based on forms with form_name='feedback'
class AllFeedbackResponsesList(generics.ListAPIView):
    serializer_class = FormQuestionSerializer

    def get_queryset(self):
        return FormQuestion.objects.filter(SessionID__form_name__iexact='feedback')

# Create - POST
class FormQuestionCreate(generics.CreateAPIView):
    serializer_class = FormQuestionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        # You can add custom logic here before saving if needed
        serializer.save()