from django.db import models
from django.utils.timezone import localtime

class Session(models.Model):
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    pss_before = models.FloatField(null=True, blank=True) 
    pss_after = models.FloatField(null=True, blank=True)
    sms_before = models.FloatField(null=True, blank=True) 
    sms_after = models.FloatField(null=True, blank=True)
    physical_tiredness_before = models.FloatField(null=True, blank=True)
    physical_tiredness_after = models.FloatField(null=True, blank=True)
    
    def __str__(self):
        return str(self.id)