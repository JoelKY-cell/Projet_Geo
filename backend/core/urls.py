from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, UserViewSet, dashboard_stats

# Disable format suffix to avoid converter conflict
router = DefaultRouter()
router.include_format_suffixes = False
router.register(r'companies', CompanyViewSet)
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard_stats, name='dashboard-stats'),
]
