# Docker Guide for Life Maxxing Backend

## 📋 Overview

This guide explains how to run the Life Maxxing backend using Docker for both development and production environments.

## 🏗️ Files Created

- `Dockerfile` - Standard production container (Alpine + OpenSSL fix)
- `Dockerfile.prod` - Multi-stage production build (recommended)
- `Dockerfile.simple` - Simple, reliable build for deployment platforms
- `Dockerfile.debian` - Debian-based build for maximum Prisma compatibility
- `Dockerfile.dev` - Development container with hot reloading
- `docker-compose.yml` - Production setup with PostgreSQL
- `docker-compose.dev.yml` - Development setup
- `.dockerignore` - Excludes unnecessary files from build

## 🚀 Quick Start

### Development Environment

1. **Start development environment:**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

2. **Services available:**
- Backend API: http://localhost:3000
- Database Admin (Adminer): http://localhost:8080
- PostgreSQL: localhost:5432

3. **Stop development environment:**
```bash
docker-compose -f docker-compose.dev.yml down
```

### Production Environment

1. **Start production environment:**
```bash
docker-compose up --build -d
```

2. **Services available:**
- Backend API: http://localhost:3000
- Database Admin (Adminer): http://localhost:8080
- PostgreSQL: localhost:5432

3. **Stop production environment:**
```bash
docker-compose down
```

## 🛠️ Dockerfile Options

### Dockerfile.prod (Recommended)
Multi-stage build with optimizations:
```bash
docker build -f Dockerfile.prod -t lifemaxxing-backend .
```

### Dockerfile.simple (Most Compatible)
Simple, reliable build for deployment platforms:
```bash
docker build -f Dockerfile.simple -t lifemaxxing-backend .
```

### Dockerfile.debian (Prisma Issues Fix)
Debian-based build for maximum compatibility:
```bash
docker build -f Dockerfile.debian -t lifemaxxing-backend .
```

### Dockerfile (Standard)
Basic production build with Alpine + OpenSSL:
```bash
docker build -t lifemaxxing-backend .
```

## 🐛 Prisma + Alpine Linux Issues

### Common Error
```
Error loading shared library libssl.so.1.1: No such file or directory
PrismaClientInitializationError: Unable to require libquery_engine-linux-musl.so.node
```

### Solutions (In Order of Preference)

**1. Use Fixed Alpine Dockerfiles (Already Implemented)**
All Alpine-based Dockerfiles now include `openssl1.1-compat`:
```dockerfile
RUN apk add --no-cache openssl1.1-compat
```

**2. Use Debian-Based Dockerfile**
```bash
docker build -f Dockerfile.debian -t lifemaxxing-backend .
```

**3. Force Engine Regeneration**
```bash
# In container
npm install
npx prisma generate --force-version
```

**4. Use Different Node.js Base Image**
```dockerfile
FROM node:18-slim  # Instead of node:18-alpine
```

## 🛠️ Detailed Commands

### Building Images

**Build production image:**
```bash
docker build -t lifemaxxing-backend .
```

**Build development image:**
```bash
docker build -f Dockerfile.dev -t lifemaxxing-backend-dev .
```

### Running Individual Containers

**Run backend only (requires external database):**
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e JWT_SECRET="your_jwt_secret" \
  lifemaxxing-backend
```

### Database Management

**Run migrations:**
```bash
docker-compose exec backend npx prisma migrate deploy
```

**Seed database:**
```bash
docker-compose exec backend npx prisma db seed
```

**Reset database:**
```bash
docker-compose exec backend npx prisma migrate reset
```

**Open Prisma Studio:**
```bash
docker-compose exec backend npx prisma studio
```

### Logs and Debugging

**View backend logs:**
```bash
docker-compose logs backend
```

**Follow logs in real-time:**
```bash
docker-compose logs -f backend
```

**Access backend container shell:**
```bash
docker-compose exec backend sh
```

**View all service logs:**
```bash
docker-compose logs
```

## 🔧 Configuration

### Environment Variables

The docker-compose files set these environment variables:

**Development:**
- `NODE_ENV=development`
- `DATABASE_URL=postgresql://postgres:password123@postgres:5432/lifemaxxing_dev`
- `JWT_SECRET=dev_jwt_secret_key`

**Production:**
- `NODE_ENV=production` 
- `DATABASE_URL=postgresql://postgres:password123@postgres:5432/lifemaxxing`
- `JWT_SECRET=your_super_secret_jwt_key_change_this_in_production`

⚠️ **Important:** Change the JWT_SECRET and database password in production!

### Custom Environment Variables

Create a `.env.docker` file for custom variables:

```env
JWT_SECRET=your_super_secure_jwt_secret
POSTGRES_PASSWORD=your_secure_password
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

Then use it with docker-compose:
```bash
docker-compose --env-file .env.docker up
```

## 💾 Data Persistence

### Volumes

The setup creates persistent volumes for:
- **Database data:** `postgres_data` / `postgres_data_dev`
- **Upload files:** `uploads_data` / `uploads_data_dev`

### Backup Database

**Create backup:**
```bash
docker-compose exec postgres pg_dump -U postgres lifemaxxing > backup.sql
```

**Restore backup:**
```bash
docker-compose exec -T postgres psql -U postgres lifemaxxing < backup.sql
```

## 🐛 Troubleshooting

### Common Issues

**Prisma Engine Loading Error:**
```bash
# Error: libssl.so.1.1: No such file or directory
# Solution 1: Use Dockerfile.debian
docker build -f Dockerfile.debian -t lifemaxxing-backend .

# Solution 2: Regenerate Prisma client in container
docker-compose exec backend sh
npm install
npx prisma generate

# Solution 3: Use corrected Alpine Dockerfiles (already implemented)
```

**Package-lock.json sync error (npm ci fails):**
```bash
# This error occurs when package.json and package-lock.json are out of sync
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync

# Solution 1: Regenerate lock file locally
npm install

# Solution 2: Use the simple Dockerfile
docker build -f Dockerfile.simple -t lifemaxxing-backend .

# Solution 3: Force npm install in Dockerfile (already implemented)
```

**Port already in use:**
```bash
# Check what's using the port
lsof -i :3000
# Kill the process or change the port in docker-compose.yml
```

**Database connection issues:**
```bash
# Check if database is running
docker-compose ps postgres
# Check database logs
docker-compose logs postgres
```

**Prisma client issues:**
```bash
# Regenerate Prisma client
docker-compose exec backend npx prisma generate
```

**File permission issues:**
```bash
# Fix upload directory permissions
docker-compose exec backend chmod -R 755 uploads
```

**Build context too large:**
```bash
# Check .dockerignore is properly configured
# Remove node_modules before building
rm -rf node_modules
docker build . -t lifemaxxing-backend
```

### Platform-Specific Issues

**EasyPanel/Deployment Platforms:**
- Use `Dockerfile.simple` for maximum compatibility
- If Prisma issues persist, use `Dockerfile.debian`
- Ensure package-lock.json is up to date
- Check platform-specific environment variable requirements

**Memory Issues:**
```bash
# Add to docker-compose.yml under backend service:
deploy:
  resources:
    limits:
      memory: 1G
    reservations:
      memory: 512M
```

### Clean Up

**Remove all containers and volumes:**
```bash
docker-compose down -v
```

**Remove all images:**
```bash
docker rmi $(docker images "lifemaxxing*" -q)
```

**Full cleanup:**
```bash
# Stop and remove everything
docker-compose down -v --rmi all
# Remove unused Docker resources
docker system prune -a
```

## 🚀 Production Deployment

### Best Practices

1. **Use secrets for sensitive data:**
```bash
echo "your_jwt_secret" | docker secret create jwt_secret -
```

2. **Use environment-specific compose files:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

3. **Health checks:**
The containers include health checks that can be monitored:
```bash
docker-compose ps
```

4. **Logging:**
Configure proper logging drivers for production:
```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Deployment Checklist

- [ ] Change default passwords
- [ ] Set secure JWT_SECRET
- [ ] Configure proper domain/SSL
- [ ] Set up backup strategy
- [ ] Configure monitoring
- [ ] Set resource limits
- [ ] Enable log rotation
- [ ] Update package-lock.json (`npm install`)
- [ ] Test Prisma compatibility (use Dockerfile.debian if issues)

## 📊 Monitoring

### Health Checks

All services include health checks accessible at:
- Backend: http://localhost:3000/health
- Container health: `docker-compose ps`

### Resource Usage

**Check resource usage:**
```bash
docker stats
```

**Set resource limits in docker-compose.yml:**
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

## 🔗 Integration with CI/CD

### GitHub Actions Example

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -f Dockerfile.simple -t lifemaxxing-backend .
      - name: Run tests
        run: docker run --rm lifemaxxing-backend npm test
```

## 🆘 Emergency Fixes

### Quick Fix for Deployment Issues

If you're having persistent build issues on deployment platforms:

1. **For Prisma Engine Issues:**
```bash
# Use Debian-based Dockerfile
cp Dockerfile.debian Dockerfile
```

2. **For Alpine Linux Issues:**
```bash
# Use the simple Dockerfile with OpenSSL fix
cp Dockerfile.simple Dockerfile
```

3. **For npm Issues:**
```bash
# Delete package-lock.json and regenerate
rm package-lock.json
npm install
```

### Dockerfile Priority for Different Issues

**Prisma Engine Errors:** `Dockerfile.debian` → `Dockerfile.simple` → `Dockerfile.prod`  
**Build Speed:** `Dockerfile.simple` → `Dockerfile` → `Dockerfile.prod`  
**Security:** `Dockerfile.prod` → `Dockerfile` → `Dockerfile.simple`  
**Compatibility:** `Dockerfile.debian` → `Dockerfile.simple` → `Dockerfile`

This Docker setup provides a complete, scalable solution for developing and deploying the Life Maxxing backend application! 