from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets, generics, status
from .serializer import OptionSerializer
from .models import Option
from api.optionSet.models import OptionSet
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError


class OptionDetails(generics.ListAPIView):
    """
    List Options

    Retrieves all options for a specific option set.
    """
    serializer_class = OptionSerializer

    def get_queryset(self):
        """
        Filter Options by OptionSet

        Retrieves options linked to a specific OptionSet.
        """
        option_set_id = self.kwargs.get('optionset_id')
        return Option.objects.filter(OptionSetID__id=option_set_id)

    def get(self, request, *args, **kwargs):
        """
        Get Options

        Returns serialized options for the specified OptionSet.
        """
        try:
            options = self.get_queryset()
            serializer = self.get_serializer(options, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateOptions(generics.UpdateAPIView):
    """
    Update Option

    Modifies a specific option by ID.
    """
    serializer_class = OptionSerializer
    queryset = Option.objects.all()

    def get_object(self):
        """
        Get Option by ID

        Retrieves the option instance using the provided ID.
        """
        option_id = self.kwargs.get('pk')
        return Option.objects.get(id=option_id)

    def put(self, request, *args, **kwargs):
        """
        Update Option

        Updates the option with the provided data.
        """
        try:
            option = self.get_object()
            serializer = self.get_serializer(option, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Option.DoesNotExist:
            return Response({"error": "Option not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateOption(generics.CreateAPIView):
    """
    Create Option

    Adds a new option to a specific option set.
    """
    queryset = Option.objects.all()
    serializer_class = OptionSerializer

    def perform_create(self, serializer):
        """
        Link Option to OptionSet

        Associates the new option with an OptionSet.
        """
        option_set_id = self.kwargs.get('pk')
        try:
            option_set = OptionSet.objects.get(pk=option_set_id)
        except OptionSet.DoesNotExist:
            raise ValidationError({"error": "OptionSet not found."})

        serializer.save(OptionSetID=option_set)

    def post(self, request, *args, **kwargs):
        """
        Create Option

        Validates and creates an option linked to an OptionSet.
        """
        try:
            return super().post(request, *args, **kwargs)
        except ValidationError as ve:
            return Response({"errors": ve.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
