# Complete Microservices Setup Script
Write-Host "🚀 Starting NestJS Microservices Setup..." -ForegroundColor Green

# Function to create service structure
function Create-Service {
    param(
        [string]$ServiceName,
        [string]$ServiceDescription, 
        [int]$Port,
        [string[]]$Modules
    )
    
    Write-Host "📦 Creating $ServiceName..." -ForegroundColor Yellow
    
    # Create directory structure
    $ServiceDir = "services/$ServiceName"
    mkdir -p "$ServiceDir/src"
    
    # Copy modules
    foreach ($Module in $Modules) {
        if (Test-Path "src/$Module") {
            xcopy "src\$Module" "$ServiceDir\src\$Module" /E /I /Q
        }
    }
    
    # Copy common files
    xcopy "src\common" "$ServiceDir\src\common" /E /I /Q
    xcopy "src\config" "$ServiceDir\src\config" /E /I /Q
    
    # Create package.json
    (Get-Content "service-templates/microservice-package.template.json") `
        -replace "SERVICE_NAME", $ServiceName `
        -replace "SERVICE_DESCRIPTION", $ServiceDescription |
        Out-File "$ServiceDir/package.json" -Encoding UTF8
    
    # Create main.ts
    (Get-Content "service-templates/microservice-main.template.ts") `
        -replace "SERVICE_PORT", $Port `
        -replace "SERVICE_NAME", $ServiceDescription |
        Out-File "$ServiceDir/src/main.ts" -Encoding UTF8
    
    # Create tsconfig.json and nest-cli.json
    Copy-Item "services/identity-service/tsconfig.json" "$ServiceDir/tsconfig.json"
    Copy-Item "services/identity-service/nest-cli.json" "$ServiceDir/nest-cli.json"
    
    Write-Host "✅ $ServiceName created successfully" -ForegroundColor Green
}

# Create all microservices
Create-Service "booking-service" "Booking Service" 3003 @("bookings", "purohits", "events", "delivery")
Create-Service "payment-service" "Payment Service" 3004 @("payment-records", "offers")  
Create-Service "content-service" "Content Service" 3005 @("upload", "banners", "newsletter", "testimonials")
Create-Service "admin-service" "Admin Service" 3006 @("admin-settings")

# Create API Gateway
Write-Host "🌐 Creating API Gateway..." -ForegroundColor Yellow
mkdir -p "api-gateway/src"

# API Gateway package.json
@"
{
  "name": "api-gateway",
  "version": "1.0.0",
  "description": "API Gateway for NestJS Microservices",
  "author": "Microservices Team",
  "private": true,
  "license": "MIT",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.0.0",
    "@nestjs/microservices": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/throttler": "^5.0.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/supertest": "^2.0.12",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  }
}
"@ | Out-File "api-gateway/package.json" -Encoding UTF8

# Copy configuration files
Copy-Item "services/identity-service/tsconfig.json" "api-gateway/tsconfig.json"
Copy-Item "services/identity-service/nest-cli.json" "api-gateway/nest-cli.json"

Write-Host "🎉 Microservices setup completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run install:all" -ForegroundColor White
Write-Host "2. Create app.module.ts files for each service" -ForegroundColor White
Write-Host "3. Create API Gateway controllers" -ForegroundColor White  
Write-Host "4. Run: npm run build:all" -ForegroundColor White
Write-Host "5. Run: npm run start:all" -ForegroundColor White
