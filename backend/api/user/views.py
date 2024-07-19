from .models import CustomUser
from .serializer import CustomUserSerializer, UserCreateSerializer, UserUpdateSerializer
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

# Create your views here.
class UserCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserCreateSerializer

class UserListView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return CustomUserSerializer

class LoginView(generics.GenericAPIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        print(username, password)
        user = authenticate(username=username, password=password)
        if user is not None:
            print("in user not none")
            refresh = CustomRefreshToken().for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'date_of_birth': str(user.date_of_birth),
                'gender': user.gender,
                'department': user.department,
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