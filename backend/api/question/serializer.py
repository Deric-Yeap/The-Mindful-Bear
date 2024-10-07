from rest_framework import serializers
from .models import Question
from ..optionSet.serializer import OptionSetSerializer

class QuestionSerializer(serializers.ModelSerializer):
    optionSet = serializers.SerializerMethodField()  # Use a custom method field to control representation

    class Meta:
        model = Question
        fields = ["questionID", "question", "order", "formID", "optionSet"]

    def get_optionSet(self, obj):
        if obj.optionSet:
            return OptionSetSerializer(obj.optionSet).data
        return None
    
class NewQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["questionID", "question", "order", "formID", "optionSet"]


