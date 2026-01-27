# Plateforme de Géolocalisation & Exploitation de Capteurs

##  Description
Plateforme centralisée de géolocalisation permettant de suivre en temps réel et en différé des véhicules, engins ou actifs mobiles, à l'aide de boîtiers GPS et capteurs compatibles (Teltonika, Coban, Sinotrack).

##  Fonctionnalités Complètes

###  Gestion des Utilisateurs (3 Rôles)
- **Administrateur**: Accès complet à toutes les fonctionnalités
  - Gestion des utilisateurs
  - Configuration système
  - Accès à tous les rapports
  
- **Superviseur**: Gestion de flotte et consultation
  - Gestion des véhicules et conducteurs
  - Consultation des rapports
  - Configuration des alertes
  
- **Utilisateur Simple**: Consultation uniquement
  - Visualisation des positions
  - Consultation de l'historique
  - Lecture des rapports

###  Gestion des Véhicules/Actifs
- Immatriculation / Identifiant unique
- Type (véhicule, moto, camion, engin, autre)
- Boîtiers GPS associés
- Capteurs associés
- Conducteurs autorisés
- Caractéristiques techniques (marque, modèle, année, capacité carburant)

###  Géolocalisation Temps Réel
- Affichage position actuelle sur carte
- Rafraîchissement automatique
- Informations affichées:
  - Position GPS (latitude/longitude)
  - Vitesse actuelle
  - État moteur
  - Direction
  - Heure dernière remontée

### Historique des Trajets
- Consultation par véhicule et période
- Tracé du parcours
- Distance parcourue
- Vitesse moyenne et maximale
- Points d'arrêt avec durées
- Export des données

### Gestion du Carburant
- Lecture niveau de carburant en temps réel
- Détection automatique:
  - Consommation anormale
  - Vol suspect (vidange)
  - Fuites
- Historique de consommation
- Comparaison distance/carburant
- Analyse des coûts

### Identification Conducteurs (RFID)
- Association conducteur/véhicule
- Identification automatique via badge RFID
- Historique conducteur:
  - Véhicules utilisés
  - Trajets effectués
  - Comportement de conduite
  - Statistiques de performance

### Alertes et Notifications
Alertes configurables:
- Excès de vitesse
- Arrêt prolongé
- Sortie/Entrée de zone (géofencing)
- Coupure boîtier
- Anomalie carburant
- Freinage/Accélération brusque

Modes de notification:
- Tableau de bord
- Email (optionnel)

### Rapports et Tableaux de Bord
Tableaux de bord personnalisés par rôle:
- Nombre de véhicules actifs
- Distance totale parcourue
- Consommation estimée
- Alertes non traitées

Types de rapports:
- Par véhicule
- Par conducteur
- Par période
- Flotte complète
- Carburant
- Alertes

Formats d'export:
- PDF
- Excel
- CSV

## 🔧 Boîtiers et Capteurs Supportés

### Boîtiers GPS
-  Teltonika
-  Coban
-  Sinotrack

### Capteurs
-  GPS temps réel
-  Capteurs carburant
-  CAN Bus véhicule
-  RFID / ID Driver

## Architecture Technique

### Backend
- Django 6.0.1
- Django REST Framework
- JWT Authentication
- SQLite (développement)

### Frontend
- React 19
- Material-UI
- Axios
- React Router

### Chaîne de Fonctionnement
1. Boîtiers et capteurs collectent les données
2. Transmission via GSM/GPRS
3. Réception sur serveur backend
4. Traitement et stockage
5. Affichage interface web sécurisée

##  Installation

### Prérequis
- Python 3.8+
- Node.js 16+
- npm ou yarn

### Installation Backend
```bash
cd Projet_Geo
python -m venv venv
venv\\Scripts\\activate
pip install Django djangorestframework djangorestframework-simplejwt django-cors-headers django-filter
python manage.py migrate
```

### Installation Frontend
```bash
cd frontend
npm install
```

##  Comptes de Test

### Administrateur
- **Username**: admin
- **Password**: admin123
- **Accès**: Complet

### Superviseur
- **Username**: supervisor
- **Password**: super123
- **Accès**: Gestion de flotte

### Utilisateur
- **Username**: user
- **Password**: user123
- **Accès**: Consultation

##  Accès à l'Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin

##  Structure du Projet

```
Projet_Geo/
├── users/              # Gestion utilisateurs (3 rôles)
├── vehicles/           # Gestion véhicules/actifs
├── devices/            # Boîtiers GPS et capteurs
├── tracking/           # Géolocalisation temps réel
├── drivers/            # Conducteurs et RFID
├── fuel/               # Gestion carburant
├── alerts/             # Système d'alertes
├── reports/            # Génération rapports
└── frontend/           # Interface React
    ├── components/
    └── services/
```

##  Modèles de Données

### Users
- Rôles: Admin, Superviseur, Utilisateur
- Permissions personnalisées

### Vehicles
- Informations complètes
- Historique maintenance

### Devices
- Support multi-marques
- Configuration flexible

### Tracking
- Positions GPS
- Trajets
- Points d'arrêt

### Drivers
- Identification RFID
- Sessions de conduite
- Statistiques

### Fuel
- Lectures en temps réel
- Événements (pleins, vols)
- Analyse consommation

### Alerts
- Règles configurables
- Géofencing
- Notifications

### Reports
- Génération automatique
- Planification
- Multi-formats

##  Sécurité

- Authentification JWT
- Permissions par rôle
- Isolation des données
- CORS configuré
- Validation des entrées

##  Compatibilité

- PC (Windows, Mac, Linux)
- Tablettes
- Smartphones
- Interface responsive

##  Prochaines Étapes

- [ ] Intégration Google Maps/OpenStreetMap
- [ ] Réception données GPS via TCP/UDP
- [ ] Notifications email automatiques
- [ ] Application mobile
- [ ] Géofencing avancé
- [ ] Rapports personnalisés


##  Support

Pour toute question technique, consultez la documentation Django et React.

##  Licence

Propriétaire - Tous droits réservés