from django.db import models
from vehicles.models import Vehicle
from devices.models import Device

class FuelReading(models.Model):
    """
    Modèle pour les lectures de niveau de carburant
    """
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='fuel_readings')
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    
    # Niveau de carburant
    fuel_level = models.FloatField(verbose_name="Niveau (litres)")
    fuel_percentage = models.FloatField(verbose_name="Pourcentage (%)")
    
    # Horodatage
    timestamp = models.DateTimeField(verbose_name="Date/Heure")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'fuel_readings'
        verbose_name = 'Lecture carburant'
        verbose_name_plural = 'Lectures carburant'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['vehicle', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.fuel_level}L ({self.fuel_percentage}%)"

class FuelEvent(models.Model):
    """
    Modèle pour les événements carburant (pleins, vols, fuites)
    """
    EVENT_TYPES = [
        ('refuel', 'Plein'),
        ('theft', 'Vol suspect'),
        ('leak', 'Fuite'),
        ('consumption_anomaly', 'Consommation anormale'),
    ]
    
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='fuel_events')
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES, verbose_name="Type d'événement")
    
    # Niveaux avant/après
    fuel_before = models.FloatField(verbose_name="Niveau avant (L)")
    fuel_after = models.FloatField(verbose_name="Niveau après (L)")
    fuel_difference = models.FloatField(verbose_name="Différence (L)")
    
    # Localisation
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    address = models.CharField(max_length=255, blank=True, verbose_name="Adresse")
    
    # Horodatage
    timestamp = models.DateTimeField(verbose_name="Date/Heure")
    
    # Validation
    is_confirmed = models.BooleanField(default=False, verbose_name="Confirmé")
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'fuel_events'
        verbose_name = 'Événement carburant'
        verbose_name_plural = 'Événements carburant'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.get_event_type_display()} - {self.timestamp}"

class FuelConsumption(models.Model):
    """
    Modèle pour l'analyse de consommation de carburant
    """
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='fuel_consumptions')
    
    # Période
    start_date = models.DateField(verbose_name="Date début")
    end_date = models.DateField(verbose_name="Date fin")
    
    # Statistiques
    distance = models.FloatField(verbose_name="Distance (km)")
    fuel_consumed = models.FloatField(verbose_name="Carburant consommé (L)")
    avg_consumption = models.FloatField(verbose_name="Consommation moyenne (L/100km)")
    
    # Coûts
    fuel_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Coût carburant")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'fuel_consumptions'
        verbose_name = 'Consommation carburant'
        verbose_name_plural = 'Consommations carburant'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.start_date} à {self.end_date}"