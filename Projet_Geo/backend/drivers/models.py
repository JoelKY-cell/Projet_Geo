from django.db import models
from vehicles.models import Vehicle

class Driver(models.Model):
    """
    Modèle pour les conducteurs avec identification RFID
    """
    # Informations personnelles
    first_name = models.CharField(max_length=50, verbose_name="Prénom")
    last_name = models.CharField(max_length=50, verbose_name="Nom")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    email = models.EmailField(blank=True, verbose_name="Email")
    
    # Identification
    license_number = models.CharField(max_length=20, unique=True, verbose_name="Numéro de permis")
    license_expiry = models.DateField(null=True, blank=True, verbose_name="Expiration permis")
    rfid_tag = models.CharField(max_length=20, unique=True, blank=True, verbose_name="Badge RFID")
    
    # Véhicules autorisés
    authorized_vehicles = models.ManyToManyField(
        Vehicle, 
        related_name='authorized_drivers', 
        blank=True,
        verbose_name="Véhicules autorisés"
    )
    
    # Statut
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    # Dates
    hire_date = models.DateField(null=True, blank=True, verbose_name="Date d'embauche")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'drivers'
        verbose_name = 'Conducteur'
        verbose_name_plural = 'Conducteurs'
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

class DriverSession(models.Model):
    """
    Modèle pour les sessions de conduite
    Enregistre quand un conducteur utilise un véhicule
    """
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='sessions')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='driver_sessions')
    
    # Période
    start_time = models.DateTimeField(verbose_name="Début session")
    end_time = models.DateTimeField(null=True, blank=True, verbose_name="Fin session")
    
    # Statistiques de la session
    distance = models.FloatField(default=0, verbose_name="Distance parcourue (km)")
    max_speed = models.FloatField(default=0, verbose_name="Vitesse max (km/h)")
    avg_speed = models.FloatField(default=0, verbose_name="Vitesse moyenne (km/h)")
    harsh_braking_count = models.IntegerField(default=0, verbose_name="Freinages brusques")
    harsh_acceleration_count = models.IntegerField(default=0, verbose_name="Accélérations brusques")
    
    # Statut
    is_active = models.BooleanField(default=True, verbose_name="Session active")
    
    class Meta:
        db_table = 'driver_sessions'
        verbose_name = 'Session de conduite'
        verbose_name_plural = 'Sessions de conduite'
        ordering = ['-start_time']
    
    def __str__(self):
        return f"{self.driver.get_full_name()} - {self.vehicle.license_plate} - {self.start_time}"