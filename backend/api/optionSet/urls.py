from django.urls import path
from .views import OptionFormGet

urlpatterns = [
    path('get', OptionFormGet.as_view(), name='form_question_list'),]