from decimal import Decimal
import json
from django.db import models
from api.exercise.models import Exercise


# Create your models here.

class Landmark(models.Model):
    landmark_id = models.AutoField(primary_key=True)
    landmark_name = models.CharField(max_length=255, default='Unnamed Landmark')
    landmark_image_url = models.URLField(max_length=500, null=True, blank=True)
    x_coordinates = models.DecimalField(max_digits=9, decimal_places=6,default=0)
    y_coordinates = models.DecimalField(max_digits=9, decimal_places=6, default=0)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE,default=None)

    def __str__(self) -> str:
        return str(self.landmark_id)