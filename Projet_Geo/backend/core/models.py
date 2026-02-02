from django.db import models

class Company(models.Model):
    """Modèle Entreprise pour architecture multi-tenant"""
    name = models.CharField(max_length=200, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'companies'
        verbose_name = 'Entreprise'
        verbose_name_plural = 'Entreprises'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class BaseModel(models.Model):
    """Modèle abstrait de base"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
