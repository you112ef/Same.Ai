# AI Coding Assistant Monitoring

This directory contains monitoring configurations for the AI Coding Assistant application.

## Overview

The monitoring stack includes:
- **Prometheus**: Metrics collection and storage
- **Grafana**: Metrics visualization and dashboards
- **Custom Metrics**: Application-specific metrics for AI operations

## Files

### `prometheus.yml`
Prometheus configuration file that defines:
- Scrape targets (backend, Redis, system metrics)
- Recording rules for common queries
- Storage configuration
- External labels

### `grafana-dashboard.json`
Grafana dashboard configuration with panels for:
- Request rate and response time
- Error rates
- Memory usage (Node.js and Redis)
- AI API call metrics
- File operation metrics
- Active sessions

## Getting Started

### 1. Start Monitoring Services

```bash
# Start Prometheus and Grafana
docker-compose up -d prometheus grafana

# Or use the Makefile
make monitoring-setup
```

### 2. Access Monitoring Tools

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

### 3. Import Dashboard

1. Open Grafana
2. Go to Dashboards → Import
3. Upload `grafana-dashboard.json`
4. Select Prometheus as data source

## Metrics

### Application Metrics

The application exposes the following metrics:

#### HTTP Metrics
- `http_requests_total`: Total HTTP requests
- `http_request_duration_seconds`: Request duration
- `http_request_size_bytes`: Request size
- `http_response_size_bytes`: Response size

#### AI Metrics
- `ai_api_calls_total`: Total AI API calls
- `ai_api_duration_seconds`: AI API response time
- `ai_tokens_used_total`: Total tokens used
- `ai_errors_total`: AI API errors

#### Session Metrics
- `ai_coding_assistant_active_sessions`: Active user sessions
- `ai_coding_assistant_sessions_total`: Total sessions created
- `ai_coding_assistant_session_duration_seconds`: Session duration

#### File Operation Metrics
- `file_operations_total`: File operations (create, read, update, delete)
- `file_operations_duration_seconds`: File operation duration
- `file_size_bytes`: File sizes

#### Version Control Metrics
- `version_operations_total`: Version operations (create, restore, delete)
- `version_size_bytes`: Version archive sizes
- `version_operations_duration_seconds`: Version operation duration

### System Metrics

- **Node.js**: Memory usage, CPU usage, event loop lag
- **Redis**: Memory usage, connections, commands
- **Docker**: Container resource usage
- **System**: CPU, memory, disk, network

## Alerts

### Default Alerts

The following alerts are configured by default:

#### High Error Rate
- **Condition**: Error rate > 5% for 5 minutes
- **Severity**: Warning
- **Action**: Check application logs and health

#### High Response Time
- **Condition**: Average response time > 2 seconds for 5 minutes
- **Severity**: Warning
- **Action**: Check system resources and optimize queries

#### High Memory Usage
- **Condition**: Memory usage > 80% for 5 minutes
- **Severity**: Critical
- **Action**: Restart application or scale up

#### Redis Memory Usage
- **Condition**: Redis memory usage > 90%
- **Severity**: Critical
- **Action**: Check Redis configuration and data

### Customizing Alerts

To add custom alerts:

1. Edit `prometheus.yml`
2. Add alerting rules under `rule_files`
3. Create alert rule files
4. Restart Prometheus

Example alert rule:
```yaml
groups:
  - name: ai_coding_assistant_alerts
    rules:
      - alert: HighAICallRate
        expr: rate(ai_api_calls_total[5m]) > 100
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High AI API call rate"
          description: "AI API calls are {{ $value }} calls per second"
```

## Dashboards

### Main Dashboard

The main dashboard provides an overview of:
- **Performance**: Request rate, response time, error rate
- **Resources**: Memory usage, CPU usage
- **AI Operations**: API calls, token usage, errors
- **System Health**: Redis status, Docker containers

### Custom Dashboards

You can create additional dashboards for:
- **Development**: Code generation metrics, file operations
- **User Experience**: Session duration, user activity
- **Infrastructure**: System resources, Docker performance
- **Business**: AI usage, project creation rates

## Troubleshooting

### Prometheus Issues

1. **Check Prometheus status**:
   ```bash
   docker-compose ps prometheus
   ```

2. **View Prometheus logs**:
   ```bash
   docker-compose logs prometheus
   ```

3. **Check configuration**:
   ```bash
   docker exec ai-coding-assistant-prometheus-1 promtool check config /etc/prometheus/prometheus.yml
   ```

### Grafana Issues

1. **Check Grafana status**:
   ```bash
   docker-compose ps grafana
   ```

2. **View Grafana logs**:
   ```bash
   docker-compose logs grafana
   ```

3. **Reset admin password**:
   ```bash
   docker exec ai-coding-assistant-grafana-1 grafana-cli admin reset-admin-password newpassword
   ```

### Metrics Not Showing

1. **Check if metrics endpoint is accessible**:
   ```bash
   curl http://localhost:3001/metrics
   ```

2. **Verify Prometheus targets**:
   - Go to http://localhost:9090/targets
   - Check target status

3. **Check scrape intervals**:
   - Ensure targets are being scraped
   - Verify network connectivity

## Scaling

### Horizontal Scaling

To scale the monitoring stack:

1. **Prometheus**:
   - Use Prometheus federation
   - Implement sharding for large deployments

2. **Grafana**:
   - Use Grafana clustering
   - Implement load balancing

3. **Storage**:
   - Use remote storage (Thanos, Cortex)
   - Implement data retention policies

### Performance Optimization

1. **Prometheus**:
   - Adjust scrape intervals
   - Use recording rules for expensive queries
   - Implement metric relabeling

2. **Grafana**:
   - Use query caching
   - Implement dashboard optimization
   - Use data source query optimization

## Security

### Access Control

1. **Prometheus**:
   - Use reverse proxy with authentication
   - Implement network policies
   - Use TLS for communication

2. **Grafana**:
   - Configure user authentication
   - Implement role-based access control
   - Use LDAP/SSO integration

### Data Protection

1. **Metrics Retention**:
   - Configure appropriate retention periods
   - Implement data archiving
   - Use encryption for sensitive data

2. **Network Security**:
   - Use internal networks for service communication
   - Implement firewall rules
   - Use VPN for remote access

## Integration

### CI/CD Integration

1. **Deployment Monitoring**:
   - Track deployment success/failure rates
   - Monitor rollback metrics
   - Alert on deployment issues

2. **Testing Metrics**:
   - Track test execution times
   - Monitor test success rates
   - Alert on test failures

### External Tools

1. **Alerting**:
   - PagerDuty integration
   - Slack notifications
   - Email alerts

2. **Logging**:
   - ELK stack integration
   - Splunk integration
   - Custom log aggregation

## Best Practices

1. **Metric Naming**:
   - Use consistent naming conventions
   - Include service and component labels
   - Avoid high cardinality labels

2. **Dashboard Design**:
   - Keep dashboards focused and simple
   - Use appropriate visualization types
   - Include context and documentation

3. **Alert Management**:
   - Set appropriate thresholds
   - Include actionable alert descriptions
   - Implement alert escalation

4. **Performance**:
   - Monitor monitoring system performance
   - Optimize query performance
   - Implement metric sampling when appropriate