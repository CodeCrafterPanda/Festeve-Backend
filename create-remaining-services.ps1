# PowerShell script to create remaining microservices

# Create Booking Service (Port 3003)
Write-Host "Creating Booking Service..."
mkdir -p services/booking-service/src
xcopy src\bookings services\booking-service\src\bookings /E /I
xcopy src\purohits services\booking-service\src\purohits /E /I  
xcopy src\events services\booking-service\src\events /E /I
xcopy src\delivery services\booking-service\src\delivery /E /I
xcopy src\common services\booking-service\src\common /E /I
xcopy src\config services\booking-service\src\config /E /I

# Create Payment Service (Port 3004)
Write-Host "Creating Payment Service..."
mkdir -p services/payment-service/src
xcopy src\payment-records services\payment-service\src\payment-records /E /I
xcopy src\offers services\payment-service\src\offers /E /I
xcopy src\common services\payment-service\src\common /E /I
xcopy src\config services\payment-service\src\config /E /I

# Create Content Service (Port 3005)  
Write-Host "Creating Content Service..."
mkdir -p services/content-service/src
xcopy src\upload services\content-service\src\upload /E /I
xcopy src\banners services\content-service\src\banners /E /I
xcopy src\newsletter services\content-service\src\newsletter /E /I
xcopy src\testimonials services\content-service\src\testimonials /E /I
xcopy src\common services\content-service\src\common /E /I
xcopy src\config services\content-service\src\config /E /I

# Create Admin Service (Port 3006)
Write-Host "Creating Admin Service..."
mkdir -p services/admin-service/src
xcopy src\admin-settings services\admin-service\src\admin-settings /E /I
xcopy src\common services\admin-service\src\common /E /I
xcopy src\config services\admin-service\src\config /E /I

# Create API Gateway
Write-Host "Creating API Gateway..."
mkdir -p api-gateway/src

Write-Host "All services created! Next steps:"
Write-Host "1. Run this script: .\create-remaining-services.ps1"
Write-Host "2. Copy package.json and config files to each service"
Write-Host "3. Create main.ts and app.module.ts for each service"
Write-Host "4. Create API Gateway controllers"
Write-Host "5. Run npm run install:all"
Write-Host "6. Run npm run build:all"
Write-Host "7. Run npm run start:all"
