from rest_framework import generics, status
from .serializer import OptionSetSerializer
from .models import OptionSet
from rest_framework.response import Response


class ListOptionSet(generics.ListAPIView):
    """
    List Option Sets

    Retrieves all option sets.
    """
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer


class RetrieveOptionSet(generics.RetrieveAPIView):
    """
    Retrieve Option Set

    Retrieves details of a specific option set by ID.
    """
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer
    lookup_field = "pk"


class CreateOptionSet(generics.CreateAPIView):
    """
    Create Option Set

    Adds a new option set.
    """
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer


class UpdateOptionSet(generics.UpdateAPIView):
    """
    Update Option Set

    Modifies an existing option set.
    """
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OptionSetDestroy(generics.DestroyAPIView):
    """
    Delete Option Set

    Removes a specified option set.
    """
    queryset = OptionSet.objects.all()
    serializer_class = OptionSetSerializer
    lookup_field = "pk"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
