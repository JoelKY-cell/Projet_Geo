# Guide de Démarrage Rapide - Plateforme GPS

## 🚀 Démarrage Rapide

### Option 1: Démarrage Automatique (Recommandé)
```bash
# Double-cliquez sur:
start_all.bat
```
Cela démarre automatiquement le backend ET le frontend.

### Option 2: Démarrage Manuel

**Backend:**
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Accès à l'Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin (admin/admin123)

## 👥 Comptes de Test

### Administrateur (Dashboard Complet)
- **Username**: `admin`
- **Password**: `admin123`
- **Accès**: Toutes les fonctionnalités + statistiques complètes

### Superviseur (Dashboard Gestion de Flotte)
- **Username**: `supervisor`
- **Password**: `super123`
- **Accès**: Gestion véhicules, conducteurs, alertes, rapports

### Utilisateur Simple (Dashboard Consultation)
- **Username**: `user`
- **Password**: `user123`
- **Accès**: Consultation positions, historique, rapports (lecture seule)

## 📊 Dashboards Personnalisés

### Dashboard Administrateur
✅ Statistiques complètes (véhicules, conducteurs, alertes, rapports)
✅ Gestion des utilisateurs
✅ Alertes récentes détaillées
✅ Statistiques système (boîtiers, capteurs)
✅ Sessions conducteurs actives
✅ Événements carburant

### Dashboard Superviseur
✅ Statistiques de flotte
✅ Gestion véhicules et conducteurs
✅ Configuration des alertes
✅ Alertes actives
✅ Distance et trajets du jour

### Dashboard Utilisateur Simple
✅ Statistiques basiques
✅ Véhicules actifs
✅ Distance et trajets du jour
✅ Consultation uniquement

## 🎯 Fonctionnalités par Rôle

| Fonctionnalité | Admin | Superviseur | Utilisateur |
|----------------|:-----:|:-----------:|:-----------:|
| Dashboard personnalisé | ✅ | ✅ | ✅ |
| Carte véhicules | ✅ | ✅ | ✅ |
| Gestion véhicules | ✅ | ✅ | ❌ |
| Gestion conducteurs | ✅ | ✅ | ❌ |
| Configuration alertes | ✅ | ✅ | ❌ |
| Rapports (création) | ✅ | ✅ | ❌ |
| Rapports (lecture) | ✅ | ✅ | ✅ |
| Gestion utilisateurs | ✅ | ❌ | ❌ |
| Statistiques système | ✅ | ❌ | ❌ |

## 📁 Structure du Projet

```
Projet_Geo/
├── backend/                    # Django Backend
│   ├── users/                  # Gestion utilisateurs (3 rôles)
│   ├── vehicles/               # Gestion véhicules
│   ├── devices/                # Boîtiers GPS et capteurs
│   ├── tracking/               # Géolocalisation temps réel
│   ├── drivers/                # Conducteurs et RFID
│   ├── fuel/                   # Gestion carburant
│   ├── alerts/                 # Système d'alertes
│   ├── reports/                # Génération rapports
│   └── core/                   # Dashboard API
│
├── frontend/                   # React Frontend
│   └── src/
│       ├── components/
│       │   ├── AdminDashboard.jsx      # Dashboard admin
│       │   ├── SupervisorDashboard.jsx # Dashboard superviseur
│       │   ├── UserDashboard.jsx       # Dashboard utilisateur
│       │   ├── Login.jsx               # Connexion
│       │   ├── Navbar.jsx              # Navigation (filtrée)
│       │   ├── VehicleMap.jsx          # Carte
│       │   ├── VehicleList.jsx         # Liste véhicules
│       │   └── Reports.jsx             # Rapports
│       └── services/
│           └── api.js                  # API client
│
├── start_all.bat               # Démarrage complet
├── start_frontend.bat          # Démarrage frontend seul
└── start.bat                   # Démarrage backend seul
```

## 🔧 Technologies Utilisées

### Backend
- Django 6.0.1
- Django REST Framework
- JWT Authentication
- SQLite

### Frontend
- React 19
- Material-UI
- Axios
- React Router
- Vite

## 📡 API Endpoints Principaux

### Authentification
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/refresh/` - Refresh token
- `GET /api/auth/profile/` - Profil utilisateur

### Dashboard
- `GET /api/dashboard/` - Statistiques (personnalisées par rôle)

### Véhicules
- `GET /api/vehicles/` - Liste véhicules
- `POST /api/vehicles/` - Créer véhicule (admin/superviseur)
- `PUT /api/vehicles/{id}/` - Modifier véhicule
- `DELETE /api/vehicles/{id}/` - Supprimer véhicule

### Tracking
- `GET /api/tracking/positions/` - Positions GPS
- `GET /api/tracking/positions/current/` - Positions actuelles
- `GET /api/tracking/trips/` - Historique trajets

## 🎨 Personnalisation des Dashboards

Les dashboards sont automatiquement personnalisés selon le rôle:

1. **Connexion** → Le système récupère le rôle de l'utilisateur
2. **Redirection** → Affichage du dashboard correspondant
3. **Navigation** → Menu filtré selon les permissions
4. **API** → Données adaptées au niveau d'accès

## ⚠️ Notes Importantes

- Les dashboards se rafraîchissent automatiquement toutes les 30 secondes
- L'authentification utilise JWT avec refresh token
- Les permissions sont vérifiées côté backend ET frontend
- Chaque rôle a une vue personnalisée des statistiques
- L'admin Django (http://localhost:8000/admin) est séparé du dashboard admin de l'application

## 🔐 Sécurité

- Authentification JWT
- Permissions par rôle (backend)
- Filtrage des menus (frontend)
- Validation des entrées
- CORS configuré

## 📝 Prochaines Étapes

- [ ] Intégration Google Maps/OpenStreetMap
- [ ] Réception données GPS via TCP/UDP
- [ ] Notifications email
- [ ] Application mobile
- [ ] Géofencing avancé
- [ ] Rapports personnalisés avec filtres avancés

## 🆘 Support

Pour toute question:
1. Consultez CONFIGURATION.md pour la configuration détaillée
2. Consultez frontend/FRONTEND_README.md pour le frontend
3. Vérifiez que les deux serveurs sont démarrés
4. Vérifiez les logs dans les consoles

## ✅ Checklist de Vérification

- [ ] Backend démarre sans erreur sur port 8000
- [ ] Frontend démarre sans erreur sur port 5173
- [ ] Connexion avec admin/admin123 fonctionne
- [ ] Dashboard administrateur s'affiche avec toutes les stats
- [ ] Connexion avec supervisor/super123 fonctionne
- [ ] Dashboard superviseur s'affiche avec stats de flotte
- [ ] Connexion avec user/user123 fonctionne
- [ ] Dashboard utilisateur s'affiche avec stats basiques
- [ ] Navigation filtrée selon le rôle
