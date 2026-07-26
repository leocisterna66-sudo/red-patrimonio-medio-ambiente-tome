@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Subir cambios - Red de Patrimonio y Medio Ambiente

echo ============================================================
echo    SUBIR CAMBIOS DEL SITIO A INTERNET
echo    Red de Patrimonio y Medio Ambiente - Tome
echo ============================================================
echo.

set HAYCAMBIOS=
for /f "delims=" %%i in ('git status --porcelain') do set HAYCAMBIOS=1

if not defined HAYCAMBIOS (
    echo No hay cambios nuevos para subir. Todo esta al dia.
    echo.
    pause
    exit /b
)

echo Archivos que cambiaron:
echo.
git status --short
echo.

set /p MENSAJE=Describe brevemente el cambio y presiona Enter:
if "%MENSAJE%"=="" set MENSAJE=Actualizacion del sitio

echo.
echo Subiendo cambios, espera un momento...
echo.
git add -A
git commit -m "%MENSAJE%"
git push
set RESULTADO=%errorlevel%

echo.
if "%RESULTADO%"=="0" (
    echo ============================================================
    echo    LISTO: los cambios se subieron correctamente.
    echo    El sitio se actualiza en internet en 30 a 60 segundos:
    echo    https://leocisterna66-sudo.github.io/red-patrimonio-medio-ambiente-tome/
    echo ============================================================
) else (
    echo ============================================================
    echo    Hubo un problema al subir. Lee el mensaje de arriba.
    echo    Si te pide usuario o clave, escribe en una terminal:
    echo        gh auth login
    echo ============================================================
)
echo.
pause
