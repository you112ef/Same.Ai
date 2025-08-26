# Authentication API

The Authentication API provides comprehensive user authentication and authorization capabilities within AI Coding Assistant, including user registration, login, session management, and access control.

## 📋 Overview

The Authentication API allows you to:
- Register new user accounts
- Authenticate users and create sessions
- Manage user sessions and tokens
- Handle password reset and recovery
- Manage user permissions and roles
- Implement multi-factor authentication
- Handle OAuth and social login
- Manage API keys and access tokens

## 🔗 Base Endpoint

```
POST /api/auth
```

## 📚 Available Endpoints

### User Authentication
- **[User Registration](#user-registration)** - Create new user accounts
- **[User Login](#user-login)** - Authenticate users and create sessions
- **[User Logout](#user-logout)** - End user sessions
- **[Password Reset](#password-reset)** - Reset forgotten passwords
- **[Password Change](#password-change)** - Change user passwords

### Session Management
- **[Session Validation](#session-validation)** - Validate active sessions
- **[Session Refresh](#session-refresh)** - Refresh session tokens
- **[Session Revoke](#session-revoke)** - Revoke specific sessions
- **[Session List](#session-list)** - List user sessions

### Security & Access Control
- **[Role Management](#role-management)** - Manage user roles and permissions
- **[Permission Check](#permission-check)** - Check user permissions
- **[Access Token](#access-token)** - Generate and manage access tokens
- **[Two-Factor Authentication](#two-factor-authentication)** - MFA operations

## 📊 Data Models

### User Object
```typescript
interface User {
  id: string;                      // Unique user identifier
  username: string;                // Unique username
  email: string;                   // User email address
  firstName?: string;              // User first name
  lastName?: string;               // User last name
  avatar?: string;                 // User avatar URL
  role: UserRole;                  // User role
  status: UserStatus;              // User account status
  emailVerified: boolean;          // Email verification status
  mfaEnabled: boolean;             // Multi-factor authentication enabled
  lastLoginAt?: string;            // Last login timestamp
  createdAt: string;               // Account creation timestamp
  updatedAt: string;               // Last update timestamp
  metadata: UserMetadata;          // Additional user metadata
}

enum UserRole {
  'user' = 'user',                 // Standard user
  'premium' = 'premium',           // Premium user
  'admin' = 'admin',               // Administrator
  'superuser' = 'superuser'        // Super user
}

enum UserStatus {
  'active' = 'active',             // Active account
  'inactive' = 'inactive',         // Inactive account
  'suspended' = 'suspended',       // Suspended account
  'pending' = 'pending'            // Pending verification
}

interface UserMetadata {
  timezone?: string;               // User timezone
  language?: string;               // Preferred language
  theme?: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  preferences: UserPreferences;
  custom?: Record<string, any>;    // Custom metadata
}

interface NotificationSettings {
  email: boolean;                  // Email notifications
  push: boolean;                   // Push notifications
  sms: boolean;                    // SMS notifications
  marketing: boolean;              // Marketing communications
}

interface UserPreferences {
  autoSave: boolean;               // Auto-save enabled
  codeTheme: string;               // Code editor theme
  fontSize: number;                // Font size preference
  tabSize: number;                 // Tab size preference
}
```

### Session Object
```typescript
interface Session {
  id: string;                      // Session identifier
  userId: string;                  // Associated user ID
  token: string;                   // Session token
  refreshToken: string;            // Refresh token
  type: 'web' | 'api' | 'mobile'; // Session type
  ipAddress: string;               // Client IP address
  userAgent: string;               // Client user agent
  deviceInfo: DeviceInfo;          // Device information
  permissions: string[];           // Session permissions
  expiresAt: string;               // Expiration timestamp
  lastActivityAt: string;          // Last activity timestamp
  createdAt: string;               // Session creation timestamp
  revokedAt?: string;              // Revocation timestamp
}

interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;                      // Operating system
  browser: string;                 // Web browser
  version: string;                 // Browser version
  deviceId?: string;               // Device identifier
}
```

### Authentication Request
```typescript
interface LoginRequest {
  username: string;                // Username or email
  password: string;                // User password
  rememberMe?: boolean;            // Remember session
  mfaCode?: string;                // MFA code if enabled
  deviceInfo?: DeviceInfo;         // Device information
}

interface RegisterRequest {
  username: string;                // Unique username
  email: string;                   // Email address
  password: string;                // Password
  confirmPassword: string;         // Password confirmation
  firstName?: string;              // First name
  lastName?: string;               // Last name
  acceptTerms: boolean;            // Terms acceptance
  marketingConsent?: boolean;      // Marketing consent
  inviteCode?: string;             // Invitation code
}

interface PasswordResetRequest {
  email: string;                   // User email
  captchaToken?: string;           // CAPTCHA token
}

interface PasswordChangeRequest {
  currentPassword: string;         // Current password
  newPassword: string;             // New password
  confirmPassword: string;         // Password confirmation
}
```

## 🚀 API Endpoints

### User Registration

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**: `RegisterRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "acceptTerms": true,
    "marketingConsent": false
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "status": "pending",
      "emailVerified": false,
      "mfaEnabled": false,
      "createdAt": "2024-01-15T21:00:00Z",
      "updatedAt": "2024-01-15T21:00:00Z"
    },
    "session": {
      "id": "session-456",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh-token-789",
      "expiresAt": "2024-01-16T21:00:00Z"
    },
    "verificationRequired": true
  },
  "message": "User registered successfully. Please verify your email."
}
```

### User Login

Authenticate user and create session.

**Endpoint**: `POST /api/auth/login`

**Request Body**: `LoginRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123!",
    "rememberMe": true,
    "deviceInfo": {
      "type": "desktop",
      "os": "Windows 11",
      "browser": "Chrome",
      "version": "120.0.0.0"
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "status": "active",
      "emailVerified": true,
      "mfaEnabled": false,
      "lastLoginAt": "2024-01-15T21:00:00Z",
      "createdAt": "2024-01-15T20:00:00Z",
      "updatedAt": "2024-01-15T21:00:00Z"
    },
    "session": {
      "id": "session-456",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh-token-789",
      "type": "web",
      "expiresAt": "2024-01-16T21:00:00Z",
      "permissions": ["read:projects", "write:projects", "read:files"]
    },
    "mfaRequired": false
  },
  "message": "Login successful"
}
```

### User Logout

End user session.

**Endpoint**: `POST /api/auth/logout`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/logout" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "sessionId": "session-456",
    "revokedAt": "2024-01-15T21:30:00Z"
  },
  "message": "Logout successful"
}
```

### Password Reset

Request password reset for forgotten password.

**Endpoint**: `POST /api/auth/password-reset`

**Request Body**: `PasswordResetRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/password-reset" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "resetToken": "reset-token-abc123",
    "expiresAt": "2024-01-16T21:00:00Z",
    "emailSent": true
  },
  "message": "Password reset email sent successfully"
}
```

### Password Change

Change user password (authenticated).

**Endpoint**: `POST /api/auth/password-change`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Request Body**: `PasswordChangeRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/password-change" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass123!",
    "newPassword": "NewSecurePass456!",
    "confirmPassword": "NewSecurePass456!"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "passwordChangedAt": "2024-01-15T21:45:00Z",
    "nextPasswordChange": "2024-04-15T21:45:00Z"
  },
  "message": "Password changed successfully"
}
```

### Session Validation

Validate active session.

**Endpoint**: `GET /api/auth/session`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/auth/session" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "session-456",
      "userId": "user-123",
      "type": "web",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "deviceInfo": {
        "type": "desktop",
        "os": "Windows 11",
        "browser": "Chrome",
        "version": "120.0.0.0"
      },
      "permissions": ["read:projects", "write:projects", "read:files"],
      "expiresAt": "2024-01-16T21:00:00Z",
      "lastActivityAt": "2024-01-15T21:30:00Z",
      "createdAt": "2024-01-15T21:00:00Z"
    },
    "user": {
      "id": "user-123",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "status": "active",
      "emailVerified": true,
      "mfaEnabled": false
    }
  },
  "message": "Session validated successfully"
}
```

### Session Refresh

Refresh session token.

**Endpoint**: `POST /api/auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "refresh-token-789"
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "refresh-token-789"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "session-456",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh-token-new-abc",
      "expiresAt": "2024-01-16T22:00:00Z"
    }
  },
  "message": "Session refreshed successfully"
}
```

### Session Revoke

Revoke specific session.

**Endpoint**: `DELETE /api/auth/session/:sessionId`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Path Parameters**:
- `sessionId`: Session identifier to revoke

**Request Example**:
```bash
curl -X DELETE "http://localhost:3001/api/auth/session/session-456" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "sessionId": "session-456",
    "revokedAt": "2024-01-15T22:00:00Z"
  },
  "message": "Session revoked successfully"
}
```

### Session List

List user sessions.

**Endpoint**: `GET /api/auth/sessions`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Query Parameters**:
- `active` (optional): Filter active sessions only (default: true)
- `limit` (optional): Maximum sessions to return (default: 20)
- `offset` (optional): Number of sessions to skip (default: 0)

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/auth/sessions?active=true&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session-456",
        "type": "web",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "deviceInfo": {
          "type": "desktop",
          "os": "Windows 11",
          "browser": "Chrome",
          "version": "120.0.0.0"
        },
        "lastActivityAt": "2024-01-15T21:30:00Z",
        "createdAt": "2024-01-15T21:00:00Z",
        "isCurrent": true
      },
      {
        "id": "session-789",
        "type": "mobile",
        "ipAddress": "10.0.0.50",
        "userAgent": "Mozilla/5.0...",
        "deviceInfo": {
          "type": "mobile",
          "os": "iOS",
          "browser": "Safari",
          "version": "17.0"
        },
        "lastActivityAt": "2024-01-15T20:00:00Z",
        "createdAt": "2024-01-15T19:00:00Z",
        "isCurrent": false
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 10,
      "offset": 0,
      "hasMore": false
    }
  },
  "message": "Sessions retrieved successfully"
}
```

### Permission Check

Check user permissions for specific resource.

**Endpoint**: `POST /api/auth/permissions/check`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Request Body**:
```json
{
  "resource": "projects",
  "action": "create",
  "resourceId": "project-123"
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/permissions/check" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "resource": "projects",
    "action": "create"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "hasPermission": true,
    "permission": "create:projects",
    "role": "user",
    "resource": "projects",
    "action": "create",
    "conditions": {
      "maxProjects": 10,
      "currentProjects": 3
    }
  },
  "message": "Permission check completed"
}
```

### Two-Factor Authentication

Enable, disable, or verify MFA.

**Endpoint**: `POST /api/auth/mfa/enable`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/mfa/enable" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "secret": "JBSWY3DPEHPK3PXP",
    "backupCodes": [
      "12345678",
      "87654321",
      "11223344",
      "44332211"
    ]
  },
  "message": "MFA setup initiated. Please scan QR code and verify."
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
- `VALIDATION_ERROR`: Input validation failed
- `USER_NOT_FOUND`: User not found
- `INVALID_CREDENTIALS`: Invalid username or password
- `ACCOUNT_LOCKED`: Account is locked
- `EMAIL_NOT_VERIFIED`: Email not verified
- `MFA_REQUIRED`: Multi-factor authentication required
- `MFA_INVALID`: Invalid MFA code
- `SESSION_EXPIRED`: Session has expired
- `INSUFFICIENT_PERMISSIONS`: Insufficient permissions
- `RATE_LIMIT_EXCEEDED`: Too many authentication attempts

### Error Response Example
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password",
    "details": {
      "attempts": 3,
      "maxAttempts": 5,
      "lockoutTime": "2024-01-15T22:30:00Z"
    },
    "timestamp": "2024-01-15T22:00:00Z",
    "requestId": "req-ghi789"
  }
}
```

## 🔐 Security Features

### Password Requirements
- **Minimum Length**: 8 characters
- **Complexity**: Must include uppercase, lowercase, numbers, and special characters
- **Common Passwords**: Blocked
- **Password History**: Last 5 passwords cannot be reused

### Session Security
- **Token Expiry**: Configurable (default: 24 hours)
- **Refresh Tokens**: Rotated on use
- **Device Tracking**: Track and display active sessions
- **IP Validation**: Optional IP address validation
- **Concurrent Sessions**: Configurable limit

### Multi-Factor Authentication
- **TOTP Support**: Time-based one-time passwords
- **Backup Codes**: Emergency access codes
- **Device Remembering**: Trusted device options
- **Recovery Options**: Multiple recovery methods

### Rate Limiting
- **Login Attempts**: 5 attempts per 15 minutes
- **Password Reset**: 3 requests per hour
- **Registration**: 3 accounts per IP per day
- **API Endpoints**: 100 requests per minute

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
import { AICodingAssistantAPI } from '@ai-coding-assistant/sdk';

const api = new AICodingAssistantAPI({
  baseURL: 'http://localhost:3001'
});

// Register new user
const registration = await api.auth.register({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe',
  acceptTerms: true
});

// Login
const login = await api.auth.login({
  username: 'johndoe',
  password: 'SecurePass123!',
  rememberMe: true
});

// Use token for authenticated requests
api.setToken(login.session.token);

// Check permissions
const hasPermission = await api.auth.checkPermission({
  resource: 'projects',
  action: 'create'
});
```

### Python
```python
from ai_coding_assistant import AICodingAssistantAPI

api = AICodingAssistantAPI(base_url="http://localhost:3001")

# Register new user
registration = api.auth.register(
    username="johndoe",
    email="john@example.com",
    password="SecurePass123!",
    confirm_password="SecurePass123!",
    first_name="John",
    last_name="Doe",
    accept_terms=True
)

# Login
login = api.auth.login(
    username="johndoe",
    password="SecurePass123!"
)

# Use token for authenticated requests
api.set_token(login.session.token)

# Check permissions
has_permission = api.auth.check_permission(
    resource="projects",
    action="create"
)
```

## 🧪 Testing

### Test User Registration
```bash
# Test user registration
curl -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!",
    "acceptTerms": true
  }'
```

### Test Authentication Flow
```bash
# Test login
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'

# Test session validation (use token from login response)
curl -X GET "http://localhost:3001/api/auth/session" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Test logout
curl -X POST "http://localhost:3001/api/auth/logout" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Configuration

### Environment Variables
```bash
# Authentication configuration
AUTH_SESSION_SECRET=your-super-secret-key
AUTH_JWT_SECRET=your-jwt-secret-key
AUTH_SESSION_EXPIRY=86400000
AUTH_REFRESH_TOKEN_EXPIRY=604800000
AUTH_MAX_LOGIN_ATTEMPTS=5
AUTH_LOCKOUT_DURATION=900000
AUTH_PASSWORD_MIN_LENGTH=8
AUTH_MFA_ENABLED=true
```

### Server Configuration
```javascript
// Authentication configuration
const authConfig = {
  sessionSecret: process.env.AUTH_SESSION_SECRET,
  jwtSecret: process.env.AUTH_JWT_SECRET,
  sessionExpiry: parseInt(process.env.AUTH_SESSION_EXPIRY) || 86400000, // 24 hours
  refreshTokenExpiry: parseInt(process.env.AUTH_REFRESH_TOKEN_EXPIRY) || 604800000, // 7 days
  maxLoginAttempts: parseInt(process.env.AUTH_MAX_LOGIN_ATTEMPTS) || 5,
  lockoutDuration: parseInt(process.env.AUTH_LOCKOUT_DURATION) || 900000, // 15 minutes
  passwordMinLength: parseInt(process.env.AUTH_PASSWORD_MIN_LENGTH) || 8,
  mfaEnabled: process.env.AUTH_MFA_ENABLED === 'true',
  bcryptRounds: 12,
  tokenRotation: true
};
```

---

## 🎉 Ready to Use Authentication API!

You now have comprehensive information about the Authentication API. Start implementing secure user authentication and authorization with our powerful authentication endpoints.

**Happy secure coding! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This API documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*