from django.db import models

# Create your models here.
class AchievementPoint(models.Model):
    userId = models.ForeignKey('user.CustomUser', on_delete=models.CASCADE)
    points = models.IntegerField()
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
