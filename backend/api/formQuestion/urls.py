from django.urls import path
from .views import AllFeedbackResponsesList, FormQuestionCreate

urlpatterns = [
     # Get responses of a certain user based on a specific form with form_name='feedback'
    # path('feedback/user/<int:user_id>/', UserFeedback.as_view(), name='user-feedback-responses'),

    # Get all feedback responses based on forms with form_name='feedback'
    path('feedback/all/', AllFeedbackResponsesList.as_view(), name='all-feedback-responses'),

    # Create a new form question response
    path('formquestion/create/', FormQuestionCreate.as_view(), name='formquestion-create'),
    
]