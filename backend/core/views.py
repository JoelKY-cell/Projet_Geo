from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from core.models import Company
from users.models import User
from core.serializers import CompanySerializer, UserSerializer
from core.permissions import IsSuperAdmin, IsAdmin, IsSupervisor

class CompanyViewSet(viewsets.ModelViewSet):
    """CRUD Companies - Réservé Super Admin"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin]
    pagination_class = None
    
    @action(detail=True, methods=['post'])
    def create_admin(self, request, pk=None):
        """Créer l'admin d'une entreprise"""
        company = self.get_object()
        
        # Vérifier qu'il n'y a pas déjà un admin
        if company.users.filter(role='admin').exists():
            return Response(
                {'error': 'Cette entreprise a déjà un administrateur'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        data = request.data.copy()
        data['role'] = 'admin'
        data['company'] = company.id
        
        serializer = UserSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    """CRUD Users avec permissions hiérarchiques"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Super Admin voit tout
        if user.is_super_admin():
            return User.objects.all()
        
        # Admin voit sa company
        if user.is_admin():
            return User.objects.filter(company=user.company)
        
        # Superviseur voit sa company (users uniquement)
        if user.is_supervisor():
            return User.objects.filter(company=user.company, role='user')
        
        # User ne voit que lui-même
        return User.objects.filter(id=user.id)
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsSupervisor()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        user = self.request.user
        
        # Auto-assigner la company pour admin/supervisor
        if not user.is_super_admin():
            serializer.save(company=user.company)
        else:
            serializer.save()
    
    def perform_destroy(self, instance):
        user = self.request.user
        
        # Empêcher la suppression du super admin
        if instance.is_super_admin():
            raise PermissionError("Impossible de supprimer un Super Admin")
        
        # Empêcher la suppression d'un admin par un non-super-admin
        if instance.is_admin() and not user.is_super_admin():
            raise PermissionError("Seul un Super Admin peut supprimer un Admin d'entreprise")
        
        # Vérifier l'isolation par company
        if not user.is_super_admin() and instance.company != user.company:
            raise PermissionError("Vous ne pouvez supprimer que les utilisateurs de votre entreprise")
        
        instance.is_active = False
        instance.save()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Statistiques du tableau de bord selon le rôle"""
    user = request.user
    today = timezone.now().date()
    
    try:
        from plugins.vehicles.models import Vehicle
        from plugins.devices.models import Device
        from plugins.tracking.models import Position, Trip
        from plugins.drivers.models import Driver, DriverSession
        from plugins.alerts.models import Alert
        from plugins.fuel.models import FuelEvent
        from plugins.reports.models import Report
        
        # Filtrer par company si pas super_admin
        company_filter = {} if user.is_super_admin() else {'company': user.company}
        
        stats = {
            'vehicles': {
                'total': Vehicle.objects.filter(**company_filter).count(),
                'active': Vehicle.objects.filter(**company_filter, is_active=True).count(),
            },
            'drivers': {
                'total': Driver.objects.filter(**company_filter).count(),
                'active_sessions': DriverSession.objects.filter(
                    driver__company=user.company if not user.is_super_admin() else None,
                    end_time__isnull=True
                ).count() if not user.is_super_admin() else DriverSession.objects.filter(end_time__isnull=True).count(),
            },
            'alerts': {
                'total': Alert.objects.filter(**company_filter).count(),
                'unacknowledged': Alert.objects.filter(**company_filter, acknowledged=False).count(),
                'recent': list(Alert.objects.filter(**company_filter).order_by('-created_at')[:5].values(
                    'alert_type', 'severity', 'vehicle__license_plate'
                ).annotate(type=Count('alert_type')))[:5]
            },
            'reports': {
                'total': Report.objects.filter(**company_filter).count(),
            },
            'trips': {
                'today_count': Trip.objects.filter(**company_filter, start_time__date=today).count(),
                'total_distance': Trip.objects.filter(**company_filter, start_time__date=today).aggregate(
                    total=Sum('distance'))['total'] or 0,
                'avg_speed': Trip.objects.filter(**company_filter, start_time__date=today).aggregate(
                    avg=Avg('average_speed'))['avg'] or 0,
            },
            'fuel': {
                'events_today': FuelEvent.objects.filter(**company_filter, timestamp__date=today).count(),
                'theft_events': FuelEvent.objects.filter(**company_filter, event_type='theft').count(),
            },
            'devices': {
                'total': Device.objects.filter(**company_filter).count(),
                'fuel_sensors': Device.objects.filter(**company_filter, has_fuel_sensor=True).count(),
                'rfid_sensors': Device.objects.filter(**company_filter, has_rfid=True).count(),
            },
            'users': {
                'total': User.objects.filter(**company_filter).count() if not user.is_super_admin() else User.objects.count(),
            }
        }
        
        # Formater les alertes récentes
        if stats['alerts']['recent']:
            recent_alerts = Alert.objects.filter(**company_filter).order_by('-created_at')[:5]
            stats['alerts']['recent'] = [{
                'type': alert.alert_type,
                'vehicle': alert.vehicle.license_plate if alert.vehicle else 'N/A',
                'severity': alert.severity
            } for alert in recent_alerts]
        
        return Response(stats)
        
    except Exception as e:
        # Si les modules n'existent pas encore, retourner des stats vides
        return Response({
            'vehicles': {'total': 0, 'active': 0},
            'drivers': {'total': 0, 'active_sessions': 0},
            'alerts': {'total': 0, 'unacknowledged': 0, 'recent': []},
            'reports': {'total': 0},
            'trips': {'today_count': 0, 'total_distance': 0, 'avg_speed': 0},
            'fuel': {'events_today': 0, 'theft_events': 0},
            'devices': {'total': 0, 'fuel_sensors': 0, 'rfid_sensors': 0},
            'users': {'total': User.objects.filter(company=user.company).count() if not user.is_super_admin() else User.objects.count()}
        })
