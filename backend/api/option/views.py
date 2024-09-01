from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets,generics, status
from .serializer import OptionSerializer
from .models import Option
from rest_framework.response import Response

class OptionDetails(generics.ListAPIView):  # Use ListAPIView to return a list of options
    serializer_class = OptionSerializer

    def get_queryset(self):
        # Get the OptionSetID from the URL parameters
        option_set_id = self.kwargs.get('optionset_id')  # Access the optionset_id from the URL
        # Filter the Option queryset based on the OptionSetID
        return Option.objects.filter(OptionSetID__id=option_set_id)

    def get(self, request, *args, **kwargs):
        try:
            options = self.get_queryset()  # Retrieve the filtered options
            serializer = self.get_serializer(options, many=True)  # Serialize the options
            return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

