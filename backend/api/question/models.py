from django.db import models
from api.form.models import Form

class Question(models.Model):
    question = models.CharField('Question', max_length=255)
    FormID = models.ForeignKey(Form, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)
    