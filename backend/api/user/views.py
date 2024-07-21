from .models import CustomUser
from .serializer import CustomUserSerializer, UserCreateSerializer, UserUpdateSerializer
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, NotFound
from rest_framework import status
from django.contrib.auth import authenticate
from ..common.jwt import getMe

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
            user = getMe(request)
            return Response(CustomUserSerializer(user).data)
        except Exception as e:
            raise AuthenticationFailed(f"Authentication failed: {str(e)}")

class UserUpdateDestroyView(generics.GenericAPIView):
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
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = CustomRefreshToken().for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'detail': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class CustomRefreshToken(RefreshToken):
    def for_user(self, user):
        refresh = super().for_user(user)
        #can edit these to add more claims in jwt
        refresh['date_of_birth'] = str(user.date_of_birth)
        refresh['gender'] = user.gender
        refresh['department'] = user.department
        return refresh