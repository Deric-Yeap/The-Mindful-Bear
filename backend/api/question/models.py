from django.db import models
from api.form.models import Form
from api.optionSet.models import OptionSet

class Question(models.Model):
    questionID = models.AutoField(primary_key=True) 
    question = models.CharField('Question', max_length=255)
    order = models.IntegerField('Order', default=0)
    formID = models.ForeignKey(Form, blank=True, null=True, on_delete=models.CASCADE)
    optionSet = models.ForeignKey(OptionSet, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)
    