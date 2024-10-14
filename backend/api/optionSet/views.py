from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets,generics, status
from .serializer import OptionSetSerializer
from .models import OptionSet
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError

class OptionSetView(generics.ListCreateAPIView, generics.RetrieveAPIView):
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer

    def get(self, request, *args, **kwargs):
        try:
            return self.retrieve(request, *args, **kwargs) if 'pk' in kwargs else self.list(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateOptionSet(generics.CreateAPIView):
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer

    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except ValidationError as ve:
            return Response({"errors": ve.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateOptionSet(generics.UpdateAPIView):
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer
    lookup_field = "pk"

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

class OptionSetDestroy(generics.DestroyAPIView):
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer
    lookup_field = "pk"

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_201_CREATED)  # Ensure no body is sent
        except NotFound:
            return Response({"error": "OptionSet not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)