from django.db import models
from api.optionSet.models import OptionSet

class Option(models.Model):
    description = models.CharField(max_length=100)
    value = models.FloatField(null=True, blank=True)
    OptionSetID = models.ForeignKey(OptionSet, blank=True, null=True, on_delete=models.CASCADE)
    def __str__(self):
        return str(self.id)
    


    
    




