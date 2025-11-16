# Docker Setup Guide

This guide will help you run the Haruneko Manga API using Docker, which automatically includes Chromium for Puppeteer.

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### 2. Or Build and Run with Docker Only

```bash
# Build the image
docker build -t haruneko-api .

# Run the container
docker run -d \
  --name haruneko-api \
  -p 3000:3000 \
  -v $(pwd)/storage:/app/storage \
  --shm-size=2gb \
  haruneko-api

# View logs
docker logs -f haruneko-api

# Stop the container
docker stop haruneko-api
docker rm haruneko-api
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# Storage
STORAGE_PATH=/app/storage

# Puppeteer (already configured in docker-compose.yml)
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_HEADLESS=true
PUPPETEER_MAX_BROWSERS=5
PUPPETEER_TIMEOUT=150000

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Downloads
DOWNLOAD_RETENTION_DAYS=7
```

Then update `docker-compose.yml` to use the `.env` file:

```yaml
services:
  haruneko-api:
    env_file:
      - .env
    # ... rest of config
```

### Volumes

The Docker setup persists data in the `./storage` directory:

```
storage/
├── database/      # Manga lists, settings, bookmarks
├── downloads/     # Downloaded manga files
└── cache/         # Temporary cache
```

You can change the volume location in `docker-compose.yml`:

```yaml
volumes:
  - /path/to/your/storage:/app/storage
```

## Resource Limits

Adjust resource limits in `docker-compose.yml` based on your needs:

```yaml
deploy:
  resources:
    limits:
      cpus: '4'        # Maximum CPU cores
      memory: 4G       # Maximum RAM
    reservations:
      cpus: '2'        # Minimum CPU cores
      memory: 1G       # Minimum RAM
```

### Shared Memory

Chromium requires shared memory for rendering. The default is 2GB:

```yaml
shm_size: '2gb'
```

If you experience crashes, increase this value.

## Verifying the Setup

### 1. Check Container Status

```bash
# With docker-compose
docker-compose ps

# With docker
docker ps | grep haruneko-api
```

### 2. Check Health

```bash
# Health check endpoint
curl http://localhost:3000/api/v1/sources

# Should return JSON with manga sources
```

### 3. Test Download

```bash
# Create a download
curl -X POST http://localhost:3000/api/v1/downloads \
  -H 'Content-Type: application/json' \
  -d '{
    "sourceId": "mangalover",
    "mangaId": "{\"post\":\"1901\",\"slug\":\"/manga/berserk/\"}",
    "chapterIds": ["/manga/berserk/383/"],
    "format": "cbz"
  }'

# Check download status
curl http://localhost:3000/api/v1/downloads
```

### 4. Check Logs

```bash
# With docker-compose
docker-compose logs -f haruneko-api

# With docker
docker logs -f haruneko-api

# You should see:
# 🌐 Launching Puppeteer browser...
# ✅ Puppeteer browser launched
```

## Troubleshooting

### Container Crashes or Restarts

**Check logs:**
```bash
docker-compose logs --tail=100 haruneko-api
```

**Common issues:**

1. **Chromium crashes**: Increase shared memory
   ```yaml
   shm_size: '4gb'
   ```

2. **Out of memory**: Increase memory limit
   ```yaml
   memory: 4G
   ```

3. **Permission errors**: Fix storage permissions
   ```bash
   chmod -R 777 storage/
   ```

### Downloads Fail

**Check Puppeteer logs:**
```bash
docker-compose logs haruneko-api | grep -i puppeteer
```

**Verify Chromium is installed:**
```bash
docker-compose exec haruneko-api which chromium
# Should output: /usr/bin/chromium

docker-compose exec haruneko-api chromium --version
# Should output version number
```

### Slow Performance

**Increase Puppeteer browser pool:**
```yaml
environment:
  - PUPPETEER_MAX_BROWSERS=10
```

**Increase resources:**
```yaml
deploy:
  resources:
    limits:
      cpus: '4'
      memory: 4G
```

## Production Deployment

### 1. Use Docker Compose with Nginx (SSL)

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream haruneko {
        server haruneko-api:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://haruneko;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Increase timeout for downloads
            proxy_read_timeout 300;
            proxy_connect_timeout 300;
            proxy_send_timeout 300;
        }
    }
}
```

Uncomment the nginx service in `docker-compose.yml` and run:

```bash
docker-compose up -d
```

### 2. Auto-restart on Failure

Already configured with:
```yaml
restart: unless-stopped
```

### 3. Monitoring

**View resource usage:**
```bash
docker stats haruneko-api
```

**Health checks:**
```bash
docker inspect haruneko-api | grep -A 10 Health
```

## Updating

### Update the Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or with docker
docker build -t haruneko-api .
docker stop haruneko-api
docker rm haruneko-api
docker run -d --name haruneko-api ... haruneko-api
```

### Update Dependencies

```bash
# Update package.json locally
npm update

# Rebuild Docker image
docker-compose up -d --build
```

## Backup and Restore

### Backup

```bash
# Backup storage directory
tar -czf haruneko-backup-$(date +%Y%m%d).tar.gz storage/

# Or use docker cp
docker cp haruneko-api:/app/storage ./backup-storage
```

### Restore

```bash
# Extract backup
tar -xzf haruneko-backup-YYYYMMDD.tar.gz

# Restart container to use restored data
docker-compose restart
```

## Clean Up

### Remove Everything

```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove images
docker rmi haruneko-api

# Clean up storage (WARNING: deletes all data)
rm -rf storage/
```

### Clean Old Downloads

```bash
# Files older than DOWNLOAD_RETENTION_DAYS are automatically cleaned
# Or manually clean:
docker-compose exec haruneko-api sh -c "find /app/storage/downloads -mtime +7 -delete"
```

## Next Steps

- Read the [API Documentation](./README.md) for available endpoints
- Configure [environment variables](#environment-variables) for your needs
- Set up [SSL/TLS with Nginx](#production-deployment) for production
- Configure [backups](#backup-and-restore) for data safety

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs: `docker-compose logs -f`
3. Report issues on GitHub with log output
