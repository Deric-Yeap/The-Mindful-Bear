from rest_framework import generics, status
from rest_framework.response import Response
from .models import LandmarkUserCount
from .serializer import LandmarkUserCountSerializer


# View to get the user count for a landmark
class GetUserCountView(generics.RetrieveAPIView):
    queryset = LandmarkUserCount.objects.all()
    serializer_class = LandmarkUserCountSerializer
    lookup_field = 'landmark_id'


# View to increment the user count for a landmark
class IncrementUserCountView(generics.UpdateAPIView):
    queryset = LandmarkUserCount.objects.all()
    serializer_class = LandmarkUserCountSerializer
    lookup_field = 'landmark_id'

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.user_count += 1
        instance.save()
        return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)


# View to decrement the user count for a landmark
class DecrementUserCountView(generics.UpdateAPIView):
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
