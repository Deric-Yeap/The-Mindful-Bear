from rest_framework import serializers
from .models import FormQuestion, Question, Session, Form
from rest_framework.exceptions import ValidationError
from api.formSession.models import FormSession
from api.formSession.utils import get_sessions_by_period
from django.db.models import Count, Case, When, IntegerField, F
from datetime import datetime, timedelta
import pytz

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
    

class ScoreAggregationGenSerializer(serializers.Serializer):

    session_id = serializers.IntegerField()
    improve_stress = serializers.SerializerMethodField()
    no_improve_stress = serializers.SerializerMethodField()
    improve_mindfulness = serializers.SerializerMethodField()
    no_improve_mindfulness = serializers.SerializerMethodField()
    
    def get_stress_improve_change(self, session_ids):
        print('hi')
        filtered_sessions = (FormQuestion.objects.filter(QuestionID__in=[177], SessionID__in=session_ids)
            .values('QuestionID', 'Response')
            .annotate( yes_count=Count(Case(When(Response='Yes', then=1), output_field=IntegerField())),
                        no_count=Count(Case(When(Response='No', then=1), output_field=IntegerField())))
            .order_by('QuestionID'))
        

        print('filtered_sessions',filtered_sessions)
        # return rating_counts
        
        # Get the new session count
        session_count = filtered_sessions.values('SessionID').distinct().count()
        print('session_count',session_count)
        # If there are no valid sessions, return 0 
        if session_count == 0:
           return {
            'percentage_yes_stress': 0,
            'percentage_no_stress': 0
            }
        else: 

            total_yes_count = 0
            total_no_count = 0

            # Iterate over each item in filtered_sessions
            for entry in filtered_sessions:
                total_yes_count += entry.get('yes_count', 0)
                total_no_count += entry.get('no_count', 0)
            print('total_yes_count',total_yes_count)
            print('total_no_count',total_no_count)

            
            percentage_yes = (total_yes_count /session_count) * 100
            percentage_no = (total_no_count / session_count) * 100
            
    

            return {
                'percentage_yes_stress': percentage_yes,
                'percentage_no_stress': percentage_no
            }
        
    def get_mindfulness_improve_change(self, session_ids):
        print('hi')
        filtered_sessions = (FormQuestion.objects.filter(QuestionID__in=[178], SessionID__in=session_ids)
            .values('QuestionID', 'Response')
            .annotate( yes_count=Count(Case(When(Response='Yes', then=1), output_field=IntegerField())),
                        no_count=Count(Case(When(Response='No', then=1), output_field=IntegerField())))
            .order_by('QuestionID'))
        

        print('filtered_sessions',filtered_sessions)
        # return rating_counts
        
        # Get the new session count
        session_count = filtered_sessions.values('SessionID').distinct().count()
        print('session_count',session_count)
        # If there are no valid sessions, return 0 
        if session_count == 0:
           return {
            'percentage_yes': 0,
            'percentage_no': 0
            }
        else: 

            total_yes_count = 0
            total_no_count = 0

            # Iterate over each item in filtered_sessions
            for entry in filtered_sessions:
                total_yes_count += entry.get('yes_count', 0)
                total_no_count += entry.get('no_count', 0)
            print('total_yes_count',total_yes_count)
            print('total_no_count',total_no_count)

            
            percentage_yes = (total_yes_count /session_count) * 100
            percentage_no = (total_no_count / session_count) * 100
            
    

            return {
                'percentage_yes_mindfulness': percentage_yes,
                'percentage_no_mindfulness': percentage_no
            }
                 

    

    def to_representation(self, instance):
        request = self.context.get('request')
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        period = request.query_params.get('period', 'daily')
        pss = request.query_params.get('pss')
        sms = request.query_params.get('sms')
        print("period",period)

        SGT = pytz.timezone('Asia/Singapore')
         # Get all sessions if year and month are not provided
        sessions = Session.objects.all()
        if period == 'daily':
             # Calculate start and end dates for the last 30 days
            end_date = datetime.now(tz=SGT)
            start_date = end_date - timedelta(days=30)
        else:
            if year and month:
                # If year and month are provided, filter by the month
                year = int(year)
                month = int(month)
                start_date = datetime(year, month, 1, tzinfo=SGT)

                if month == 12:
                    end_date = datetime(year + 1, 1, 1, tzinfo=SGT) - timedelta(microseconds=1)
                else:
                    end_date = datetime(year, month + 1, 1, tzinfo=SGT) - timedelta(microseconds=1)

                sessions = sessions.filter(start_datetime__gte=start_date, start_datetime__lt=end_date)
            else:
                # If no year and month, use the full date range of all sessions
                if sessions.exists():
                    start_date = sessions.order_by('start_datetime').first().start_datetime
                    end_date = sessions.order_by('-start_datetime').first().start_datetime
                else:
                    start_date = datetime.now(tz=SGT)
                    end_date = datetime.now(tz=SGT)

        # Get the session data for the specified period
        # Get sessions aggregated by period
         # Iterate over each period and calculate form averages
         # Get sessions aggregated by period
        session_data = get_sessions_by_period(start_date,end_date, period)
        
        result = {}
        for period_key, data in session_data.items():
            print('data',data['session_gen_ids'])
            stress_gen= self.get_stress_improve_change(data['session_gen_ids'])
            mindfulness_gen = self.get_mindfulness_improve_change(data['session_gen_ids'])
            
            result[period_key] = {
                **stress_gen,
                **mindfulness_gen,
                'session_gen_ids': data['session_gen_ids'],
                'session_gen_count': data['session_gen_count']
                
            }

        return result


