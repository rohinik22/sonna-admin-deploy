@echo off
echo 🚀 Sonna Admin Dashboard - Complete Setup
echo ========================================
echo.

echo Step 1: Checking Supabase CLI...
where supabase >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Supabase CLI found
    supabase --version
) else (
    echo ❌ Supabase CLI not found
    echo Installing Supabase CLI...
    winget install --id=Supabase.cli
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install Supabase CLI
        echo Please install manually from: https://github.com/supabase/cli
        pause
        exit /b 1
    )
)

echo.
echo Step 2: Login to Supabase...
supabase login

echo.
echo Step 3: Link to your project...
supabase link --project-ref wbhfwagjmtyxipuntrut

echo.
echo Step 4: Set JWT secret...
supabase secrets set JWT_SECRET=d27e98a46d16bba19c11a2372f33614dfb151d368c38dd75ab49033500a08ed07cdff0c358315eb5612389d8f8c94cc628686ca70581987b83f2a84d6a380efd

echo.
echo Step 5: Deploy admin login function...
supabase functions deploy admin-login

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/wbhfwagjmtyxipuntrut
echo 2. Navigate to SQL Editor
echo 3. Run the database-setup.sql script
echo 4. Test login with: admin@sonnas.com / admin123
echo.
pause
