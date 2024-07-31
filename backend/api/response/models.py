from django.db import models
from api.question.models import Question

class Response(models.Model):
    QuestionID = models.ForeignKey(Question, blank=True, null=True, on_delete=models.CASCADE)
    Answer = models.CharField('Answer', max_length=255)
    def __str__(self):
        return str(self.id)