from django.db import models
from django.contrib.auth import get_user_model
from vehicles.models import Vehicle
from drivers.models import Driver

User = get_user_model()

class Report(models.Model):
    """
    Modèle pour la génération et l'historique des rapports
    """
    REPORT_TYPES = [
        ('vehicle', 'Rapport véhicule'),
        ('driver', 'Rapport conducteur'),
        ('fleet', 'Rapport flotte'),
        ('fuel', 'Rapport carburant'),
        ('alerts', 'Rapport alertes'),
        ('trips', 'Rapport trajets'),
        ('consumption', 'Rapport consommation'),
    ]
    
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
    ]
    
    # Identification
    name = models.CharField(max_length=100, verbose_name="Nom du rapport")
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES, verbose_name="Type")
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='pdf', verbose_name="Format")
    
    # Filtres
    vehicle = models.ForeignKey(
        Vehicle, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        verbose_name="Véhicule"
    )
    driver = models.ForeignKey(
        Driver, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        verbose_name="Conducteur"
    )
    start_date = models.DateField(verbose_name="Date début")
    end_date = models.DateField(verbose_name="Date fin")
    
    # Fichier généré
    file_path = models.CharField(max_length=255, blank=True, verbose_name="Chemin fichier")
    file_size = models.IntegerField(null=True, blank=True, verbose_name="Taille (octets)")
    
    # Métadonnées
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Généré par")
    generated_at = models.DateTimeField(auto_now_add=True, verbose_name="Généré le")
    
    # Statistiques incluses (JSON)
    statistics = models.JSONField(null=True, blank=True, verbose_name="Statistiques")
    
    class Meta:
        db_table = 'reports'
        verbose_name = 'Rapport'
        verbose_name_plural = 'Rapports'
        ordering = ['-generated_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_report_type_display()} - {self.generated_at.date()}"

class ReportSchedule(models.Model):
    """
    Modèle pour la planification automatique de rapports
    """
    FREQUENCY_CHOICES = [
        ('daily', 'Quotidien'),
        ('weekly', 'Hebdomadaire'),
        ('monthly', 'Mensuel'),
    ]
    
    name = models.CharField(max_length=100, verbose_name="Nom")
    report_type = models.CharField(max_length=20, choices=Report.REPORT_TYPES, verbose_name="Type")
    format = models.CharField(max_length=10, choices=Report.FORMAT_CHOICES, default='pdf')
    
    # Planification
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, verbose_name="Fréquence")
    day_of_week = models.IntegerField(null=True, blank=True, verbose_name="Jour de la semaine (0-6)")
    day_of_month = models.IntegerField(null=True, blank=True, verbose_name="Jour du mois (1-31)")
    time = models.TimeField(verbose_name="Heure d'envoi")
    
    # Destinataires
    email_recipients = models.TextField(verbose_name="Destinataires email (séparés par ;)")
    
    # Filtres
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True, blank=True)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, null=True, blank=True)
    
    # Statut
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    last_run = models.DateTimeField(null=True, blank=True, verbose_name="Dernière exécution")
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'report_schedules'
        verbose_name = 'Planification rapport'
        verbose_name_plural = 'Planifications rapports'
    
    def __str__(self):
        return f"{self.name} - {self.get_frequency_display()}"