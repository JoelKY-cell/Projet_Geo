from django.db import models
from django.contrib.auth import get_user_model
from vehicles.models import Vehicle

User = get_user_model()

class Geofence(models.Model):
    """
    Modèle pour les zones géographiques définies (géofencing)
    """
    SHAPE_TYPES = [
        ('circle', 'Cercle'),
        ('polygon', 'Polygone'),
    ]
    
    name = models.CharField(max_length=100, verbose_name="Nom de la zone")
    shape_type = models.CharField(max_length=20, choices=SHAPE_TYPES, verbose_name="Type de forme")
    
    # Coordonnées (JSON pour polygones, centre pour cercles)
    center_latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    center_longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    radius = models.FloatField(null=True, blank=True, verbose_name="Rayon (m)")
    coordinates = models.JSONField(null=True, blank=True, verbose_name="Coordonnées polygone")
    
    is_active = models.BooleanField(default=True, verbose_name="Active")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'geofences'
        verbose_name = 'Zone géographique'
        verbose_name_plural = 'Zones géographiques'
    
    def __str__(self):
        return self.name

class AlertRule(models.Model):
    """
    Modèle pour les règles d'alertes configurables
    """
    ALERT_TYPES = [
        ('speed', 'Excès de vitesse'),
        ('idle', 'Arrêt prolongé'),
        ('geofence_exit', 'Sortie de zone'),
        ('geofence_entry', 'Entrée dans zone'),
        ('device_offline', 'Coupure boîtier'),
        ('fuel_theft', 'Vol de carburant'),
        ('fuel_leak', 'Fuite de carburant'),
        ('harsh_braking', 'Freinage brusque'),
        ('harsh_acceleration', 'Accélération brusque'),
    ]
    
    name = models.CharField(max_length=100, verbose_name="Nom de la règle")
    alert_type = models.CharField(max_length=30, choices=ALERT_TYPES, verbose_name="Type d'alerte")
    
    # Cible
    vehicle = models.ForeignKey(
        Vehicle, 
        on_delete=models.CASCADE, 
        related_name='alert_rules', 
        null=True, 
        blank=True,
        verbose_name="Véhicule (vide = tous)"
    )
    geofence = models.ForeignKey(
        Geofence, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        verbose_name="Zone géographique"
    )
    
    # Seuil
    threshold_value = models.FloatField(verbose_name="Valeur seuil")
    threshold_unit = models.CharField(max_length=20, blank=True, verbose_name="Unité")
    
    # Notifications
    email_notifications = models.BooleanField(default=False, verbose_name="Notifications email")
    email_recipients = models.TextField(blank=True, verbose_name="Destinataires email (séparés par ;)")
    
    # Statut
    is_active = models.BooleanField(default=True, verbose_name="Active")
    
    # Gestion
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Créé par")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'alert_rules'
        verbose_name = 'Règle d\'alerte'
        verbose_name_plural = 'Règles d\'alerte'
    
    def __str__(self):
        return f"{self.name} - {self.get_alert_type_display()}"

class Alert(models.Model):
    """
    Modèle pour les alertes générées
    """
    SEVERITY_LEVELS = [
        ('low', 'Faible'),
        ('medium', 'Moyen'),
        ('high', 'Élevé'),
        ('critical', 'Critique'),
    ]
    
    rule = models.ForeignKey(AlertRule, on_delete=models.CASCADE, related_name='alerts')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='alerts')
    
    # Détails
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS, verbose_name="Sévérité")
    message = models.TextField(verbose_name="Message")
    value = models.FloatField(null=True, blank=True, verbose_name="Valeur mesurée")
    
    # Localisation
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    address = models.CharField(max_length=255, blank=True, verbose_name="Adresse")
    
    # Horodatage
    timestamp = models.DateTimeField(verbose_name="Date/Heure")
    
    # Traitement
    is_acknowledged = models.BooleanField(default=False, verbose_name="Acquittée")
    acknowledged_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='acknowledged_alerts',
        verbose_name="Acquittée par"
    )
    acknowledged_at = models.DateTimeField(null=True, blank=True, verbose_name="Acquittée le")
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'alerts'
        verbose_name = 'Alerte'
        verbose_name_plural = 'Alertes'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['vehicle', '-timestamp']),
            models.Index(fields=['is_acknowledged']),
        ]
    
    def __str__(self):
        return f"{self.vehicle.license_plate} - {self.rule.name} - {self.timestamp}"