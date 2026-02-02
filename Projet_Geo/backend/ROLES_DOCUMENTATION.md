# Documentation des Rôles Utilisateurs

## Architecture Multi-tenant

### 1. SUPER_ADMIN (Admin Système)
**Caractéristiques:**
- `role = 'super_admin'`
- `company = NULL` (pas d'entreprise)
- Accès global à toutes les entreprises
- Dashboard sombre dédié

**Permissions:**
- ✅ Créer/Modifier/Supprimer des entreprises
- ✅ Créer des admins d'entreprise (role='admin')
- ✅ Voir toutes les données de toutes les entreprises
- ✅ Gérer tous les utilisateurs
- ✅ Accès aux statistiques globales

**Restrictions:**
- ❌ Ne peut PAS avoir de company assignée
- ❌ Un seul super_admin par système (recommandé)

---

### 2. ADMIN (Admin Entreprise)
**Caractéristiques:**
- `role = 'admin'`
- `company = FK` (obligatoire)
- Accès complet à SON entreprise uniquement
- Dashboard AdminLTE clair

**Permissions:**
- ✅ Créer des superviseurs (role='supervisor') pour son entreprise
- ✅ Créer des utilisateurs (role='user') pour son entreprise
- ✅ Gérer les véhicules de son entreprise
- ✅ Gérer les conducteurs de son entreprise
- ✅ Voir toutes les données de son entreprise
- ✅ Générer des rapports pour son entreprise

**Restrictions:**
- ❌ Ne peut PAS créer d'autres admins
- ❌ Ne peut PAS créer de super_admin
- ❌ Ne peut PAS voir les données d'autres entreprises
- ❌ DOIT avoir une company assignée

---

### 3. SUPERVISOR (Superviseur)
**Caractéristiques:**
- `role = 'supervisor'`
- `company = FK` (obligatoire)
- Gestion de flotte + création d'utilisateurs

**Permissions:**
- ✅ Créer des utilisateurs simples (role='user') pour son entreprise
- ✅ Gérer les véhicules de son entreprise
- ✅ Assigner des conducteurs
- ✅ Voir les données de son entreprise

**Restrictions:**
- ❌ Ne peut PAS créer d'admins ou superviseurs
- ❌ Ne peut PAS modifier les paramètres de l'entreprise
- ❌ DOIT avoir une company assignée

---

### 4. USER (Utilisateur Simple)
**Caractéristiques:**
- `role = 'user'`
- `company = FK` (obligatoire)
- Consultation uniquement

**Permissions:**
- ✅ Voir les véhicules de son entreprise
- ✅ Voir les positions en temps réel
- ✅ Consulter les rapports

**Restrictions:**
- ❌ Ne peut PAS créer d'utilisateurs
- ❌ Ne peut PAS modifier les données
- ❌ Accès lecture seule
- ❌ DOIT avoir une company assignée

---

## Hiérarchie des Permissions

```
SUPER_ADMIN (système)
    └── Peut créer → ADMIN (entreprise)
            └── Peut créer → SUPERVISOR
                    └── Peut créer → USER
```

## Validation Backend

### Règles de Création (UserSerializer)

1. **Super Admin crée:**
   - Admin d'entreprise → `role='admin'` + `company=<id>`
   - Superviseur → `role='supervisor'` + `company=<id>`
   - User → `role='user'` + `company=<id>`

2. **Admin d'entreprise crée:**
   - Superviseur → `role='supervisor'` + `company=<sa_company>`
   - User → `role='user'` + `company=<sa_company>`
   - ❌ Erreur si `role='admin'` ou `role='super_admin'`
   - ❌ Erreur si `company != user.company`

3. **Superviseur crée:**
   - User → `role='user'` + `company=<sa_company>`
   - ❌ Erreur si `role != 'user'`
   - ❌ Erreur si `company != user.company`

### Isolation des Données

Tous les modèles avec `company` FK sont automatiquement filtrés:
- Super Admin → Voit tout
- Admin/Supervisor/User → Voit uniquement `company=user.company`

## Base de Données

### Table: users
```sql
id              INTEGER PRIMARY KEY
username        VARCHAR(150) UNIQUE
role            VARCHAR(20) -- 'super_admin', 'admin', 'supervisor', 'user'
company_id      INTEGER NULL -- NULL pour super_admin, FK pour autres
email           VARCHAR(254)
first_name      VARCHAR(150)
last_name       VARCHAR(150)
phone           VARCHAR(20)
is_active       BOOLEAN
created_at      TIMESTAMP
updated_at      TIMESTAMP

CONSTRAINT: role='super_admin' → company_id IS NULL
CONSTRAINT: role IN ('admin','supervisor','user') → company_id IS NOT NULL
```

### Exemple de Données

```sql
-- Admin Système
INSERT INTO users (username, role, company_id) VALUES ('Tanga', 'super_admin', NULL);

-- Admin Entreprise "Acme Corp"
INSERT INTO users (username, role, company_id) VALUES ('admin_acme', 'admin', 1);

-- Superviseur "Acme Corp"
INSERT INTO users (username, role, company_id) VALUES ('supervisor_acme', 'supervisor', 1);

-- User "Acme Corp"
INSERT INTO users (username, role, company_id) VALUES ('user_acme', 'user', 1);
```

## Frontend

### Dashboards
- `super_admin` → `SystemAdminDashboard.jsx` (sombre)
- `admin` → `AdminDashboard.jsx` (AdminLTE clair)
- `supervisor` → `SupervisorDashboard.jsx`
- `user` → `UserDashboard.jsx`

### Formulaire Création Utilisateur
- Super Admin voit: Rôle (admin/supervisor/user) + Entreprise (dropdown)
- Admin voit: Rôle (supervisor/user) + Entreprise (auto-assignée)
- Superviseur voit: Rôle (user) + Entreprise (auto-assignée)
