from django.db import models
from api.user.models import CustomUser
from api.article.models import Article

class SearchHistory(models.Model):
    searchID = models.AutoField(primary_key=True)  # Changed to match camelCase
    userID = models.ForeignKey(  # Changed to match naming convention
        CustomUser,
        on_delete=models.CASCADE,
        related_name='search_history',
        to_field='user_id',
        blank=True, 
        null=True
    )
    articleID = models.ForeignKey(  # Changed to match naming convention
        Article,
        on_delete=models.CASCADE,
        related_name='search_clicks',
        to_field='article_id',
        blank=True,
        null=True
    )
    query = models.CharField('Query', max_length=255)  # Added label and max_length like Question model
    rankPosition = models.IntegerField('RankPosition', default=0)  # Added label and default
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'search_history'
        indexes = [
            models.Index(fields=['userID']),
            models.Index(fields=['query']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return str(self.searchID)  # Changed to match Question model's __str__