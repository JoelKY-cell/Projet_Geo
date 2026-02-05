@echo off
echo ========================================
echo   Demarrage Frontend React
echo ========================================
echo.

cd frontend
echo Installation des dependances...
call npm install

echo.
echo Demarrage du serveur de developpement...
echo Frontend disponible sur: http://localhost:5173
echo.
call npm run dev
