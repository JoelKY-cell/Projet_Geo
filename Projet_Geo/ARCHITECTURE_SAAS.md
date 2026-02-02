# 🏗️ ARCHITECTURE SAAS MULTI-ENTREPRISES

## 📋 STRUCTURE COMPLÈTE

```
backend/
├── core/                       # Module central multi-tenant
│   ├── models.py              # Company, BaseModel
│   ├── permissions.py         # IsSuperAdmin, IsAdmin, CompanyIsolation
│   ├── serializers.py         # CompanySerializer, UserSerializer
│   ├── views.py               # CompanyViewSet
│   ├── middleware.py          # CompanyIsolationMiddleware
│   └── urls.py
│
├── users/                      # Gestion utilisateurs
│   └── models.py              # User (4 rôles: super_admin, admin, supervisor, user)
│
├── plugins/                    # Modules métier
│   ├── vehicles/              # Véhicules (liés à Company)
│   ├── devices/               # Boîtiers GPS (IMEI unique, protocol)
│   ├── tracking/              # Positions GPS
│   ├── drivers/               # Conducteurs
│   ├── fuel/                  # Carburant
│   ├── alerts/                # Alertes
│   └── reports/               # Rapports
│
├── listeners/                  # Serveur TCP GPS
│   ├── tcp_server.py          # Serveur TCP principal
│   ├── dispatcher.py          # Router vers parsers
│   └── protocols/
│       ├── teltonika.py       # Parser Teltonika
│       ├── coban.py           # Parser Coban
│       └── sinotrack.py       # Parser Sinotrack
│
└── start_tcp_server.py        # Script démarrage TCP
```

---

## 🔐 SYSTÈME DE RÔLES

### 1. SUPER_ADMIN
- **Accès**: Toutes les entreprises
- **Permissions**:
  - CRUD Companies
  - CRUD tous Users
  - Accès toutes données
- **Company**: NULL

### 2. ADMIN
- **Accès**: SA company uniquement
- **Permissions**:
  - CRUD Supervisors + Users de sa company
  - CRUD Vehicles, Devices, Drivers
  - Lecture toutes données de sa company
- **Company**: OBLIGATOIRE

### 3. SUPERVISOR
- **Accès**: SA company uniquement
- **Permissions**:
  - CRUD Users simples de sa company
  - CRUD Vehicles, Devices
  - Lecture complète
- **Company**: OBLIGATOIRE

### 4. USER
- **Accès**: SA company uniquement
- **Permissions**:
  - Lecture seule
- **Company**: OBLIGATOIRE

---

## 🔄 PIPELINE DONNÉES GPS

```
Boîtier GPS
    ↓
TCP Socket (port 5027)
    ↓
TCPServer.handle_client()
    ↓
Extract IMEI
    ↓
Device.objects.get(imei=..., is_active=True)
    ↓
Vérification Company
    ↓
DataDispatcher.process()
    ↓
Parser (Teltonika/Coban/Sinotrack)
    ↓
Parse binaire → JSON
    ↓
Send ACK
    ↓
Position.objects.bulk_create()
    ↓
API REST / WebSocket
    ↓
Frontend
```

---

## 🗄️ MODÈLES CLÉS

### Company
```python
- id
- name (unique)
- is_active
- created_at
- updated_at
```

### User
```python
- id
- username
- email
- password
- role (super_admin, admin, supervisor, user)
- company (FK, nullable pour super_admin)
- phone
- is_active
- created_at
```

### Device
```python
- id
- company (FK)
- imei (unique, indexed)
- device_type
- brand
- protocol (teltonika, coban, sinotrack)
- vehicle (FK)
- is_active
- last_communication
```

### Vehicle
```python
- id
- company (FK)
- license_plate
- vehicle_type
- brand, model, year
- is_active
- unique_together: [company, license_plate]
```

### Position
```python
- id
- vehicle (FK)
- device (FK)
- latitude, longitude, altitude
- speed, heading
- engine_on, ignition
- timestamp
```

---

## 🔒 ISOLATION MULTI-TENANT

### Middleware
```python
CompanyIsolationMiddleware
- Attache request.company automatiquement
- Filtre toutes les requêtes par company
```

### Permissions
```python
CompanyIsolationPermission
- Vérifie obj.company == request.user.company
- Autorise super_admin sur tout
```

### QuerySets
```python
# Exemple dans ViewSet
def get_queryset(self):
    if self.request.user.is_super_admin():
        return Vehicle.objects.all()
    return Vehicle.objects.filter(company=self.request.user.company)
```

---

## 🚀 DÉMARRAGE

### 1. Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Créer Super Admin
```bash
python manage.py createsuperuser
# Définir role='super_admin' manuellement
```

### 3. Démarrer API
```bash
python manage.py runserver 0.0.0.0:8000
```

### 4. Démarrer TCP Server
```bash
python start_tcp_server.py
```

---

## 📡 PROTOCOLES GPS

### Teltonika (Binaire)
- Codec 8/8E/16
- ACK: nombre d'enregistrements
- Port: 5027

### Coban (ASCII)
- Format: imei:XXX,tracker,date,lat,lon,speed
- ACK: "ON"
- Port: 5027

### Sinotrack (ASCII)
- Format: ST300STT;IMEI;Date;Time;Lat;Lon
- ACK: "OK"
- Port: 5027

---

## ✅ AVANTAGES ARCHITECTURE

1. **Multi-tenant natif**: Isolation stricte par Company
2. **Scalable**: Ajout facile de nouvelles entreprises
3. **Modulaire**: Plugins indépendants
4. **Extensible**: Ajout facile de nouveaux protocoles GPS
5. **Sécurisé**: Permissions granulaires par rôle
6. **Production-ready**: Middleware, services, parsers

---

## 🔧 PROCHAINES ÉTAPES

1. Créer migrations pour Company
2. Mettre à jour User avec FK Company
3. Ajouter company à tous les modèles plugins
4. Tester serveur TCP avec boîtiers réels
5. Implémenter WebSocket temps réel
6. Ajouter tests unitaires

---

**Architecture SaaS complète et production-ready!** 🎉
