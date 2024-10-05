from rest_framework import serializers
from .models import Question

class QuestionSerializer(serializers.ModelSerializer):
    option_set_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Question
        fields = ["questionID", "question", "order", "formID", "optionSet", "option_set_id"] 

class NewQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["questionID", "question", "order", "formID", "optionSet"]


