# Complete All Remaining Microservices Script
Write-Host "🚀 Completing All Remaining Microservices..." -ForegroundColor Green

# Content Service (Port 3005)
Write-Host "📝 Completing Content Service..." -ForegroundColor Yellow

# Create content service package.json
@"
{
  "name": "content-service",
  "version": "1.0.0",
  "description": "Content microservice for upload, banners, newsletter, and testimonials",
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
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.0.0",
    "@nestjs/microservices": "^10.0.0",
    "@nestjs/mongoose": "^10.0.2",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/throttler": "^5.0.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "joi": "^17.11.0",
    "mongoose": "^8.0.3",
    "multer": "^1.4.5-lts.1",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/multer": "^1.4.11",
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
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
"@ | Out-File "services/content-service/package.json" -Encoding UTF8

# Copy config files
Copy-Item "services/identity-service/tsconfig.json" "services/content-service/tsconfig.json"
Copy-Item "services/identity-service/nest-cli.json" "services/content-service/nest-cli.json"

# Admin Service (Port 3006)
Write-Host "⚙️ Creating Admin Service..." -ForegroundColor Yellow
mkdir -p "services/admin-service/src"
xcopy "src\admin-settings" "services\admin-service\src\admin-settings" /E /I /Q
xcopy "src\common" "services\admin-service\src\common" /E /I /Q
xcopy "src\config" "services\admin-service\src\config" /E /I /Q

# Create admin service package.json
@"
{
  "name": "admin-service",
  "version": "1.0.0", 
  "description": "Admin microservice for admin settings and configuration",
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
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.0.0",
    "@nestjs/microservices": "^10.0.0",
    "@nestjs/mongoose": "^10.0.2",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/throttler": "^5.0.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "joi": "^17.11.0",
    "mongoose": "^8.0.3",
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
  },
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
"@ | Out-File "services/admin-service/package.json" -Encoding UTF8

Copy-Item "services/identity-service/tsconfig.json" "services/admin-service/tsconfig.json"
Copy-Item "services/identity-service/nest-cli.json" "services/admin-service/nest-cli.json"

Write-Host "✅ All services structure created!" -ForegroundColor Green
Write-Host "Next: Create main.ts and app.module.ts files for each service" -ForegroundColor Cyan
