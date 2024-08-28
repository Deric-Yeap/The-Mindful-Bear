from django.urls import path
from .views import FormQuestionList, FormQuestionCreate,FormQuestionUpdate

urlpatterns = [
    path('get/', FormQuestionList.as_view(), name='form_question_list'),
    path('create/', FormQuestionCreate.as_view(), name='form_question_create'),
    path('update/', FormQuestionUpdate.as_view(), name='form_question_update'),  # No <int:QuestionID>
]