# Comparaison des Dashboards Personnalisés

## Vue d'Ensemble

Chaque rôle dispose d'un dashboard personnalisé avec des statistiques et fonctionnalités adaptées à son niveau d'accès.

## 📊 Statistiques Affichées par Dashboard

### Dashboard Administrateur (AdminDashboard.jsx)

#### Cartes Statistiques (8 cartes)
1. **Véhicules actifs** 
   - Valeur: Nombre de véhicules actifs
   - Sous-titre: Total de véhicules
   - Icône: DirectionsCar (vert)

2. **Conducteurs actifs**
   - Valeur: Sessions de conduite actives
   - Sous-titre: Total de conducteurs
   - Icône: People (bleu)

3. **Alertes non traitées**
   - Valeur: Alertes en attente
   - Sous-titre: Total d'alertes
   - Icône: Warning (orange)

4. **Rapports générés**
   - Valeur: Nombre total de rapports
   - Icône: Assignment (violet)

5. **Distance aujourd'hui**
   - Valeur: Distance totale en km
   - Sous-titre: Nombre de trajets
   - Icône: Speed (bleu)

6. **Vitesse moyenne**
   - Valeur: Vitesse moyenne en km/h
   - Icône: TrendingUp (bleu)

7. **Événements carburant**
   - Valeur: Événements du jour
   - Sous-titre: Vols détectés
   - Icône: LocalGasStation (rouge)

#### Tableaux Détaillés (2 sections)
8. **Alertes récentes** (tableau)
   - Type d'alerte
   - Véhicule concerné
   - Niveau de sévérité
   - Affiche les 5 dernières alertes

9. **Statistiques système** (liste)
   - Nombre de boîtiers GPS
   - Nombre de capteurs carburant
   - Nombre de capteurs RFID
   - Nombre d'utilisateurs

---

### Dashboard Superviseur (SupervisorDashboard.jsx)

#### Cartes Statistiques (4 cartes)
1. **Véhicules actifs**
   - Valeur: Nombre de véhicules actifs
   - Sous-titre: Total de véhicules
   - Icône: DirectionsCar (vert)

2. **Conducteurs**
   - Valeur: Total de conducteurs
   - Sous-titre: Conducteurs en service
   - Icône: Person (bleu)

3. **Alertes**
   - Valeur: Alertes non traitées
   - Sous-titre: "À traiter"
   - Icône: Warning (orange)

4. **Distance du jour**
   - Valeur: Distance totale en km
   - Icône: Speed (bleu)

#### Sections Détaillées (2 sections)
5. **Alertes actives** (liste)
   - Type d'alerte
   - Véhicule concerné
   - Badge de sévérité (couleur)
   - Affiche les 5 dernières alertes

6. **Statistiques flotte** (liste)
   - Trajets aujourd'hui
   - Vitesse moyenne
   - Événements carburant
   - Boîtiers GPS

---

### Dashboard Utilisateur Simple (UserDashboard.jsx)

#### Cartes Statistiques (4 cartes)
1. **Véhicules actifs**
   - Valeur: Nombre de véhicules actifs
   - Icône: DirectionsCar (vert)

2. **Total véhicules**
   - Valeur: Nombre total de véhicules
   - Icône: DirectionsCar (bleu)

3. **Distance aujourd'hui**
   - Valeur: Distance totale en km
   - Icône: Speed (bleu)

4. **Trajets du jour**
   - Valeur: Nombre de trajets
   - Icône: Map (violet)

#### Section Informative
5. **Informations**
   - Message d'aide pour la navigation
   - Guide d'utilisation basique

---

## 🎯 Comparaison Visuelle

| Élément | Admin | Superviseur | Utilisateur |
|---------|:-----:|:-----------:|:-----------:|
| **Cartes statistiques** | 7 | 4 | 4 |
| **Tableaux détaillés** | 2 | 2 | 0 |
| **Statistiques conducteurs** | ✅ | ✅ | ❌ |
| **Statistiques système** | ✅ | ❌ | ❌ |
| **Alertes détaillées** | ✅ | ✅ | ❌ |
| **Rapports générés** | ✅ | ❌ | ❌ |
| **Vitesse moyenne** | ✅ | ✅ | ❌ |
| **Événements carburant** | ✅ | ✅ | ❌ |
| **Vols détectés** | ✅ | ❌ | ❌ |

---

## 🔄 Actualisation des Données

Tous les dashboards se rafraîchissent automatiquement toutes les **30 secondes** pour afficher les données en temps réel.

```javascript
useEffect(() => {
  fetchStats();
  const interval = setInterval(fetchStats, 30000); // 30 secondes
  return () => clearInterval(interval);
}, []);
```

---

## 🎨 Codes Couleur des Icônes

| Couleur | Utilisation | Signification |
|---------|-------------|---------------|
| **success** (vert) | Véhicules actifs | État positif |
| **primary** (bleu) | Totaux, distance | Information principale |
| **info** (bleu clair) | Conducteurs, vitesse | Information secondaire |
| **warning** (orange) | Alertes | Attention requise |
| **error** (rouge) | Carburant, vols | Problème critique |
| **secondary** (violet) | Trajets, rapports | Information complémentaire |

---

## 📱 Responsive Design

Tous les dashboards utilisent Material-UI Grid avec breakpoints:
- **xs={12}**: Mobile (pleine largeur)
- **sm={6}**: Tablette (2 colonnes)
- **md={3}** ou **md={4}**: Desktop (3-4 colonnes)

---

## 🔐 Sécurité et Permissions

### Backend (core/views.py)
```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user
    
    if user.is_admin():
        # Retourne toutes les statistiques
    elif user.is_supervisor():
        # Retourne statistiques de flotte
    else:
        # Retourne statistiques basiques
```

### Frontend (App.jsx)
```javascript
const getDashboard = () => {
  if (userRole === 'admin') return <AdminDashboard />;
  if (userRole === 'supervisor') return <SupervisorDashboard />;
  return <UserDashboard />;
};
```

---

## 📊 Données API par Rôle

### Administrateur
```json
{
  "vehicles": {"active": 10, "total": 15},
  "drivers": {"active_sessions": 5, "total": 20},
  "alerts": {"unacknowledged": 3, "total": 50, "recent": [...]},
  "reports": {"total": 100},
  "trips": {"total_distance": 1500, "today_count": 25, "avg_speed": 65},
  "fuel": {"events_today": 2, "theft_events": 1},
  "devices": {"total": 15, "fuel_sensors": 10, "rfid_sensors": 8},
  "users": {"total": 25}
}
```

### Superviseur
```json
{
  "vehicles": {"active": 10, "total": 15},
  "drivers": {"active_sessions": 5, "total": 20},
  "alerts": {"unacknowledged": 3, "recent": [...]},
  "trips": {"total_distance": 1500, "today_count": 25, "avg_speed": 65},
  "fuel": {"events_today": 2},
  "devices": {"total": 15}
}
```

### Utilisateur Simple
```json
{
  "vehicles": {"active": 10, "total": 15},
  "trips": {"total_distance": 1500, "today_count": 25}
}
```

---

## 🚀 Évolutions Futures

### Dashboard Administrateur
- [ ] Graphiques de tendances
- [ ] Statistiques par période
- [ ] Export des statistiques
- [ ] Alertes en temps réel (WebSocket)

### Dashboard Superviseur
- [ ] Comparaison de performance
- [ ] Classement des conducteurs
- [ ] Prévisions de maintenance

### Dashboard Utilisateur
- [ ] Favoris véhicules
- [ ] Notifications personnalisées
- [ ] Historique personnel

---

## 💡 Bonnes Pratiques

1. **Chargement**: Afficher un CircularProgress pendant le chargement
2. **Erreurs**: Gérer les erreurs API avec try/catch
3. **Actualisation**: Nettoyer les intervals avec clearInterval
4. **Responsive**: Utiliser Grid avec breakpoints appropriés
5. **Accessibilité**: Utiliser des icônes significatives et des couleurs contrastées
