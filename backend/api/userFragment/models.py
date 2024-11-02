from django.db import models
from django.conf import settings
from ..user.models import CustomUser  
from ..avatar.models import Avatar

class UserFragment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_fragments')
    avatar = models.ForeignKey(Avatar, on_delete=models.CASCADE, related_name='fragment_avatars')
    quantity = models.IntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'avatar'], name='unique_user_fragment')
        ]

    def __str__(self):
        return f"{self.user} - {self.avatar}"
