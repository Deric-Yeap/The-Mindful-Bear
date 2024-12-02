from django.urls import path

from .views import FormQuestionList, FormQuestionCreate, FormQuestionUpdate, BulkFormQuestionCreate, FormQuestionScoreGenView,  ExerciseLandmarkRatingDistribution, LikelihoodOfFutureUseDistribution, OverallExperienceRatingDistribution, SuggestionOnLandmarkAPIView, ImprovementsToAppAPIView


urlpatterns = [
    path('get/', FormQuestionList.as_view(), name='form_question_list'),
    path('create/', FormQuestionCreate.as_view(), name='form_question_create'),
    path('update/', FormQuestionUpdate.as_view(), name='form_question_update'), 
    path('bulk_create/', BulkFormQuestionCreate.as_view(), name='bulk_create_form_questions'),
    path('rating_distribution/', ExerciseLandmarkRatingDistribution.as_view(), name='rating_distribution'),
    path('likelihood_of_future_use/', LikelihoodOfFutureUseDistribution.as_view(), name='likelihood_of_future_use'),
    path('overall_experience_rating/', OverallExperienceRatingDistribution.as_view(), name='overall_experience_rating'),    
    path('suggestion_on_landmark/', SuggestionOnLandmarkAPIView.as_view(), name='suggestion_on_landmark'),   
    path('improvements_to_app/', ImprovementsToAppAPIView.as_view(), name='improvements_to_app'),    
    path('gen-score/', FormQuestionScoreGenView.as_view(), name='form-question-gen-score')

]

