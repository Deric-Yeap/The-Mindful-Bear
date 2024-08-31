from django.urls import path
from .views import OptionFormGet,OptionSetDetail

urlpatterns = [
    path('get', OptionFormGet.as_view(), name='form_question_list'),
    path('get/<int:pk>/', OptionSetDetail.as_view(), name='option-detail'), 
    
]
