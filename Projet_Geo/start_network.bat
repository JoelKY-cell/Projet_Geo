@echo off
echo ========================================
echo   DEMARRAGE RESEAU - Plateforme GPS
echo ========================================
echo.
echo Backend: http://192.168.43.35:8000
echo Frontend: http://192.168.43.35:5173
echo.

echo Demarrage du Backend Django...
start "Django Backend" cmd /k "cd backend && ..\venv\Scripts\activate && python manage.py runserver 0.0.0.0:8000"

timeout /t 3 /nobreak >nul

echo Demarrage du Frontend React...
start "React Frontend" cmd /k "cd frontend && npm run dev -- --host 0.0.0.0"

echo.
echo ========================================
echo   Services demarres sur le reseau:
echo   - Backend:  http://192.168.43.35:8000
echo   - Frontend: http://192.168.43.35:5173
echo ========================================
echo.
echo Comptes de test:
echo   Admin: admin / admin123
echo   Superviseur: supervisor / super123
echo   Utilisateur: user / user123
echo.
pause
