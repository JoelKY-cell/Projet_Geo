from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Modèle utilisateur multi-tenant avec 4 rôles:
    - SUPER_ADMIN: Accès global toutes entreprises
    - ADMIN: Accès complet à son entreprise
    - SUPERVISOR: Gestion flotte + création users
    - USER: Consultation uniquement
    """
    ROLE_CHOICES = [
        ('super_admin', 'Super Administrateur'),
        ('admin', 'Administrateur'),
        ('supervisor', 'Superviseur'),
        ('user', 'Utilisateur simple'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    company = models.ForeignKey(
        'core.Company',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='users',
        help_text="Null uniquement pour SUPER_ADMIN"
    )
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def is_super_admin(self):
        return self.role == 'super_admin'
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_supervisor(self):
        return self.role == 'supervisor'
    
    def is_simple_user(self):
        return self.role == 'user'
    
    def save(self, *args, **kwargs):
        if self.role == 'super_admin':
            self.company = None
        elif not self.company and not self.is_superuser:
            raise ValueError(f"Le rôle {self.role} nécessite une entreprise")
        super().save(*args, **kwargs)