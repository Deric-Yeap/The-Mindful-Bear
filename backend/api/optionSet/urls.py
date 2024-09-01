from django.urls import path
from .views import OptionFormGet,OptionSetDetail,CreateOptionSet

urlpatterns = [
    path('get', OptionFormGet.as_view(), name='form_question_list'),
    path('get/<int:pk>/', OptionSetDetail.as_view(), name='optionset-detail'), 
    path('create/', CreateOptionSet.as_view(), name='create-optionset'), 
    
]
