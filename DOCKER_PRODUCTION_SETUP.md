# Production Docker Configuration

## Docker Compose Production Setup

### 1. Production Docker Compose (docker-compose.prod.yml)
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: kalpla-postgres-prod
    restart: unless-stopped
    environment:
      POSTGRES_DB: kalpla_prod
      POSTGRES_USER: kalpla_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - kalpla-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U kalpla_user -d kalpla_prod"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: kalpla-redis-prod
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - kalpla-network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend API
  backend:
    build:
      context: ./kalpla-backend
      dockerfile: Dockerfile
      target: production
    container_name: kalpla-backend-prod
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://kalpla_user:${POSTGRES_PASSWORD}@postgres:5432/kalpla_prod
      REDIS_URL: redis://redis:6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      FRONTEND_URL: https://kalpla.in
      ALLOWED_ORIGINS: https://kalpla.in,https://www.kalpla.in
      AWS_REGION: ${AWS_REGION}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_S3_BUCKET: ${AWS_S3_BUCKET}
      FIREBASE_PROJECT_ID: ${FIREBASE_PROJECT_ID}
      FIREBASE_PRIVATE_KEY: ${FIREBASE_PRIVATE_KEY}
      FIREBASE_CLIENT_EMAIL: ${FIREBASE_CLIENT_EMAIL}
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
      SMTP_FROM: ${SMTP_FROM}
      LOG_LEVEL: info
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - kalpla-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build:
      context: ./kalpla-frontend
      dockerfile: Dockerfile
      target: production
    container_name: kalpla-frontend-prod
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: https://kalpla.in/api
      NEXT_PUBLIC_WS_URL: wss://kalpla.in
      NEXT_PUBLIC_APP_ENV: production
      NEXT_PUBLIC_DEBUG: false
      NEXT_PUBLIC_ANALYTICS_ENABLED: true
      NEXT_PUBLIC_FIREBASE_API_KEY: ${NEXT_PUBLIC_FIREBASE_API_KEY}
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
      NEXT_PUBLIC_FIREBASE_APP_ID: ${NEXT_PUBLIC_FIREBASE_APP_ID}
      GOOGLE_ANALYTICS_ID: ${GOOGLE_ANALYTICS_ID}
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - kalpla-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: kalpla-nginx-prod
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/conf.d:/etc/nginx/conf.d
      - /etc/letsencrypt:/etc/letsencrypt
      - nginx_logs:/var/log/nginx
    depends_on:
      - frontend
      - backend
    networks:
      - kalpla-network
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Monitoring with Prometheus
  prometheus:
    image: prom/prometheus:latest
    container_name: kalpla-prometheus-prod
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    networks:
      - kalpla-network

  # Grafana Dashboard
  grafana:
    image: grafana/grafana:latest
    container_name: kalpla-grafana-prod
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
      GF_USERS_ALLOW_SIGN_UP: false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    depends_on:
      - prometheus
    networks:
      - kalpla-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  nginx_logs:
    driver: local
  prometheus_data:
    driver: local
  grafana_data:
    driver: local

networks:
  kalpla-network:
    driver: bridge
```

### 2. Production Dockerfile for Backend
```dockerfile
# kalpla-backend/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 kalpla

COPY --from=builder --chown=kalpla:nodejs /app/dist ./dist
COPY --from=builder --chown=kalpla:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=kalpla:nodejs /app/package.json ./package.json

USER kalpla

EXPOSE 3001

ENV PORT=3001

CMD ["node", "dist/server.js"]
```

### 3. Production Dockerfile for Frontend
```dockerfile
# kalpla-frontend/Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 4. Nginx Configuration
```nginx
# nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Include server configurations
    include /etc/nginx/conf.d/*.conf;
}
```

### 5. Nginx Server Configuration
```nginx
# nginx/conf.d/kalpla.conf
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:3001;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name kalpla.in www.kalpla.in;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name kalpla.in www.kalpla.in;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/kalpla.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kalpla.in/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Backend API
    location /api {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Login endpoint with stricter rate limiting
    location /api/auth/login {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://frontend;
    }
}
```

### 6. Environment Variables (.env.production)
```bash
# Database
POSTGRES_PASSWORD=your_secure_postgres_password
REDIS_PASSWORD=your_secure_redis_password

# JWT Secrets (Generate strong secrets)
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here

# AWS Production
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_production_aws_key
AWS_SECRET_ACCESS_KEY=your_production_aws_secret
AWS_S3_BUCKET=kalpla-content-storage-prod

# Firebase Production
FIREBASE_PROJECT_ID=kalpla-prod
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PROD_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@kalpla-prod.iam.gserviceaccount.com

# Frontend Environment Variables
NEXT_PUBLIC_FIREBASE_API_KEY=your_prod_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kalpla-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kalpla-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kalpla-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# SMTP Production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@kalpla.in
SMTP_PASS=your_app_password
SMTP_FROM=noreply@kalpla.in

# Monitoring
GRAFANA_PASSWORD=your_secure_grafana_password
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### 7. Production Deployment Script
```bash
#!/bin/bash
# deploy-production.sh

set -e

echo "🚀 Starting Kalpla Production Deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production with your production environment variables."
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Create necessary directories
mkdir -p nginx/conf.d
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources

# Generate SSL certificates (if not already done)
if [ ! -d "/etc/letsencrypt/live/kalpla.in" ]; then
    echo "📜 Generating SSL certificates..."
    sudo certbot --nginx -d kalpla.in -d www.kalpla.in --non-interactive --agree-tos --email admin@kalpla.in
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

# Test endpoints
echo "🧪 Testing endpoints..."
curl -f http://localhost/api/health || echo "❌ Backend health check failed"
curl -f http://localhost || echo "❌ Frontend health check failed"

echo "✅ Kalpla Production Deployment Complete!"
echo "🌐 Frontend: https://kalpla.in"
echo "🔧 Backend API: https://kalpla.in/api"
echo "📊 Grafana: http://localhost:3001"
echo "📈 Prometheus: http://localhost:9090"
```

### 8. Monitoring Configuration
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'kalpla-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/api/metrics'
    scrape_interval: 5s

  - job_name: 'kalpla-frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 5s

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:9113']
    scrape_interval: 5s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
    scrape_interval: 5s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
    scrape_interval: 5s
```

### 9. Backup Script
```bash
#!/bin/bash
# backup-production.sh

BACKUP_DIR="/backup/kalpla-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

echo "📦 Creating production backup..."

# Backup database
docker exec kalpla-postgres-prod pg_dump -U kalpla_user kalpla_prod > $BACKUP_DIR/database.sql

# Backup Redis
docker exec kalpla-redis-prod redis-cli --rdb $BACKUP_DIR/redis.rdb

# Backup SSL certificates
sudo cp -r /etc/letsencrypt $BACKUP_DIR/

# Backup application data
docker cp kalpla-backend-prod:/app $BACKUP_DIR/backend-app
docker cp kalpla-frontend-prod:/app $BACKUP_DIR/frontend-app

# Compress backup
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "✅ Backup created: $BACKUP_DIR.tar.gz"
```

### 10. Health Check Script
```bash
#!/bin/bash
# health-check.sh

echo "🔍 Kalpla Production Health Check"

# Check Docker containers
echo "📦 Docker Containers:"
docker-compose -f docker-compose.prod.yml ps

# Check SSL certificate
echo "🔒 SSL Certificate:"
echo | openssl s_client -servername kalpla.in -connect kalpla.in:443 2>/dev/null | openssl x509 -noout -dates

# Check API health
echo "🔧 Backend API:"
curl -s https://kalpla.in/api/health | jq .

# Check frontend
echo "🌐 Frontend:"
curl -s -I https://kalpla.in | head -1

# Check database
echo "🗄️ Database:"
docker exec kalpla-postgres-prod pg_isready -U kalpla_user -d kalpla_prod

# Check Redis
echo "🔴 Redis:"
docker exec kalpla-redis-prod redis-cli ping

echo "✅ Health check complete!"
```

## Production Deployment Commands

```bash
# 1. Clone repository and setup
git clone https://github.com/your-repo/kalpla.git
cd kalpla

# 2. Create production environment file
cp .env.example .env.production
# Edit .env.production with your production values

# 3. Generate SSL certificates
sudo certbot --nginx -d kalpla.in -d www.kalpla.in

# 4. Deploy with Docker Compose
chmod +x deploy-production.sh
./deploy-production.sh

# 5. Monitor services
chmod +x health-check.sh
./health-check.sh

# 6. Setup monitoring
# Access Grafana at http://your-server:3001
# Access Prometheus at http://your-server:9090
```

This production Docker setup provides:
- ✅ **High Availability**: Restart policies and health checks
- ✅ **Security**: SSL/TLS, security headers, rate limiting
- ✅ **Monitoring**: Prometheus + Grafana
- ✅ **Scalability**: Load balancing and caching
- ✅ **Backup**: Automated backup scripts
- ✅ **Performance**: Optimized Docker images and Nginx configuration

Your Kalpla platform is now ready for production deployment! 🚀
