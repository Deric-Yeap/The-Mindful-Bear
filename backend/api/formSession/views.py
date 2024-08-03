from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import FormSession, Session, Form
from .serializer import FormSessionSerializer
from api.form.serializer import FormSerializer
from api.session.serializer import SessionSerializer
from rest_framework.exceptions import ValidationError

class FormSessionCreate(generics.CreateAPIView):
    queryset = FormSession.objects.all()
    serializer_class = FormSessionSerializer

    def create(self, request, *args, **kwargs):
        form_id = request.data.get('FormID')
        session_id = request.data.get('SessionId')
        
        errors = {}

        # Check if the FormID exists in the Form table
        if not Form.objects.filter(id=form_id).exists():
            errors['FormID'] = f'Form ID: {form_id} does not exist in Form Table'

        
        # Check if the SessionId exists in the Session table
        if not Session.objects.filter(id=session_id).exists():
            errors['SessionId'] = f'Session ID: {session_id} does not exist in Session Table'
        
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# Get all forms for a specific session
class FormsForSession(generics.ListAPIView):
    serializer_class = FormSerializer

    def get_queryset(self):
        session_id = self.kwargs['session_id']
        return Form.objects.filter(formsession__SessionId_id=session_id)

# Get all sessions for a specific form
class SessionsForForm(generics.ListAPIView):
    serializer_class = SessionSerializer

    def get_queryset(self):
        form_id = self.kwargs['form_id']
        return Session.objects.filter(formsession__FormID_id=form_id)

# Check if a form is associated with a session
class FormSessionCheck(generics.RetrieveAPIView):
    queryset = FormSession.objects.all()
    serializer_class = FormSessionSerializer

    def get(self, request, *args, **kwargs):
        session_id = self.kwargs['session_id']
        form_id = self.kwargs['form_id']
        exists = self.queryset.filter(SessionId_id=session_id, FormID_id=form_id).exists()
        return Response({'exists': exists})


# Remove a form from a session
class FormSessionRemove(generics.DestroyAPIView):
    queryset = FormSession.objects.all()
    serializer_class = FormSessionSerializer

    def get_object(self):
        session_id = self.kwargs['session_id']
        form_id = self.kwargs['form_id']
        return get_object_or_404(self.queryset, SessionId_id=session_id, FormID_id=form_id)


# Get all FormSessions
class FormSessionList(generics.ListAPIView):
    queryset = FormSession.objects.all()
    serializer_class = FormSessionSerializer