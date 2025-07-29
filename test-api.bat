@echo off
echo Testing Sonna Backend API Endpoints...
echo.

echo ================================
echo 1. Testing Health Endpoint
echo ================================
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:54321/health' -Method GET; Write-Host 'Success:'; $response | ConvertTo-Json -Depth 3 } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo ================================
echo 2. Testing CORS Preflight
echo ================================
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:54321/functions/v1/admin-login' -Method OPTIONS; Write-Host 'Status:' $response.StatusCode; Write-Host 'CORS Headers:'; $response.Headers['Access-Control-Allow-Origin'] } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo ================================
echo 3. Testing Valid Admin Login
echo ================================
powershell -Command "try { $body = @{ email='admin@sonna.com'; password='admin123' } | ConvertTo-Json; $response = Invoke-RestMethod -Uri 'http://localhost:54321/functions/v1/admin-login' -Method POST -Body $body -ContentType 'application/json'; Write-Host 'Success:'; $response | ConvertTo-Json -Depth 3 } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo ================================
echo 4. Testing Invalid Admin Login
echo ================================
powershell -Command "try { $body = @{ email='wrong@email.com'; password='wrongpassword' } | ConvertTo-Json; $response = Invoke-RestMethod -Uri 'http://localhost:54321/functions/v1/admin-login' -Method POST -Body $body -ContentType 'application/json'; Write-Host 'Unexpected Success:'; $response | ConvertTo-Json -Depth 3 } catch { Write-Host 'Expected Error (401):' $_.Exception.Response.StatusCode }"

echo.
echo ================================
echo 5. Testing Missing Credentials
echo ================================
powershell -Command "try { $body = @{ email=''; password='' } | ConvertTo-Json; $response = Invoke-RestMethod -Uri 'http://localhost:54321/functions/v1/admin-login' -Method POST -Body $body -ContentType 'application/json'; Write-Host 'Unexpected Success:'; $response | ConvertTo-Json -Depth 3 } catch { Write-Host 'Expected Error (400):' $_.Exception.Response.StatusCode }"

echo.
echo ================================
echo Testing Complete!
echo ================================
echo.
echo Next steps:
echo 1. Import postman-collection.json into Postman
echo 2. Test endpoints using the Postman collection
echo 3. Verify all responses match expected behavior
echo.
pause
