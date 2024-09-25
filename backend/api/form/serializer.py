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
            # Update the form's main fields
            instance.form_name = validated_data.get('form_name', instance.form_name)
            instance.store_responses = validated_data.get('store_responses', instance.store_responses)
            instance.is_compulsory = validated_data.get('is_compulsory', instance.is_compulsory)
            instance.is_presession = validated_data.get('is_presession', instance.is_presession)
            instance.is_postsession = validated_data.get('is_postsession', instance.is_postsession)
            instance.save()

            # Get all the existing questions for the form
            existing_questions = list(Question.objects.filter(formID=instance))

            # Delete questions not in the input data (those not having a questionID in existing_question_ids)
            for question in existing_questions:
                if question.questionID not in existing_question_ids:
                    question.delete()

            # Update or create questions
            for question_data in questions_data:
                option_set_id = question_data['optionSet']
                try:
                    option_set = OptionSet.objects.get(id=option_set_id)
                except OptionSet.DoesNotExist:
                    raise serializers.ValidationError({'questions': f'OptionSet with ID {option_set_id} does not exist.'})

                if 'questionID' in question_data:
                    # Update existing question using questionID
                    question = Question.objects.get(questionID=question_data['questionID'])
                    question.question = question_data['question']
                    question.order = question_data['order']
                    question.optionSet = option_set
                    question.save()
                else:
                    # Create new question
                    Question.objects.create(
                        formID=instance,
                        question=question_data['question'],
                        order=question_data['order'],
                        optionSet=option_set
                    )

        return instance
    
    def to_representation(self, instance):
        """Customize the response to include questions in the representation."""
        response = super().to_representation(instance)
        response['questions'] = QuestionSerializer(instance.question_set.all(), many=True).data
        return response