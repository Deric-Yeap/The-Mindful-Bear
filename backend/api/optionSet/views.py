from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets,generics, status
from .serializer import OptionSetSerializer
from .models import OptionSet
from rest_framework.response import Response

class OptionFormGet(generics.ListCreateAPIView):
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer

    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
