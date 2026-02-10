@echo off
REM This script downloads and sets up a portable Maven if needed
setlocal enabledelayedexpansion

set MAVEN_VERSION=3.9.6
set MAVEN_DIR=%~dp0.maven
set MAVEN_BIN=%MAVEN_DIR%\apache-maven-%MAVEN_VERSION%\bin\mvn.cmd

echo ==========================================
echo   Maven Setup Script
echo ==========================================
echo.

REM Check if portable Maven already exists
if exist "%MAVEN_BIN%" (
    echo [OK] Portable Maven already installed at: %MAVEN_DIR%
    exit /b 0
)

REM Check if system Maven exists
where mvn >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] System Maven is already installed
    exit /b 0
)

REM Need to download Maven
echo [INFO] Maven not found. Downloading portable Maven...
echo [INFO] This is a one-time setup and does not require admin rights.
echo.

REM Create .maven directory
if not exist "%MAVEN_DIR%" mkdir "%MAVEN_DIR%"

REM Download Maven
set MAVEN_URL=https://dlcdn.apache.org/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip
set MAVEN_ZIP=%MAVEN_DIR%\maven.zip

echo [INFO] Downloading Maven %MAVEN_VERSION%...
echo [INFO] URL: %MAVEN_URL%
echo.

powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'}"

if %errorlevel% neq 0 (
    echo [ERROR] Failed to download Maven!
    echo Please check your internet connection or download manually from:
    echo https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo [OK] Download complete!
echo.

REM Extract Maven
echo [INFO] Extracting Maven...
powershell -Command "& {Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%MAVEN_DIR%' -Force}"

if %errorlevel% neq 0 (
    echo [ERROR] Failed to extract Maven!
    pause
    exit /b 1
)

REM Clean up zip file
del "%MAVEN_ZIP%"

echo [OK] Maven extracted successfully!
echo.
echo ==========================================
echo   Maven Setup Complete!
echo ==========================================
echo.
echo Portable Maven has been installed to: %MAVEN_DIR%
echo You can now run start.bat to launch the application.
echo.
pause
