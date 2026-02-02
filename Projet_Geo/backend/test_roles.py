"""
Script de test des contraintes de rôles
Execute: python manage.py shell < test_roles.py
"""

from users.models import User
from core.models import Company
from django.db import IntegrityError

print("\n" + "="*60)
print("TEST DES CONTRAINTES DE RÔLES")
print("="*60)

# Test 1: Super Admin ne peut pas avoir de company
print("\n[TEST 1] Super Admin avec company → DOIT ÉCHOUER")
try:
    company = Company.objects.first()
    user = User(username='test_super', role='super_admin', company=company)
    user.save()
    print("❌ ÉCHEC: Super Admin créé avec company")
except ValueError as e:
    print(f"✅ SUCCÈS: {e}")

# Test 2: Admin doit avoir une company
print("\n[TEST 2] Admin sans company → DOIT ÉCHOUER")
try:
    user = User(username='test_admin', role='admin', company=None)
    user.save()
    print("❌ ÉCHEC: Admin créé sans company")
except ValueError as e:
    print(f"✅ SUCCÈS: {e}")

# Test 3: Admin avec company → DOIT RÉUSSIR
print("\n[TEST 3] Admin avec company → DOIT RÉUSSIR")
try:
    company = Company.objects.first()
    if company:
        user = User.objects.create_user(
            username='test_admin_ok',
            password='test123',
            role='admin',
            company=company
        )
        print(f"✅ SUCCÈS: Admin créé avec company={company.name}")
        user.delete()
    else:
        print("⚠️  Aucune company disponible pour le test")
except Exception as e:
    print(f"❌ ÉCHEC: {e}")

# Test 4: Supervisor doit avoir une company
print("\n[TEST 4] Supervisor sans company → DOIT ÉCHOUER")
try:
    user = User(username='test_supervisor', role='supervisor', company=None)
    user.save()
    print("❌ ÉCHEC: Supervisor créé sans company")
except ValueError as e:
    print(f"✅ SUCCÈS: {e}")

# Test 5: User doit avoir une company
print("\n[TEST 5] User sans company → DOIT ÉCHOUER")
try:
    user = User(username='test_user', role='user', company=None)
    user.save()
    print("❌ ÉCHEC: User créé sans company")
except ValueError as e:
    print(f"✅ SUCCÈS: {e}")

# Résumé
print("\n" + "="*60)
print("RÉSUMÉ DES CONTRAINTES")
print("="*60)
print("✅ super_admin → company DOIT être NULL")
print("✅ admin → company DOIT être définie")
print("✅ supervisor → company DOIT être définie")
print("✅ user → company DOIT être définie")
print("="*60 + "\n")
