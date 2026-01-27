@echo off
echo ========================================
echo   Plateforme GPS - Demarrage Complet
echo ========================================
echo.
echo Demarrage du Backend Django...
start cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

timeout /t 3 /nobreak >nul

echo Demarrage du Frontend React...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Services demarres:
echo   - Backend:  http://localhost:8000
echo   - Frontend: http://localhost:5173
echo ========================================
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul
