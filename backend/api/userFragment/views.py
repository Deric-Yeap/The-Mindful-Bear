from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import UserFragment
from .serializer import UserFragmentCreateSerializer, UserFragmentSerializer, UserFragmentUpdateSerializer


class UserFragmentCreateView(generics.CreateAPIView):
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentCreateSerializer

class UserFragmentListView(generics.ListAPIView):
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserFragmentGetByIdView(generics.RetrieveAPIView):
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentSerializer
    lookup_field = "pk"

    def get(self, request, *args, **kwargs):
        try:
            userFragment = self.get_object()
            serializer = self.get_serializer(userFragment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserFragment.DoesNotExist:
            return Response({'detail': 'User Fragment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserFragmentGetByUserIdView(generics.ListAPIView):
    serializer_class = UserFragmentSerializer
    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        print(user_id)
        return UserFragment.objects.filter(user_id=user_id)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({'detail': 'No fragments found for this user.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserFragmentUpdateDestroyView(generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = UserFragment.objects.all()
    serializer_class = UserFragmentUpdateSerializer
    lookup_field = "pk"

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_200_OK)
