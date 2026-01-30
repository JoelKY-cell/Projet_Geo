from django.db import models
from plugins.vehicles.models import Vehicle
from plugins.devices.models import Device

class Position(models.Model):
    """
    Modèle pour la géolocalisation temps réel
    Stocke chaque position GPS reçue des boîtiers
    """
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='positions')
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    
    # Coordonnées GPS
    latitude = models.DecimalField(max_digits=10, decimal_places=8, verbose_name="Latitude")
    longitude = models.DecimalField(max_digits=11, decimal_places=8, verbose_name="Longitude")
    altitude = models.FloatField(null=True, blank=True, verbose_name="Altitude (m)")
    
    # Données de mouvement
    speed = models.FloatField(default=0, verbose_name="Vitesse (km/h)")
    heading = models.IntegerField(default=0, verbose_name="Direction (degrés)")
    
    # État du véhicule
    engine_on = models.BooleanField(default=False, verbose_name="Moteur allumé")
    ignition = models.BooleanField(default=False, verbose_name="Contact")
    
    # Horodatage
    timestamp = models.DateTimeField(verbose_name="Date/Heure GPS")
    server_timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Date/Heure serveur")
    
    class Meta:
        db_table = 'positions'
        verbose_name = 'Position GPS'
        verbose_name_plural = 'Positions GPS'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['vehicle', '-timestamp']),
            models.Index(fields=['timestamp']),
        ]
    
    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.timestamp}"

class Trip(models.Model):
    """
    Modèle pour l'historique des trajets
    """
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='trips')
    
    # Positions de début et fin
    start_latitude = models.DecimalField(max_digits=10, decimal_places=8)
    start_longitude = models.DecimalField(max_digits=11, decimal_places=8)
    end_latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    end_longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    
    # Statistiques du trajet
    distance = models.FloatField(default=0, verbose_name="Distance (km)")
    max_speed = models.FloatField(default=0, verbose_name="Vitesse max (km/h)")
    avg_speed = models.FloatField(default=0, verbose_name="Vitesse moyenne (km/h)")
    
    # Durées
    start_time = models.DateTimeField(verbose_name="Heure de départ")
    end_time = models.DateTimeField(null=True, blank=True, verbose_name="Heure d'arrivée")
    duration = models.DurationField(null=True, blank=True, verbose_name="Durée")
    idle_time = models.DurationField(null=True, blank=True, verbose_name="Temps d'arrêt")
    
    # Statut
    is_completed = models.BooleanField(default=False, verbose_name="Trajet terminé")
    
    class Meta:
        db_table = 'trips'
        verbose_name = 'Trajet'
        verbose_name_plural = 'Trajets'
        ordering = ['-start_time']
    
    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.start_time.date()}"

class StopPoint(models.Model):
    """
    Modèle pour les points d'arrêt lors d'un trajet
    """
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stop_points')
    
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    
    start_time = models.DateTimeField(verbose_name="Début arrêt")
    end_time = models.DateTimeField(null=True, blank=True, verbose_name="Fin arrêt")
    duration = models.DurationField(null=True, blank=True, verbose_name="Durée arrêt")
    
    address = models.CharField(max_length=255, blank=True, verbose_name="Adresse")
    
    class Meta:
        db_table = 'stop_points'
        verbose_name = 'Point d\'arrêt'
        verbose_name_plural = 'Points d\'arrêt'
        ordering = ['start_time']
    
    def __str__(self):
        return f"Arrêt - {self.trip.vehicle.license_plate} - {self.start_time}"