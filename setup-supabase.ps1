# Supabase Setup Script for Sonna Admin Dashboard
# Run this after installing Supabase CLI

Write-Host "🚀 Setting up Supabase for Sonna Admin Dashboard" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "Run: winget install --id=Supabase.cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔐 Step 1: Login to Supabase" -ForegroundColor Cyan
Write-Host "This will open your browser for authentication..."
supabase login

Write-Host ""
Write-Host "🔗 Step 2: Link to your project" -ForegroundColor Cyan
Write-Host "Linking to project: wbhfwagjmtyxipuntrut"
supabase link --project-ref wbhfwagjmtyxipuntrut

Write-Host ""
Write-Host "🔑 Step 3: Set JWT Secret" -ForegroundColor Cyan
$jwtSecret = "d27e98a46d16bba19c11a2372f33614dfb151d368c38dd75ab49033500a08ed07cdff0c358315eb5612389d8f8c94cc628686ca70581987b83f2a84d6a380efd"
Write-Host "Setting JWT secret for Edge Functions..."
supabase secrets set JWT_SECRET=$jwtSecret

Write-Host ""
Write-Host "🚀 Step 4: Deploy admin-login Edge Function" -ForegroundColor Cyan
Write-Host "Deploying the authentication function..."
supabase functions deploy admin-login

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to your Supabase project dashboard" -ForegroundColor White
Write-Host "2. Navigate to SQL Editor" -ForegroundColor White
Write-Host "3. Run the database-setup.sql script" -ForegroundColor White
Write-Host "4. Test the admin login at: http://localhost:5173/admin/login" -ForegroundColor White
Write-Host ""
Write-Host "Demo credentials:" -ForegroundColor Yellow
Write-Host "Email: admin@sonnas.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
