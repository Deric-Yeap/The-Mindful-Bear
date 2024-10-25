from rest_framework import serializers

from .models import Article
from ..common.validators import is_field_empty
from django.conf import settings
from ..common.s3 import create_presigned_url, upload_fileobj, make_file_upload_path, delete_s3_object
from urllib.parse import quote
from ..common.processContents import extract_key_concepts


class ArticleSerializer(serializers.ModelSerializer):
    article_pdf_url = serializers.SerializerMethodField()
    article_image_url = serializers.SerializerMethodField()
    class Meta:
        model = Article
        fields = ['article_id','title', 'topic', 'processed_contents', 'article_pdf_url', 'article_image_url']

    def get_article_pdf_url(self, obj):
        if obj.article_pdf_url:
            return create_presigned_url(obj.article_pdf_url)
        return None

    def get_article_image_url(self, obj):
        if obj.article_image_url:
            return create_presigned_url(obj.article_image_url)
        return None
    
class ArticleCreateSerializer(serializers.ModelSerializer):
    article_pdf_url = serializers.FileField(write_only=True, required=True)
    article_image_url = serializers.FileField(write_only=True, required=True)

    class Meta: 
        model = Article
        fields = ['article_id', 'title', 'topic', 'processed_contents', 'article_pdf_url', 'article_image_url']

    def validate_article_pdf_url(self, value):
        if not value.name.endswith(('.pdf')):
            raise serializers.ValidationError("File must be in pdf.")
        return value
    
    def validate_article_image_url(self, value):
        if not value.name.endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("Image file must be in JPG, JPEG, or PNG format.")
        return value

    def create(self, validated_data):
        article_pdf_url = validated_data.pop('article_pdf_url')        
        user = self.context['request'].user    
        file_name, object_path = make_file_upload_path("articles", user, quote(article_pdf_url.name))                
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        file_url = upload_fileobj(article_pdf_url, bucket, object_path)
        if not file_url:        
            raise serializers.ValidationError("File upload to S3 failed")
        
        
        article_image_url = validated_data.pop('article_image_url')        
        image_file_name, image_object_path = make_file_upload_path("articleImages", user, quote(article_image_url.name))                
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        image_file_url = upload_fileobj(article_image_url, bucket, image_object_path)
        if not image_file_url:        
            raise serializers.ValidationError("File upload to S3 failed")
        
        processed_contents = validated_data.get('processed_contents', '')
        key_concepts = extract_key_concepts(processed_contents)
        validated_data['processed_contents'] = ', '.join(key_concepts)  # Store key concepts as a string
        
        article = Article.objects.create(
            article_pdf_url=object_path,
            article_image_url=image_object_path,
            topic=validated_data['topic'],
            processed_contents=validated_data['processed_contents'],
            title=validated_data['title']
        )

        return article

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['article_pdf_url'] = instance.article_pdf_url  
        representation['article_image_url'] = instance.article_image_url  
        return representation
    
class ArticleUpdateSerializer(serializers.ModelSerializer):
    article_pdf_url = serializers.FileField(write_only=True, required=False)
    article_image_url = serializers.FileField(write_only=True, required=False)
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
    
    def validate_article_image_url(self, value):
        if not value.name.endswith(('.jpg', '.jpeg', '.png')):
            return serializers.ValidationError("Image file must be in JPG, JPEG, or PNG format.")
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

        if 'article_image_url' in validated_data:
            article_image_url = validated_data.pop('article_image_url')        
            image_file_name, image_object_path = make_file_upload_path("articleImages", user, quote(article_image_url.name))                
            bucket = settings.AWS_STORAGE_BUCKET_NAME
            image_file_url = upload_fileobj(article_image_url, bucket, image_object_path)
            if not image_file_url:        
                raise serializers.ValidationError("File upload to S3 failed")
            instance.article_image_url = object_path
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
        representation['article_image_url'] = instance.article_image_url
        return representation

