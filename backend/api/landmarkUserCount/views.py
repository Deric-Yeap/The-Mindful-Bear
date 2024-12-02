from rest_framework import generics, status
from rest_framework.response import Response
from .models import LandmarkUserCount
from .serializer import LandmarkUserCountSerializer


class GetUserCountView(generics.RetrieveAPIView):
    """
    Landmark User Count

    Retrieve the current user count for a specific landmark by its ID.
    """
    queryset = LandmarkUserCount.objects.all()
    serializer_class = LandmarkUserCountSerializer
    lookup_field = 'landmark_id'


class IncrementUserCountView(generics.UpdateAPIView):
    """
    Increment User Count

    Increases the user count for a specific landmark by 1.
    """
    queryset = LandmarkUserCount.objects.all()
    serializer_class = LandmarkUserCountSerializer
    lookup_field = 'landmark_id'

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.user_count += 1
        instance.save()
        return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)


class DecrementUserCountView(generics.UpdateAPIView):
    """
    Decrement User Count

    Decreases the user count for a specific landmark by 1, with a minimum value of 0.
    """
    queryset = LandmarkUserCount.objects.all()
    serializer_class = LandmarkUserCountSerializer
    lookup_field = 'landmark_id'

    def patch(self, request, *args, **kwargs):
    
        instance = self.get_object()
        if instance.user_count > 0:
            instance.user_count -= 1
            instance.save()
            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User count cannot be less than zero."}, status=status.HTTP_400_BAD_REQUEST)
