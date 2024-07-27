from django.db import models
from api.session.models import Session
from api.form.models import Form

class FormSession(models.Model):
    SessionId = models.ForeignKey(Session, blank=True, null=True, on_delete=models.CASCADE)
    FormID = models.ForeignKey(Form, blank=True, null=True, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('SessionId', 'FormID')
        # Optionally, can specify ordering
        ordering = ['SessionId', 'FormID']

    def __str__(self):
        return f"SessionId: {self.SessionId}, FormID: {self.FormID}"
    