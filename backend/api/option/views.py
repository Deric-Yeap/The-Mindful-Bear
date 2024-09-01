from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets,generics, status
from .serializer import OptionSerializer
from .models import Option
from api.optionSet.models import OptionSet
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError


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

class UpdateOptions(generics.UpdateAPIView):  # Use UpdateAPIView for updating options
    serializer_class = OptionSerializer
    queryset = Option.objects.all()  # Set the queryset to all Option instances

    def get_object(self):
        # Get the Option instance based on the provided ID in the URL
        option_id = self.kwargs.get('pk')  # Assuming you pass the option ID in the URL
        return Option.objects.get(id=option_id)  # Retrieve the Option instance

    def put(self, request, *args, **kwargs):
        try:
            option = self.get_object()  # Get the specific Option instance
            serializer = self.get_serializer(option, data=request.data)  # Pass the new data to the serializer
            
            if serializer.is_valid():  # Validate the data
                serializer.save()  # Save the updated instance
                return Response(serializer.data, status=status.HTTP_200_OK)  # Return updated data
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return errors if validation fails
        except Option.DoesNotExist:
            return Response({"error": "Option not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    serializer_class = OptionSerializer

class CreateOption(generics.CreateAPIView):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer

    def perform_create(self, serializer):
        # Get the OptionSetID from the URL parameters
        option_set_id = self.kwargs.get('pk')
        
        # Fetch the OptionSet instance
        try:
            option_set = OptionSet.objects.get(pk=option_set_id)
        except OptionSet.DoesNotExist:
            raise ValidationError({"error": "OptionSet not found."})

        # Create the Option with the OptionSetID
        serializer.save(OptionSetID=option_set)

    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except ValidationError as ve:
            return Response({"errors": ve.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    

