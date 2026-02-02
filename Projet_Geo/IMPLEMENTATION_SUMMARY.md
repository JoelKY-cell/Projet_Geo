# SYSTÈME DE RÔLES - IMPLÉMENTÉ ✅

## Backend (Déjà en place)

### 1. Modèle User (users/models.py)
```python
role = CharField(choices=['super_admin', 'admin', 'supervisor', 'user'])
company = ForeignKey(Company, null=True)  # NULL pour super_admin uniquement

def save():
    if role == 'super_admin':
        company = None  # Force NULL
    elif not company:
        raise ValueError("Rôle nécessite une entreprise")
```

### 2. Permissions (core/permissions.py)
- `IsSuperAdmin`: Vérifie role='super_admin'
- `IsAdmin`: Vérifie role in ['super_admin', 'admin']
- `IsSupervisor`: Vérifie role in ['super_admin', 'admin', 'supervisor']
- `CompanyIsolationPermission`: Filtre par company

### 3. Serializer (core/serializers.py)
**Validation automatique:**
- Super Admin → Peut créer admin/supervisor/user avec company
- Admin → Peut créer supervisor/user pour SA company uniquement
- Supervisor → Peut créer user pour SA company uniquement

### 4. ViewSet (core/views.py)
**Filtrage automatique:**
```python
def get_queryset():
    if user.is_super_admin():
        return queryset.all()  # Voit tout
    else:
        return queryset.filter(company=user.company)  # Isolation
```

## Frontend (Déjà en place)

### 1. Dashboards Distincts
- `SystemAdminDashboard.jsx` → super_admin (sombre)
- `AdminDashboard.jsx` → admin (AdminLTE)
- `SupervisorDashboard.jsx` → supervisor
- `UserDashboard.jsx` → user

### 2. Formulaire UserManagement
- Super Admin voit: Rôle (admin/supervisor/user) + Entreprise (dropdown)
- Admin voit: Rôle (supervisor/user) + Entreprise (auto-assignée)
- Superviseur voit: Rôle (user) + Entreprise (auto-assignée)

### 3. Routing (App.jsx)
```javascript
if (userRole === 'super_admin') return <SystemAdminDashboard />;
if (userRole === 'admin') return <AdminDashboard />;
```

## Base de Données

### État Actuel
```sql
SELECT username, role, company_id FROM users;
-- Tanga | super_admin | NULL
```

### Contraintes Appliquées
1. ✅ super_admin → company_id IS NULL (forcé par save())
2. ✅ admin/supervisor/user → company_id NOT NULL (validé par save())
3. ✅ Isolation par company dans tous les querysets

## Tests Manuels

### Créer Admin Entreprise (via super_admin)
```bash
POST /api/users/
{
  "username": "admin_acme",
  "password": "pass123",
  "role": "admin",
  "company": 1,
  "email": "admin@acme.com"
}
```

### Créer Supervisor (via admin)
```bash
POST /api/users/
{
  "username": "supervisor_acme",
  "password": "pass123",
  "role": "supervisor",
  "email": "supervisor@acme.com"
  # company auto-assignée
}
```

### Créer User (via supervisor)
```bash
POST /api/users/
{
  "username": "user_acme",
  "password": "pass123",
  "role": "user",
  "email": "user@acme.com"
  # company auto-assignée
}
```

## Résumé

✅ **Backend**: Modèle, permissions, validation, isolation → COMPLET
✅ **Frontend**: Dashboards, formulaires, routing → COMPLET
✅ **Base de données**: Contraintes, migrations → COMPLET

**Différence entre les deux admins:**
- `super_admin` (Tanga) = Admin Système, company=NULL, voit tout
- `admin` = Admin Entreprise, company=FK, voit uniquement son entreprise

**Hiérarchie de création:**
- super_admin → admin (entreprise)
- admin → supervisor + user
- supervisor → user
