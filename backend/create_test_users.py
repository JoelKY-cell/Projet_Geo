#!/usr/bin/env python
"""
Script pour créer automatiquement les utilisateurs de test en production
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

def create_test_users():
    """Crée les utilisateurs de test s'ils n'existent pas déjà"""
    
    # Administrateur
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@tangagps.com',
            password='admin123',
            role='admin',
            first_name='Admin',
            last_name='System'
        )
        print('✅ Utilisateur admin créé')
    else:
        print('ℹ️  Utilisateur admin existe déjà')
    
    # Superviseur
    if not User.objects.filter(username='supervisor').exists():
        User.objects.create_user(
            username='supervisor',
            email='supervisor@tangagps.com',
            password='super123',
            role='supervisor',
            first_name='Super',
            last_name='Visor'
        )
        print('✅ Utilisateur supervisor créé')
    else:
        print('ℹ️  Utilisateur supervisor existe déjà')
    
    # Utilisateur simple
    if not User.objects.filter(username='user').exists():
        User.objects.create_user(
            username='user',
            email='user@tangagps.com',
            password='user123',
            role='user',
            first_name='Simple',
            last_name='User'
        )
        print('✅ Utilisateur user créé')
    else:
        print('ℹ️  Utilisateur user existe déjà')
    
    print('\n🎉 Configuration des utilisateurs terminée!')

if __name__ == '__main__':
    create_test_users()
