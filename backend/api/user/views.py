from .models import CustomUser
from .serializer import CustomUserSerializer, UserCreateSerializer, UserUpdateSerializer
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from ..common.permission import CustomDjangoModelPermissions
from rest_framework import status
from django.contrib.auth import authenticate
from django.utils import timezone
from ..common.jwt import getMe
from ..gender.serializer import GenderSerializer
from ..department.serializer import DepartmentSerializer

# Create your views here.
class UserCreateView(generics.CreateAPIView):
    authentication_classes = []
    permission_classes = []
    queryset = CustomUser.objects.all()
    serializer_class = UserCreateSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        custom_serializer = CustomUserSerializer(user)
        return Response(custom_serializer.data, status=status.HTTP_201_CREATED)

class UserGetMeView(generics.RetrieveAPIView):
    def get(self, request):
        try:
            user = request.user
            return Response(CustomUserSerializer(user).data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserUpdateDestroyView(generics.GenericAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = CustomUser.objects.all()

    def put(self, request):
        user = getMe(request)
        try:
            user_instance = CustomUser.objects.get(user_id=user.user_id)
        except CustomUser.DoesNotExist:
            raise NotFound('User not found.')

        serializer = UserUpdateSerializer(user_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = getMe(request)
        try:
            user_instance = CustomUser.objects.get(user_id=user.user_id)
        except CustomUser.DoesNotExist:
            raise NotFound('User not found.')
        user_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class LoginView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            user.last_login = timezone.now()
            user.save()
            refresh = CustomRefreshToken().for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class CustomRefreshToken(RefreshToken):
    def for_user(self, user):
        refresh = super().for_user(user)
        gender_serializer = GenderSerializer(user.gender)
        department_serializer = DepartmentSerializer(user.department)

        #can edit these to add more claims in jwt
        refresh['date_of_birth'] = str(user.date_of_birth)
        refresh['gender'] = gender_serializer.data
        refresh['department'] = department_serializer.data
        return refresh