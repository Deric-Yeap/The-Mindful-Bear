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
from datetime import datetime, timedelta
from ..exercise.serializer import ExerciseSerializer
from ..exercise.models import Exercise
from django.db.models import F
from ..landmark.serializer import LandmarkSerializer
from ..landmark.models import Landmark
from django.contrib.auth.models import Group

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
            now = timezone.now()
            yesterday = now - timedelta(days=1)
            if user.last_login and user.last_login.date() == yesterday.date():
                user.login_streak += 1
            elif not user.last_login or user.last_login.date() != now.date():
                user.login_streak = 1
            user.last_login = now
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
    
class UpgradeUserView(generics.GenericAPIView):
    def post(self, request):
        if request.user.groups.filter(name="admin").exists():
            return Response({'error': 'Permission denied. Only admin users can perform this action.'}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('id')
        
        if not user_id:
            return Response({'detail': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            staff_group = Group.objects.get(name='staff')
            if staff_group in user.groups.all():
                user.groups.remove(staff_group)
        except Group.DoesNotExist:
            return Response({'error': "The 'staff' group does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            admin_group = Group.objects.get(name='admin')
            user.groups.add(admin_group)
            user.is_staff = True
        except Group.DoesNotExist:
            return Response({'error': "The 'admin' group does not exist"}, status=status.HTTP_404_NOT_FOUND)

        user.save()
        return Response({'success': f'User {user.email} has been upgraded to admin.'}, status=status.HTTP_200_OK)

class ListUserView(generics.GenericAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = CustomUser.objects.all()

    def get(self, request):
        users = self.get_queryset().values('user_id', 'email', 'is_staff')
        user_list = []

        for user in users:
            if user['is_staff']:
                user_list.append({'key': user['user_id'], 'value': f"{user['email']} (Admin)"})
            else:
                user_list.append({'key': user['user_id'], 'value': user['email']})
        return Response(user_list, status=status.HTTP_200_OK)
    
class UserExercisesView(generics.ListAPIView):
    serializer_class = ExerciseSerializer

    def get_queryset(self):        
        user = self.request.user
        # Join with UserSession and annotate the start_datetime
        exercises = Exercise.objects.filter(
            landmarks__usersessions__user_id=user.user_id
        ).annotate(
            start_datetime=F('landmarks__usersessions__start_datetime')  # Annotate start_datetime from UserSession
        ).distinct()

        return exercises
    
class SessionExercisesView(generics.ListAPIView):
    serializer_class = ExerciseSerializer

    def get_queryset(self):        
        user = self.request.user 
        session_id = self.kwargs['session_id']        
        exercises = Exercise.objects.filter(
            landmarks__usersessions__user_id=user.user_id,
            landmarks__usersessions__session_id=session_id
        ).distinct()

        return exercises

class SessionLandmarksView(generics.ListAPIView):
    serializer_class = LandmarkSerializer

    def get_queryset(self):        
        user = self.request.user 
        session_id = self.kwargs['session_id'] 
        landmarks = Landmark.objects.filter(
            usersessions__user_id=user.user_id,
            usersessions__session_id=session_id
        ).distinct()

        return landmarks