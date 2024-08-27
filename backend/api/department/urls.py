from .views import DepartmentViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('', DepartmentViewSet, basename='department')
urlpatterns = router.urls

