# Frontend - Plateforme GPS

## Dashboards Personnalisés par Rôle

### 1. Dashboard Administrateur
**Accès complet** - Toutes les fonctionnalités
- Statistiques complètes (véhicules, conducteurs, alertes, rapports)
- Gestion des utilisateurs
- Accès à tous les modules
- Alertes récentes détaillées
- Statistiques système (boîtiers, capteurs, utilisateurs)

### 2. Dashboard Superviseur
**Gestion de flotte** - Consultation et configuration
- Statistiques de flotte (véhicules, conducteurs, distance)
- Gestion des véhicules et conducteurs
- Configuration des alertes
- Consultation des rapports
- Alertes actives

### 3. Dashboard Utilisateur Simple
**Consultation uniquement** - Lecture seule
- Statistiques basiques (véhicules actifs, distance, trajets)
- Visualisation des positions sur carte
- Consultation de l'historique
- Lecture des rapports

## Structure des Composants

```
frontend/src/
├── components/
│   ├── AdminDashboard.jsx       # Dashboard administrateur
│   ├── SupervisorDashboard.jsx  # Dashboard superviseur
│   ├── UserDashboard.jsx        # Dashboard utilisateur simple
│   ├── Login.jsx                # Page de connexion
│   ├── Navbar.jsx               # Menu de navigation (filtré par rôle)
│   ├── VehicleMap.jsx           # Carte des véhicules
│   ├── VehicleList.jsx          # Liste des véhicules
│   └── Reports.jsx              # Rapports
├── services/
│   └── api.js                   # Configuration API et endpoints
├── App.jsx                      # Routeur principal
└── main.jsx                     # Point d'entrée
```

## Comptes de Test

### Administrateur
- **Username**: admin
- **Password**: admin123
- **Dashboard**: Complet avec toutes les statistiques

### Superviseur
- **Username**: supervisor
- **Password**: super123
- **Dashboard**: Gestion de flotte

### Utilisateur
- **Username**: user
- **Password**: user123
- **Dashboard**: Consultation basique

## Installation

```bash
cd frontend
npm install
```

## Démarrage

```bash
npm run dev
```

Frontend disponible sur: http://localhost:5173

## Technologies

- **React 19** - Framework UI
- **Material-UI** - Composants UI
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Vite** - Build tool

## API Endpoints Utilisés

- `POST /api/auth/login/` - Connexion
- `GET /api/auth/profile/` - Profil utilisateur (rôle)
- `GET /api/dashboard/` - Statistiques dashboard
- `GET /api/vehicles/` - Liste véhicules
- `GET /api/tracking/positions/` - Positions GPS
- `GET /api/tracking/trips/` - Historique trajets

## Permissions par Rôle

| Fonctionnalité | Admin | Superviseur | Utilisateur |
|----------------|-------|-------------|-------------|
| Dashboard complet | ✅ | ❌ | ❌ |
| Dashboard flotte | ✅ | ✅ | ❌ |
| Dashboard basique | ✅ | ✅ | ✅ |
| Carte véhicules | ✅ | ✅ | ✅ |
| Gestion véhicules | ✅ | ✅ | ❌ |
| Rapports | ✅ | ✅ | ✅ (lecture) |
| Gestion utilisateurs | ✅ | ❌ | ❌ |

## Notes Importantes

- Le dashboard affiché dépend automatiquement du rôle de l'utilisateur connecté
- La navigation est filtrée selon les permissions du rôle
- Les statistiques sont actualisées toutes les 30 secondes
- L'authentification utilise JWT avec refresh token
