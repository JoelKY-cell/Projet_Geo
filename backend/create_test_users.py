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
        defaults={'is_active': True}
    )
    if created:
        print('✅ Entreprise de test créée')
    else:
        print('ℹ️  Entreprise de test existe déjà')
    
    # Super Admin (pas d'entreprise - accès global)
    if not User.objects.filter(username='superadmin').exists():
        superadmin = User.objects.create_superuser(
            username='superadmin',
            email='superadmin@tangagps.com',
            password='super123',
            first_name='Super',
            last_name='Admin'
        )
        superadmin.role = 'super_admin'
        superadmin.company = None
        superadmin.save()
        print('✅ Super Admin créé (accès global)')
    else:
        print('ℹ️  Super Admin existe déjà')
    
    # Admin de l'entreprise
    if not User.objects.filter(username='admin').exists():
        admin = User(
            username='admin',
            email='admin@tangagps.com',
            first_name='Admin',
            last_name='Company',
            role='admin',
            company=company,
            is_staff=True
        )
        admin.set_password('admin123')
        admin.save()
        print('✅ Admin entreprise créé')
    else:
        print('ℹ️  Admin entreprise existe déjà')
    
    # Superviseur
    if not User.objects.filter(username='supervisor').exists():
        supervisor = User(
            username='supervisor',
            email='supervisor@tangagps.com',
            first_name='Super',
            last_name='Visor',
            role='supervisor',
            company=company
        )
        supervisor.set_password('super123')
        supervisor.save()
        print('✅ Superviseur créé')
    else:
        print('ℹ️  Superviseur existe déjà')
    
    # Utilisateur simple
    if not User.objects.filter(username='user').exists():
        user = User(
            username='user',
            email='user@tangagps.com',
            first_name='Simple',
            last_name='User',
            role='user',
            company=company
        )
        user.set_password('user123')
        user.save()
        print('✅ Utilisateur simple créé')
    else:
        print('ℹ️  Utilisateur simple existe déjà')
    
    print('\n🎉 Configuration terminée!')
    print('\n📊 Résumé:')
    print(f'  - 1 Super Admin (accès global)')
    print(f'  - 1 Entreprise: {company.name}')
    print(f'  - 3 Utilisateurs de l\'entreprise (admin, supervisor, user)')

if __name__ == '__main__':
    create_test_users()
