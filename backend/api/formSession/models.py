from django.db import models
from api.session.models import Session
from api.form.models import Form

class FormSession(models.Model):
    SessionID = models.ForeignKey(Session, blank=True, null=True, on_delete=models.CASCADE)
    FormID = models.ForeignKey(Form, blank=True, null=True, on_delete=models.CASCADE)
    aggregatedScore = models.CharField('Response', max_length=125)

    def __str__(self):
        return f"Session Id: {self.SessionID} - Form:{self.FormID}"
    




