from django.db import models

# Create your models here.
class Exercise(models.Model):
    exercise_id = models.AutoField(primary_key=True)
    audio_url = models.URLField()
    description = models.CharField(max_length=250)

    def __str__(self):
        return self.exercise_id


