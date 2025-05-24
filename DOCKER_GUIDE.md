# Docker Guide for Life Maxxing Backend

## 📋 Overview

This guide explains how to run the Life Maxxing backend using Docker for both development and production environments.

## 🏗️ Files Created

- `Dockerfile` - Production-optimized container
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
        run: docker build -t lifemaxxing-backend .
      - name: Run tests
        run: docker run --rm lifemaxxing-backend npm test
```

This Docker setup provides a complete, scalable solution for developing and deploying the Life Maxxing backend application! 