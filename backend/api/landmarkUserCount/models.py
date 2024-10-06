from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class LandmarkUserCount(models.Model):
    landmark = models.OneToOneField('landmark.Landmark', on_delete=models.CASCADE, related_name="user_count")
    user_count = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"{self.landmark.landmark_name} - User Count: {self.user_count}"

# Signal to create LandmarkUserCount when a Landmark is created
@receiver(post_save, sender='landmark.Landmark')
def create_landmark_user_count(sender, instance, created, **kwargs):
    if created:
        LandmarkUserCount.objects.create(landmark=instance)