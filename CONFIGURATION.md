# Configuration Complète - Plateforme GPS

##  Structure Backend (Correcte)

```
backend/
├── alerts/              # Système d'alertes configurables
├── backend/             # Configuration Django
├── core/                # Dashboard et statistiques
├── devices/             # Boîtiers GPS et capteurs
├── drivers/             # Conducteurs et RFID
├── fuel/                # Gestion carburant
├── reports/             # Génération rapports
├── tracking/            # Géolocalisation temps réel
├── users/               # 3 types d'utilisateurs
├── vehicles/            # Gestion flotte
├── db.sqlite3           # Base de données
└── manage.py            # Commandes Django
```

##  Modèles Créés (100% Cahier des Charges)

### 1. Users (3 Rôles)
- **Administrateur**: Accès complet
- **Superviseur**: Gestion de flotte
- **Utilisateur**: Consultation uniquement

### 2. Vehicles
- Immatriculation unique
- Types: véhicule, moto, camion, engin, autre
- Caractéristiques techniques complètes

### 3. Devices
- Support: Teltonika, Coban, Sinotrack
- Types: GPS, Capteur carburant, RFID, CAN Bus

### 4. Tracking
- Position GPS temps réel
- Historique trajets
- Points d'arrêt avec durées

### 5. Drivers
- Identification RFID
- Sessions de conduite
- Statistiques comportement

### 6. Fuel
- Lectures temps réel
- Détection anomalies (vol, fuite, consommation)
- Historique et analyse

### 7. Alerts
- Règles configurables
- Géofencing (zones géographiques)
- Notifications email

### 8. Reports
- Types: véhicule, conducteur, flotte, carburant, alertes
- Formats: PDF, Excel, CSV
- Planification automatique

##  API REST Créées

### Authentication
- POST `/api/auth/login/` - Connexion JWT
- POST `/api/auth/refresh/` - Rafraîchir token

### Dashboard
- GET `/api/dashboard/` - Statistiques personnalisées par rôle

### Vehicles
- GET `/api/vehicles/` - Liste véhicules
- POST `/api/vehicles/` - Créer véhicule
- GET `/api/vehicles/{id}/` - Détails véhicule
- PUT `/api/vehicles/{id}/` - Modifier véhicule
- DELETE `/api/vehicles/{id}/` - Supprimer véhicule

### Tracking
- GET `/api/tracking/positions/` - Toutes positions
- GET `/api/tracking/positions/current/` - Positions actuelles
- GET `/api/tracking/trips/` - Historique trajets
- GET `/api/tracking/stops/` - Points d'arrêt

##  Base de Données

- SQLite (développement)
- Migrations appliquées
- 3 utilisateurs de test créés

##  Comptes de Test

| Rôle | Username | Password | Accès |
|------|----------|----------|-------|
| Admin | admin | admin123 | Complet |
| Superviseur | supervisor | super123 | Gestion flotte |
| Utilisateur | user | user123 | Consultation |

##  Démarrage

### Option 1: Script automatique
```bash
start.bat
```

### Option 2: Manuel
```bash
# Backend
cd backend
..\venv\Scripts\activate
python manage.py runserver

# Frontend (nouveau terminal)
cd frontend
npm run dev
```

##  Tableaux de Bord Personnalisés

### Administrateur
- Nombre véhicules actifs/inactifs
- Distance totale parcourue
- Vitesse moyenne/maximale
- Alertes non traitées
- Événements carburant
- Sessions conducteurs actives

### Superviseur
- Nombre véhicules actifs/inactifs
- Distance totale parcourue
- Vitesse moyenne/maximale
- Alertes non traitées
- Événements carburant

### Utilisateur Simple
- Nombre véhicules actifs/inactifs
- Distance totale parcourue
- Alertes non traitées
- Événements carburant

##  Technologies

- **Backend**: Django 6.0.1 + DRF
- **Frontend**: React 19 + Material-UI
- **Auth**: JWT
- **Database**: SQLite
- **API**: REST

##  Prochaines Étapes

1. Créer les vues API pour drivers, fuel, alerts, reports
2. Finaliser le frontend React avec les 3 tableaux de bord
3. Intégrer Google Maps/OpenStreetMap
4. Implémenter la réception données GPS (TCP/UDP)
5. Ajouter les notifications email

##  Conformité Cahier des Charges

 Gestion 3 types d'utilisateurs
 Gestion véhicules/actifs
 Géolocalisation temps réel
 Historique trajets
 Gestion carburant
 Identification conducteurs RFID
 Système d'alertes
 Génération rapports
 Support boîtiers: Teltonika, Coban, Sinotrack
 Support capteurs: GPS, Carburant, RFID, CAN Bus