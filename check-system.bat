@echo off
echo ==========================================
echo   Photo Archive - System Check
echo ==========================================
echo.
echo Checking if your system is ready to run the application...
echo.

set ERRORS=0

REM Check Java
echo [1/2] Checking Java installation...
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [FAIL] Java is NOT installed or not in PATH
    echo        Please install Java 17+ from: https://adoptium.net/
    set ERRORS=1
) else (
    echo [PASS] Java found:
    java -version 2>&1 | findstr "version"
)
echo.

REM Check Node.js
echo [2/2] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [FAIL] Node.js is NOT installed or not in PATH
    echo        Please install Node.js from: https://nodejs.org/
    set ERRORS=1
) else (
    echo [PASS] Node.js found:
    node --version
    echo [PASS] npm found:
    call npm --version
)
echo.

REM Check if mvnw exists
echo [INFO] Checking Maven wrapper...
if exist "photo-archive-backend\mvnw.cmd" (
    echo [PASS] Maven wrapper found
) else (
    echo [WARN] Maven wrapper not found in photo-archive-backend\
    set ERRORS=1
)
echo.

REM Check if package.json exists
echo [INFO] Checking frontend configuration...
if exist "package.json" (
    echo [PASS] Frontend configuration found
) else (
    echo [WARN] package.json not found
    set ERRORS=1
)
echo.

echo ==========================================
if %ERRORS% equ 0 (
    echo   ✓ System Check PASSED
    echo ==========================================
    echo.
    echo Your system is ready! You can now:
    echo   • Double-click 'start.bat' to run the application
    echo   • Double-click 'stop.bat' to stop it
) else (
    echo   ✗ System Check FAILED
    echo ==========================================
    echo.
    echo Please install the missing requirements above.
    echo Then run this check again.
)
echo.
pause
