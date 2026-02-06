# Guide de Déploiement - Tanga GPS

## Backend sur Render

### 1. Préparer le repository
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
```

### 2. Créer un compte Render
- Allez sur https://render.com
- Créez un compte gratuit

### 3. Déployer le backend
1. Cliquez sur "New +" → "Web Service"
2. Connectez votre repository GitHub
3. Configurez :
   - **Name**: tanga-gps-backend
   - **Environment**: Python 3
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn backend.wsgi:application`
   - **Instance Type**: Free

4. Variables d'environnement :
   - `SECRET_KEY`: Générer une clé secrète
   - `DEBUG`: False
   - `ALLOWED_HOSTS`: .onrender.com
   - `CORS_ALLOWED_ORIGINS`: https://your-frontend.vercel.app

5. Cliquez sur "Create Web Service"

### 4. Récupérer l'URL du backend
Après déploiement, notez l'URL : `https://tanga-gps-backend.onrender.com`

---

## Frontend sur Vercel

### 1. Préparer le repository
```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
```

### 2. Créer un compte Vercel
- Allez sur https://vercel.com
- Créez un compte gratuit

### 3. Déployer le frontend
1. Cliquez sur "Add New..." → "Project"
2. Importez votre repository GitHub
3. Configurez :
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

4. Variables d'environnement :
   - `VITE_API_URL`: https://tanga-gps-backend.onrender.com/api

5. Cliquez sur "Deploy"

### 4. Mettre à jour CORS
Retournez sur Render et ajoutez l'URL Vercel dans `CORS_ALLOWED_ORIGINS`:
```
https://your-app.vercel.app
```

---

## Configuration Post-Déploiement

### Backend (Render)
1. Créer un super utilisateur :
   - Allez dans Shell sur Render
   - Exécutez : `python manage.py createsuperuser`

2. Vérifier les migrations :
   ```bash
   python manage.py migrate
   ```

### Frontend (Vercel)
1. Vérifiez que `VITE_API_URL` pointe vers votre backend Render
2. Testez la connexion

---

## Commandes Utiles

### Redéployer le backend
```bash
git add .
git commit -m "Update"
git push
```

### Redéployer le frontend
```bash
git add .
git commit -m "Update"
git push
```

Vercel et Render redéploient automatiquement à chaque push.

---

## Troubleshooting

### Erreur CORS
- Vérifiez `CORS_ALLOWED_ORIGINS` dans les variables d'environnement Render
- Ajoutez l'URL Vercel complète avec https://

### Erreur 500 Backend
- Vérifiez les logs sur Render Dashboard
- Assurez-vous que `DEBUG=False` en production

### Frontend ne se connecte pas
- Vérifiez `VITE_API_URL` dans Vercel
- Testez l'API directement : `https://your-backend.onrender.com/api/`

---

## Notes Importantes

1. **Render Free Tier** : Le service s'endort après 15 min d'inactivité
2. **Base de données** : SQLite n'est pas persistant sur Render, utilisez PostgreSQL pour la production
3. **Fichiers statiques** : WhiteNoise gère les fichiers statiques
4. **HTTPS** : Render et Vercel fournissent HTTPS automatiquement
