from rest_framework import serializers
from .models import FormQuestion
from api.question.models import Question
from api.session.models import Session
from rest_framework.exceptions import ValidationError


class FormQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormQuestion
        fields = '__all__' 

class BulkFormQuestionSerializer(serializers.Serializer):
    SessionID = serializers.IntegerField()
    data = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(max_length=125)
        )
    )

    def create(self, validated_data):
        session_id = validated_data.get("SessionID")
        questions_data = validated_data.get("data")

        # Validate and get the session object
        try:
            session = Session.objects.get(pk=session_id)
        except Session.DoesNotExist:
            raise ValidationError({"SessionID": f"Session with id {session_id} not found."})

        form_questions = []
        for item in questions_data:
            question_id = item.get('QuestionID')
            response = item.get('Response')

            # Validate and get the question object
            try:
                question = Question.objects.get(pk=question_id)
            except Question.DoesNotExist:
                raise ValidationError({"QuestionID": f"Question with id {question_id} not found."})

            # Create the FormQuestion object but don't save yet
            form_question = FormQuestion(
                QuestionID=question,
                SessionID=session,
                Response=response
            )
            form_questions.append(form_question)

        # Perform the bulk create
        return FormQuestion.objects.bulk_create(form_questions)
