from django.urls import path
from . import views

urlpatterns = [
    #This gets all questions for a particular form
    path("getFormQuestions/",views.GetQuestions.as_view(),name="get-questions"),
    #This gets all questions for a particular form
    path("getFormQuestions/<int:pk>/",views.FormGetQuestions.as_view(),name="form-get-questions"),
    path("create",views.CreateQuestion.as_view(),name="create-question"),
    path('questions/update/<int:QuestionID>/', views.UpdateQuestion.as_view(), name='update-question'),
    path('questions/delete/<int:QuestionID>/', views.DeleteQuestion.as_view(), name='delete-question'),

]