from django.db import models
from plugins.vehicles.models import Vehicle
from core.models import BaseModel

class Device(BaseModel):
    """
    Modèle pour les boîtiers GPS et capteurs
    Supporte: Teltonika, Coban, Sinotrack
    """
    DEVICE_TYPES = [
        ('gps', 'Boîtier GPS'),
        ('fuel_sensor', 'Capteur carburant'),
        ('rfid', 'Lecteur RFID'),
        ('canbus', 'CAN Bus'),
    ]
    
    BRANDS = [
        ('teltonika', 'Teltonika'),
        ('coban', 'Coban'),
        ('sinotrack', 'Sinotrack'),
        ('other', 'Autre'),
    ]
    
    PROTOCOLS = [
        ('teltonika', 'Teltonika Binary'),
        ('coban', 'Coban ASCII'),
        ('sinotrack', 'Sinotrack Binary'),
    ]
    
    company = models.ForeignKey('core.Company', on_delete=models.CASCADE, related_name='devices', null=True, blank=True)
    imei = models.CharField(max_length=20, unique=True, verbose_name="IMEI", db_index=True)
    device_type = models.CharField(max_length=20, choices=DEVICE_TYPES, verbose_name="Type")
    brand = models.CharField(max_length=20, choices=BRANDS, verbose_name="Marque")
    protocol = models.CharField(max_length=20, choices=PROTOCOLS, verbose_name="Protocole", default='teltonika')
    model = models.CharField(max_length=50, blank=True, verbose_name="Modèle")
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='devices', verbose_name="Véhicule")
    sim_number = models.CharField(max_length=20, blank=True, verbose_name="Numéro SIM")
    apn = models.CharField(max_length=50, blank=True, verbose_name="APN")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    last_communication = models.DateTimeField(null=True, blank=True, verbose_name="Dernière communication")
    installation_date = models.DateField(null=True, blank=True, verbose_name="Date d'installation")
    
    class Meta:
        db_table = 'devices'
        verbose_name = 'Boîtier/Capteur'
        verbose_name_plural = 'Boîtiers/Capteurs'
    
    def __str__(self):
        return f"{self.imei} - {self.get_device_type_display()} ({self.company.name})"