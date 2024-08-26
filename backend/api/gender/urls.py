from .views import GenderViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('', GenderViewSet, basename='gender')
urlpatterns = router.urls

