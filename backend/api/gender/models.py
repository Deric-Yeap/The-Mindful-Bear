from django.db import models

# Create your models here.
class Gender (models.Model):
    description = models.CharField(max_length=100)
