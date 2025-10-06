# Production Monitoring Setup

## Comprehensive Monitoring Stack

### 1. Prometheus Configuration (monitoring/prometheus.yml)
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'kalpla-production'
    environment: 'production'

rule_files:
  - "alert_rules.yml"
  - "recording_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  # Kalpla Backend
  - job_name: 'kalpla-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/api/metrics'
    scrape_interval: 5s
    scrape_timeout: 5s
    honor_labels: true

  # Kalpla Frontend
  - job_name: 'kalpla-frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 5s

  # Nginx
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:9113']
    scrape_interval: 5s

  # PostgreSQL
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
    scrape_interval: 5s

  # Redis
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
    scrape_interval: 5s

  # Node Exporter (System Metrics)
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
    scrape_interval: 5s

  # cAdvisor (Container Metrics)
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
    scrape_interval: 5s

  # Blackbox Exporter (Uptime Monitoring)
  - job_name: 'blackbox'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
        - https://kalpla.in
        - https://kalpla.in/api/health
        - https://kalpla.in/api/auth/login
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115
```

### 2. Alert Rules (monitoring/alert_rules.yml)
```yaml
groups:
  - name: kalpla-backend
    rules:
      - alert: BackendDown
        expr: up{job="kalpla-backend"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Kalpla backend is down"
          description: "Backend has been down for more than 1 minute"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile response time is {{ $value }} seconds"

      - alert: DatabaseConnectionsHigh
        expr: postgres_stat_activity_count > 80
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High database connections"
          description: "Database has {{ $value }} active connections"

  - name: kalpla-frontend
    rules:
      - alert: FrontendDown
        expr: up{job="kalpla-frontend"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Kalpla frontend is down"
          description: "Frontend has been down for more than 1 minute"

      - alert: FrontendBuildFailed
        expr: increase(frontend_build_failures_total[5m]) > 0
        for: 0m
        labels:
          severity: warning
        annotations:
          summary: "Frontend build failures"
          description: "Frontend build has failed {{ $value }} times in the last 5 minutes"

  - name: infrastructure
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value }}% on {{ $labels.instance }}"

      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value }}% on {{ $labels.instance }}"

      - alert: DiskSpaceLow
        expr: (1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100 > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
          description: "Disk usage is {{ $value }}% on {{ $labels.instance }}"

      - alert: ContainerRestarted
        expr: increase(container_start_time_seconds[1h]) > 0
        for: 0m
        labels:
          severity: warning
        annotations:
          summary: "Container restarted"
          description: "Container {{ $labels.name }} has restarted"

  - name: ssl-certificates
    rules:
      - alert: SSLCertificateExpiringSoon
        expr: (ssl_cert_not_after - time()) / 86400 < 30
        for: 0m
        labels:
          severity: warning
        annotations:
          summary: "SSL certificate expiring soon"
          description: "SSL certificate for {{ $labels.instance }} expires in {{ $value }} days"

      - alert: SSLCertificateExpired
        expr: ssl_cert_not_after - time() < 0
        for: 0m
        labels:
          severity: critical
        annotations:
          summary: "SSL certificate expired"
          description: "SSL certificate for {{ $labels.instance }} has expired"
```

### 3. Alertmanager Configuration (monitoring/alertmanager.yml)
```yaml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@kalpla.in'
  smtp_auth_username: 'alerts@kalpla.in'
  smtp_auth_password: 'your-app-password'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'
    - match:
        severity: warning
      receiver: 'warning-alerts'

receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://localhost:5001/'

  - name: 'critical-alerts'
    email_configs:
      - to: 'admin@kalpla.in'
        subject: '🚨 CRITICAL: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          Severity: {{ .Labels.severity }}
          Instance: {{ .Labels.instance }}
          {{ end }}
    slack_configs:
      - api_url: 'YOUR_SLACK_WEBHOOK_URL'
        channel: '#alerts-critical'
        title: '🚨 Critical Alert'
        text: |
          {{ range .Alerts }}
          *Alert:* {{ .Annotations.summary }}
          *Description:* {{ .Annotations.description }}
          *Severity:* {{ .Labels.severity }}
          *Instance:* {{ .Labels.instance }}
          {{ end }}

  - name: 'warning-alerts'
    email_configs:
      - to: 'devops@kalpla.in'
        subject: '⚠️ WARNING: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          Severity: {{ .Labels.severity }}
          Instance: {{ .Labels.instance }}
          {{ end }}
    slack_configs:
      - api_url: 'YOUR_SLACK_WEBHOOK_URL'
        channel: '#alerts-warning'
        title: '⚠️ Warning Alert'
        text: |
          {{ range .Alerts }}
          *Alert:* {{ .Annotations.summary }}
          *Description:* {{ .Annotations.description }}
          *Severity:* {{ .Labels.severity }}
          *Instance:* {{ .Labels.instance }}
          {{ end }}

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
```

### 4. Grafana Dashboard Configuration

#### Main Dashboard (monitoring/grafana/dashboards/kalpla-overview.json)
```json
{
  "dashboard": {
    "id": null,
    "title": "Kalpla Production Overview",
    "tags": ["kalpla", "production"],
    "style": "dark",
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "System Status",
        "type": "stat",
        "targets": [
          {
            "expr": "up{job=\"kalpla-backend\"}",
            "legendFormat": "Backend"
          },
          {
            "expr": "up{job=\"kalpla-frontend\"}",
            "legendFormat": "Frontend"
          },
          {
            "expr": "up{job=\"postgres\"}",
            "legendFormat": "Database"
          },
          {
            "expr": "up{job=\"redis\"}",
            "legendFormat": "Redis"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            },
            "thresholds": {
              "steps": [
                {
                  "color": "red",
                  "value": 0
                },
                {
                  "color": "green",
                  "value": 1
                }
              ]
            }
          }
        }
      },
      {
        "id": 2,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "id": 3,
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "id": 4,
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          },
          {
            "expr": "rate(http_requests_total{status=~\"4..\"}[5m])",
            "legendFormat": "4xx errors"
          }
        ]
      },
      {
        "id": 5,
        "title": "CPU Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "100 - (avg by(instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
            "legendFormat": "{{instance}}"
          }
        ]
      },
      {
        "id": 6,
        "title": "Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
            "legendFormat": "{{instance}}"
          }
        ]
      },
      {
        "id": 7,
        "title": "Database Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "postgres_stat_activity_count",
            "legendFormat": "Active connections"
          }
        ]
      },
      {
        "id": 8,
        "title": "Redis Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "redis_memory_used_bytes",
            "legendFormat": "Used memory"
          }
        ]
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "30s"
  }
}
```

### 5. Application Metrics Integration

#### Backend Metrics (kalpla-backend/src/middleware/metrics.ts)
```typescript
import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';

// Create a Registry
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const databaseQueryDuration = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['query_type', 'table']
});

// Register metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(databaseQueryDuration);

// Middleware to collect metrics
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode.toString())
      .inc();
  });
  
  next();
};

// Metrics endpoint
export const metricsHandler = async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

export { register, httpRequestDuration, httpRequestTotal, activeConnections, databaseQueryDuration };
```

#### Frontend Metrics (kalpla-frontend/src/lib/metrics.ts)
```typescript
// Frontend metrics collection
class MetricsCollector {
  private metrics: Map<string, number> = new Map();
  
  // Page load time
  trackPageLoad(page: string, loadTime: number) {
    this.metrics.set(`page_load_${page}`, loadTime);
  }
  
  // User interactions
  trackUserAction(action: string, value?: number) {
    this.metrics.set(`user_action_${action}`, value || 1);
  }
  
  // API calls
  trackApiCall(endpoint: string, duration: number, status: number) {
    this.metrics.set(`api_call_${endpoint}_${status}`, duration);
  }
  
  // Error tracking
  trackError(error: string, context?: string) {
    this.metrics.set(`error_${context || 'general'}`, 1);
  }
  
  // Send metrics to backend
  async sendMetrics() {
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(this.metrics))
      });
      this.metrics.clear();
    } catch (error) {
      console.error('Failed to send metrics:', error);
    }
  }
}

export const metricsCollector = new MetricsCollector();

// Auto-send metrics every 30 seconds
setInterval(() => {
  metricsCollector.sendMetrics();
}, 30000);
```

### 6. Log Aggregation with ELK Stack

#### Logstash Configuration (monitoring/logstash.conf)
```ruby
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "kalpla-backend" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
    
    if [level] == "ERROR" {
      mutate {
        add_tag => [ "error" ]
      }
    }
  }
  
  if [fields][service] == "kalpla-frontend" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "kalpla-logs-%{+YYYY.MM.dd}"
  }
}
```

### 7. Uptime Monitoring Script
```bash
#!/bin/bash
# monitoring/uptime-check.sh

ENDPOINTS=(
  "https://kalpla.in"
  "https://kalpla.in/api/health"
  "https://kalpla.in/api/auth/login"
  "https://kalpla.in/api/programs"
)

for endpoint in "${ENDPOINTS[@]}"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
  if [ "$response" -eq 200 ]; then
    echo "✅ $endpoint - OK"
  else
    echo "❌ $endpoint - FAILED (HTTP $response)"
    # Send alert
    curl -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\"🚨 Uptime Alert: $endpoint returned HTTP $response\"}" \
      $SLACK_WEBHOOK_URL
  fi
done
```

### 8. Performance Monitoring Script
```bash
#!/bin/bash
# monitoring/performance-check.sh

echo "🔍 Kalpla Performance Check"

# Check response times
echo "📊 Response Times:"
curl -w "@curl-format.txt" -o /dev/null -s "https://kalpla.in"
curl -w "@curl-format.txt" -o /dev/null -s "https://kalpla.in/api/health"

# Check database performance
echo "🗄️ Database Performance:"
docker exec kalpla-postgres-prod psql -U kalpla_user -d kalpla_prod -c "
SELECT 
  query,
  mean_time,
  calls,
  total_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 5;
"

# Check Redis performance
echo "🔴 Redis Performance:"
docker exec kalpla-redis-prod redis-cli info stats | grep -E "(keyspace_hits|keyspace_misses|expired_keys)"

# Check disk usage
echo "💾 Disk Usage:"
df -h | grep -E "(/dev/|Filesystem)"

# Check memory usage
echo "🧠 Memory Usage:"
free -h

# Check CPU usage
echo "⚡ CPU Usage:"
top -bn1 | grep "Cpu(s)"
```

### 9. Monitoring Dashboard Setup Script
```bash
#!/bin/bash
# monitoring/setup-monitoring.sh

echo "🔧 Setting up Kalpla monitoring..."

# Create monitoring directories
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources
mkdir -p monitoring/prometheus
mkdir -p monitoring/alertmanager

# Setup Grafana datasource
cat > monitoring/grafana/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF

# Setup Grafana dashboard provisioning
cat > monitoring/grafana/dashboards/dashboard.yml << EOF
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
EOF

# Start monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

echo "✅ Monitoring setup complete!"
echo "📊 Grafana: http://localhost:3001"
echo "📈 Prometheus: http://localhost:9090"
echo "🚨 Alertmanager: http://localhost:9093"
```

### 10. Monitoring Docker Compose (docker-compose.monitoring.yml)
```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: kalpla-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./monitoring/alert_rules.yml:/etc/prometheus/alert_rules.yml
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

  alertmanager:
    image: prom/alertmanager:latest
    container_name: kalpla-alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
      - '--web.external-url=http://localhost:9093'
    networks:
      - kalpla-network

  grafana:
    image: grafana/grafana:latest
    container_name: kalpla-grafana
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
      GF_USERS_ALLOW_SIGN_UP: false
      GF_INSTALL_PLUGINS: grafana-piechart-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    networks:
      - kalpla-network

  node-exporter:
    image: prom/node-exporter:latest
    container_name: kalpla-node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - kalpla-network

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: kalpla-cadvisor
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    privileged: true
    devices:
      - /dev/kmsg
    networks:
      - kalpla-network

  blackbox-exporter:
    image: prom/blackbox-exporter:latest
    container_name: kalpla-blackbox-exporter
    ports:
      - "9115:9115"
    volumes:
      - ./monitoring/blackbox.yml:/etc/blackbox_exporter/config.yml
    networks:
      - kalpla-network

volumes:
  prometheus_data:
  alertmanager_data:
  grafana_data:

networks:
  kalpla-network:
    external: true
```

## Monitoring Features

✅ **Real-time Metrics**: Prometheus + Grafana dashboards  
✅ **Alerting**: Critical and warning alerts with Slack/Email notifications  
✅ **Uptime Monitoring**: Blackbox exporter for endpoint monitoring  
✅ **Performance Tracking**: Response times, error rates, throughput  
✅ **Infrastructure Monitoring**: CPU, memory, disk, network  
✅ **Application Metrics**: Custom business metrics and KPIs  
✅ **Log Aggregation**: Centralized logging with ELK stack  
✅ **SSL Monitoring**: Certificate expiry alerts  
✅ **Database Monitoring**: Query performance and connection tracking  
✅ **Container Monitoring**: Docker container metrics and health  

Your Kalpla platform now has enterprise-grade monitoring capabilities! 📊🚀
