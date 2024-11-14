from rest_framework import serializers
from .models import FormQuestion, Question, Session, Form
from rest_framework.exceptions import ValidationError
from api.formSession.models import FormSession
from api.formSession.utils import get_sessions_by_period, get_sessions
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
       

        SGT = pytz.timezone('Asia/Singapore')
         # Get all sessions if year and month are not provided
        sessions = Session.objects.all()
        
        request = self.context.get('request')
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        period = request.query_params.get('period', 'daily')
        print("period",period)

        SGT = pytz.timezone('Asia/Singapore')
         # Get all sessions if year and month are not provided
        sessions = Session.objects.all()
        # Use the current year if no year is provided
        if not year and not month:
        # No year and no month provided, use the full date range of all sessions
            if sessions.exists():
                start_date = sessions.order_by('start_datetime').first().start_datetime
                end_date = sessions.order_by('-start_datetime').first().start_datetime
            else:
                # If no sessions are available, use the current date
                start_date = datetime.now(tz=SGT)
                end_date = datetime.now(tz=SGT)
                
        elif year and not month:
            # Only year provided, take all months in that year
            year = int(year)
            start_date = datetime(year, 1, 1, tzinfo=SGT)
            end_date = datetime(year + 1, 1, 1, tzinfo=SGT) - timedelta(microseconds=1)
            
        elif month and not year:
            # Only month provided, take the specified month across all years
            month = int(month)
            start_date = sessions.filter(start_datetime__month=month).order_by('start_datetime').first().start_datetime
            end_date = sessions.filter(start_datetime__month=month).order_by('-start_datetime').first().start_datetime

        else:
            # Both year and month are provided
            year = int(year)
            month = int(month)
            start_date = datetime(year, month, 1, tzinfo=SGT)
            if month == 12:
                end_date = datetime(year + 1, 1, 1, tzinfo=SGT) - timedelta(microseconds=1)
            else:
                end_date = datetime(year, month + 1, 1, tzinfo=SGT) - timedelta

        # Get the session data for the specified period
        # Get sessions aggregated by period
         # Iterate over each period and calculate form averages
         # Get sessions aggregated by period
        session_data = get_sessions(start_date,end_date)
        
        result = {}
        
        stress_gen= self.get_stress_improve_change(session_data['session_gen_ids'])
        mindfulness_gen = self.get_mindfulness_improve_change(session_data['session_gen_ids'])
            
        result = {
            **stress_gen,
            **mindfulness_gen,
            'session_gen_ids': session_data['session_gen_ids'],
            'session_gen_count': session_data['session_gen_count']
            
        }

        return result


