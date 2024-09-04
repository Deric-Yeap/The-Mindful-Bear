from django.urls import path
from .views import OptionFormGet,OptionSetDetail,CreateOptionSet,OptionSetDestroy,UpdateOptionSet

urlpatterns = [
    path('get', OptionFormGet.as_view(), name='form_question_list'),
    path('get/<int:pk>/', OptionSetDetail.as_view(), name='optionset-detail'), 
    path('create/', CreateOptionSet.as_view(), name='create-optionset'), 
     path('update/<int:pk>/', UpdateOptionSet.as_view(), name='update-optionset'), 
    path("delete/<int:pk>/", OptionSetDestroy.as_view(),name="optionset-delete"),
] 
