from django.urls import path
from .views import OptionDetails

urlpatterns = [
    path('getOptions/<int:optionset_id>/', OptionDetails.as_view(), name='option-detail'), 
]