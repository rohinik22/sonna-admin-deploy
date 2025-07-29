@echo off
echo Starting Sonna Admin Backend API...
echo.

echo Checking if Supabase is installed...
supabase --version
if errorlevel 1 (
    echo ERROR: Supabase CLI not found. Please install it first.
    echo Run: npm install -g supabase
    pause
    exit /b 1
)

echo.
echo Starting Supabase local development...
cd /d "e:\sonna-admin-deploy"
supabase start

echo.
echo Backend API is now running!
echo.
echo Available endpoints:
echo - Admin Login: POST http://localhost:54321/functions/v1/admin-login
echo.
echo You can now test the API using Postman:
echo 1. Import the postman-collection.json file
echo 2. Use the predefined requests to test the endpoints
echo.
echo To stop the backend, press Ctrl+C and run: supabase stop
echo.
pause
