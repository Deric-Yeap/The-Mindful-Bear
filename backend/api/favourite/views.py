from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Favourite
from api.landmark.models import Landmark
from .serializer import FavouriteSerializer
from django.shortcuts import get_object_or_404
from api.landmark.serializer import LandmarkSerializer

class FavouriteCreateView(generics.CreateAPIView):
    """
    Create Favourite

    Allows a user to mark a landmark as a favourite by providing the `landmarkId`.
    """
    queryset = Favourite.objects.all()
    serializer_class = FavouriteSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def create(self, request, *args, **kwargs):
        """
        Create a favourite for a landmark.

        Ensures the `landmarkId` exists and associates the favourite with the landmark.
        """
        landmark_id = kwargs.get('landmarkId')
        if not landmark_id:
            raise ValidationError('landmarkId is required.')
        landmark = Landmark.objects.filter(pk=landmark_id).first()
        if not landmark:
            raise ValidationError(f'Landmark with ID {landmark_id} does not exist.')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(landmark=landmark)
        return Response({'detail': 'Favourite has been successfully created.'}, status=status.HTTP_201_CREATED)

class FavouriteDeleteView(generics.DestroyAPIView):
    """
    Delete Favourite

    Allows a user to remove a landmark from their favourites using the `landmarkId`.
    """
    queryset = Favourite.objects.all()
    serializer_class = FavouriteSerializer

    def get_object(self):
        """
        Retrieve the favourite object for the current user and `landmarkId`.

        Raises an error if the `landmarkId` is not provided or the favourite does not exist.
        """
        user = self.request.user
        landmark_id = self.kwargs.get('landmarkId')
        if not landmark_id:
            raise ValidationError('landmarkId is required.')
        return get_object_or_404(Favourite, user=user, landmark__landmark_id=landmark_id)

    def delete(self, request, *args, **kwargs):
        """
        Delete a favourite for a specific landmark.

        Removes the association between the user and the landmark in the favourites.
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Favourite has been successfully deleted.'}, status=status.HTTP_200_OK)

class FavouriteListView(generics.ListAPIView):
    """
    List Favourite Landmarks

    Retrieves a list of landmarks marked as favourites by the authenticated user.
    """
    serializer_class = LandmarkSerializer

    def get_queryset(self):
        """
        Retrieve landmarks liked by the authenticated user.
        """
        user = self.request.user
        return Landmark.objects.filter(liked_by__user=user)
