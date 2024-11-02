from rest_framework import serializers

from .models import Article
from ..common.validators import is_field_empty
from django.conf import settings
from ..common.s3 import create_presigned_url, upload_fileobj, make_file_upload_path, delete_s3_object
from urllib.parse import quote
from ..common.processContents import extract_key_concepts
import re
import os


class ArticleSerializer(serializers.ModelSerializer):
    article_pdf_url = serializers.SerializerMethodField()
    class Meta:
        model = Article
        fields = ['article_id','title', 'topic', 'processed_contents', 'article_pdf_url', 'article_image_url']

    def get_article_pdf_url(self, obj):
        if obj.article_pdf_url:
            return create_presigned_url(obj.article_pdf_url)
        return None

    
class ArticleCreateSerializer(serializers.ModelSerializer):
    article_pdf_url = serializers.FileField(write_only=True, required=True)
  
    class Meta: 
        model = Article
        fields = ['article_id', 'title', 'topic', 'processed_contents', 'article_pdf_url', 'article_image_url']

    def validate_article_pdf_url(self, value):
        if not value.name.endswith(('.pdf')):
            raise serializers.ValidationError("File must be in pdf.")
        return value
    

    def create(self, validated_data):
        article_pdf_url = validated_data.pop('article_pdf_url')        
        user = self.context['request'].user   
        # Split into name and extension, clean name, then rejoin
        name, ext = os.path.splitext(article_pdf_url.name)
        clean_name = re.sub(r'[^a-zA-Z0-9]', '', name)
        clean_file_name = clean_name + ext
        file_name, object_path = make_file_upload_path("articles", user, quote(clean_file_name)) 
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        file_url = upload_fileobj(article_pdf_url, bucket, object_path)
        if not file_url:        
            raise serializers.ValidationError("File upload to S3 failed")
        
        # Combine title and processed_contents
        combined_text = validated_data['title'] + ' ' + validated_data['processed_contents']
        
        # Extract key concepts from the combined text
        key_concepts = extract_key_concepts(combined_text)
        
        # Update processed_contents with the extracted key concepts
        validated_data['processed_contents'] = key_concepts
        
        article = Article.objects.create(
            article_pdf_url=object_path,
            article_image_url=validated_data['article_image_url'],
            topic=validated_data['topic'],
            processed_contents=validated_data['processed_contents'],
            title=validated_data['title']
        )

        return article
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['article_pdf_url'] = instance.article_pdf_url  
        return representation
    
class ArticleUpdateSerializer(serializers.ModelSerializer):
    article_pdf_url = serializers.FileField(write_only=True, required=False)
    article_image_url = serializers.CharField(max_length=255, required=False)
    topic = serializers.CharField(max_length=100, required=False)
    processed_contents = serializers.CharField(required=False)
    title = serializers.CharField(required=False)

    class Meta:
        model = Article
        fields = ['article_id', 'title', 'topic', 'processed_contents', 'article_pdf_url', 'article_image_url']

    def validate_article_pdf_url(self, value):
        if not value.name.endswith(('.pdf')):
            return serializers.ValidationError("File must be in pdf.")
        return value
    

    def update(self, instance, validated_data):
        user = self.context['request'].user    
        if 'article_pdf_url' in validated_data:
            article_pdf_url = validated_data.pop('article_pdf_url')
            file_name, object_path = make_file_upload_path("articles", user, quote(article_pdf_url.name))
            bucket = settings.AWS_STORAGE_BUCKET_NAME
            file_url = upload_fileobj(article_pdf_url, bucket, object_path)
            if not file_url:
                raise serializers.ValidationError("File upload to S3 failed")
            instance.article_pdf_url = object_path

        
        if 'processed_contents' in validated_data:
            processed_content = validated_data.get('processed_contents', '')
            key_concepts = extract_key_concepts(processed_content)
            instance.processed_contents = ', '.join(key_concepts)  # Store key concepts as a string

        
    
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['article_pdf_url'] = instance.article_pdf_url
        return representation

