from django.db import models

# Create your models here.

class Avatar(models.Model):
    avatar_id = models.AutoField(primary_key=True)
    avatar_url = models.TextField(default='null')
    fragments_required = models.IntegerField(default=1)
    drop_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    title= models.CharField(max_length=255,default="null")

    
    def __str__(self) -> str:
        return str(self.avatar_id)
    