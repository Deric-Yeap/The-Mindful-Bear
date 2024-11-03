from rest_framework import serializers
from .models import SearchHistory

class SearchHistorySerializer(serializers.ModelSerializer):
    userEmail = serializers.CharField(source='userID.email', read_only=True)
    articleTitle = serializers.CharField(source='articleID.title', read_only=True, allow_null=True)

    class Meta:
        model = SearchHistory
        fields = [
            'searchID',
            'userEmail',
            'query',
            'articleTitle',
            'rankPosition',
            'created_at'
        ]

class SearchClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ['query', 'articleID', 'rankPosition']