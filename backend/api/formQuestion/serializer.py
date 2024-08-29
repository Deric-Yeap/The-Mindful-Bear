from rest_framework import serializers
from .models import FormQuestion

class FormQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormQuestion
        fields = '__all__' 

