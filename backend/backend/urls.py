"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="TheMindfulBear API Documentation",
        default_version='v1',
        description="API documentation for all available endpoints.",
        terms_of_service="https://www.yourdomain.com/terms/",
        contact=openapi.Contact(email="themindfulbear0@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path("admin/", admin.site.urls),
    path("api/gender/", include('api.gender.urls')),
    path("api/department/", include('api.department.urls')),
    path("api/emotion/", include('api.emotion.urls')),
    path("api/color/", include('api.color.urls')),
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path("api/option_set/", include("api.optionSet.urls")),
    path("api/option/", include("api.option.urls")),
    path("api/landmark/", include("api.landmark.urls")),
    path("api/exercise/", include("api.exercise.urls")),
    path("api/users/", include("api.user.urls")),
    path("api/journal/", include("api.journal.urls")),
    path("api/form/", include("api.form.urls")),
    path("api/question/", include("api.question.urls")),
    path("api/session/", include("api.session.urls")),
    path("api/formQuestion/", include("api.formQuestion.urls")),
    path("api/formSession/", include("api.formSession.urls")),
    path("api/userSession/", include("api.userSession.urls")),
    path("api/favourite/", include("api.favourite.urls")),
    path("api/landmarkUserCount/", include("api.landmarkUserCount.urls")), 
    path("api/achievementPoint/", include("api.achievementPoint.urls")),
    path("api/avatar/", include("api.avatar.urls")),
    path("api/userAvatar/", include("api.userAvatar.urls")),
    path("api/article/", include("api.article.urls")),
    path("api/userFragment/", include("api.userFragment.urls")),
    path("api/searchHistory/", include("api.searchHistory.urls")),
    path("api/achievement/", include("api.achievement.urls")),
    path("api/userAchievement/", include("api.userAchievement.urls")),
]
