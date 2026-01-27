from users.models import User

# Création des 3 types d'utilisateurs selon le cahier des charges

# 1. Administrateur - Accès complet
admin = User.objects.create_user(
    username='admin',
    email='admin@gps-platform.com',
    password='admin123',
    first_name='Admin',
    last_name='Système',
    role='admin',
    is_staff=True,
    is_superuser=True
)
print(f"✓ Administrateur créé: {admin.username}")

# 2. Superviseur - Gestion de flotte
supervisor = User.objects.create_user(
    username='supervisor',
    email='supervisor@gps-platform.com',
    password='super123',
    first_name='Jean',
    last_name='Dupont',
    role='supervisor',
    is_staff=True
)
print(f"✓ Superviseur créé: {supervisor.username}")

# 3. Utilisateur simple - Consultation uniquement
user = User.objects.create_user(
    username='user',
    email='user@gps-platform.com',
    password='user123',
    first_name='Marie',
    last_name='Martin',
    role='user'
)
print(f"✓ Utilisateur simple créé: {user.username}")

print("\n=== Comptes créés avec succès ===")
print("Admin: admin / admin123")
print("Superviseur: supervisor / super123")
print("Utilisateur: user / user123")