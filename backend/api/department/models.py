from django.db import models

# Create your models here.
class Department(models.Model):
    description = models.CharField(max_length=100)
    disable = models.BooleanField(default=False)