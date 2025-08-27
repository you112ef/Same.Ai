# Analytics API

The Analytics API provides comprehensive analytics and reporting capabilities within AI Coding Assistant, including usage statistics, performance metrics, user behavior analysis, and business intelligence.

## 📋 Overview

The Analytics API allows you to:
- Track user activity and engagement
- Monitor system performance and usage
- Generate detailed reports and insights
- Analyze user behavior patterns
- Track feature adoption and usage
- Monitor business metrics and KPIs
- Export analytics data for external analysis
- Create custom dashboards and visualizations

## 🔗 Base Endpoint

```
GET /api/analytics
```

## 📚 Available Endpoints

### Usage Analytics
- **[User Activity](#user-activity)** - Track user engagement and activity
- **[Feature Usage](#feature-usage)** - Monitor feature adoption and usage
- **[Project Analytics](#project-analytics)** - Analyze project creation and usage
- **[File Analytics](#file-analytics)** - Track file operations and storage

### Performance Analytics
- **[System Performance](#system-performance)** - Monitor system metrics and performance
- **[API Performance](#api-performance)** - Track API usage and response times
- **[Error Analytics](#error-analytics)** - Monitor errors and system health
- **[Resource Usage](#resource-usage)** - Track resource consumption

### Business Analytics
- **[User Growth](#user-growth)** - Track user acquisition and retention
- **[Revenue Analytics](#revenue-analytics)** - Monitor subscription and billing metrics
- **[Geographic Analytics](#geographic-analytics)** - Analyze user distribution by location
- **[Industry Analytics](#industry-analytics)** - Track usage by industry and company

### Custom Analytics
- **[Custom Metrics](#custom-metrics)** - Define and track custom business metrics
- **[Event Tracking](#event-tracking)** - Track custom events and user actions
- **[Funnel Analysis](#funnel-analysis)** - Analyze user conversion funnels
- **[Cohort Analysis](#cohort-analysis)** - Track user behavior over time

## 📊 Data Models

### Analytics Event Object
```typescript
interface AnalyticsEvent {
  id: string;                      // Event identifier
  userId?: string;                 // Associated user ID
  sessionId?: string;              // Session identifier
  eventType: string;               // Event type/category
  eventName: string;               // Specific event name
  timestamp: string;               // Event timestamp (ISO 8601)
  properties: Record<string, any>; // Event properties and data
  context: EventContext;           // Event context information
  metadata: EventMetadata;         // Additional event metadata
}

interface EventContext {
  page?: string;                   // Page where event occurred
  referrer?: string;               // Referrer URL
  userAgent?: string;              // User agent string
  ipAddress?: string;              // Client IP address
  deviceInfo: DeviceInfo;          // Device information
  location?: GeoLocation;          // Geographic location
  projectId?: string;              // Associated project
  fileId?: string;                 // Associated file
}

interface EventMetadata {
  source: string;                  // Event source
  version: string;                 // Application version
  environment: string;             // Environment (dev, staging, prod)
  priority: 'low' | 'medium' | 'high';
  tags: string[];                  // Event tags
  correlationId?: string;          // Correlation ID for tracking
}

interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;                      // Operating system
  browser: string;                 // Web browser
  version: string;                 // Browser version
  screenResolution: string;        // Screen resolution
  viewport: string;                // Viewport dimensions
}

interface GeoLocation {
  country: string;                 // Country code
  region?: string;                 // Region/state
  city?: string;                   // City name
  latitude?: number;               // Latitude
  longitude?: number;              // Longitude
  timezone: string;                // Timezone
}
```

### Analytics Metrics Object
```typescript
interface AnalyticsMetrics {
  period: string;                  // Metrics period
  startDate: string;               // Period start date
  endDate: string;                 // Period end date
  metrics: MetricData[];           // Array of metric data points
  summary: MetricsSummary;         // Summary statistics
  trends: MetricsTrends;           // Trend analysis
  breakdowns: MetricsBreakdowns;   // Detailed breakdowns
}

interface MetricData {
  timestamp: string;               // Data point timestamp
  value: number;                   // Metric value
  unit?: string;                   // Metric unit
  metadata?: Record<string, any>;  // Additional metadata
}

interface MetricsSummary {
  total: number;                   // Total value
  average: number;                 // Average value
  minimum: number;                 // Minimum value
  maximum: number;                 // Maximum value
  median: number;                  // Median value
  standardDeviation: number;       // Standard deviation
  percentile95: number;            // 95th percentile
  percentile99: number;            // 99th percentile
}

interface MetricsTrends {
  direction: 'increasing' | 'decreasing' | 'stable';
  change: number;                  // Percentage change
  changeAmount: number;            // Absolute change amount
  velocity: number;                // Rate of change
  acceleration: number;            // Rate of acceleration
  seasonality?: SeasonalityInfo;   // Seasonal patterns
}

interface MetricsBreakdowns {
  byUser: Record<string, number>;  // Breakdown by user
  byProject: Record<string, number>; // Breakdown by project
  byFeature: Record<string, number>; // Breakdown by feature
  byTime: TimeBreakdown;           // Time-based breakdown
  byLocation: Record<string, number>; // Geographic breakdown
  byDevice: Record<string, number>;   // Device breakdown
}

interface TimeBreakdown {
  hourly: Record<string, number>;  // Hourly breakdown
  daily: Record<string, number>;   // Daily breakdown
  weekly: Record<string, number>;  // Weekly breakdown
  monthly: Record<string, number>; // Monthly breakdown
  seasonal: Record<string, number>; // Seasonal breakdown
}

interface SeasonalityInfo {
  pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
  strength: number;                // Pattern strength (0-1)
  peaks: string[];                 // Peak times
  valleys: string[];               // Valley times
}
```

### Analytics Report Object
```typescript
interface AnalyticsReport {
  id: string;                      // Report identifier
  name: string;                    // Report name
  description?: string;            // Report description
  type: ReportType;                // Report type
  period: string;                  // Report period
  generatedAt: string;             // Generation timestamp
  generatedBy: string;             // User who generated report
  data: ReportData;                // Report data
  visualizations: Visualization[];  // Data visualizations
  insights: Insight[];             // Key insights
  recommendations: Recommendation[]; // Actionable recommendations
  metadata: ReportMetadata;        // Report metadata
}

enum ReportType {
  'user-activity' = 'user-activity',
  'system-performance' = 'system-performance',
  'feature-usage' = 'feature-usage',
  'business-metrics' = 'business-metrics',
  'custom' = 'custom'
}

interface ReportData {
  summary: ReportSummary;          // Executive summary
  metrics: MetricSection[];        // Detailed metrics
  comparisons: ComparisonSection[]; // Comparative analysis
  trends: TrendSection[];          // Trend analysis
  breakdowns: BreakdownSection[];  // Detailed breakdowns
}

interface ReportSummary {
  overview: string;                // High-level overview
  keyFindings: string[];           // Key findings
  highlights: string[];            // Notable highlights
  concerns: string[];              // Areas of concern
  opportunities: string[];         // Growth opportunities
}

interface Visualization {
  id: string;                      // Visualization identifier
  type: 'chart' | 'table' | 'metric' | 'heatmap';
  title: string;                   // Visualization title
  description?: string;            // Description
  data: any;                       // Visualization data
  config: VisualizationConfig;     // Display configuration
  interactive: boolean;            // Interactive features
}

interface Insight {
  id: string;                      // Insight identifier
  title: string;                   // Insight title
  description: string;             // Detailed description
  type: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  confidence: number;              // Confidence level (0-1)
  data: any;                       // Supporting data
  actions: string[];               // Recommended actions
}

interface Recommendation {
  id: string;                      // Recommendation identifier
  title: string;                   // Recommendation title
  description: string;             // Detailed description
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'high' | 'medium' | 'low';
  roi: number;                     // Expected ROI
  timeline: string;                // Implementation timeline
  steps: string[];                 // Implementation steps
}
```

## 🚀 API Endpoints

### User Activity

Track user engagement and activity patterns.

**Endpoint**: `GET /api/analytics/user-activity`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Query Parameters**:
- `period` (optional): Time period (default: '30d')
- `userId` (optional): Specific user ID
- `eventType` (optional): Filter by event type
- `groupBy` (optional): Grouping (default: 'day')
- `includeDetails` (optional): Include detailed data (default: false)

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/analytics/user-activity?period=90d&groupBy=week&includeDetails=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "period": "90d",
    "startDate": "2024-10-17T00:00:00Z",
    "endDate": "2024-01-15T23:59:59Z",
    "groupBy": "week",
    "metrics": [
      {
        "timestamp": "2024-01-08T00:00:00Z",
        "activeUsers": 45,
        "totalSessions": 156,
        "totalEvents": 2340,
        "averageSessionDuration": 45.2,
        "bounceRate": 0.15,
        "retentionRate": 0.78
      }
    ],
    "summary": {
      "total": {
        "activeUsers": 67,
        "totalSessions": 234,
        "totalEvents": 4567,
        "averageSessionDuration": 42.8,
        "bounceRate": 0.18,
        "retentionRate": 0.75
      },
      "average": {
        "activeUsers": 45.3,
        "totalSessions": 156.7,
        "totalEvents": 3044.7,
        "averageSessionDuration": 42.8,
        "bounceRate": 0.18,
        "retentionRate": 0.75
      }
    },
    "trends": {
      "activeUsers": {
        "direction": "increasing",
        "change": 12.5,
        "velocity": 2.1
      },
      "sessionDuration": {
        "direction": "stable",
        "change": 1.2,
        "velocity": 0.1
      }
    },
    "breakdowns": {
      "byEventType": {
        "page_view": 1234,
        "button_click": 567,
        "form_submit": 89,
        "file_upload": 234,
        "ai_interaction": 567
      },
      "byUserRole": {
        "user": 45,
        "premium": 18,
        "admin": 4
      },
      "byTime": {
        "hourly": {
          "9": 45,
          "10": 67,
          "11": 89,
          "14": 78,
          "15": 56
        },
        "daily": {
          "Monday": 234,
          "Tuesday": 267,
          "Wednesday": 289,
          "Thursday": 245,
          "Friday": 198
        }
      }
    }
  },
  "message": "User activity analytics retrieved successfully"
}
```

### Feature Usage

Monitor feature adoption and usage patterns.

**Endpoint**: `GET /api/analytics/feature-usage`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Query Parameters**:
- `period` (optional): Time period (default: '30d')
- `feature` (optional): Specific feature name
- `groupBy` (optional): Grouping (default: 'day')
- `includeBreakdown` (optional): Include detailed breakdown (default: true)

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/analytics/feature-usage?period=60d&groupBy=week&includeBreakdown=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "period": "60d",
    "startDate": "2024-11-16T00:00:00Z",
    "endDate": "2024-01-15T23:59:59Z",
    "groupBy": "week",
    "features": [
      {
        "name": "ai-chat",
        "usage": {
          "totalUsers": 45,
          "totalInteractions": 1234,
          "averageInteractionsPerUser": 27.4,
          "adoptionRate": 0.67,
          "retentionRate": 0.82
        },
        "trends": {
          "direction": "increasing",
          "change": 23.5,
          "velocity": 4.2
        },
        "breakdown": {
          "byUserType": {
            "user": 23,
            "premium": 18,
            "admin": 4
          },
          "byTime": {
            "hourly": {
              "9": 45,
              "10": 67,
              "11": 89
            }
          }
        }
      },
      {
        "name": "code-editor",
        "usage": {
          "totalUsers": 67,
          "totalSessions": 456,
          "averageSessionDuration": 34.2,
          "adoptionRate": 1.0,
          "retentionRate": 0.95
        },
        "trends": {
          "direction": "stable",
          "change": 2.1,
          "velocity": 0.3
        }
      }
    ],
    "summary": {
      "totalFeatures": 8,
      "activeFeatures": 7,
      "averageAdoptionRate": 0.78,
      "averageRetentionRate": 0.84,
      "mostPopularFeature": "code-editor",
      "fastestGrowingFeature": "ai-chat"
    }
  },
  "message": "Feature usage analytics retrieved successfully"
}
```

### System Performance

Monitor system metrics and performance.

**Endpoint**: `GET /api/analytics/system-performance`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Query Parameters**:
- `period` (optional): Time period (default: '24h')
- `metric` (optional): Specific metric type
- `groupBy` (optional): Grouping (default: 'hour')
- `includeAlerts` (optional): Include performance alerts (default: true)

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/analytics/system-performance?period=7d&groupBy=day&includeAlerts=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "period": "7d",
    "startDate": "2024-01-09T00:00:00Z",
    "endDate": "2024-01-15T23:59:59Z",
    "groupBy": "day",
    "metrics": {
      "cpu": {
        "usage": [
          {
            "timestamp": "2024-01-09T00:00:00Z",
            "average": 45.2,
            "peak": 78.9,
            "minimum": 12.3
          }
        ],
        "summary": {
          "average": 42.1,
          "peak": 89.2,
          "minimum": 8.7,
          "trend": "stable"
        }
      },
      "memory": {
        "usage": [
          {
            "timestamp": "2024-01-09T00:00:00Z",
            "average": 67.8,
            "peak": 89.5,
            "minimum": 45.2
          }
        ],
        "summary": {
          "average": 69.3,
          "peak": 92.1,
          "minimum": 42.8,
          "trend": "increasing"
        }
      },
      "responseTime": {
        "api": [
          {
            "timestamp": "2024-01-09T00:00:00Z",
            "p50": 125,
            "p90": 245,
            "p95": 389,
            "p99": 567
          }
        ],
        "summary": {
          "p50": 118,
          "p90": 234,
          "p95": 378,
          "p99": 545,
          "trend": "improving"
        }
      }
    },
    "alerts": [
      {
        "id": "alert-123",
        "type": "warning",
        "metric": "memory",
        "message": "Memory usage above 80% for 2 hours",
        "timestamp": "2024-01-15T18:00:00Z",
        "severity": "medium"
      }
    ],
    "health": {
      "overall": "healthy",
      "score": 87,
      "components": {
        "cpu": "healthy",
        "memory": "warning",
        "disk": "healthy",
        "network": "healthy"
      }
    }
  },
  "message": "System performance analytics retrieved successfully"
}
```

### Business Metrics

Monitor business KPIs and metrics.

**Endpoint**: `GET /api/analytics/business-metrics`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required, admin role)

**Query Parameters**:
- `period` (optional): Time period (default: '30d')
- `metric` (optional): Specific business metric
- `groupBy` (optional): Grouping (default: 'day')
- `includeProjections` (optional): Include future projections (default: false)

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/analytics/business-metrics?period=90d&groupBy=week&includeProjections=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "period": "90d",
    "startDate": "2024-10-17T00:00:00Z",
    "endDate": "2024-01-15T23:59:59Z",
    "groupBy": "week",
    "metrics": {
      "userGrowth": {
        "newUsers": [
          {
            "timestamp": "2024-01-08T00:00:00Z",
            "value": 23,
            "growth": 15.2
          }
        ],
        "summary": {
          "total": 156,
          "average": 17.3,
          "growth": 12.5,
          "trend": "increasing"
        }
      },
      "revenue": {
        "subscriptions": [
          {
            "timestamp": "2024-01-08T00:00:00Z",
            "value": 2340.50,
            "growth": 8.7
          }
        ],
        "summary": {
          "total": 15678.90,
          "average": 1742.10,
          "growth": 18.3,
          "trend": "increasing"
        }
      },
      "retention": {
        "monthly": [
          {
            "timestamp": "2024-01-08T00:00:00Z",
            "value": 0.78,
            "change": 2.1
          }
        ],
        "summary": {
          "average": 0.76,
          "trend": "improving",
          "bestMonth": "December 2024"
        }
      },
      "conversion": {
        "freeToPremium": [
          {
            "timestamp": "2024-01-08T00:00:00Z",
            "value": 0.12,
            "change": 1.5
          }
        ],
        "summary": {
          "average": 0.11,
          "trend": "improving",
          "funnel": {
            "visitors": 1000,
            "signups": 100,
            "activeUsers": 67,
            "premiumUsers": 8
          }
        }
      }
    },
    "projections": {
      "nextMonth": {
        "newUsers": 89,
        "revenue": 18900.00,
        "retention": 0.79
      },
      "nextQuarter": {
        "newUsers": 267,
        "revenue": 56700.00,
        "retention": 0.81
      }
    },
    "insights": [
      {
        "title": "Strong User Growth",
        "description": "User growth increased by 12.5% this quarter",
        "type": "positive",
        "impact": "high"
      },
      {
        "title": "Premium Conversion Opportunity",
        "description": "Conversion rate below industry average",
        "type": "negative",
        "impact": "medium"
      }
    ]
  },
  "message": "Business metrics retrieved successfully"
}
```

### Custom Metrics

Define and track custom business metrics.

**Endpoint**: `POST /api/analytics/custom-metrics`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Request Body**:
```json
{
  "name": "project_completion_rate",
  "description": "Percentage of projects completed on time",
  "type": "percentage",
  "calculation": "completed_projects / total_projects * 100",
  "target": 85,
  "alertThreshold": 70,
  "tags": ["projects", "performance", "timeline"]
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/analytics/custom-metrics" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "project_completion_rate",
    "description": "Percentage of projects completed on time",
    "type": "percentage",
    "calculation": "completed_projects / total_projects * 100",
    "target": 85,
    "alertThreshold": 70,
    "tags": ["projects", "performance", "timeline"]
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "metric": {
      "id": "metric-123",
      "name": "project_completion_rate",
      "description": "Percentage of projects completed on time",
      "type": "percentage",
      "calculation": "completed_projects / total_projects * 100",
      "target": 85,
      "alertThreshold": 70,
      "tags": ["projects", "performance", "timeline"],
      "createdAt": "2024-01-15T23:00:00Z",
      "createdBy": "user-123"
    },
    "currentValue": 78.5,
    "status": "below-target",
    "trend": "improving"
  },
  "message": "Custom metric created successfully"
}
```

### Event Tracking

Track custom events and user actions.

**Endpoint**: `POST /api/analytics/events`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Request Body**:
```json
{
  "eventType": "user_action",
  "eventName": "feature_discovery",
  "properties": {
    "feature": "ai-code-review",
    "source": "dashboard",
    "userType": "premium"
  },
  "context": {
    "page": "/dashboard",
    "projectId": "project-123"
  }
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/analytics/events" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "user_action",
    "eventName": "feature_discovery",
    "properties": {
      "feature": "ai-code-review",
      "source": "dashboard",
      "userType": "premium"
    },
    "context": {
      "page": "/dashboard",
      "projectId": "project-123"
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "eventId": "event-abc123",
    "timestamp": "2024-01-15T23:45:00Z",
    "tracked": true,
    "processed": true
  },
  "message": "Event tracked successfully"
}
```

### Generate Report

Generate comprehensive analytics report.

**Endpoint**: `POST /api/analytics/reports`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Request Body**:
```json
{
  "name": "Q4 2024 Performance Report",
  "description": "Quarterly performance and business metrics report",
  "type": "business-metrics",
  "period": "90d",
  "metrics": ["user-growth", "revenue", "retention", "conversion"],
  "includeVisualizations": true,
  "includeInsights": true,
  "includeRecommendations": true,
  "format": "pdf"
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/analytics/reports" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q4 2024 Performance Report",
    "description": "Quarterly performance and business metrics report",
    "type": "business-metrics",
    "period": "90d",
    "metrics": ["user-growth", "revenue", "retention", "conversion"],
    "includeVisualizations": true,
    "includeInsights": true,
    "includeRecommendations": true,
    "format": "pdf"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "report": {
      "id": "report-123",
      "name": "Q4 2024 Performance Report",
      "description": "Quarterly performance and business metrics report",
      "type": "business-metrics",
      "period": "90d",
      "status": "generating",
      "progress": 0,
      "estimatedCompletion": "2024-01-16T00:15:00Z",
      "createdAt": "2024-01-15T23:50:00Z"
    },
    "message": "Report generation started. You will be notified when complete."
  },
  "message": "Report generation initiated successfully"
}
```

## 🛡️ Error Handling

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;                 // Error code
    message: string;              // Human-readable error message
    details?: any;                // Additional error details
    timestamp: string;            // Error timestamp
    requestId?: string;           // Request identifier for tracking
  };
}
```

### Common Error Codes
- `ANALYTICS_UNAVAILABLE`: Analytics service unavailable
- `INSUFFICIENT_PERMISSIONS`: Insufficient permissions
- `INVALID_PERIOD`: Invalid time period
- `METRIC_NOT_FOUND`: Requested metric not found
- `REPORT_GENERATION_FAILED`: Report generation failed
- `DATA_EXPORT_ERROR`: Data export error
- `INVALID_EVENT_DATA`: Invalid event data
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded

## 🔐 Authentication & Authorization

### Required Headers
```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Permission Requirements
- **Basic Analytics**: User can view their own analytics
- **System Analytics**: Admin role required
- **Business Metrics**: Admin role required
- **Custom Metrics**: User can create their own metrics
- **Report Generation**: Admin role required

## 📈 Rate Limiting

### Rate Limits
- **Event Tracking**: 100 events per minute
- **Analytics Queries**: 50 requests per minute
- **Report Generation**: 5 reports per hour
- **Data Export**: 10 exports per hour

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
import { AICodingAssistantAPI } from '@ai-coding-assistant/sdk';

const api = new AICodingAssistantAPI({
  baseURL: 'http://localhost:3001',
  token: 'your-jwt-token'
});

// Track custom event
await api.analytics.trackEvent({
  eventType: 'user_action',
  eventName: 'feature_used',
  properties: {
    feature: 'ai-chat',
    duration: 300
  }
});

// Get user activity analytics
const activity = await api.analytics.getUserActivity({
  period: '30d',
  groupBy: 'day'
});

// Generate custom report
const report = await api.analytics.generateReport({
  name: 'Monthly Performance Report',
  type: 'business-metrics',
  period: '30d'
});
```

### Python
```python
from ai_coding_assistant import AICodingAssistantAPI

api = AICodingAssistantAPI(
    base_url="http://localhost:3001",
    token="your-jwt-token"
)

# Track custom event
api.analytics.track_event(
    event_type="user_action",
    event_name="feature_used",
    properties={
        "feature": "ai-chat",
        "duration": 300
    }
)

# Get user activity analytics
activity = api.analytics.get_user_activity(
    period="30d",
    group_by="day"
)

# Generate custom report
report = api.analytics.generate_report(
    name="Monthly Performance Report",
    type="business-metrics",
    period="30d"
)
```

## 🧪 Testing

### Test Event Tracking
```bash
# Test tracking custom event
curl -X POST "http://localhost:3001/api/analytics/events" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "test",
    "eventName": "api_test",
    "properties": {
      "test": true,
      "timestamp": "2024-01-15T23:59:59Z"
    }
  }'
```

### Test Analytics Queries
```bash
# Test user activity analytics
curl -X GET "http://localhost:3001/api/analytics/user-activity?period=7d" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test feature usage analytics
curl -X GET "http://localhost:3001/api/analytics/feature-usage?period=30d" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Configuration

### Environment Variables
```bash
# Analytics configuration
ANALYTICS_ENABLED=true
ANALYTICS_RETENTION_DAYS=365
ANALYTICS_BATCH_SIZE=1000
ANALYTICS_FLUSH_INTERVAL=30000
ANALYTICS_STORAGE_PATH=/workspace/analytics
ANALYTICS_BACKUP_ENABLED=true
```

### Server Configuration
```javascript
// Analytics configuration
const analyticsConfig = {
  enabled: process.env.ANALYTICS_ENABLED === 'true',
  retentionDays: parseInt(process.env.ANALYTICS_RETENTION_DAYS) || 365,
  batchSize: parseInt(process.env.ANALYTICS_BATCH_SIZE) || 1000,
  flushInterval: parseInt(process.env.ANALYTICS_FLUSH_INTERVAL) || 30000,
  storagePath: process.env.ANALYTICS_STORAGE_PATH || '/workspace/analytics',
  backupEnabled: process.env.ANALYTICS_BACKUP_ENABLED === 'true',
  maxEventsPerRequest: 100,
  maxPropertiesPerEvent: 50,
  maxEventNameLength: 100
};
```

---

## 🎉 Ready to Use Analytics API!

You now have comprehensive information about the Analytics API. Start tracking user behavior, monitoring system performance, and generating insights with our powerful analytics endpoints.

**Happy analyzing! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This API documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*