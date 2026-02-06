#!/usr/bin/env python
"""
Script pour créer automatiquement les utilisateurs de test en production
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from core.models import Company

def create_test_users():
    """Crée les utilisateurs de test s'ils n'existent pas déjà"""
    
    # Créer une entreprise de test si elle n'existe pas
    company, created = Company.objects.get_or_create(
        name='Tanga GPS Demo',
        defaults={
            'address': 'Dar es Salaam, Tanzania',
            'phone': '+255 123 456 789',
            'email': 'contact@tangagps.com'
        }
    )
    if created:
        print('✅ Entreprise de test créée')
    else:
        print('ℹ️  Entreprise de test existe déjà')
    
    # Administrateur (super_admin - pas besoin de company)
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@tangagps.com',
            password='admin123',
            first_name='Admin',
            last_name='System'
        )
        admin.role = 'super_admin'
        admin.save()
        print('✅ Utilisateur admin créé')
    else:
        print('ℹ️  Utilisateur admin existe déjà')
    
    # Superviseur
    if not User.objects.filter(username='supervisor').exists():
        supervisor = User.objects.create_user(
            username='supervisor',
            email='supervisor@tangagps.com',
            password='super123',
            first_name='Super',
            last_name='Visor'
        )
        supervisor.role = 'supervisor'
        supervisor.company = company
        supervisor.save()
        print('✅ Utilisateur supervisor créé')
    else:
        print('ℹ️  Utilisateur supervisor existe déjà')
    
    # Utilisateur simple
    if not User.objects.filter(username='user').exists():
        user = User.objects.create_user(
            username='user',
            email='user@tangagps.com',
            password='user123',
            first_name='Simple',
            last_name='User'
        )
        user.role = 'user'
        user.company = company
        user.save()
        print('✅ Utilisateur user créé')
    else:
        print('ℹ️  Utilisateur user existe déjà')
    
    print('\n🎉 Configuration des utilisateurs terminée!')

if __name__ == '__main__':
    create_test_users()
