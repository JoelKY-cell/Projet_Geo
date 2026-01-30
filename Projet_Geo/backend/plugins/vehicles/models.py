from django.db import models

class Vehicle(models.Model):
    """
    Modèle pour la gestion des véhicules/actifs mobiles
    """
    VEHICLE_TYPES = [
        ('car', 'Véhicule'),
        ('motorcycle', 'Moto'),
        ('truck', 'Camion'),
        ('equipment', 'Engin'),
        ('other', 'Autre'),
    ]
    
    # Informations de base
    license_plate = models.CharField(max_length=20, unique=True, verbose_name="Immatriculation")
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPES, verbose_name="Type")
    brand = models.CharField(max_length=50, blank=True, verbose_name="Marque")
    model = models.CharField(max_length=50, blank=True, verbose_name="Modèle")
    year = models.IntegerField(null=True, blank=True, verbose_name="Année")
    color = models.CharField(max_length=30, blank=True, verbose_name="Couleur")
    
    # Caractéristiques techniques
    fuel_capacity = models.FloatField(null=True, blank=True, verbose_name="Capacité carburant (L)")
    fuel_type = models.CharField(max_length=20, blank=True, verbose_name="Type de carburant")
    
    # Statut et gestion
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vehicles'
        verbose_name = 'Véhicule'
        verbose_name_plural = 'Véhicules'
        ordering = ['license_plate']
    
    def __str__(self):
        return f"{self.license_plate} ({self.get_vehicle_type_display()})"