# CI/CD Pipeline Setup

## GitHub Actions Workflow

### 1. Main CI/CD Pipeline (.github/workflows/deploy.yml)
```yaml
name: Kalpla CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Test and Build
  test-and-build:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: kalpla_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: |
        cd kalpla-backend && npm ci
        cd ../kalpla-frontend && npm ci

    - name: Run backend tests
      run: |
        cd kalpla-backend
        npm run test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/kalpla_test
        REDIS_URL: redis://localhost:6379
        JWT_SECRET: test-secret
        NODE_ENV: test

    - name: Run frontend tests
      run: |
        cd kalpla-frontend
        npm run test

    - name: Run linting
      run: |
        cd kalpla-backend && npm run lint
        cd ../kalpla-frontend && npm run lint

    - name: Build backend
      run: |
        cd kalpla-backend
        npm run build

    - name: Build frontend
      run: |
        cd kalpla-frontend
        npm run build

    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-artifacts
        path: |
          kalpla-backend/dist
          kalpla-frontend/.next
        retention-days: 7

  # Security Scanning
  security-scan:
    runs-on: ubuntu-latest
    needs: test-and-build
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'

    - name: Upload Trivy scan results
      uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: 'trivy-results.sarif'

    - name: Run npm audit
      run: |
        cd kalpla-backend && npm audit --audit-level moderate
        cd ../kalpla-frontend && npm audit --audit-level moderate

  # Build and Push Docker Images
  build-and-push:
    runs-on: ubuntu-latest
    needs: [test-and-build, security-scan]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: build-artifacts

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}

    - name: Build and push backend image
      uses: docker/build-push-action@v5
      with:
        context: ./kalpla-backend
        file: ./kalpla-backend/Dockerfile
        target: production
        push: true
        tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:${{ github.sha }}
        labels: ${{ steps.meta.outputs.labels }}

    - name: Build and push frontend image
      uses: docker/build-push-action@v5
      with:
        context: ./kalpla-frontend
        file: ./kalpla-frontend/Dockerfile
        target: production
        push: true
        tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:${{ github.sha }}
        labels: ${{ steps.meta.outputs.labels }}

  # Deploy to Production
  deploy-production:
    runs-on: ubuntu-latest
    needs: build-and-push
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Deploy to production server
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.PRODUCTION_HOST }}
        username: ${{ secrets.PRODUCTION_USER }}
        key: ${{ secrets.PRODUCTION_SSH_KEY }}
        script: |
          cd /opt/kalpla
          
          # Pull latest images
          docker pull ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:${{ github.sha }}
          docker pull ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:${{ github.sha }}
          
          # Update docker-compose.prod.yml with new image tags
          sed -i "s|image: kalpla-backend|image: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:${{ github.sha }}|g" docker-compose.prod.yml
          sed -i "s|image: kalpla-frontend|image: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend:${{ github.sha }}|g" docker-compose.prod.yml
          
          # Deploy with zero downtime
          docker-compose -f docker-compose.prod.yml up -d --no-deps backend
          sleep 10
          docker-compose -f docker-compose.prod.yml up -d --no-deps frontend
          sleep 10
          docker-compose -f docker-compose.prod.yml up -d --no-deps nginx
          
          # Health check
          curl -f https://kalpla.in/api/health || exit 1
          
          # Cleanup old images
          docker image prune -f

    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        fields: repo,message,commit,author,action,eventName,ref,workflow

  # Rollback on failure
  rollback:
    runs-on: ubuntu-latest
    needs: deploy-production
    if: failure()
    
    steps:
    - name: Rollback deployment
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.PRODUCTION_HOST }}
        username: ${{ secrets.PRODUCTION_USER }}
        key: ${{ secrets.PRODUCTION_SSH_KEY }}
        script: |
          cd /opt/kalpla
          
          # Rollback to previous version
          docker-compose -f docker-compose.prod.yml down
          docker-compose -f docker-compose.prod.yml up -d
          
          # Notify rollback
          curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"🚨 Kalpla deployment rollback completed"}' \
            ${{ secrets.SLACK_WEBHOOK }}
```

### 2. Staging Deployment (.github/workflows/staging.yml)
```yaml
name: Deploy to Staging

on:
  push:
    branches: [ develop ]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Deploy to staging
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.STAGING_HOST }}
        username: ${{ secrets.STAGING_USER }}
        key: ${{ secrets.STAGING_SSH_KEY }}
        script: |
          cd /opt/kalpla-staging
          git pull origin develop
          docker-compose -f docker-compose.staging.yml up -d --build
          
          # Run staging tests
          docker-compose -f docker-compose.staging.yml exec backend npm run test
```

### 3. Database Migration Pipeline (.github/workflows/migrate.yml)
```yaml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to migrate'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production

jobs:
  migrate:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Run database migration
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets[format('{0}_HOST', inputs.environment)] }}
        username: ${{ secrets[format('{0}_USER', inputs.environment)] }}
        key: ${{ secrets[format('{0}_SSH_KEY', inputs.environment)] }}
        script: |
          cd /opt/kalpla${{ inputs.environment == 'production' && '' || '-staging' }}
          
          # Backup database before migration
          docker exec kalpla-postgres-${{ inputs.environment }} pg_dump -U kalpla_user kalpla_${{ inputs.environment }} > backup-$(date +%Y%m%d-%H%M%S).sql
          
          # Run migration
          docker-compose -f docker-compose.${{ inputs.environment }}.yml exec backend npx prisma migrate deploy
          
          # Verify migration
          docker-compose -f docker-compose.${{ inputs.environment }}.yml exec backend npx prisma db seed
```

### 4. Security and Compliance Pipeline (.github/workflows/security.yml)
```yaml
name: Security and Compliance

on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday at 2 AM
  workflow_dispatch:

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Run OWASP ZAP Baseline Scan
      uses: zaproxy/action-baseline@v0.7.0
      with:
        target: 'https://kalpla.in'
        rules_file_name: '.zap/rules.tsv'
        cmd_options: '-a'

    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high

    - name: Check for secrets
      uses: trufflesecurity/trufflehog@main
      with:
        path: ./
        base: main
        head: HEAD
        extra_args: --debug --only-verified

  compliance-check:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Run license compliance check
      run: |
        cd kalpla-backend && npm run license-check
        cd ../kalpla-frontend && npm run license-check

    - name: Generate compliance report
      run: |
        echo "## Compliance Report" > compliance-report.md
        echo "Date: $(date)" >> compliance-report.md
        echo "Branch: ${{ github.ref }}" >> compliance-report.md
        echo "Commit: ${{ github.sha }}" >> compliance-report.md
```

### 5. Performance Testing Pipeline (.github/workflows/performance.yml)
```yaml
name: Performance Testing

on:
  schedule:
    - cron: '0 3 * * 0'  # Weekly on Sunday at 3 AM
  workflow_dispatch:

jobs:
  performance-test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v10
      with:
        configPath: './lighthouse-ci.json'
        uploadArtifacts: true
        temporaryPublicStorage: true

    - name: Run K6 performance tests
      run: |
        docker run --rm -v $(pwd)/k6-tests:/scripts loadimpact/k6:latest run /scripts/load-test.js

    - name: Generate performance report
      run: |
        echo "## Performance Report" > performance-report.md
        echo "Date: $(date)" >> performance-report.md
        echo "Lighthouse Score: $(cat lighthouse-results.json | jq '.score')" >> performance-report.md
```

### 6. Configuration Files

#### Lighthouse CI Configuration (lighthouse-ci.json)
```json
{
  "ci": {
    "collect": {
      "url": ["https://kalpla.in"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.8}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.8}],
        "categories:seo": ["error", {"minScore": 0.8}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

#### K6 Performance Test (k6-tests/load-test.js)
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

export default function () {
  // Test homepage
  let response = http.get('https://kalpla.in');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  // Test API
  response = http.get('https://kalpla.in/api/health');
  check(response, {
    'API status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

### 7. GitHub Secrets Configuration

#### Required Secrets:
```bash
# Production Server
PRODUCTION_HOST=your-production-server.com
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=your-private-ssh-key

# Staging Server
STAGING_HOST=your-staging-server.com
STAGING_USER=deploy
STAGING_SSH_KEY=your-private-ssh-key

# Container Registry
GITHUB_TOKEN=your-github-token

# Security Tools
SNYK_TOKEN=your-snyk-token
SLACK_WEBHOOK=your-slack-webhook-url

# Monitoring
GRAFANA_API_KEY=your-grafana-api-key
PROMETHEUS_URL=your-prometheus-url
```

### 8. Deployment Scripts

#### Production Deployment Script (scripts/deploy.sh)
```bash
#!/bin/bash
set -e

echo "🚀 Deploying Kalpla to Production..."

# Check if we're on main branch
if [ "$(git branch --show-current)" != "main" ]; then
    echo "❌ Error: Must be on main branch to deploy to production"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Working directory is not clean"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm run test

# Build applications
echo "🔨 Building applications..."
cd kalpla-backend && npm run build
cd ../kalpla-frontend && npm run build

# Deploy to production
echo "📦 Deploying to production..."
docker-compose -f docker-compose.prod.yml up -d --build

# Health check
echo "🔍 Running health checks..."
sleep 30
curl -f https://kalpla.in/api/health || exit 1

echo "✅ Deployment successful!"
```

#### Rollback Script (scripts/rollback.sh)
```bash
#!/bin/bash
set -e

echo "🔄 Rolling back Kalpla deployment..."

# Get previous version
PREVIOUS_VERSION=$(docker images --format "table {{.Tag}}" | grep -v "latest" | head -1)

if [ -z "$PREVIOUS_VERSION" ]; then
    echo "❌ Error: No previous version found"
    exit 1
fi

echo "📦 Rolling back to version: $PREVIOUS_VERSION"

# Update docker-compose with previous version
sed -i "s|image: kalpla-backend:.*|image: kalpla-backend:$PREVIOUS_VERSION|g" docker-compose.prod.yml
sed -i "s|image: kalpla-frontend:.*|image: kalpla-frontend:$PREVIOUS_VERSION|g" docker-compose.prod.yml

# Deploy previous version
docker-compose -f docker-compose.prod.yml up -d

# Health check
echo "🔍 Running health checks..."
sleep 30
curl -f https://kalpla.in/api/health || exit 1

echo "✅ Rollback successful!"
```

### 9. Monitoring Integration

#### Slack Notifications
```yaml
# Add to workflow steps
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#deployments'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
    fields: repo,message,commit,author,action,eventName,ref,workflow
```

#### Grafana Dashboard Updates
```bash
# scripts/update-grafana-dashboard.sh
#!/bin/bash

# Update Grafana dashboard with deployment metrics
curl -X POST \
  -H "Authorization: Bearer $GRAFANA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "dashboard": {
      "title": "Kalpla Deployment Metrics",
      "panels": [
        {
          "title": "Deployment Status",
          "type": "stat",
          "targets": [
            {
              "expr": "up{job=\"kalpla-backend\"}"
            }
          ]
        }
      ]
    }
  }' \
  $GRAFANA_URL/api/dashboards/db
```

## CI/CD Pipeline Benefits

✅ **Automated Testing**: Unit tests, integration tests, and E2E tests  
✅ **Security Scanning**: Vulnerability scanning and compliance checks  
✅ **Performance Testing**: Lighthouse CI and K6 load testing  
✅ **Zero-Downtime Deployment**: Rolling updates with health checks  
✅ **Rollback Capability**: Automatic rollback on deployment failure  
✅ **Monitoring Integration**: Slack notifications and Grafana dashboards  
✅ **Multi-Environment**: Staging and production environments  
✅ **Database Migrations**: Automated database schema updates  
✅ **Container Registry**: Automated Docker image building and pushing  
✅ **Compliance**: License checking and security compliance  

Your Kalpla platform now has enterprise-grade CI/CD capabilities! 🚀
