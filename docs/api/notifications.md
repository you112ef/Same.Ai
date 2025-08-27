# Notifications API

The Notifications API provides comprehensive notification management capabilities within AI Coding Assistant, including real-time notifications, email notifications, push notifications, and notification preferences.

## 📋 Overview

The Notifications API allows you to:
- Send and manage real-time notifications
- Handle email notifications and templates
- Manage push notifications and mobile alerts
- Configure notification preferences and settings
- Handle notification delivery and tracking
- Manage notification categories and channels
- Implement notification scheduling and queuing
- Handle notification analytics and reporting

## 🔗 Base Endpoint

```
GET/POST/PUT/DELETE /api/notifications
```

## 📚 Available Endpoints

### Notification Management
- **[Send Notification](#send-notification)** - Send a new notification
- **[Get Notifications](#get-notifications)** - Retrieve user notifications
- **[Mark as Read](#mark-as-read)** - Mark notifications as read
- **[Delete Notification](#delete-notification)** - Remove notifications
- **[Clear All](#clear-all)** - Clear all notifications

### Notification Types
- **[Real-time Notifications](#real-time-notifications)** - WebSocket-based notifications
- **[Email Notifications](#email-notifications)** - Email-based notifications
- **[Push Notifications](#push-notifications)** - Mobile push notifications
- **[SMS Notifications](#sms-notifications)** - Text message notifications

### Advanced Features
- **[Notification Templates](#notification-templates)** - Manage notification templates
- **[Notification Scheduling](#notification-scheduling)** - Schedule future notifications
- **[Notification Preferences](#notification-preferences)** - Manage user preferences
- **[Notification Analytics](#notification-analytics)** - Track notification metrics

## 📊 Data Models

### Notification Object
```typescript
interface Notification {
  id: string;                      // Unique notification identifier
  userId: string;                  // Target user ID
  type: NotificationType;          // Notification type
  category: NotificationCategory;  // Notification category
  priority: NotificationPriority;  // Notification priority
  title: string;                   // Notification title
  message: string;                 // Notification message
  content?: string;                // Rich content (HTML/Markdown)
  data?: Record<string, any>;      // Additional data
  metadata: NotificationMetadata;  // Notification metadata
  status: NotificationStatus;      // Current status
  readAt?: string;                 // Read timestamp
  deliveredAt?: string;            // Delivery timestamp
  createdAt: string;               // Creation timestamp
  updatedAt: string;               // Last update timestamp
  expiresAt?: string;              // Expiration timestamp
  scheduledFor?: string;           // Scheduled delivery time
  retryCount: number;              // Retry attempts
  maxRetries: number;              // Maximum retry attempts
  channels: NotificationChannel[]; // Delivery channels
  actions: NotificationAction[];   // Available actions
  tracking: NotificationTracking;  // Delivery tracking
}

enum NotificationType {
  'info' = 'info',
  'success' = 'success',
  'warning' = 'warning',
  'error' = 'error',
  'urgent' = 'urgent'
}

enum NotificationCategory {
  'system' = 'system',
  'project' = 'project',
  'collaboration' = 'collaboration',
  'security' = 'security',
  'updates' = 'updates',
  'reminders' = 'reminders',
  'achievements' = 'achievements',
  'marketing' = 'marketing'
}

enum NotificationPriority {
  'low' = 'low',
  'normal' = 'normal',
  'high' = 'high',
  'urgent' = 'urgent'
}

enum NotificationStatus {
  'pending' = 'pending',
  'scheduled' = 'scheduled',
  'sending' = 'sending',
  'delivered' = 'delivered',
  'read' = 'read',
  'failed' = 'failed',
  'expired' = 'expired',
  'cancelled' = 'cancelled'
}

interface NotificationMetadata {
  source: string;                  // Notification source
  sourceId?: string;               // Source identifier
  template?: string;               // Template used
  locale: string;                  // Language/locale
  version: string;                 // Template version
  campaign?: string;               // Marketing campaign
  tags: string[];                  // Notification tags
  custom: Record<string, any>;     // Custom metadata
}

interface NotificationChannel {
  type: ChannelType;               // Channel type
  enabled: boolean;                // Channel enabled
  config: ChannelConfig;           // Channel configuration
  status: ChannelStatus;           // Channel status
  lastAttempt?: string;            // Last delivery attempt
  nextAttempt?: string;            // Next retry attempt
  errorCount: number;              // Error count
  lastError?: string;              // Last error message
}

enum ChannelType {
  'in_app' = 'in_app',
  'email' = 'email',
  'push' = 'push',
  'sms' = 'sms',
  'webhook' = 'webhook',
  'slack' = 'slack',
  'discord' = 'discord'
}

interface ChannelConfig {
  recipient?: string;               // Recipient (email, phone, etc.)
  template?: string;                // Channel-specific template
  subject?: string;                 // Email subject
  from?: string;                    // Sender information
  replyTo?: string;                 // Reply-to address
  priority?: string;                // Email priority
  attachments?: Attachment[];       // File attachments
  webhook?: WebhookConfig;          // Webhook configuration
  slack?: SlackConfig;             // Slack configuration
  discord?: DiscordConfig;          // Discord configuration
}

interface Attachment {
  name: string;                     // File name
  type: string;                     // MIME type
  size: number;                     // File size
  url?: string;                     // File URL
  content?: string;                 // File content (base64)
  inline: boolean;                  // Inline attachment
}

interface WebhookConfig {
  url: string;                      // Webhook URL
  method: string;                   // HTTP method
  headers: Record<string, string>;  // Custom headers
  timeout: number;                  // Request timeout
  retryOnFailure: boolean;          // Retry on failure
}

interface SlackConfig {
  channel: string;                  // Slack channel
  username?: string;                // Bot username
  icon?: string;                    // Bot icon
  threadTs?: string;                // Thread timestamp
}

interface DiscordConfig {
  channel: string;                  // Discord channel
  username?: string;                // Bot username
  avatar?: string;                  // Bot avatar
  embed?: boolean;                  // Use rich embeds
}

enum ChannelStatus {
  'pending' = 'pending',
  'sending' = 'sending',
  'delivered' = 'delivered',
  'failed' = 'failed',
  'retrying' = 'retrying',
  'cancelled' = 'cancelled'
}

interface NotificationAction {
  id: string;                       // Action identifier
  label: string;                    // Action label
  type: ActionType;                 // Action type
  url?: string;                     // Action URL
  data?: Record<string, any>;       // Action data
  primary: boolean;                 // Primary action
  destructive: boolean;             // Destructive action
  requiresConfirmation: boolean;    // Require confirmation
}

enum ActionType {
  'link' = 'link',
  'button' = 'button',
  'dismiss' = 'dismiss',
  'snooze' = 'snooze',
  'custom' = 'custom'
}

interface NotificationTracking {
  sentAt?: string;                  // Sent timestamp
  deliveredAt?: string;             // Delivered timestamp
  openedAt?: string;                // Opened timestamp
  clickedAt?: string;               // Clicked timestamp
  actionTaken?: string;             // Action taken timestamp
  deliveryAttempts: DeliveryAttempt[]; // Delivery attempts
  userAgent?: string;               // User agent
  ipAddress?: string;               // IP address
  location?: string;                // Geographic location
  deviceInfo?: DeviceInfo;          // Device information
}

interface DeliveryAttempt {
  timestamp: string;                // Attempt timestamp
  channel: ChannelType;             // Channel used
  status: 'success' | 'failed';     // Attempt status
  error?: string;                   // Error message
  responseCode?: number;            // HTTP response code
  responseTime?: number;            // Response time (ms)
}
```

### Notification Template Object
```typescript
interface NotificationTemplate {
  id: string;                       // Template identifier
  name: string;                     // Template name
  description?: string;             // Template description
  type: NotificationType;           // Notification type
  category: NotificationCategory;   // Notification category
  channels: ChannelType[];          // Supported channels
  locale: string;                   // Template locale
  version: string;                  // Template version
  active: boolean;                  // Template active
  createdAt: string;                // Creation timestamp
  updatedAt: string;                // Last update timestamp
  content: TemplateContent;         // Template content
  variables: TemplateVariable[];     // Template variables
  conditions: TemplateCondition[];   // Template conditions
  metadata: TemplateMetadata;       // Template metadata
}

interface TemplateContent {
  title: string;                    // Title template
  message: string;                  // Message template
  content?: string;                 // Rich content template
  subject?: string;                 // Email subject template
  preview?: string;                 // Preview text
  fallback?: string;                // Fallback text
}

interface TemplateVariable {
  name: string;                     // Variable name
  description: string;              // Variable description
  type: 'string' | 'number' | 'boolean' | 'date' | 'object';
  required: boolean;                // Variable required
  defaultValue?: any;               // Default value
  validation?: string;              // Validation regex
  example?: string;                 // Example value
}

interface TemplateCondition {
  field: string;                    // Condition field
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;                       // Condition value
  logicalOperator?: 'and' | 'or';   // Logical operator
}

interface TemplateMetadata {
  author: string;                   // Template author
  tags: string[];                   // Template tags
  category: string;                 // Template category
  priority: string;                 // Template priority
  estimatedDeliveryTime: number;    // Estimated delivery time (ms)
  maxRetries: number;               // Maximum retry attempts
  retryDelay: number;               // Retry delay (ms)
  expirationTime: number;           // Expiration time (ms)
}
```

### Notification Request Objects
```typescript
interface SendNotificationRequest {
  userId: string;                   // Target user ID
  type: NotificationType;           // Notification type
  category: NotificationCategory;   // Notification category
  priority?: NotificationPriority;  // Notification priority
  title: string;                    // Notification title
  message: string;                  // Notification message
  content?: string;                 // Rich content
  data?: Record<string, any>;       // Additional data
  channels?: ChannelType[];         // Delivery channels
  scheduledFor?: string;            // Scheduled delivery time
  expiresAt?: string;               // Expiration time
  template?: string;                // Template to use
  templateData?: Record<string, any>; // Template variables
  actions?: NotificationAction[];   // Available actions
  metadata?: Partial<NotificationMetadata>; // Custom metadata
  options?: {
    immediate?: boolean;             // Send immediately
    batch?: boolean;                 // Batch with other notifications
    retryOnFailure?: boolean;        // Retry on failure
    maxRetries?: number;             // Maximum retry attempts
    retryDelay?: number;             // Retry delay (ms)
  };
}

interface NotificationQueryRequest {
  userId?: string;                  // Filter by user ID
  type?: NotificationType;          // Filter by type
  category?: NotificationCategory;  // Filter by category
  status?: NotificationStatus;      // Filter by status
  priority?: NotificationPriority;  // Filter by priority
  read?: boolean;                   // Filter by read status
  dateRange?: {                     // Filter by date range
    from?: string;
    to?: string;
  };
  search?: string;                  // Search in title/message
  tags?: string[];                  // Filter by tags
  channels?: ChannelType[];         // Filter by channels
  options?: {
    includeExpired?: boolean;        // Include expired notifications
    includeDeleted?: boolean;        // Include deleted notifications
    sortBy?: string;                 // Sort field
    sortOrder?: 'asc' | 'desc';      // Sort order
    limit?: number;                  // Maximum results
    offset?: number;                 // Results offset
  };
}

interface NotificationUpdateRequest {
  status?: NotificationStatus;      // Update status
  readAt?: string;                  // Mark as read
  data?: Record<string, any>;       // Update data
  metadata?: Partial<NotificationMetadata>; // Update metadata
  actions?: NotificationAction[];   // Update actions
  channels?: NotificationChannel[]; // Update channels
  expiresAt?: string;               // Update expiration
  scheduledFor?: string;            // Update schedule
}
```

### Notification Preferences Object
```typescript
interface NotificationPreferences {
  id: string;                       // Preferences identifier
  userId: string;                   // User identifier
  global: GlobalPreferences;        // Global preferences
  categories: CategoryPreferences[]; // Category preferences
  channels: ChannelPreferences[];   // Channel preferences
  schedules: SchedulePreferences[]; // Schedule preferences
  quietHours: QuietHours;           // Quiet hours
  updatedAt: string;                // Last update timestamp
}

interface GlobalPreferences {
  enabled: boolean;                 // Notifications enabled
  defaultChannels: ChannelType[];   // Default channels
  defaultPriority: NotificationPriority; // Default priority
  maxNotifications: number;         // Maximum notifications
  retentionDays: number;            // Retention period
  autoDelete: boolean;              // Auto-delete expired
  batchNotifications: boolean;      // Batch notifications
  digestFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

interface CategoryPreferences {
  category: NotificationCategory;   // Category
  enabled: boolean;                 // Category enabled
  channels: ChannelType[];          // Allowed channels
  priority: NotificationPriority;   // Category priority
  quietHours: boolean;              // Respect quiet hours
  batch: boolean;                   // Batch with others
  maxPerHour: number;               // Maximum per hour
  maxPerDay: number;                // Maximum per day
}

interface ChannelPreferences {
  channel: ChannelType;             // Channel type
  enabled: boolean;                 // Channel enabled
  priority: NotificationPriority;   // Channel priority
  quietHours: boolean;              // Respect quiet hours
  batch: boolean;                   // Batch notifications
  maxPerHour: number;               // Maximum per hour
  maxPerDay: number;                // Maximum per day
  config: ChannelConfig;            // Channel configuration
}

interface SchedulePreferences {
  dayOfWeek: number;                // Day of week (0-6)
  startTime: string;                // Start time (HH:MM)
  endTime: string;                  // End time (HH:MM)
  timezone: string;                 // Timezone
  enabled: boolean;                 // Schedule enabled
  categories: NotificationCategory[]; // Applicable categories
  channels: ChannelType[];          // Applicable channels
}

interface QuietHours {
  enabled: boolean;                 // Quiet hours enabled
  startTime: string;                // Start time (HH:MM)
  endTime: string;                  // End time (HH:MM)
  timezone: string;                 // Timezone
  days: number[];                   // Days of week (0-6)
  categories: NotificationCategory[]; // Affected categories
  channels: ChannelType[];          // Affected channels
  emergency: boolean;               // Allow emergency notifications
}
```

## 🚀 API Endpoints

### Send Notification

Send a new notification to a user.

**Endpoint**: `POST /api/notifications`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)
- `Content-Type: application/json`

**Request Body**: `SendNotificationRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/notifications" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "type": "info",
    "category": "project",
    "priority": "normal",
    "title": "Project Update",
    "message": "Your project has been updated with new features",
    "content": "<p>Your project <strong>AI Assistant</strong> has been updated with new features including:</p><ul><li>Enhanced code generation</li><li>Improved error handling</li><li>New UI components</li></ul>",
    "data": {
      "projectId": "project-456",
      "projectName": "AI Assistant",
      "updateType": "feature"
    },
    "channels": ["in_app", "email"],
    "actions": [
      {
        "id": "view-project",
        "label": "View Project",
        "type": "link",
        "url": "/projects/project-456",
        "primary": true
      },
      {
        "id": "dismiss",
        "label": "Dismiss",
        "type": "dismiss",
        "primary": false
      }
    ],
    "metadata": {
      "source": "project-system",
      "sourceId": "update-789",
      "tags": ["project", "update", "feature"]
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "notification": {
      "id": "notif-123",
      "userId": "user-123",
      "type": "info",
      "category": "project",
      "priority": "normal",
      "title": "Project Update",
      "message": "Your project has been updated with new features",
      "content": "<p>Your project <strong>AI Assistant</strong> has been updated with new features including:</p><ul><li>Enhanced code generation</li><li>Improved error handling</li><li>New UI components</li></ul>",
      "status": "pending",
      "createdAt": "2024-01-15T23:00:00Z",
      "updatedAt": "2024-01-15T23:00:00Z",
      "channels": [
        {
          "type": "in_app",
          "enabled": true,
          "status": "pending"
        },
        {
          "type": "email",
          "enabled": true,
          "status": "pending"
        }
      ],
      "actions": [
        {
          "id": "view-project",
          "label": "View Project",
          "type": "link",
          "url": "/projects/project-456",
          "primary": true
        }
      ]
    },
    "deliveryStatus": {
      "in_app": "queued",
      "email": "scheduled"
    },
    "estimatedDelivery": {
      "in_app": "2024-01-15T23:00:05Z",
      "email": "2024-01-15T23:01:00Z"
    }
  },
  "message": "Notification sent successfully"
}
```

### Get Notifications

Retrieve user notifications with filtering and pagination.

**Endpoint**: `GET /api/notifications`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Query Parameters**:
- `userId` (optional): Filter by user ID
- `type` (optional): Filter by notification type
- `category` (optional): Filter by category
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `read` (optional): Filter by read status
- `limit` (optional): Maximum results (default: 20)
- `offset` (optional): Results offset (default: 0)
- `sortBy` (optional): Sort field (default: 'createdAt')
- `sortOrder` (optional): Sort order (default: 'desc')

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/notifications?userId=user-123&category=project&status=unread&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif-123",
        "userId": "user-123",
        "type": "info",
        "category": "project",
        "priority": "normal",
        "title": "Project Update",
        "message": "Your project has been updated with new features",
        "status": "delivered",
        "readAt": null,
        "createdAt": "2024-01-15T23:00:00Z",
        "channels": [
          {
            "type": "in_app",
            "status": "delivered"
          }
        ],
        "actions": [
          {
            "id": "view-project",
            "label": "View Project",
            "type": "link",
            "primary": true
          }
        ]
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    },
    "summary": {
      "total": 45,
      "unread": 23,
      "read": 22,
      "byCategory": {
        "project": 15,
        "system": 12,
        "collaboration": 8,
        "security": 5,
        "updates": 5
      },
      "byPriority": {
        "urgent": 2,
        "high": 8,
        "normal": 30,
        "low": 5
      }
    }
  },
  "message": "Notifications retrieved successfully"
}
```

### Mark as Read

Mark notifications as read.

**Endpoint**: `PUT /api/notifications/:notificationId/read`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Path Parameters**:
- `notificationId`: Notification identifier

**Request Body**:
```json
{
  "readAt": "2024-01-15T23:05:00Z"
}
```

**Request Example**:
```bash
curl -X PUT "http://localhost:3001/api/notifications/notif-123/read" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "readAt": "2024-01-15T23:05:00Z"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "notificationId": "notif-123",
    "readAt": "2024-01-15T23:05:00Z",
    "status": "read",
    "updatedAt": "2024-01-15T23:05:00Z"
  },
  "message": "Notification marked as read"
}
```

### Mark Multiple as Read

Mark multiple notifications as read.

**Endpoint**: `PUT /api/notifications/read`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)
- `Content-Type: application/json`

**Request Body**:
```json
{
  "notificationIds": ["notif-123", "notif-456", "notif-789"],
  "readAt": "2024-01-15T23:10:00Z"
}
```

**Request Example**:
```bash
curl -X PUT "http://localhost:3001/api/notifications/read" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notificationIds": ["notif-123", "notif-456", "notif-789"],
    "readAt": "2024-01-15T23:10:00Z"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "markedAsRead": 3,
    "readAt": "2024-01-15T23:10:00Z",
    "results": [
      {
        "id": "notif-123",
        "status": "read",
        "updatedAt": "2024-01-15T23:10:00Z"
      },
      {
        "id": "notif-456",
        "status": "read",
        "updatedAt": "2024-01-15T23:10:00Z"
      },
      {
        "id": "notif-789",
        "status": "read",
        "updatedAt": "2024-01-15T23:10:00Z"
      }
    ]
  },
  "message": "Notifications marked as read successfully"
}
```

### Delete Notification

Delete a notification.

**Endpoint**: `DELETE /api/notifications/:notificationId`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Path Parameters**:
- `notificationId`: Notification identifier

**Request Example**:
```bash
curl -X DELETE "http://localhost:3001/api/notifications/notif-123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "notificationId": "notif-123",
    "deletedAt": "2024-01-15T23:15:00Z",
    "status": "deleted"
  },
  "message": "Notification deleted successfully"
}
```

### Clear All Notifications

Clear all notifications for a user.

**Endpoint**: `DELETE /api/notifications`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Query Parameters**:
- `userId`: User identifier
- `category` (optional): Clear specific category only
- `status` (optional): Clear specific status only

**Request Example**:
```bash
curl -X DELETE "http://localhost:3001/api/notifications?userId=user-123&category=project" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "clearedAt": "2024-01-15T23:20:00Z",
    "deletedCount": 15,
    "category": "project",
    "summary": {
      "total": 45,
      "remaining": 30,
      "deleted": 15
    }
  },
  "message": "Project notifications cleared successfully"
}
```

### Get Notification Preferences

Retrieve user notification preferences.

**Endpoint**: `GET /api/notifications/preferences/:userId`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Path Parameters**:
- `userId`: User identifier

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/notifications/preferences/user-123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "prefs-123",
    "userId": "user-123",
    "global": {
      "enabled": true,
      "defaultChannels": ["in_app", "email"],
      "defaultPriority": "normal",
      "maxNotifications": 100,
      "retentionDays": 30,
      "autoDelete": true,
      "batchNotifications": true,
      "digestFrequency": "daily"
    },
    "categories": [
      {
        "category": "project",
        "enabled": true,
        "channels": ["in_app", "email"],
        "priority": "normal",
        "quietHours": false,
        "batch": false,
        "maxPerHour": 10,
        "maxPerDay": 50
      }
    ],
    "channels": [
      {
        "channel": "email",
        "enabled": true,
        "priority": "normal",
        "quietHours": true,
        "batch": true,
        "maxPerHour": 5,
        "maxPerDay": 20,
        "config": {
          "recipient": "user@example.com",
          "from": "noreply@example.com"
        }
      }
    ],
    "quietHours": {
      "enabled": true,
      "startTime": "22:00",
      "endTime": "08:00",
      "timezone": "America/Los_Angeles",
      "days": [0, 1, 2, 3, 4, 5, 6],
      "categories": ["marketing", "updates"],
      "channels": ["email", "push"],
      "emergency": true
    },
    "updatedAt": "2024-01-15T22:00:00Z"
  },
  "message": "Notification preferences retrieved successfully"
}
```

### Update Notification Preferences

Update user notification preferences.

**Endpoint**: `PUT /api/notifications/preferences/:userId`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)
- `Content-Type: application/json`

**Path Parameters**:
- `userId`: User identifier

**Request Body**:
```json
{
  "global": {
    "enabled": true,
    "defaultChannels": ["in_app", "email"],
    "digestFrequency": "hourly"
  },
  "categories": [
    {
      "category": "project",
      "enabled": true,
      "channels": ["in_app", "email"],
      "priority": "high"
    }
  ],
  "quietHours": {
    "enabled": true,
    "startTime": "23:00",
    "endTime": "07:00"
  }
}
```

**Request Example**:
```bash
curl -X PUT "http://localhost:3001/api/notifications/preferences/user-123" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "global": {
      "enabled": true,
      "defaultChannels": ["in_app", "email"],
      "digestFrequency": "hourly"
    },
    "categories": [
      {
        "category": "project",
        "enabled": true,
        "channels": ["in_app", "email"],
        "priority": "high"
      }
    ],
    "quietHours": {
      "enabled": true,
      "startTime": "23:00",
      "endTime": "07:00"
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "prefs-123",
    "userId": "user-123",
    "updatedAt": "2024-01-15T23:25:00Z",
    "changes": [
      "Updated digest frequency to hourly",
      "Updated project category priority to high",
      "Updated quiet hours to 23:00-07:00"
    ],
    "preferences": {
      "global": {
        "enabled": true,
        "defaultChannels": ["in_app", "email"],
        "digestFrequency": "hourly"
      },
      "categories": [
        {
          "category": "project",
          "enabled": true,
          "channels": ["in_app", "email"],
          "priority": "high"
        }
      ],
      "quietHours": {
        "enabled": true,
        "startTime": "23:00",
        "endTime": "07:00"
      }
    }
  },
  "message": "Notification preferences updated successfully"
}
```

### Send Bulk Notifications

Send notifications to multiple users.

**Endpoint**: `POST /api/notifications/bulk`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)
- `Content-Type: application/json`

**Request Body**:
```json
{
  "users": ["user-123", "user-456", "user-789"],
  "type": "info",
  "category": "system",
  "title": "System Maintenance",
  "message": "Scheduled maintenance will occur tonight",
  "channels": ["in_app", "email"],
  "scheduledFor": "2024-01-15T23:30:00Z",
  "options": {
    "batch": true,
    "retryOnFailure": true
  }
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/notifications/bulk" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "users": ["user-123", "user-456", "user-789"],
    "type": "info",
    "category": "system",
    "title": "System Maintenance",
    "message": "Scheduled maintenance will occur tonight",
    "channels": ["in_app", "email"],
    "scheduledFor": "2024-01-15T23:30:00Z",
    "options": {
      "batch": true,
      "retryOnFailure": true
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "bulkId": "bulk-123",
    "totalUsers": 3,
    "scheduledFor": "2024-01-15T23:30:00Z",
    "notifications": [
      {
        "userId": "user-123",
        "notificationId": "notif-456",
        "status": "scheduled"
      },
      {
        "userId": "user-456",
        "notificationId": "notif-789",
        "status": "scheduled"
      },
      {
        "userId": "user-789",
        "notificationId": "notif-012",
        "status": "scheduled"
      }
    ],
    "summary": {
      "scheduled": 3,
      "failed": 0,
      "estimatedDelivery": "2024-01-15T23:30:00Z"
    }
  },
  "message": "Bulk notifications scheduled successfully"
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
- `NOTIFICATION_NOT_FOUND`: Notification not found
- `USER_NOT_FOUND`: User not found
- `INSUFFICIENT_PERMISSIONS`: Insufficient permissions
- `INVALID_NOTIFICATION_DATA`: Invalid notification data
- `CHANNEL_NOT_AVAILABLE`: Notification channel not available
- `TEMPLATE_NOT_FOUND`: Notification template not found
- `DELIVERY_FAILED`: Notification delivery failed
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `QUIET_HOURS_ACTIVE`: Quiet hours active
- `USER_PREFERENCES_DISABLED`: User has disabled notifications

## 🔐 Authentication & Authorization

### Required Headers
```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Permission Requirements
- **Own Notifications**: Users can manage their own notifications
- **User Notifications**: Admin role required for other users' notifications
- **Bulk Notifications**: Admin role required
- **System Notifications**: Admin role required

## 📈 Rate Limiting

### Rate Limits
- **Send Notifications**: 100 notifications per minute per user
- **Bulk Notifications**: 10 bulk operations per hour per user
- **Get Notifications**: 200 requests per minute per user
- **Update Preferences**: 50 updates per minute per user

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
import { AICodingAssistantAPI } from '@ai-coding-assistant/sdk';

const api = new AICodingAssistantAPI({
  baseURL: 'http://localhost:3001',
  token: 'your-jwt-token'
});

// Send notification
const notification = await api.notifications.send({
  userId: 'user-123',
  type: 'info',
  category: 'project',
  title: 'Project Update',
  message: 'Your project has been updated',
  channels: ['in_app', 'email']
});

// Get notifications
const notifications = await api.notifications.get({
  userId: 'user-123',
  status: 'unread',
  limit: 20
});

// Mark as read
await api.notifications.markAsRead('notif-123');

// Update preferences
await api.notifications.updatePreferences('user-123', {
  global: {
    enabled: true,
    digestFrequency: 'daily'
  }
});
```

### Python
```python
from ai_coding_assistant import AICodingAssistantAPI

api = AICodingAssistantAPI(
    base_url="http://localhost:3001",
    token="your-jwt-token"
)

# Send notification
notification = api.notifications.send({
    "user_id": "user-123",
    "type": "info",
    "category": "project",
    "title": "Project Update",
    "message": "Your project has been updated",
    "channels": ["in_app", "email"]
})

# Get notifications
notifications = api.notifications.get({
    "user_id": "user-123",
    "status": "unread",
    "limit": 20
})

# Mark as read
api.notifications.mark_as_read("notif-123")

# Update preferences
api.notifications.update_preferences("user-123", {
    "global": {
        "enabled": True,
        "digest_frequency": "daily"
    }
})
```

## 🧪 Testing

### Test Send Notification
```bash
# Test sending a notification
curl -X POST "http://localhost:3001/api/notifications" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "type": "info",
    "category": "test",
    "title": "Test Notification",
    "message": "This is a test notification",
    "channels": ["in_app"]
  }'
```

### Test Get Notifications
```bash
# Test getting notifications
curl -X GET "http://localhost:3001/api/notifications?userId=test-user-123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Mark as Read
```bash
# Test marking notification as read
curl -X PUT "http://localhost:3001/api/notifications/NOTIFICATION_ID/read" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"readAt": "2024-01-15T23:30:00Z"}'
```

## 🔧 Configuration

### Environment Variables
```bash
# Notification configuration
NOTIFICATIONS_ENABLED=true
NOTIFICATIONS_MAX_RETRIES=3
NOTIFICATIONS_RETRY_DELAY=5000
NOTIFICATIONS_BATCH_SIZE=100
NOTIFICATIONS_QUEUE_SIZE=1000
NOTIFICATIONS_WORKER_THREADS=4
NOTIFICATIONS_DELIVERY_TIMEOUT=30000
NOTIFICATIONS_CLEANUP_INTERVAL=3600000
```

### Server Configuration
```javascript
// Notification configuration
const notificationConfig = {
  enabled: process.env.NOTIFICATIONS_ENABLED === 'true',
  maxRetries: parseInt(process.env.NOTIFICATIONS_MAX_RETRIES) || 3,
  retryDelay: parseInt(process.env.NOTIFICATIONS_RETRY_DELAY) || 5000,
  batchSize: parseInt(process.env.NOTIFICATIONS_BATCH_SIZE) || 100,
  queueSize: parseInt(process.env.NOTIFICATIONS_QUEUE_SIZE) || 1000,
  workerThreads: parseInt(process.env.NOTIFICATIONS_WORKER_THREADS) || 4,
  deliveryTimeout: parseInt(process.env.NOTIFICATIONS_DELIVERY_TIMEOUT) || 30000,
  cleanupInterval: parseInt(process.env.NOTIFICATIONS_CLEANUP_INTERVAL) || 3600000,
  channels: {
    inApp: {
      enabled: true,
      maxNotifications: 100,
      retentionDays: 30
    },
    email: {
      enabled: true,
      smtp: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      },
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      templates: '/workspace/templates/email'
    },
    push: {
      enabled: process.env.PUSH_NOTIFICATIONS_ENABLED === 'true',
      vapidKeys: {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY
      }
    }
  }
};
```

---

## 🎉 Ready to Use Notifications API!

You now have comprehensive information about the Notifications API. Start implementing real-time notifications, email alerts, and push notifications with our powerful notification management endpoints.

**Happy notifying! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This API documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*