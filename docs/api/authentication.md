# Authentication API

The Authentication API provides comprehensive user authentication and authorization capabilities within AI Coding Assistant, including user registration, login, password management, and security features.

## 📋 Overview

The Authentication API allows you to:
- Register new user accounts
- Authenticate users and create sessions
- Manage user passwords and security
- Implement multi-factor authentication
- Handle password reset and recovery
- Manage user roles and permissions
- Implement OAuth and social login
- Handle account verification and activation
- Manage user security settings

## 🔗 Base Endpoint

```
POST /api/auth
```

## 📚 Available Endpoints

### User Authentication
- **[User Registration](#user-registration)** - Create new user accounts
- **[User Login](#user-login)** - Authenticate existing users
- **[User Logout](#user-logout)** - End user sessions
- **[Password Reset](#password-reset)** - Reset forgotten passwords
- **[Password Change](#password-change)** - Change user passwords

### Account Management
- **[Account Verification](#account-verification)** - Verify email addresses
- **[Account Activation](#account-activation)** - Activate user accounts
- **[Account Deactivation](#account-deactivation)** - Deactivate user accounts
- **[Account Deletion](#account-deletion)** - Delete user accounts

### Security Features
- **[Multi-Factor Authentication](#multi-factor-authentication)** - Enable 2FA/MFA
- **[OAuth Integration](#oauth-integration)** - Social login providers
- **[Session Management](#session-management)** - Manage active sessions
- **[Security Settings](#security-settings)** - Configure security options

### Advanced Features
- **[Role Management](#role-management)** - Manage user roles and permissions
- **[Permission System](#permission-system)** - Configure access controls
- **[Audit Logging](#audit-logging)** - Track authentication events
- **[Security Monitoring](#security-monitoring)** - Monitor security threats

## 📊 Data Models

### User Object
```typescript
interface User {
  id: string;                      // Unique user identifier
  username: string;                // Username (unique)
  email: string;                   // Email address (unique)
  firstName: string;               // First name
  lastName: string;                // Last name
  displayName: string;             // Display name
  avatar?: string;                 // Avatar image URL
  status: UserStatus;              // Account status
  role: UserRole;                  // User role
  permissions: Permission[];        // User permissions
  createdAt: string;               // Account creation timestamp
  updatedAt: string;               // Last update timestamp
  lastLoginAt?: string;            // Last login timestamp
  emailVerified: boolean;          // Email verification status
  phoneVerified: boolean;          // Phone verification status
  twoFactorEnabled: boolean;       // 2FA status
  security: UserSecurity;          // Security settings
  preferences: UserPreferences;    // User preferences
  metadata: UserMetadata;          // Additional user data
}

enum UserStatus {
  'active' = 'active',
  'inactive' = 'inactive',
  'suspended' = 'suspended',
  'pending' = 'pending',
  'banned' = 'banned'
}

enum UserRole {
  'user' = 'user',
  'premium' = 'premium',
  'admin' = 'admin',
  'moderator' = 'moderator',
  'developer' = 'developer'
}

interface Permission {
  resource: string;                 // Resource name
  action: string;                   // Action type
  conditions?: Record<string, any>; // Permission conditions
}

interface UserSecurity {
  passwordHash: string;             // Hashed password
  passwordSalt: string;             // Password salt
  passwordChangedAt: string;        // Password change timestamp
  failedLoginAttempts: number;      // Failed login attempts
  lastFailedLoginAt?: string;       // Last failed login
  accountLocked: boolean;           // Account lock status
  lockExpiresAt?: string;           // Lock expiration
  twoFactorSecret?: string;         // 2FA secret key
  backupCodes: string[];            // Backup recovery codes
  securityQuestions: SecurityQuestion[]; // Security questions
  lastSecurityCheck: string;        // Last security check
  securityScore: number;            // Security score (0-100)
}

interface SecurityQuestion {
  question: string;                 // Security question
  answerHash: string;               // Hashed answer
  answerSalt: string;               // Answer salt
}

interface UserPreferences {
  language: string;                 // Preferred language
  timezone: string;                 // Preferred timezone
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings; // Notification preferences
  privacy: PrivacySettings;         // Privacy preferences
  accessibility: AccessibilitySettings; // Accessibility settings
}

interface UserMetadata {
  company?: string;                 // Company name
  position?: string;                // Job position
  location?: string;                // Location
  bio?: string;                     // User biography
  website?: string;                 // Personal website
  socialLinks: SocialLinks;         // Social media links
  skills: string[];                 // User skills
  interests: string[];              // User interests
  custom: Record<string, any>;      // Custom metadata
}

interface SocialLinks {
  github?: string;                  // GitHub profile
  linkedin?: string;                // LinkedIn profile
  twitter?: string;                 // Twitter profile
  facebook?: string;                // Facebook profile
  instagram?: string;               // Instagram profile
}
```

### Authentication Request Objects
```typescript
interface RegisterRequest {
  username: string;                 // Username
  email: string;                    // Email address
  password: string;                 // Password
  firstName: string;                // First name
  lastName: string;                 // Last name
  displayName?: string;             // Display name
  phone?: string;                   // Phone number
  company?: string;                 // Company name
  position?: string;                // Job position
  acceptTerms: boolean;             // Terms acceptance
  acceptMarketing?: boolean;        // Marketing consent
  captchaToken?: string;            // CAPTCHA verification
  referrerCode?: string;            // Referral code
  metadata?: Partial<UserMetadata>; // Additional metadata
}

interface LoginRequest {
  identifier: string;               // Username or email
  password: string;                 // Password
  rememberMe?: boolean;             // Remember login
  twoFactorCode?: string;           // 2FA code
  deviceInfo?: DeviceInfo;          // Device information
  location?: GeoLocation;           // Geographic location
  captchaToken?: string;            // CAPTCHA verification
}

interface PasswordResetRequest {
  email: string;                    // Email address
  captchaToken?: string;            // CAPTCHA verification
}

interface PasswordChangeRequest {
  currentPassword: string;          // Current password
  newPassword: string;              // New password
  confirmPassword: string;          // Password confirmation
  requireCurrentPassword: boolean;  // Require current password
}

interface TwoFactorRequest {
  code: string;                     // 2FA code
  backupCode?: string;              // Backup recovery code
  rememberDevice?: boolean;         // Remember this device
}

interface OAuthRequest {
  provider: OAuthProvider;          // OAuth provider
  code: string;                     // Authorization code
  state?: string;                   // State parameter
  redirectUri: string;              // Redirect URI
}

enum OAuthProvider {
  'google' = 'google',
  'github' = 'github',
  'facebook' = 'facebook',
  'twitter' = 'twitter',
  'linkedin' = 'linkedin',
  'microsoft' = 'microsoft',
  'apple' = 'apple'
}
```

### Authentication Response Objects
```typescript
interface AuthResponse {
  success: boolean;                 // Success status
  user: User;                       // User information
  session: Session;                 // Session data
  token: string;                    // Authentication token
  refreshToken: string;             // Refresh token
  expiresAt: string;                // Token expiration
  requiresTwoFactor: boolean;       // 2FA requirement
  twoFactorType?: TwoFactorType;    // 2FA type
  message: string;                  // Response message
  warnings?: string[];              // Warning messages
  metadata?: Record<string, any>;   // Additional data
}

interface TwoFactorResponse {
  success: boolean;                 // Success status
  requiresTwoFactor: boolean;       // 2FA requirement
  twoFactorType: TwoFactorType;     // 2FA type
  qrCode?: string;                  // QR code for setup
  secret?: string;                  // Secret key
  backupCodes: string[];            // Backup codes
  message: string;                  // Response message
}

enum TwoFactorType {
  'totp' = 'totp',                 // Time-based OTP
  'sms' = 'sms',                   // SMS verification
  'email' = 'email',               // Email verification
  'authenticator' = 'authenticator' // Authenticator app
}

interface PasswordResetResponse {
  success: boolean;                 // Success status
  resetToken: string;               // Password reset token
  expiresAt: string;                // Token expiration
  message: string;                  // Response message
  instructions: string[];           // Reset instructions
}

interface VerificationResponse {
  success: boolean;                 // Success status
  verified: boolean;                // Verification status
  message: string;                  // Response message
  nextSteps?: string[];             // Next steps
  resendAvailable: boolean;         // Resend availability
  resendCooldown?: number;          // Resend cooldown
}
```

## 🚀 API Endpoints

### User Registration

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Headers**:
- `Content-Type: application/json`

**Request Body**: `RegisterRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "displayName": "John Doe",
    "phone": "+1-555-0123",
    "company": "Tech Corp",
    "position": "Software Developer",
    "acceptTerms": true,
    "acceptMarketing": false,
    "metadata": {
      "skills": ["JavaScript", "React", "Node.js"],
      "interests": ["Web Development", "AI", "Open Source"],
      "website": "https://johndoe.dev"
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
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "displayName": "John Doe",
      "status": "pending",
      "role": "user",
      "emailVerified": false,
      "phoneVerified": false,
      "twoFactorEnabled": false,
      "createdAt": "2024-01-15T23:00:00Z",
      "updatedAt": "2024-01-15T23:00:00Z"
    },
    "message": "Account created successfully. Please verify your email address.",
    "nextSteps": [
      "Check your email for verification link",
      "Complete your profile",
      "Enable two-factor authentication for enhanced security"
    ],
    "verificationRequired": true
  },
  "message": "Registration successful"
}
```

### User Login

Authenticate existing user.

**Endpoint**: `POST /api/auth/login`

**Headers**:
- `Content-Type: application/json`

**Request Body**: `LoginRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "johndoe",
    "password": "SecurePassword123!",
    "rememberMe": true,
    "deviceInfo": {
      "type": "desktop",
      "os": "Windows 11",
      "browser": "Chrome",
      "version": "120.0.0.0"
    },
    "location": {
      "country": "US",
      "city": "San Francisco",
      "ipAddress": "192.168.1.100"
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
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "displayName": "John Doe",
      "status": "active",
      "role": "user",
      "emailVerified": true,
      "phoneVerified": false,
      "twoFactorEnabled": false,
      "lastLoginAt": "2024-01-15T23:05:00Z"
    },
    "session": {
      "id": "session-789",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh-abc123def456",
      "expiresAt": "2024-01-16T23:05:00Z",
      "type": "web"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-abc123def456",
    "expiresAt": "2024-01-16T23:05:00Z",
    "requiresTwoFactor": false,
    "message": "Login successful"
  },
  "message": "Authentication successful"
}
```

### Two-Factor Authentication

Handle 2FA authentication.

**Endpoint**: `POST /api/auth/2fa/verify`

**Headers**:
- `Content-Type: application/json`

**Request Body**:
```json
{
  "code": "123456",
  "rememberDevice": true
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/2fa/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456",
    "rememberDevice": true
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "verified": true,
    "deviceRemembered": true,
    "session": {
      "id": "session-789",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh-abc123def456",
      "expiresAt": "2024-01-16T23:05:00Z"
    },
    "message": "Two-factor authentication successful"
  },
  "message": "2FA verification successful"
}
```

### Password Reset

Request password reset.

**Endpoint**: `POST /api/auth/password/reset`

**Headers**:
- `Content-Type: application/json`

**Request Body**: `PasswordResetRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/password/reset" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "resetToken": "reset-abc123def456",
    "expiresAt": "2024-01-16T23:00:00Z",
    "message": "Password reset email sent successfully",
    "instructions": [
      "Check your email for password reset instructions",
      "Click the reset link in the email",
      "Create a new secure password",
      "The reset link expires in 24 hours"
    ]
  },
  "message": "Password reset initiated"
}
```

### Password Change

Change user password.

**Endpoint**: `POST /api/auth/password/change`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)
- `Content-Type: application/json`

**Request Body**: `PasswordChangeRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/password/change" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePassword123!",
    "newPassword": "NewSecurePassword456!",
    "confirmPassword": "NewSecurePassword456!",
    "requireCurrentPassword": true
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "passwordChanged": true,
    "changedAt": "2024-01-15T23:10:00Z",
    "nextPasswordChange": "2024-01-22T23:10:00Z",
    "message": "Password changed successfully",
    "recommendations": [
      "Enable two-factor authentication",
      "Use a password manager",
      "Enable login notifications"
    ]
  },
  "message": "Password changed successfully"
}
```

### Account Verification

Verify user email address.

**Endpoint**: `POST /api/auth/verify/email`

**Headers**:
- `Content-Type: application/json`

**Request Body**:
```json
{
  "token": "verify-abc123def456"
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/verify/email" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verify-abc123def456"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "verified": true,
    "email": "john.doe@example.com",
    "verifiedAt": "2024-01-15T23:15:00Z",
    "message": "Email verified successfully",
    "nextSteps": [
      "Complete your profile",
      "Enable two-factor authentication",
      "Explore available features"
    ]
  },
  "message": "Email verification successful"
}
```

### OAuth Login

Authenticate with OAuth provider.

**Endpoint**: `POST /api/auth/oauth/:provider`

**Headers**:
- `Content-Type: application/json`

**Path Parameters**:
- `provider`: OAuth provider name

**Request Body**: `OAuthRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/oauth/google" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "4/0AfJohXn...",
    "state": "random-state-string",
    "redirectUri": "http://localhost:3000/auth/callback"
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
      "email": "john.doe@gmail.com",
      "firstName": "John",
      "lastName": "Doe",
      "displayName": "John Doe",
      "avatar": "https://lh3.googleusercontent.com/...",
      "status": "active",
      "role": "user",
      "emailVerified": true
    },
    "session": {
      "id": "session-789",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "refresh-abc123def456",
      "expiresAt": "2024-01-16T23:20:00Z"
    },
    "provider": "google",
    "linked": true,
    "message": "OAuth authentication successful"
  },
  "message": "OAuth login successful"
}
```

### User Logout

End user session.

**Endpoint**: `POST /api/auth/logout`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Request Body**:
```json
{
  "allSessions": false,
  "reason": "user_logout"
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/logout" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "allSessions": false,
    "reason": "user_logout"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "loggedOut": true,
    "sessionId": "session-789",
    "loggedOutAt": "2024-01-15T23:25:00Z",
    "reason": "user_logout",
    "message": "Logout successful"
  },
  "message": "Logout successful"
}
```

### Enable Two-Factor Authentication

Setup 2FA for user account.

**Endpoint**: `POST /api/auth/2fa/enable`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)
- `Content-Type: application/json`

**Request Body**:
```json
{
  "type": "totp",
  "method": "authenticator"
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/auth/2fa/enable" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "totp",
    "method": "authenticator"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "type": "totp",
    "method": "authenticator",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "secret": "JBSWY3DPEHPK3PXP",
    "backupCodes": [
      "12345678",
      "87654321",
      "11223344",
      "44332211"
    ],
    "setupComplete": false,
    "message": "Two-factor authentication enabled",
    "nextSteps": [
      "Scan QR code with authenticator app",
      "Enter the 6-digit code to verify setup",
      "Save backup codes in a secure location"
    ]
  },
  "message": "2FA enabled successfully"
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
- `INVALID_CREDENTIALS`: Invalid username/password
- `ACCOUNT_LOCKED`: Account is locked
- `ACCOUNT_SUSPENDED`: Account is suspended
- `EMAIL_NOT_VERIFIED`: Email not verified
- `PHONE_NOT_VERIFIED`: Phone not verified
- `TWO_FACTOR_REQUIRED`: 2FA code required
- `INVALID_2FA_CODE`: Invalid 2FA code
- `PASSWORD_TOO_WEAK`: Password doesn't meet requirements
- `USERNAME_TAKEN`: Username already exists
- `EMAIL_TAKEN`: Email already exists
- `INVALID_TOKEN`: Invalid or expired token
- `RATE_LIMIT_EXCEEDED`: Too many attempts
- `CAPTCHA_REQUIRED`: CAPTCHA verification required
- `OAUTH_ERROR`: OAuth authentication failed

## 🔐 Authentication & Authorization

### Required Headers
```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Permission Requirements
- **Public Endpoints**: Registration, login, password reset
- **Authenticated Endpoints**: Password change, profile updates, 2FA setup
- **Admin Endpoints**: User management, role management, system settings

## 📈 Rate Limiting

### Rate Limits
- **Login Attempts**: 5 attempts per 15 minutes per IP
- **Registration**: 3 accounts per hour per IP
- **Password Reset**: 3 requests per hour per email
- **2FA Verification**: 10 attempts per 15 minutes per user
- **OAuth Requests**: 20 requests per hour per IP

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
import { AICodingAssistantAPI } from '@ai-coding-assistant/sdk';

const api = new AICodingAssistantAPI({
  baseURL: 'http://localhost:3001'
});

// User registration
const registration = await api.auth.register({
  username: 'johndoe',
  email: 'john.doe@example.com',
  password: 'SecurePassword123!',
  firstName: 'John',
  lastName: 'Doe',
  acceptTerms: true
});

// User login
const login = await api.auth.login({
  identifier: 'johndoe',
  password: 'SecurePassword123!',
  rememberMe: true
});

// Enable 2FA
const twoFactor = await api.auth.enable2FA({
  type: 'totp',
  method: 'authenticator'
});

// Change password
await api.auth.changePassword({
  currentPassword: 'SecurePassword123!',
  newPassword: 'NewSecurePassword456!',
  confirmPassword: 'NewSecurePassword456!'
});
```

### Python
```python
from ai_coding_assistant import AICodingAssistantAPI

api = AICodingAssistantAPI(base_url="http://localhost:3001")

# User registration
registration = api.auth.register(
    username="johndoe",
    email="john.doe@example.com",
    password="SecurePassword123!",
    first_name="John",
    last_name="Doe",
    accept_terms=True
)

# User login
login = api.auth.login(
    identifier="johndoe",
    password="SecurePassword123!",
    remember_me=True
)

# Enable 2FA
two_factor = api.auth.enable_2fa(
    type="totp",
    method="authenticator"
)

# Change password
api.auth.change_password(
    current_password="SecurePassword123!",
    new_password="NewSecurePassword456!",
    confirm_password="NewSecurePassword456!"
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
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "acceptTerms": true
  }'
```

### Test User Login
```bash
# Test user login
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "testuser",
    "password": "TestPassword123!"
  }'
```

### Test Password Reset
```bash
# Test password reset request
curl -X POST "http://localhost:3001/api/auth/password/reset" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## 🔧 Configuration

### Environment Variables
```bash
# Authentication configuration
AUTH_SECRET=your-auth-secret-key
AUTH_JWT_SECRET=your-jwt-secret-key
AUTH_JWT_EXPIRY=86400
AUTH_REFRESH_TOKEN_EXPIRY=604800
AUTH_PASSWORD_MIN_LENGTH=8
AUTH_PASSWORD_REQUIRE_UPPERCASE=true
AUTH_PASSWORD_REQUIRE_LOWERCASE=true
AUTH_PASSWORD_REQUIRE_NUMBERS=true
AUTH_PASSWORD_REQUIRE_SYMBOLS=true
AUTH_MAX_LOGIN_ATTEMPTS=5
AUTH_LOCKOUT_DURATION=900
AUTH_EMAIL_VERIFICATION_REQUIRED=true
AUTH_PHONE_VERIFICATION_REQUIRED=false
AUTH_TWO_FACTOR_ENABLED=true
AUTH_OAUTH_ENABLED=true
```

### Server Configuration
```javascript
// Authentication configuration
const authConfig = {
  secret: process.env.AUTH_SECRET || 'default-secret',
  jwt: {
    secret: process.env.AUTH_JWT_SECRET || 'default-jwt-secret',
    expiry: parseInt(process.env.AUTH_JWT_EXPIRY) || 86400,
    refreshExpiry: parseInt(process.env.AUTH_REFRESH_TOKEN_EXPIRY) || 604800
  },
  password: {
    minLength: parseInt(process.env.AUTH_PASSWORD_MIN_LENGTH) || 8,
    requireUppercase: process.env.AUTH_PASSWORD_REQUIRE_UPPERCASE === 'true',
    requireLowercase: process.env.AUTH_PASSWORD_REQUIRE_LOWERCASE === 'true',
    requireNumbers: process.env.AUTH_PASSWORD_REQUIRE_NUMBERS === 'true',
    requireSymbols: process.env.AUTH_PASSWORD_REQUIRE_SYMBOLS === 'true'
  },
  security: {
    maxLoginAttempts: parseInt(process.env.AUTH_MAX_LOGIN_ATTEMPTS) || 5,
    lockoutDuration: parseInt(process.env.AUTH_LOCKOUT_DURATION) || 900,
    emailVerificationRequired: process.env.AUTH_EMAIL_VERIFICATION_REQUIRED === 'true',
    phoneVerificationRequired: process.env.AUTH_PHONE_VERIFICATION_REQUIRED === 'true',
    twoFactorEnabled: process.env.AUTH_TWO_FACTOR_ENABLED === 'true',
    oauthEnabled: process.env.AUTH_OAUTH_ENABLED === 'true'
  }
};
```

---

## 🎉 Ready to Use Authentication API!

You now have comprehensive information about the Authentication API. Start implementing secure user authentication, multi-factor authentication, and OAuth integration with our powerful authentication endpoints.

**Happy authenticating! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This API documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*