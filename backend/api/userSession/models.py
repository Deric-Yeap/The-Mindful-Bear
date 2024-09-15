from django.db import models
from django.conf import settings
from ..session.models import Session  # Assuming your Session model is in 'session' app
from ..landmark.models import Landmark  # Assuming your Landmark model is in 'landmark' app
from ..user.models import CustomUser  # Assuming your Landmark model is in 'landmark' app


class UserSession(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='usersessions')
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='usersessions')
    landmark = models.ForeignKey(Landmark, on_delete=models.CASCADE, related_name='usersessions')

    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'landmark', 'session'], name='unique_user_landmark_session')
        ]

    def __str__(self):
        return f"{self.user} - {self.landmark} - {self.session}"