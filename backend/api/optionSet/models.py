from django.db import models

class OptionSet(models.Model):
    description = models.CharField(max_length=100)
    
    def __str__(self):
        return str(self.id)

    
    




