from django.db import models
from django.conf import settings
from ..session.models import Session  # Assuming your Session model is in 'session' app
from ..landmark.models import Landmark  # Assuming your Landmark model is in 'landmark' app
from ..user.models import CustomUser  # Assuming your Landmark model is in 'landmark' app
from ..avatar.models import Avatar


class UserAvatar(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='useravatar')
    avatar = models.ForeignKey(Avatar, on_delete=models.CASCADE, related_name='useravatar')
   

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'avatar'], name='unique_user_avatar')
        ]

    def __str__(self):
        return f"{self.user} - {self.avatar}"