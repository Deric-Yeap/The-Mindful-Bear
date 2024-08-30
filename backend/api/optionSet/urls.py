from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.OptionSetViewSet, basename='gender')
urlpatterns = router.urls
