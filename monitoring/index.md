# Monitoring Index

This directory contains all monitoring-related configurations and documentation for the AI Coding Assistant.

## Files

- **[README.md](README.md)** - Comprehensive monitoring documentation
- **[prometheus.yml](prometheus.yml)** - Prometheus configuration
- **[grafana-dashboard.json](grafana-dashboard.json)** - Grafana dashboard configuration

## Quick Start

1. **Start monitoring services**:
   ```bash
   make monitoring-setup
   ```

2. **Access monitoring tools**:
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000 (admin/admin)

3. **Import dashboard**:
   - Upload `grafana-dashboard.json` to Grafana
   - Select Prometheus as data source

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │    Prometheus   │    │     Grafana     │
│   (Port 3001)  │───▶│   (Port 9090)   │───▶│   (Port 3000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Redis      │    │   Alert Rules   │    │   Dashboards    │
│   (Port 6379)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Metrics Flow

1. **Application** exposes metrics at `/metrics` endpoint
2. **Prometheus** scrapes metrics from application and Redis
3. **Grafana** queries Prometheus for visualization
4. **Alerts** are triggered based on metric thresholds

## Key Metrics

- **Performance**: Request rate, response time, error rate
- **Resources**: Memory usage, CPU usage, disk usage
- **AI Operations**: API calls, token usage, response times
- **System Health**: Redis status, Docker containers, network

## Next Steps

- Read the [README.md](README.md) for detailed documentation
- Customize the [prometheus.yml](prometheus.yml) for your environment
- Import the [grafana-dashboard.json](grafana-dashboard.json) to Grafana
- Set up alerts and notifications
- Scale monitoring for production use