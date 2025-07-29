@echo off
echo Stopping Sonna Admin Backend API...
echo.

cd /d "e:\sonna-admin-deploy"
supabase stop

echo.
echo Backend API stopped successfully!
echo.
pause
