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
                option_set_id = question_data['optionSet']
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
    


class FormAndQuestionViewSerializer(serializers.ModelSerializer):
    questions = serializers.ListSerializer(
        child=serializers.DictField(), write_only=True
    )
    
    class Meta:
        model = Form
        fields = ['form_name', 'store_responses', 'is_compulsory', 'is_presession', 'is_postsession', 'questions']

    def update(self, instance, validated_data):
        questions_data = validated_data.pop('questions')
        existing_question_ids = [q['questionID'] for q in questions_data if 'questionID' in q]

        with transaction.atomic():
            # Dynamically update the form's main fields
            for field, value in validated_data.items():
                setattr(instance, field, value)
            instance.save()

            # Delete questions not in the input data
            Question.objects.filter(formID=instance).exclude(questionID__in=existing_question_ids).delete()

            # Update or create questions
            for question_data in questions_data:
                option_set_id = question_data.get('optionSet')
                if isinstance(option_set_id, dict):
                    option_set_id = option_set_id.get('id')
                if not OptionSet.objects.filter(id=option_set_id).exists():
                    raise serializers.ValidationError({'questions': f'OptionSet with ID {option_set_id} does not exist.'})

                option_set = OptionSet.objects.get(id=option_set_id)

                question, created = Question.objects.update_or_create(
                    questionID=question_data.get('questionID'),
                    defaults={
                        'formID': instance,
                        'question': question_data.get('question'),
                        'order': question_data.get('order'),
                        'optionSet': option_set,
                        'reverse_score': question_data.get('reverse_score', False)
                    }
                )

        return instance
    
    def to_representation(self, instance):
        """Customize the response to include questions in the representation."""
        instance.refresh_from_db()
        response = super().to_representation(instance)
        response['questions'] = QuestionSerializer(instance.question_set.all(), many=True).data
        return response