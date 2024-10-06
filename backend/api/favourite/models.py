from django.db import models
from api.landmark.models import Landmark 
from api.user.models import CustomUser




class Favourite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='likes')
    landmark = models.ForeignKey(Landmark, on_delete=models.CASCADE, related_name='liked_by')    
    class Meta:
        unique_together = ('user', 'landmark') 
        verbose_name = 'Favourite'
        verbose_name_plural = 'Favourites'

    def __str__(self):
        return f'{self.user.name} - {self.landmark.name}'