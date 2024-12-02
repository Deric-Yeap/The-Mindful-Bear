from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError
from .models import Form
from ..question.models import Question
from .serializer import FormSerializer, FormAndQuestionCreateSerializer, FormAndQuestionViewSerializer
from django.db.models import Prefetch
from drf_yasg.utils import swagger_auto_schema

class FormGet(generics.ListCreateAPIView):
    """
    List and Create Forms

    Retrieves a list of all forms or creates a new form.
    """
    queryset = Form.objects.all()
    serializer_class = FormSerializer

    @swagger_auto_schema(
        operation_summary="List Forms",
        operation_description="Retrieve a list of all forms.",
        responses={200: FormSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_summary="Create a Form",
        operation_description="Create a new form with the provided details.",
        request_body=FormSerializer,
        responses={201: FormSerializer()}
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except ValidationError as ve:
            return Response({"errors": ve.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FormCreate(generics.CreateAPIView):
    """
    Create Form

    Allows the creation of a new form.
    """
    queryset = Form.objects.all()
    serializer_class = FormSerializer

    @swagger_auto_schema(
        operation_summary="Create a Form",
        operation_description="Create a new form with the provided details.",
        request_body=FormSerializer,
        responses={201: FormSerializer()}
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except ValidationError as ve:
            return Response({"errors": ve.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FormUpdate(generics.UpdateAPIView):
    """
    Update Form

    Allows updating a specific form by ID.
    """
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    lookup_field = "pk"

    @swagger_auto_schema(
        operation_summary="Update a Form",
        operation_description="Update an existing form with the provided details.",
        request_body=FormSerializer,
        responses={200: FormSerializer()}
    )
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except NotFound:
            return Response({"error": "Form not found."}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as ve:
            return Response({"errors": ve.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FormDestroy(generics.DestroyAPIView):
    """
    Delete Form

    Allows deletion of a specific form by ID.
    """
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    lookup_field = "pk"

    @swagger_auto_schema(
        operation_summary="Delete a Form",
        operation_description="Delete an existing form by ID.",
        responses={204: 'No Content'}
    )
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_200_OK)
        except NotFound:
            return Response({"error": "Form not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FormAndQuestionCreateView(generics.CreateAPIView):
    """
    Create Form with Questions

    Allows the creation of a form along with its associated questions.
    """
    queryset = Form.objects.all()
    serializer_class = FormAndQuestionCreateSerializer

    @swagger_auto_schema(
        operation_summary="Create a Form with Questions",
        operation_description="Create a new form and its associated questions.",
        request_body=FormAndQuestionCreateSerializer,
        responses={201: FormSerializer()}
    )
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            form = serializer.save()

            response_data = {
                "message": "Form and questions created successfully.",
                "form": FormSerializer(form).data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class FormAndQuestionRetrieveView(generics.RetrieveAPIView):
    """
    Retrieve Form with Questions

    Retrieves a form along with its associated questions by ID.
    """
    queryset = Form.objects.prefetch_related(
        Prefetch(
            'question_set',
            queryset=Question.objects.select_related('optionSet').prefetch_related('optionSet__options')
        )
    ).all()
    serializer_class = FormAndQuestionViewSerializer
    lookup_field = "pk"

    @swagger_auto_schema(
        operation_summary="Retrieve a Form with Questions",
        operation_description="Retrieve a form and its associated questions by ID.",
        responses={200: FormAndQuestionViewSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except NotFound:
            return Response({"error": "Form not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FormAndQuestionUpdateView(generics.UpdateAPIView):
    """
    Update Form with Questions

    Updates a form along with its associated questions by ID.
    """
    queryset = Form.objects.prefetch_related(
        Prefetch(
            'question_set',
            queryset=Question.objects.select_related('optionSet').prefetch_related('optionSet__options')
        )
    ).all()
    serializer_class = FormAndQuestionViewSerializer
    lookup_field = "pk"

    @swagger_auto_schema(
        operation_summary="Update a Form with Questions",
        operation_description="Update an existing form and its associated questions.",
        request_body=FormAndQuestionViewSerializer,
        responses={200: FormAndQuestionViewSerializer()}
    )
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            updated_instance = self.get_serializer(instance)
            return Response(updated_instance.data, status=status.HTTP_200_OK)
        except NotFound:
            return Response({"error": "Form not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
