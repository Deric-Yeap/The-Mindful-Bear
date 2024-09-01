from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets,generics, status
from .serializer import OptionSetSerializer
from .models import OptionSet
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError

class OptionFormGet(generics.ListCreateAPIView):
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer

    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class OptionSetDetail(generics.RetrieveAPIView):
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer

    def get(self, request, *args, **kwargs):
        try:
            option_set = self.get_object()  # Retrieve the OptionSet instance
            serializer = self.get_serializer(option_set)  # Serialize the OptionSet instance
            return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data
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

