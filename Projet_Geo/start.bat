@echo off
echo ========================================
echo   PLATEFORME GPS - DEMARRAGE
echo ========================================
echo.

echo 1. Demarrage du serveur Django (Backend)...
cd backend
start "Django Backend" cmd /k "..\venv\Scripts\activate && python manage.py runserver"

echo 2. Attente de 5 secondes...
timeout /t 5 /nobreak > nul

echo 3. Demarrage du serveur React (Frontend)...
cd ..\frontend
start "React Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   SERVEURS DEMARRES
echo ========================================
echo Backend Django: http://localhost:8000
echo Frontend React: http://localhost:5173
echo Admin: http://localhost:8000/admin
echo.
echo === COMPTES DE TEST ===
echo Admin: admin / admin123
echo Superviseur: supervisor / super123
echo Utilisateur: user / user123
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul