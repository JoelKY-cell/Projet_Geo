# 🌐 Guide de Déploiement Réseau Local

## 📋 Configuration Actuelle

**Adresse IP Backend**: `192.168.43.35:8000`
**Adresse IP Frontend**: `192.168.43.35:5173`

---

## ✅ Vérifications Préalables

### 1. Vérifier votre adresse IP actuelle
```bash
ipconfig
```
Cherchez l'adresse IPv4 de votre carte réseau active.

### 2. Si votre IP a changé

**Modifier dans `frontend/src/services/api.js`:**
```javascript
const API_BASE_URL = 'http://VOTRE_IP:8000/api'
```

**Modifier dans `backend/backend/settings.py`:**
```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'VOTRE_IP']
CORS_ALLOWED_ORIGINS = ['http://VOTRE_IP:5173']
```

---

## 🚀 Démarrage sur le Réseau

### Option 1: Script Automatique (Recommandé)
```bash
Double-cliquez sur: start_network.bat
```

### Option 2: Manuel

**Terminal 1 - Backend:**
```bash
cd backend
..\venv\Scripts\activate
python manage.py runserver 0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

---

## 🔧 Accès depuis d'autres appareils

### Sur le même réseau WiFi/LAN:

**Depuis un PC:**
- Frontend: `http://192.168.43.35:5173`
- Backend API: `http://192.168.43.35:8000`

**Depuis un smartphone/tablette:**
- Ouvrir le navigateur
- Aller sur: `http://192.168.43.35:5173`

---

## 🐛 Dépannage

### Problème 1: "Cannot connect to backend"

**Solution:**
1. Vérifier que le backend est démarré:
   ```bash
   curl http://192.168.43.35:8000/api/dashboard/
   ```

2. Vérifier le pare-feu Windows:
   - Ouvrir "Pare-feu Windows Defender"
   - Autoriser Python et Node.js

### Problème 2: "CORS error"

**Solution:**
Vérifier dans `backend/backend/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://192.168.43.35:5173',  # Doit correspondre à votre IP
]
```

### Problème 3: "Network error" lors du login

**Solution:**
1. Ouvrir la console du navigateur (F12)
2. Vérifier l'URL appelée dans l'onglet "Network"
3. Si l'URL est `http://localhost:8000`, modifier `api.js`:
   ```javascript
   const API_BASE_URL = 'http://192.168.43.35:8000/api'
   ```

### Problème 4: Le site ne charge pas sur un autre appareil

**Vérifications:**
1. Les deux appareils sont sur le même réseau WiFi
2. Le pare-feu n'est pas bloqué
3. Tester avec: `ping 192.168.43.35`

---

## 🔐 Comptes de Test

| Rôle | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Superviseur | supervisor | super123 |
| Utilisateur | user | user123 |

---

## 📱 Accès Mobile

### Configuration recommandée:
1. Connecter le smartphone au même WiFi
2. Ouvrir Chrome/Safari
3. Aller sur `http://192.168.43.35:5173`
4. Ajouter à l'écran d'accueil pour un accès rapide

---

## ⚠️ Notes Importantes

1. **Adresse IP dynamique**: Votre IP peut changer après un redémarrage du routeur
2. **Pare-feu**: Assurez-vous que les ports 8000 et 5173 sont ouverts
3. **Performance**: Le réseau local est plus rapide que localhost pour les tests multi-appareils
4. **Sécurité**: Cette configuration est pour développement uniquement

---

## 🔄 Changement d'IP

Si votre IP change (ex: de 192.168.43.35 à 192.168.1.100):

1. **Modifier `frontend/src/services/api.js`:**
   ```javascript
   const API_BASE_URL = 'http://192.168.1.100:8000/api'
   ```

2. **Modifier `backend/backend/settings.py`:**
   ```python
   ALLOWED_HOSTS = ['localhost', '127.0.0.1', '192.168.1.100']
   CORS_ALLOWED_ORIGINS = ['http://192.168.1.100:5173']
   ```

3. **Redémarrer les serveurs**

---

## ✅ Checklist de Déploiement

- [ ] Backend démarre sur `0.0.0.0:8000`
- [ ] Frontend démarre sur `0.0.0.0:5173`
- [ ] CORS configuré avec la bonne IP
- [ ] ALLOWED_HOSTS contient l'IP
- [ ] Pare-feu autorise Python et Node.js
- [ ] Connexion fonctionne depuis le PC hôte
- [ ] Connexion fonctionne depuis un autre appareil
- [ ] Les 3 comptes de test fonctionnent

---

## 🎯 Test de Connexion

### Depuis le PC hôte:
```bash
# Tester le backend
curl http://192.168.43.35:8000/api/dashboard/

# Ouvrir le frontend
start http://192.168.43.35:5173
```

### Depuis un autre appareil:
1. Ouvrir le navigateur
2. Aller sur `http://192.168.43.35:5173`
3. Se connecter avec `admin / admin123`
4. Vérifier que le dashboard s'affiche

---

## 📞 Support

Si le problème persiste:
1. Vérifier les logs du backend dans le terminal
2. Vérifier la console du navigateur (F12)
3. Tester avec `curl` pour isoler le problème
4. Vérifier que la base de données `db.sqlite3` existe

---

**Bon déploiement!** 🚀
