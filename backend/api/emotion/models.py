from django.db import models

# Create your models here.
class Emotion (models.Model):
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=100)
    value = models.IntegerField(null=True)
    colorID = models.ForeignKey('color.Color', on_delete=models.CASCADE)
    parentID = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name