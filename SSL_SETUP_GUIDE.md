# SSL Certificate Setup Guide for Kalpla Production Deployment

## Overview
SSL certificates are essential for secure communication, HTTPS enforcement, and modern web features like push notifications.

## SSL Certificate Options

### 1. Let's Encrypt (Free, Recommended)
- **Cost**: Free
- **Validity**: 90 days (auto-renewal recommended)
- **Features**: Wildcard certificates, automatic renewal
- **Best for**: Most production deployments

### 2. Commercial SSL Providers
- **Cost**: $50-500/year
- **Validity**: 1-2 years
- **Features**: Extended validation, warranty, support
- **Best for**: Enterprise applications

### 3. Cloud Provider SSL
- **AWS Certificate Manager**: Free with AWS services
- **Cloudflare**: Free SSL with CDN
- **Google Cloud**: Free with Google services

## Let's Encrypt Setup (Recommended)

### Prerequisites
- Domain name pointing to your server
- Server with root/sudo access
- Ports 80 and 443 open

### 1. Install Certbot

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

#### CentOS/RHEL:
```bash
sudo yum install certbot python3-certbot-nginx
```

#### macOS:
```bash
brew install certbot
```

### 2. Generate SSL Certificate

#### For Nginx (Recommended):
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Manual verification:
```bash
sudo certbot certonly --manual -d yourdomain.com -d www.yourdomain.com
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

## Nginx SSL Configuration

### 1. Update Nginx Configuration

Create `/etc/nginx/sites-available/kalpla`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Frontend (Next.js)
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
    location /api/ {
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
    
    # WebSocket support
    location /ws/ {
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
```

### 2. Enable Site and Test Configuration

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/kalpla /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Docker SSL Configuration

### 1. Docker Compose with SSL

Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
      - /var/www/html:/var/www/html
    depends_on:
      - frontend
      - backend

  frontend:
    build: ./kalpla-frontend
    environment:
      - NODE_ENV=production
    expose:
      - "3000"

  backend:
    build: ./kalpla-backend
    environment:
      - NODE_ENV=production
    expose:
      - "3001"
```

### 2. SSL Certificate Volume Mount

```bash
# Mount SSL certificates in Docker
docker run -d \
  -p 80:80 \
  -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  nginx:alpine
```

## Cloudflare SSL Setup (Alternative)

### 1. Cloudflare Configuration

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption mode: "Full (strict)"
4. Enable "Always Use HTTPS"

### 2. Origin Certificate (Optional)

Generate Cloudflare Origin Certificate for server-to-server communication:

1. Go to Cloudflare Dashboard → SSL/TLS → Origin Server
2. Create Certificate
3. Add certificate to your server

## SSL Testing and Validation

### 1. SSL Labs Test

Visit [SSL Labs](https://www.ssllabs.com/ssltest/) to test your SSL configuration:
- Enter your domain
- Check for A+ rating
- Review security recommendations

### 2. Command Line Testing

```bash
# Test SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check certificate expiration
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Test SSL configuration
curl -I https://yourdomain.com
```

### 3. Automated SSL Monitoring

Create a monitoring script:

```bash
#!/bin/bash
# ssl-check.sh

DOMAIN="yourdomain.com"
EMAIL="admin@yourdomain.com"

# Check certificate expiration
EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
CURRENT_EPOCH=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
    echo "SSL certificate expires in $DAYS_UNTIL_EXPIRY days" | mail -s "SSL Certificate Expiry Warning" $EMAIL
fi
```

## Security Best Practices

### 1. SSL Configuration
- Use TLS 1.2+ only
- Disable weak ciphers
- Enable HSTS
- Use strong key sizes (2048+ bits)

### 2. Security Headers
```nginx
# Add to Nginx configuration
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

### 3. Certificate Management
- Monitor expiration dates
- Set up automatic renewal
- Keep private keys secure
- Use certificate transparency monitoring

## Troubleshooting

### Common Issues:

1. **"SSL certificate problem"**
   - Check certificate path and permissions
   - Verify domain name matches certificate

2. **"Connection refused"**
   - Ensure ports 80 and 443 are open
   - Check firewall settings

3. **"Certificate not trusted"**
   - Verify certificate chain is complete
   - Check intermediate certificates

4. **"Mixed content warnings"**
   - Ensure all resources use HTTPS
   - Update hardcoded HTTP URLs

### Debug Commands:

```bash
# Check certificate details
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout

# Test SSL connection
curl -vI https://yourdomain.com

# Check Nginx configuration
sudo nginx -t

# View SSL logs
sudo tail -f /var/log/nginx/error.log
```

## Production Checklist

- [ ] SSL certificate installed and valid
- [ ] HTTPS redirect configured
- [ ] Security headers implemented
- [ ] Certificate auto-renewal set up
- [ ] SSL monitoring configured
- [ ] Mixed content issues resolved
- [ ] SSL Labs test passed (A+ rating)
- [ ] Backup certificate and keys
- [ ] Documentation updated

## Cost Considerations

### Let's Encrypt (Free)
- ✅ No cost
- ✅ Automatic renewal
- ✅ Wildcard support
- ❌ 90-day validity
- ❌ No warranty

### Commercial SSL ($50-500/year)
- ✅ Longer validity
- ✅ Warranty and support
- ✅ Extended validation
- ❌ Higher cost
- ❌ Manual renewal

### Cloud Provider SSL (Free with services)
- ✅ Integrated with cloud services
- ✅ Automatic management
- ✅ No additional cost
- ❌ Vendor lock-in
- ❌ Limited customization

Choose the option that best fits your needs and budget!

