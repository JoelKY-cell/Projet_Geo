from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PositionViewSet, TripViewSet, StopPointViewSet

router = DefaultRouter()
router.include_format_suffixes = False
router.register(r'positions', PositionViewSet)
router.register(r'trips', TripViewSet)
router.register(r'stops', StopPointViewSet)

urlpatterns = [
    path('', include(router.urls)),
]