@echo off
echo ==========================================
echo   Photo Archive - Application Launcher
echo ==========================================
echo.

REM Check if Java is installed
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed or not in PATH!
    echo Please install Java 17 or later from: https://adoptium.net/
    echo.
    pause
    exit /b 1
)

REM Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Java found: 
java -version 2>&1 | findstr "version"
echo.

echo [OK] Node.js found:
node --version
echo.

REM Check if npm modules are installed
if not exist "node_modules\" (
    echo [INFO] Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
)

echo.
echo ==========================================
echo   Starting Application...
echo ==========================================
echo.
echo [INFO] Backend will start at: http://localhost:8080
echo [INFO] Frontend will start at: http://localhost:5173
echo.
echo Press CTRL+C in either window to stop the application
echo.
pause

REM Check for Maven wrapper or system Maven or portable Maven
set MAVEN_CMD=
set PORTABLE_MAVEN=%~dp0.maven\apache-maven-3.9.6\bin\mvn.cmd

if exist "photo-archive-backend\mvnw.cmd" (
    set MAVEN_CMD=.\mvnw.cmd
    echo [INFO] Using Maven wrapper
) else if exist "%PORTABLE_MAVEN%" (
    set MAVEN_CMD=%PORTABLE_MAVEN%
    echo [INFO] Using portable Maven
) else (
    where mvn >nul 2>nul
    if %errorlevel% equ 0 (
        set MAVEN_CMD=mvn
        echo [INFO] Using system Maven
    ) else (
        echo [INFO] Maven not found. Running setup...
        echo.
        call setup-maven.bat
        if %errorlevel% neq 0 (
            echo [ERROR] Maven setup failed!
            pause
            exit /b 1
        )
        REM Check again after setup
        if exist "%PORTABLE_MAVEN%" (
            set MAVEN_CMD=%PORTABLE_MAVEN%
            echo [INFO] Using newly installed portable Maven
        ) else (
            echo [ERROR] Maven setup completed but Maven not found!
            pause
            exit /b 1
        )
    )
)

echo.
REM Start backend in a new window
echo [INFO] Starting Backend...
start "Photo Archive - Backend" cmd /k "cd photo-archive-backend && %MAVEN_CMD% spring-boot:run"

REM Wait a moment before starting frontend
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
echo [INFO] Starting Frontend...
start "Photo Archive - Frontend" cmd /k "npm run dev"

echo.
echo ==========================================
echo   Application Started!
echo ==========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Two new windows have opened for the backend and frontend.
echo Close those windows to stop the application.
echo.
pause
