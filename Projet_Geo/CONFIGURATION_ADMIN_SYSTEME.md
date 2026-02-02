# 🔐 CONFIGURATION ADMIN SYSTÈME & ADMINS ENTREPRISE

## 📋 HIÉRARCHIE DES RÔLES

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN (Admin Système)              │
│  - Accès global toutes entreprises                          │
│  - Crée les entreprises                                     │
│  - Crée les Admins d'entreprise                             │
│  - company = NULL                                           │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────▼────────────┐              ┌──────────▼─────────────┐
│  ENTREPRISE A      │              │  ENTREPRISE B          │
│                    │              │                        │
│  ┌──────────────┐  │              │  ┌──────────────┐     │
│  │ ADMIN        │  │              │  │ ADMIN        │     │
│  │ - Gère tout  │  │              │  │ - Gère tout  │     │
│  └──────┬───────┘  │              │  └──────┬───────┘     │
│         │          │              │         │             │
│    ┌────┴────┐     │              │    ┌────┴────┐        │
│    │         │     │              │    │         │        │
│  ┌─▼──┐   ┌─▼──┐  │              │  ┌─▼──┐   ┌─▼──┐     │
│  │SUP │   │SUP │  │              │  │SUP │   │SUP │     │
│  └─┬──┘   └─┬──┘  │              │  └─┬──┘   └─┬──┘     │
│    │        │      │              │    │        │        │
│  ┌─▼─┐   ┌─▼─┐    │              │  ┌─▼─┐   ┌─▼─┐       │
│  │USR│   │USR│    │              │  │USR│   │USR│       │
│  └───┘   └───┘    │              │  └───┘   └───┘       │
└────────────────────┘              └────────────────────────┘
```

---

## 👑 SUPER ADMIN (Admin Système)

### Caractéristiques
```python
role = 'super_admin'
company = None  # OBLIGATOIRE
is_superuser = True
```

### Droits
✅ Créer/modifier/supprimer des entreprises
✅ Créer l'Admin principal de chaque entreprise
✅ Voir toutes les entreprises
✅ Voir tous les utilisateurs (toutes entreprises)
✅ Accéder à toutes les données (véhicules, tracking, etc.)
✅ Accès complet à l'admin Django

### Restrictions
❌ Ne peut pas être supprimé par un Admin d'entreprise
❌ Ne doit jamais avoir de `company` assignée

### Création
```bash
python manage.py createsuperuser
# Puis dans le shell:
python manage.py shell
>>> from users.models import User
>>> user = User.objects.get(username='Tanga')
>>> user.role = 'super_admin'
>>> user.save()
```

---

## 🏢 ADMIN D'ENTREPRISE

### Caractéristiques
```python
role = 'admin'
company = Company.objects.get(id=X)  # OBLIGATOIRE
```

### Droits
✅ Gérer tous les modules de SA entreprise uniquement
✅ Créer/modifier/désactiver:
   - Superviseurs de son entreprise
   - Utilisateurs simples de son entreprise
✅ Gérer:
   - Véhicules de son entreprise
   - Boîtiers GPS de son entreprise
   - Conducteurs de son entreprise
   - Alertes de son entreprise
   - Rapports de son entreprise

### Restrictions
❌ Ne peut pas créer d'entreprise
❌ Ne peut pas créer d'Admin (ni pour sa company, ni pour une autre)
❌ Ne peut pas accéder aux données d'une autre entreprise
❌ Ne peut pas supprimer le Super Admin
❌ Ne peut pas être supprimé par un Superviseur

### Création (par Super Admin uniquement)
```python
# Via API: POST /api/companies/{id}/create_admin/
{
    "username": "admin_entrepriseA",
    "email": "admin@entrepriseA.com",
    "password": "password123",
    "first_name": "Admin",
    "last_name": "Entreprise A"
}
```

---

## 👨💼 SUPERVISEUR

### Caractéristiques
```python
role = 'supervisor'
company = Company.objects.get(id=X)  # OBLIGATOIRE
```

### Droits
✅ Créer des utilisateurs simples de son entreprise
✅ Consulter toutes les données de son entreprise
✅ Superviser les activités
✅ Gérer les véhicules et boîtiers

### Restrictions
❌ Ne peut pas créer d'Admin
❌ Ne peut pas créer d'autre Superviseur
❌ Ne peut pas supprimer d'Admin
❌ Ne peut pas accéder aux données d'une autre entreprise

### Création (par Admin d'entreprise)
```python
# Via API: POST /api/users/
{
    "username": "supervisor1",
    "email": "supervisor@entrepriseA.com",
    "password": "password123",
    "role": "supervisor",
    "company": 1  # ID de l'entreprise
}
```

---

## 👤 UTILISATEUR SIMPLE

### Caractéristiques
```python
role = 'user'
company = Company.objects.get(id=X)  # OBLIGATOIRE
```

### Droits
✅ Consultation uniquement
✅ Voir les véhicules de son entreprise
✅ Voir les positions GPS
✅ Voir les rapports

### Restrictions
❌ Aucune création/modification/suppression
❌ Lecture seule

### Création (par Admin ou Superviseur)
```python
# Via API: POST /api/users/
{
    "username": "user1",
    "email": "user@entrepriseA.com",
    "password": "password123",
    "role": "user",
    "company": 1
}
```

---

## 🔄 FLUX DE CRÉATION DES COMPTES

### 1️⃣ Création d'une entreprise
```
Super Admin → POST /api/companies/
{
    "name": "Entreprise A"
}
```

### 2️⃣ Création de l'Admin d'entreprise
```
Super Admin → POST /api/companies/{id}/create_admin/
{
    "username": "admin_A",
    "email": "admin@entrepriseA.com",
    "password": "password123"
}
```

### 3️⃣ Création de Superviseurs
```
Admin Entreprise → POST /api/users/
{
    "username": "supervisor1",
    "role": "supervisor",
    "company": 1
}
```

### 4️⃣ Création d'Utilisateurs Simples
```
Admin ou Superviseur → POST /api/users/
{
    "username": "user1",
    "role": "user",
    "company": 1
}
```

---

## 🔐 RÈGLES DE SÉCURITÉ

### Isolation par Entreprise
```python
# Dans les ViewSets
def get_queryset(self):
    if self.request.user.is_super_admin():
        return Model.objects.all()
    return Model.objects.filter(company=self.request.user.company)
```

### Validation des Permissions
```python
# Dans les Serializers
def validate(self, data):
    user = self.context['request'].user
    
    if user.is_admin():
        # Ne peut créer que supervisor et user
        if data['role'] not in ['supervisor', 'user']:
            raise ValidationError("Interdit")
    
    if user.is_supervisor():
        # Ne peut créer que user
        if data['role'] != 'user':
            raise ValidationError("Interdit")
```

### Protection contre la Suppression
```python
def perform_destroy(self, instance):
    # Empêcher suppression Super Admin
    if instance.is_super_admin():
        raise PermissionError("Impossible")
    
    # Empêcher suppression Admin par non-super-admin
    if instance.is_admin() and not user.is_super_admin():
        raise PermissionError("Interdit")
```

---

## 📊 MATRICE DES PERMISSIONS

| Action | Super Admin | Admin | Supervisor | User |
|--------|-------------|-------|------------|------|
| Créer Entreprise | ✅ | ❌ | ❌ | ❌ |
| Créer Admin | ✅ | ❌ | ❌ | ❌ |
| Créer Supervisor | ✅ | ✅ | ❌ | ❌ |
| Créer User | ✅ | ✅ | ✅ | ❌ |
| Voir toutes entreprises | ✅ | ❌ | ❌ | ❌ |
| Voir sa company | ✅ | ✅ | ✅ | ✅ |
| Gérer véhicules | ✅ | ✅ | ✅ | ❌ |
| Voir positions GPS | ✅ | ✅ | ✅ | ✅ |
| Supprimer Admin | ✅ | ❌ | ❌ | ❌ |

---

## 🚀 ENDPOINTS API

### Entreprises (Super Admin uniquement)
```
GET    /api/companies/              # Liste entreprises
POST   /api/companies/              # Créer entreprise
GET    /api/companies/{id}/         # Détails entreprise
PUT    /api/companies/{id}/         # Modifier entreprise
DELETE /api/companies/{id}/         # Supprimer entreprise
POST   /api/companies/{id}/create_admin/  # Créer admin entreprise
```

### Utilisateurs (Selon rôle)
```
GET    /api/users/                  # Liste (filtrée par company)
POST   /api/users/                  # Créer utilisateur
GET    /api/users/{id}/             # Détails utilisateur
PUT    /api/users/{id}/             # Modifier utilisateur
DELETE /api/users/{id}/             # Désactiver utilisateur
```

---

## ✅ CHECKLIST DE CONFIGURATION

- [x] Modèle User avec 4 rôles
- [x] Modèle Company
- [x] Permissions DRF (IsSuperAdmin, IsAdmin, IsSupervisor)
- [x] Serializers avec validation par rôle
- [x] ViewSets avec isolation par company
- [x] Middleware d'isolation
- [x] Protection contre suppression Super Admin
- [x] Validation création utilisateurs selon hiérarchie
- [x] Frontend avec menu adapté par rôle

---

## 🎯 RÉSUMÉ

**Super Admin** → Gère tout le système
**Admin** → Gère son entreprise
**Supervisor** → Crée des users, supervise
**User** → Consultation uniquement

**Isolation stricte** → Chaque entreprise voit uniquement ses données
**Sécurité** → Validation à tous les niveaux (serializer, view, permission)
**Évolutif** → Ajout facile de nouvelles entreprises

**Architecture SaaS multi-tenant production-ready!** 🎉
