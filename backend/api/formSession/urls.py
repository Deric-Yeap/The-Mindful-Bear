from django.urls import path
from . import views

urlpatterns = [
    # Create a new FormSession
     path('create/', views.FormSessionCreate.as_view(), name='create-form-session'),

    # Get all forms for a specific session
    path('session/<int:session_id>/forms/', views.FormsForSession.as_view(), name='get-forms-for-session'),

    # Get all sessions for a specific form
    path('form/<int:form_id>/sessions/', views.SessionsForForm.as_view(), name='get-sessions-for-form'),

    # Check if a form is associated with a session
    path('check/<int:session_id>/<int:form_id>/', views.FormSessionCheck.as_view(), name='is-form-in-session'),

    # Remove a form from a session
    path('remove/<int:session_id>/<int:form_id>/', views.FormSessionRemove.as_view(), name='remove-form-from-session'),

    # Get all FormSessions
    path('get/', views.FormSessionList.as_view(), name='get-all-form-sessions'),

]

