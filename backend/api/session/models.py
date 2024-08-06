from django.db import models
from django.utils.timezone import localtime
from django.core.exceptions import ValidationError

class Session(models.Model):
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField(null=True, blank=True)
    pss_before = models.FloatField(null=True, blank=True) 
    pss_after = models.FloatField(null=True, blank=True)
    sms_before = models.FloatField(null=True, blank=True) 
    sms_after = models.FloatField(null=True, blank=True)
    physical_tiredness_before = models.FloatField(null=True, blank=True)
    physical_tiredness_after = models.FloatField(null=True, blank=True)
    
    def __str__(self):
        return str(self.id)
    
    # This is to ensure that the start_datetime field of your Session model cannot be changed after it's initially set
    def save(self, *args, **kwargs):
        if self.pk:  # If the object already exists
            original = Session.objects.get(pk=self.pk)
            if original.start_datetime != self.start_datetime:
                raise ValidationError("start_datetime cannot be modified")
        super().save(*args, **kwargs)