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

        # Validate and get the session object
        try:
            session = Session.objects.get(pk=session_id)
        except Session.DoesNotExist:
            raise ValidationError({"SessionID": f"Session with id {session_id} not found."})

        # Validate and get the form object
        try:
            form = Form.objects.get(pk=form_id)
        except Form.DoesNotExist:
            raise ValidationError({"FormID": f"Form with id {form_id} not found."})

        form_questions = []
        valid_responses = []

        # Process each question in the data list
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

            # Collect responses that are integers for aggregation
            if response.isdigit():
                valid_responses.append(int(response))

        # Perform the bulk create for FormQuestion instances
        FormQuestion.objects.bulk_create(form_questions)

        # Calculate aggregatedScore as the average of valid integer responses
        aggregated_score = (
            sum(valid_responses) / len(valid_responses)
            if valid_responses else 0
        )

        # Create the FormSession instance
        FormSession.objects.create(
            SessionID=session,
            FormID=form,
            aggregatedScore=str(aggregated_score)
        )

        return form_questions