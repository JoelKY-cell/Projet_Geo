from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum, Count, Avg
from vehicles.models import Vehicle
from tracking.models import Position, Trip
from alerts.models import Alert
from fuel.models import FuelEvent

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Tableau de bord personnalisé selon le rôle de l'utilisateur
    - Admin: Toutes les statistiques
    - Superviseur: Statistiques de gestion de flotte
    - Utilisateur: Statistiques de consultation
    """
    user = request.user
    now = timezone.now()
    today = now.date()
    
    # Statistiques de base (tous les rôles)
    total_vehicles = Vehicle.objects.filter(is_active=True).count()
    active_vehicles = Position.objects.filter(
        timestamp__gte=now - timedelta(hours=1)
    ).values('vehicle').distinct().count()
    
    # Trajets du jour
    today_trips = Trip.objects.filter(start_time__date=today)
    total_distance = today_trips.aggregate(Sum('distance'))['distance__sum'] or 0
    
    # Alertes non traitées
    unacknowledged_alerts = Alert.objects.filter(is_acknowledged=False).count()
    
    # Événements carburant du jour
    fuel_events_today = FuelEvent.objects.filter(timestamp__date=today).count()
    
    stats = {
        'user_role': user.get_role_display(),
        'vehicles': {
            'total': total_vehicles,
            'active': active_vehicles,
            'inactive': total_vehicles - active_vehicles
        },
        'trips': {
            'today_count': today_trips.count(),
            'total_distance': round(total_distance, 2)
        },
        'alerts': {
            'unacknowledged': unacknowledged_alerts
        },
        'fuel': {
            'events_today': fuel_events_today
        }
    }
    
    # Statistiques supplémentaires pour Admin et Superviseur
    if user.is_admin() or user.is_supervisor():
        stats['trips']['avg_speed'] = round(
            today_trips.aggregate(Avg('avg_speed'))['avg_speed__avg'] or 0, 2
        )
        stats['trips']['max_speed'] = round(
            today_trips.aggregate(Avg('max_speed'))['max_speed__avg'] or 0, 2
        )
    
    # Statistiques admin uniquement
    if user.is_admin():
        from drivers.models import DriverSession
        active_sessions = DriverSession.objects.filter(is_active=True).count()
        stats['drivers'] = {
            'active_sessions': active_sessions
        }
    
    return Response(stats)