from django.db import models

# Create your models here.

class Article(models.Model):
    article_id = models.AutoField(primary_key=True)
    topic = models.CharField(max_length=100)
    processed_contents = models.TextField(default='null')
    article_pdf_url = models.CharField(max_length=255)
    article_image_url = models.CharField(max_length=255)
    title = models.TextField(default='null')
    
    def __str__(self) -> str:
        return str(self.article_id)
    