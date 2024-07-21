from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..user.models import CustomUser

def getMe(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise AuthenticationFailed('Authorization header is missing or invalid')
    token = auth_header.split(' ')[1]
    jwt_authenticator = JWTAuthentication()
    try:
        validated_token = jwt_authenticator.get_validated_token(token)
        user = jwt_authenticator.get_user(validated_token)
        return user
    except (AuthenticationFailed) as e:
        raise AuthenticationFailed(f"Authentication failed: {str(e)}")