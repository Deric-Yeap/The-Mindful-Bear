from rest_framework.routers import DefaultRouter
from .views import EmotionViewSet

router = DefaultRouter()
router.register('', EmotionViewSet, basename='emotion')
urlpatterns = router.urls