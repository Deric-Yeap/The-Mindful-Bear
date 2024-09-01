from django.urls import path
from .views import OptionDetails,UpdateOptions,CreateOption

urlpatterns = [
    path('getOptions/<int:optionset_id>/', OptionDetails.as_view(), name='option-detail'), 
    path('update/<int:pk>/', UpdateOptions.as_view(), name='update-option'),
    path('create/<int:pk>/', CreateOption.as_view(), name='create-option'),
]