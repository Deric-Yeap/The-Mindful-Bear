from django.db import models
from api.question.models import Question

class OptionSet(models.Model):
    description = models.CharField(max_length=100)
    QuestionID = models.ForeignKey(Question, blank=True, null=True, on_delete=models.CASCADE)
    
    def __str__(self):
        return str(self.id)

    
    




