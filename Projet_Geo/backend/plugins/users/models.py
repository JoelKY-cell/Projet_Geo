from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Modèle utilisateur personnalisé avec 3 rôles:
    - Administrateur: Accès complet à toutes les fonctionnalités
    - Superviseur: Gestion de flotte et consultation des rapports
    - Utilisateur: Consultation uniquement
    """
    ROLE_CHOICES = [
        ('admin', 'Administrateur'),
        ('supervisor', 'Superviseur'),
        ('user', 'Utilisateur simple'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_supervisor(self):
        return self.role == 'supervisor'
    
    def is_simple_user(self):
        return self.role == 'user'