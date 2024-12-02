from django.urls import path
from . import views

urlpatterns = [
    path('get/', views.ListOptionSet.as_view(), name='form_question_list'),
    path('get/<int:pk>/', views.RetrieveOptionSet.as_view(), name='optionset-detail'),
    path('create/', views.CreateOptionSet.as_view(), name='create-optionset'), 
    path('update/<int:pk>/', views.UpdateOptionSet.as_view(), name='update-optionset'), 
    path("delete/<int:pk>/", views.OptionSetDestroy.as_view(),name="optionset-delete"),
] 
