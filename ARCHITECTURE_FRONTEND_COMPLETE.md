#  ARCHITECTURE FRONTEND - PLATEFORME GPS SAAS

##  STRUCTURE COMPLÈTE

```
frontend/src/
│
├── auth/
│   └── ProtectedRoute.jsx          # Route protégée par rôle
│
├── layouts/
│   ├── SuperAdminLayout.jsx        # Layout Super Admin
│   ├── AdminLayout.jsx             # Layout Admin Entreprise
│   ├── SupervisorLayout.jsx        # Layout Superviseur
│   └── UserLayout.jsx              # Layout Utilisateur
│
├── dashboards/
│   ├── SuperAdminDashboard.jsx     # Dashboard global système
│   ├── AdminDashboard.jsx          # Dashboard entreprise
│   ├── SupervisorDashboard.jsx     # Dashboard supervision
│   └── UserDashboard.jsx           # Dashboard consultation
│
├── modules/
│   ├── vehicles/
│   │   ├── VehicleList.jsx         # Liste véhicules
│   │   ├── VehicleForm.jsx         # Formulaire CRUD
│   │   └── VehicleDetails.jsx      # Détails véhicule
│   │
│   ├── devices/
│   │   ├── DeviceList.jsx          # Liste boîtiers
│   │   └── DeviceForm.jsx          # Formulaire boîtier
│   │
│   ├── tracking/
│   │   ├── TrackingMap.jsx         # Carte temps réel ✅
│   │   ├── HistoryPlayer.jsx       # Replay trajets
│   │   └── PositionList.jsx        # Liste positions
│   │
│   ├── drivers/
│   │   ├── DriverList.jsx          # Liste conducteurs
│   │   └── DriverForm.jsx          # Formulaire conducteur
│   │
│   ├── fuel/
│   │   ├── FuelDashboard.jsx       # Dashboard carburant
│   │   ├── FuelChart.jsx           # Graphique consommation
│   │   └── FuelEvents.jsx          # Événements (vols, pleins)
│   │
│   ├── alerts/
│   │   ├── AlertsModule.jsx        # Module alertes ✅
│   │   ├── AlertRules.jsx          # Configuration règles
│   │   └── AlertHistory.jsx        # Historique
│   │
│   └── reports/
│       ├── ReportGenerator.jsx     # Générateur rapports
│       ├── ReportList.jsx          # Liste rapports
│       └── ReportViewer.jsx        # Visualisation
│
├── components/
│   ├── Map/
│   │   ├── GoogleMap.jsx           # Wrapper Google Maps
│   │   ├── VehicleMarker.jsx       # Marqueur véhicule
│   │   └── InfoWindow.jsx          # Popup info
│   │
│   ├── Charts/
│   │   ├── LineChart.jsx           # Graphique ligne
│   │   ├── BarChart.jsx            # Graphique barres
│   │   └── PieChart.jsx            # Graphique camembert
│   │
│   ├── Tables/
│   │   ├── DataTable.jsx           # Table réutilisable
│   │   └── FilterBar.jsx           # Barre de filtres
│   │
│   └── Common/
│       ├── StatCard.jsx            # Carte statistique
│       ├── LoadingSpinner.jsx      # Chargement
│       ├── EmptyState.jsx          # État vide
│       └── Toast.jsx               # Notifications
│
├── services/
│   ├── api.js                      # Client API REST
│   └── websocket.js                # Service WebSocket ✅
│
├── store/
│   ├── index.js                    # Store Redux
│   ├── authSlice.js                # State auth
│   ├── vehiclesSlice.js            # State véhicules
│   └── alertsSlice.js              # State alertes
│
├── utils/
│   ├── constants.js                # Constantes
│   ├── helpers.js                  # Fonctions utilitaires
│   └── validators.js               # Validations
│
├── App.jsx                         # App principale
└── main.jsx                        # Point d'entrée
```

---

##  DASHBOARDS PAR RÔLE

###  Super Admin Dashboard
**Objectif**: Vue globale du système

**Composants**:
- Nombre d'entreprises
- Total véhicules (toutes entreprises)
- Total utilisateurs
- Alertes système
- Table entreprises avec stats
- Graphique croissance

**Permissions**:
- Créer entreprises
- Créer admins d'entreprise
- Voir toutes les données

---

###  Admin Entreprise Dashboard
**Objectif**: Gestion complète de l'entreprise

**Composants**:
- Carte temps réel des véhicules
- Véhicules actifs / inactifs
- Distance totale parcourue
- Consommation carburant
- Alertes critiques
- Dernières positions
- Graphiques de performance

**Permissions**:
- CRUD véhicules, boîtiers, conducteurs
- Créer superviseurs et users
- Voir toutes données de son entreprise

---

###  Superviseur Dashboard
**Objectif**: Supervision opérationnelle

**Composants**:
- Carte temps réel
- Alertes actives
- Activité véhicules
- Historique simplifié

**Permissions**:
- Créer utilisateurs simples
- Lecture complète
- Gestion alertes

---

###  Utilisateur Dashboard
**Objectif**: Consultation

**Composants**:
- Carte
- Historique trajets
- Rapports simples

**Permissions**:
- Lecture seule

---

##  MODULE TRACKING (CŒUR UX)

### Fonctionnalités
 Carte interactive temps réel
 Points GPS animés
 Info-window détaillée:
   - Véhicule
   - Vitesse actuelle
   - État moteur
   - Dernière remontée
 Filtrage par véhicule
 Filtrage par date
 Lecture historique (replay)
 WebSocket pour live updates

### Technologies
- **Google Maps API** ou **Leaflet + OpenStreetMap**
- **WebSocket** pour temps réel
- **Recharts** pour graphiques

---

##  TEMPS RÉEL (WEBSOCKET)

### Événements
```javascript
// Positions GPS
websocket.on('position_update', (data) => {
  // Mise à jour carte
});

// Alertes
websocket.on('new_alert', (alert) => {
  // Notification + badge
});

// État véhicule
websocket.on('vehicle_status', (status) => {
  // Mise à jour statut
});
```

### Fallback
- Polling toutes les 30s si WebSocket indisponible
- Reconnexion automatique

---

##  AUTHENTIFICATION & ROUTING

### Routes Protégées
```javascript
<ProtectedRoute allowedRoles={['super_admin']}>
  <SuperAdminDashboard />
</ProtectedRoute>

<ProtectedRoute allowedRoles={['super_admin', 'admin']}>
  <CompanyManagement />
</ProtectedRoute>

<ProtectedRoute allowedRoles={['super_admin', 'admin', 'supervisor']}>
  <VehicleList />
</ProtectedRoute>
```

### Redirection Automatique
```javascript
// Après login, redirection selon rôle
if (role === 'super_admin') navigate('/');
if (role === 'admin') navigate('/dashboard');
if (role === 'supervisor') navigate('/tracking');
if (role === 'user') navigate('/map');
```

---

##  DESIGN SYSTEM

### Couleurs
```javascript
primary: '#1976d2'      // Bleu
success: '#4caf50'      // Vert
warning: '#ff9800'      // Orange
error: '#f44336'        // Rouge
info: '#2196f3'         // Bleu clair
```

### Composants Réutilisables
- **StatCard**: Carte statistique avec icône
- **DataTable**: Table avec tri, filtres, pagination
- **LoadingSpinner**: Indicateur de chargement
- **EmptyState**: État vide avec illustration
- **Toast**: Notifications (succès, erreur, info)

---

##  DÉPENDANCES

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "@mui/material": "^7.0.0",
    "@mui/icons-material": "^7.0.0",
    "axios": "^1.6.0",
    "recharts": "^2.10.0",
    "react-leaflet": "^4.2.0",
    "leaflet": "^1.9.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0"
  }
}
```

---

##  INSTALLATION

```bash
cd frontend
npm install

# Démarrer
npm run dev
```

---

##  MODULES MÉTIER

###  Module Carburant
- Courbe de consommation (Recharts)
- Détection vidange (alertes visuelles)
- Comparaison distance/carburant
- Export données

###  Module Alertes
- Liste temps réel
- Notifications badge
- Filtrage par type/sévérité
- Historique avec recherche

###  Module Rapports
- Sélection période
- Génération PDF/Excel
- Téléchargement
- Visualisation graphique

---

##  CHECKLIST IMPLÉMENTATION

### Phase 1: Base 
- [x] Structure dossiers
- [x] ProtectedRoute
- [x] SuperAdminLayout
- [x] SuperAdminDashboard
- [x] WebSocket service
- [x] TrackingMap (structure)
- [x] AlertsModule

### Phase 2: Modules Métier
- [ ] VehicleList + CRUD
- [ ] DeviceList + CRUD
- [ ] DriverList + CRUD
- [ ] FuelDashboard
- [ ] ReportGenerator

### Phase 3: Temps Réel
- [ ] Intégration Google Maps / Leaflet
- [ ] WebSocket positions live
- [ ] Replay trajets
- [ ] Notifications temps réel

### Phase 4: UX/UI
- [ ] Dark mode
- [ ] Responsive mobile
- [ ] Loading states
- [ ] Empty states
- [ ] Toast notifications

---

##  RÉSUMÉ

**Architecture complète** → Layouts, Dashboards, Modules
**Temps réel** → WebSocket + Fallback polling
**Sécurité** → Routes protégées par rôle
**UX moderne** → Material UI + Responsive
**Production-ready** → Structure scalable

**Frontend SaaS GPS professionnel!** 
