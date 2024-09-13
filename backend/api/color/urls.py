from rest_framework.routers import DefaultRouter
from .views import ColorViewSet

router = DefaultRouter()
router.register('', ColorViewSet, basename='color')
urlpatterns = router.urls