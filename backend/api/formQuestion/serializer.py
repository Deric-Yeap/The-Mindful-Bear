from rest_framework import serializers
from .models import FormQuestion, Question, Session, Form
from rest_framework.exceptions import ValidationError
from api.formSession.models import FormSession

class FormQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormQuestion
        fields = '__all__' 

class BulkFormQuestionSerializer(serializers.Serializer):
    SessionID = serializers.IntegerField()
    FormID = serializers.IntegerField()
    data = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(max_length=125)
        )
    )

    def create(self, validated_data):
        session_id = validated_data.get("SessionID")
        form_id = validated_data.get("FormID")
        questions_data = validated_data.get("data")

        try:
            session = Session.objects.get(pk=session_id)
        except Session.DoesNotExist:
            raise ValidationError({"SessionID": f"Session with id {session_id} not found."})

        try:
            form = Form.objects.get(pk=form_id)
        except Form.DoesNotExist:
            raise ValidationError({"FormID": f"Form with id {form_id} not found."})

        form_questions = []
        valid_responses = []

        for item in questions_data:
            question_id = item.get('QuestionID')
            response = item.get('Response')

            try:
                question = Question.objects.get(pk=question_id)
            except Question.DoesNotExist:
                raise ValidationError({"QuestionID": f"Question with id {question_id} not found."})

            form_question = FormQuestion(
                QuestionID=question,
                SessionID=session,
                Response=response
            )
            form_questions.append(form_question)

            if response.isdigit():
                score = int(response)
                if question.reverse_score:
                    score = 4 - score
                valid_responses.append(score)

        if form.store_responses:
            FormQuestion.objects.bulk_create(form_questions)

        if not form.store_responses:
            aggregated_score = (
                sum(valid_responses)
                if valid_responses else 0
            )

            FormSession.objects.create(
                SessionID=session,
                FormID=form,
                aggregatedScore=str(aggregated_score)
            )

        return form_questions if form.store_responses else []
