@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "FRONTEND_DIR=%SCRIPT_DIR%frontend"
set "API_DIR=%SCRIPT_DIR%api"
set "CERTS_DIR=%FRONTEND_DIR%\certs"
set "API_CERTS_DIR=%API_DIR%\certs"

:menu
cls
echo ╔═══════════════════════════════════════════════════════════╗
echo ║              HKGD Toolbox - Main Menu                   ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo [1] Update SSL Certificates    - Copy Let's Encrypt certs to project
echo [2] Update Admin Password      - Change the admin login password
echo [3] Update Domain/Host         - Change the allowed domain for HMR
echo [4] Install Dependencies      - npm install for frontend ^& API
echo [5] Start Dev Server          - Run Vite dev server (port 5173)
echo [6] Start Production Server   - Run Node API server (port 8081)
echo [7] Kill Process              - Kill processes on port 8081 or 5173
echo [8] Toggle April Fools Prank  - Enable/disable the prank page
echo [9] Exit
echo.
set /p choice="Select option: "

if "%choice%"=="1" goto update_certs
if "%choice%"=="2" goto update_password
if "%choice%"=="3" goto update_domain
if "%choice%"=="4" goto install_deps
if "%choice%"=="5" goto start_dev
if "%choice%"=="6" goto start_prod
if "%choice%"=="7" goto kill_process
if "%choice%"=="8" goto toggle_prank
if "%choice%"=="9" exit

goto menu

:update_certs
cls
echo ═════════════════════════════════════════════════════════════
echo   Update SSL Certificates
echo ═════════════════════════════════════════════════════════════
echo This will copy Let's Encrypt certificates to the project.
echo Source: C:\Certbot\Live\^<domain^>\  (or your certbot path)
echo Target: frontend\certs\ and api\certs\
echo.
set /p DOMAIN="Enter Let's Encrypt domain (e.g., hkgdl.ddns.net): "
set "CERT_PATH=C:\Certbot\Live\%DOMAIN%"
if not exist "%CERT_PATH%\privkey.pem" (
    echo Error: Certificate not found at %CERT_PATH%
    pause
    goto menu
)
mkdir "%CERTS_DIR%" 2>nul
mkdir "%API_CERTS_DIR%" 2>nul
copy /Y "%CERT_PATH%\privkey.pem" "%CERTS_DIR%\key.pem"
copy /Y "%CERT_PATH%\fullchain.pem" "%CERTS_DIR%\cert.pem"
copy /Y "%CERT_PATH%\privkey.pem" "%API_CERTS_DIR%\key.pem"
copy /Y "%CERT_PATH%\fullchain.pem" "%API_CERTS_DIR%\cert.pem"
echo.
echo ✓ Certificates updated successfully!
echo   - Frontend: %CERTS_DIR%
echo   - API: %API_CERTS_DIR%
pause
goto menu

:update_password
cls
echo ═════════════════════════════════════════════════════════════
echo   Update Admin Password
echo ═════════════════════════════════════════════════════════════
echo This will change the admin password in api\.env file.
echo Used for authenticating admin operations.
echo.
set /p NEW_PASSWORD="Enter new admin password: "
if exist "%API_DIR%\.env" (
    powershell -Command "(Get-Content '%API_DIR%\.env') -replace 'ADMIN_PASSWORD=.*', 'ADMIN_PASSWORD=%NEW_PASSWORD%' | Set-Content '%API_DIR%\.env'"
    echo.
    echo ✓ Admin password updated successfully!
) else (
    echo Error: .env file not found!
)
pause
goto menu

:update_domain
cls
echo ═════════════════════════════════════════════════════════════
echo   Update Domain/Host
echo ═════════════════════════════════════════════════════════════
echo This will update the allowed hosts and HMR host in vite.config.ts.
echo Required for Hot Module Replacement to work with custom domain.
echo.
set /p NEW_DOMAIN="Enter new domain (e.g., hkgdl.ddns.net): "
if exist "%FRONTEND_DIR%\vite.config.ts" (
    powershell -Command "(Get-Content '%FRONTEND_DIR%\vite.config.ts') -replace ""allowedHosts: \['[^']*', 'localhost'\]"", ""allowedHosts: ['%NEW_DOMAIN%', 'localhost']"" | Set-Content '%FRONTEND_DIR%\vite.config.ts'"
    powershell -Command "(Get-Content '%FRONTEND_DIR%\vite.config.ts') -replace 'host: ''[^'']*''', ""host: '%NEW_DOMAIN%'"" | Set-Content '%FRONTEND_DIR%\vite.config.ts'"
    echo.
    echo ✓ Domain updated to %NEW_DOMAIN%
)
pause
goto menu

:install_deps
cls
echo ═════════════════════════════════════════════════════════════
echo   Install Dependencies
echo ═════════════════════════════════════════════════════════════
echo This will install npm packages for both frontend and API.
echo.
echo Installing frontend dependencies...
cd /d "%FRONTEND_DIR%" && npm install
echo.
echo Installing API dependencies...
cd /d "%API_DIR%" && npm install
echo.
echo ✓ Dependencies installed successfully!
pause
goto menu

:start_dev
cls
echo ═════════════════════════════════════════════════════════════
echo   Start Development Server
echo ═════════════════════════════════════════════════════════════
echo Starting Vite development server (frontend only)...
echo The dev server proxies /api requests to localhost:8081
echo Make sure the API server is running separately!
echo.
echo Frontend URL: https://localhost:5173
echo API should be running on: https://localhost:8081
echo.
cd /d "%FRONTEND_DIR%" && start cmd /k "npm run dev"
echo ✓ Dev server started!
pause
goto menu

:start_prod
cls
echo ═════════════════════════════════════════════════════════════
echo   Start Production Server
echo ═════════════════════════════════════════════════════════════
echo Starting Node.js API server...
echo URL: https://localhost:8081
echo.
cd /d "%API_DIR%" && start cmd /k "npm start"
echo ✓ Production server started!
pause
goto menu

:kill_process
cls
echo ═════════════════════════════════════════════════════════════
echo   Kill Process
echo ═════════════════════════════════════════════════════════════
echo This will kill processes running on port 8081 and 5173.
echo.

echo Checking port 8081 (API)...
netstat -ano | findstr :8081 > temp_ports.txt
if %errorlevel%==0 (
    for /f "tokens=5" %%a in (temp_ports.txt) do (
        set PID=%%a
    )
    if defined PID taskkill /F /PID %PID% >nul 2>&1
    echo ✓ Port 8081 freed
) else (
    echo No process on port 8081
)
del temp_ports.txt 2>nul

echo.
echo Checking port 5173 (Frontend)...
netstat -ano | findstr :5173 > temp_ports.txt
if %errorlevel%==0 (
    for /f "tokens=5" %%a in (temp_ports.txt) do (
        set PID=%%a
    )
    if defined PID taskkill /F /PID %PID% >nul 2>&1
    echo ✓ Port 5173 freed
) else (
    echo No process on port 5173
)
del temp_ports.txt 2>nul

echo.
echo ✓ Done!
pause
goto menu

:toggle_prank
cls
echo ═════════════════════════════════════════════════════════════
echo   Toggle April Fools Prank
echo ═════════════════════════════════════════════════════════════
echo This will enable or disable the April Fools prank page.
echo.

set "PRANK_FILE=%FRONTEND_DIR%\src\components\AprilFoolsPrank.tsx"
set "PRANK_DISABLED=%FRONTEND_DIR%\src\components\AprilFoolsPrank.tsx.disabled"

REM Check if prank is currently disabled (file has only passthrough)
findstr /C:"// Prank disabled" "%PRANK_FILE%" >nul 2>&1
if %errorlevel%==0 (
    REM Currently disabled, enable it
    if exist "%PRANK_DISABLED%" (
        move /Y "%PRANK_DISABLED%" "%PRANK_FILE%"
        echo ✓ Prank ENABLED!
        echo Users will see the maintenance prank page.
    ) else (
        echo Error: Disabled prank backup not found
    )
) else if exist "%PRANK_DISABLED%" (
    REM Backup exists, restore it
    move /Y "%PRANK_DISABLED%" "%PRANK_FILE%"
    echo ✓ Prank ENABLED!
    echo Users will see the maintenance prank page.
) else if exist "%PRANK_FILE%" (
    REM Currently enabled, disable it by creating passthrough
    move /Y "%PRANK_FILE%" "%PRANK_DISABLED%"
    (
echo // Prank disabled - just pass through children
echo export function AprilFoolsPrank({ children }: { children: React.ReactNode }) {
echo   return children;
echo }
    ) > "%PRANK_FILE%"
    echo ✓ Prank DISABLED!
    echo Users will see the normal website.
) else (
    echo Error: Prank file not found
)
pause
goto menu
