@echo off
echo ==========================================
echo   Stopping Photo Archive Application
echo ==========================================
echo.

REM Kill Java processes (Spring Boot backend)
echo [INFO] Stopping backend...
taskkill /F /IM java.exe 2>nul
if %errorlevel% equ 0 (
    echo [OK] Backend stopped
) else (
    echo [INFO] No backend process found
)

REM Kill Node processes (Vite frontend)
echo [INFO] Stopping frontend...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo [OK] Frontend stopped
) else (
    echo [INFO] No frontend process found
)

echo.
echo ==========================================
echo   Application Stopped
echo ==========================================
echo.
echo Note: This will stop ALL Java and Node.js processes.
echo If you're running other Java/Node apps, they were also stopped.
echo.
pause
