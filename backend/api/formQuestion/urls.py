from django.urls import path

from .views import FormQuestionList, FormQuestionCreate, FormQuestionUpdate, BulkFormQuestionCreate, FormQuestionScoreGenView,  ExerciseLandmarkRatingDistribution, LikelihoodOfFutureUseDistribution, OverallExperienceRatingDistribution, SuggestionOnLandmarkAPIView, ImprovementsToAppAPIView


urlpatterns = [
    path('get/', FormQuestionList.as_view(), name='form_question_list'),
    path('create/', FormQuestionCreate.as_view(), name='form_question_create'),
    path('update/', FormQuestionUpdate.as_view(), name='form_question_update'),  # No <int:QuestionID>
    path('bulk_create/', BulkFormQuestionCreate.as_view(), name='bulk_create_form_questions'),

    
    #newly added: http://127.0.0.1:8000/api/formQuestion/rating_distribution/
    path('rating_distribution/', ExerciseLandmarkRatingDistribution.as_view(), name='rating_distribution'),
    
    #newly added: http://127.0.0.1:8000/api/formQuestion/likelihood_of_future_use/
    path('likelihood_of_future_use/', LikelihoodOfFutureUseDistribution.as_view(), name='likelihood_of_future_use'),
    
    #newly added: http://127.0.0.1:8000/api/formQuestion/overall_experience_rating/
    path('overall_experience_rating/', OverallExperienceRatingDistribution.as_view(), name='overall_experience_rating'),
    
    #http://127.0.0.1:8000/api/formQuestion/suggestion_on_landmark/
    path('suggestion_on_landmark/', SuggestionOnLandmarkAPIView.as_view(), name='suggestion_on_landmark'),
    
    #http://127.0.0.1:8000/api/formQuestion/improvements_to_app/
    path('improvements_to_app/', ImprovementsToAppAPIView.as_view(), name='improvements_to_app'),
    
    path('gen-score/', FormQuestionScoreGenView.as_view(), name='form-question-gen-score')

    path('gen-score/', FormQuestionScoreGenView.as_view(), name='form-question-gen-score'),



]

