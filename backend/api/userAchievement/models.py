from django.db import models
from django.conf import settings
from ..user.models import CustomUser  # Assuming your Landmark model is in 'landmark' app
from ..achievement.models import Achievement


class UserAchievement(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='userachievement')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='userachievement')
    date_obtained = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'achievement'], name='unique_user_achievement')
        ]

    def __str__(self):
        return f"{self.user} - {self.achievement}"