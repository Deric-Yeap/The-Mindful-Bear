from django.db import models
from api.session.models import Session
from api.question.models import Question

class FormQuestion(models.Model):
    SessionID = models.ForeignKey(Session, blank=True, null=True, on_delete=models.CASCADE)
    QuestionID = models.ForeignKey(Question, blank=True, null=True, on_delete=models.CASCADE)
    Response = models.CharField('Response', max_length=125)

    # class Meta:
    #     unique_together = ('SessionID', 'QuestionID')

    def __str__(self):
        return f"Session Id: {self.SessionID} - QuestionId:{self.QuestionID}"
    




