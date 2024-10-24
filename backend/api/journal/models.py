from django.db import models
from ..emotion.models import Emotion

# Create your models here.
class Journal(models.Model):
    title = models.CharField(max_length=255)
    user_id = models.ForeignKey('user.CustomUser', on_delete=models.CASCADE)
    emotion_id = models.ManyToManyField(Emotion, related_name='journals')
    audio_file_path = models.CharField(max_length=255)
    journal_text = models.TextField()
    sentiment_analysis_result = models.TextField()
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Journal Entry {self.id} on {self.upload_date.strftime("%Y-%m-%d %H:%M:%S")}'