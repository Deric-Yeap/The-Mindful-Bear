from django.db import models
from django.db.models.functions import Length

# Create your models here.

models.CharField.register_lookup(Length)
class Exercise(models.Model):
    exercise_id = models.AutoField(primary_key=True)
    exercise_name = models.CharField(max_length=250, default="testExercise")
    audio_url = models.CharField(max_length=500)
    description = models.CharField(max_length=500)

    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(
    #             audio_url="%(app_label)s_%(class)s_audio_url_not_empty",
    #             check=models.Q(audio_url__length__gt=0),
    #         ),
    #         models.UniqueConstraint(
    #             description="%(app_label)s_%(class)s_description_not_empty",
    #             check=models.Q(description__length__gt=0),
    #         )
    #     ]


    def __str__(self):
        return self.exercise_id


