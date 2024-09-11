from rest_framework import serializers
from .models import Form
from ..question.models import Question
from ..question.serializer import QuestionSerializer
from ..optionSet.models import OptionSet
from django.db import transaction

class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = '__all__' 

class FormAndQuestionCreateSerializer(serializers.ModelSerializer):
    questions = serializers.ListSerializer(child=serializers.DictField(), write_only=True)
    class Meta:
        model = Form
        fields = ['form_name', 'store_responses', 'is_compulsory', 'is_presession', 'is_postsession', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        
        with transaction.atomic():
            form = Form.objects.create(**validated_data)
            
            questions_list = []
            for question_data in questions_data:
                option_set_id = question_data['option_set_id']
                try:
                    option_set = OptionSet.objects.get(id=option_set_id)
                except OptionSet.DoesNotExist:
                    raise serializers.ValidationError({'questions': f'OptionSet with ID {option_set_id} does not exist.'})
                questions_list.append(
                    Question(
                        formID=form,
                        question=question_data['question'],
                        order=question_data['order'],
                        optionSet=option_set
                    )
                )
            Question.objects.bulk_create(questions_list)
        
        return form
    
class FormAndQustionViewSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Form
        fields = ['form_name', 'store_responses', 'is_compulsory', 'is_presession', 'is_postsession', 'questions']
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        questions_list = Question.objects.filter(formID=instance.id).order_by('order')
        data['questions'] = QuestionSerializer(questions_list, many=True).data
        return data