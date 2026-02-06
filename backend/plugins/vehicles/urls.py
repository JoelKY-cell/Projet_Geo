from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet

router = DefaultRouter()
router.include_format_suffixes = False
router.register(r'', VehicleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]