# Production SSL Certificate Setup

## SSL Certificate Configuration with Let's Encrypt

### 1. Install Certbot
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

### 2. Generate SSL Certificate
```bash
# Replace your-domain.com with your actual domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# For multiple domains
sudo certbot --nginx -d kalpla.in -d www.kalpla.in -d api.kalpla.in
```

### 3. Auto-renewal Setup
```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab for automatic renewal
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name kalpla.in www.kalpla.in;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/kalpla.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kalpla.in/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name kalpla.in www.kalpla.in;
    return 301 https://$server_name$request_uri;
}
```

### 5. SSL Monitoring Script
```bash
#!/bin/bash
# ssl-monitor.sh

DOMAIN="kalpla.in"
DAYS_BEFORE_EXPIRY=30

# Check certificate expiry
EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_TIMESTAMP=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( (EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -lt $DAYS_BEFORE_EXPIRY ]; then
    echo "WARNING: SSL certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRY days"
    # Send notification (email, Slack, etc.)
    # certbot renew --quiet
else
    echo "SSL certificate for $DOMAIN is valid for $DAYS_UNTIL_EXPIRY days"
fi
```

### 6. Security Headers
```nginx
# Add to server block
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 7. Rate Limiting
```nginx
# Add to http block
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

# Add to location blocks
location /api/auth/login {
    limit_req zone=login burst=5 nodelay;
    proxy_pass http://localhost:3001;
}

location /api {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://localhost:3001;
}
```

### 8. Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -j DROP
```

### 9. SSL Grade Check
```bash
# Test SSL configuration
curl -I https://kalpla.in
nmap --script ssl-enum-ciphers -p 443 kalpla.in
```

### 10. Backup SSL Certificates
```bash
# Backup certificates
sudo cp -r /etc/letsencrypt /backup/ssl-backup-$(date +%Y%m%d)
```

## Environment Variables for Production

### Backend (.env.production)
```bash
# Production Environment
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL="postgresql://kalpla_user:secure_password@localhost:5432/kalpla_prod"

# JWT (Generate strong secrets)
JWT_SECRET="your-super-secure-jwt-secret-key-here"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-key-here"

# Frontend URL
FRONTEND_URL=https://kalpla.in

# Security
ALLOWED_ORIGINS=https://kalpla.in,https://www.kalpla.in

# AWS Production
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_production_aws_key
AWS_SECRET_ACCESS_KEY=your_production_aws_secret
AWS_S3_BUCKET=kalpla-content-storage-prod

# Firebase Production
FIREBASE_PROJECT_ID=kalpla-prod
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PROD_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@kalpla-prod.iam.gserviceaccount.com

# Redis Production
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_secure_redis_password

# SMTP Production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@kalpla.in
SMTP_PASS=your_app_password
SMTP_FROM=noreply@kalpla.in

# Monitoring
LOG_LEVEL=info
```

### Frontend (.env.production)
```bash
# Production Environment
NEXT_PUBLIC_API_URL=https://kalpla.in/api
NEXT_PUBLIC_WS_URL=wss://kalpla.in
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_ANALYTICS_ENABLED=true

# Firebase Production
NEXT_PUBLIC_FIREBASE_API_KEY=your_prod_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kalpla-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kalpla-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kalpla-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
FACEBOOK_PIXEL_ID=your_facebook_pixel_id
```

## SSL Certificate Monitoring

### Automated Renewal Check
```bash
#!/bin/bash
# /etc/cron.daily/ssl-check

DOMAIN="kalpla.in"
LOG_FILE="/var/log/ssl-check.log"

# Check certificate expiry
EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_TIMESTAMP=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( (EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))

echo "$(date): SSL certificate for $DOMAIN expires in $DAYS_UNTIL_EXPIRY days" >> $LOG_FILE

if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
    echo "$(date): WARNING - SSL certificate expires soon!" >> $LOG_FILE
    # Send alert notification
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"SSL Certificate for kalpla.in expires in '$DAYS_UNTIL_EXPIRY' days!"}' \
        YOUR_SLACK_WEBHOOK_URL
fi
```

## Security Checklist

- [ ] SSL certificate installed and configured
- [ ] HTTP to HTTPS redirect enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Firewall configured
- [ ] Strong JWT secrets generated
- [ ] Database credentials secured
- [ ] AWS credentials secured
- [ ] Firebase credentials secured
- [ ] SMTP credentials secured
- [ ] SSL monitoring enabled
- [ ] Automated renewal configured
- [ ] Backup strategy implemented

## Next Steps

1. **Domain Setup**: Configure your domain DNS to point to your server
2. **Certificate Generation**: Run certbot to generate SSL certificates
3. **Nginx Configuration**: Deploy the SSL-enabled Nginx configuration
4. **Security Testing**: Test SSL configuration and security headers
5. **Monitoring Setup**: Configure SSL monitoring and alerts
6. **Backup Strategy**: Implement SSL certificate backup

This setup provides enterprise-grade SSL security for your Kalpla platform!
