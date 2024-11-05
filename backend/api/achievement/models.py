
from django.db import models

# Create your models here.

class Achievement(models.Model):
    achievement_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=255,default='null')
    streak_count = models.IntegerField(default=1)
    achievement_badge_url = models.TextField(default="null")
  
    
    def __str__(self) -> str:
        return str(self.achievement_id)
    