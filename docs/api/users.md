# Users API

The Users API provides comprehensive user management capabilities within AI Coding Assistant, including user profiles, preferences, settings, and administrative operations.

## 📋 Overview

The Users API allows you to:
- Manage user profiles and information
- Update user preferences and settings
- Handle user roles and permissions
- Manage user subscriptions and billing
- Handle user data export and deletion
- Implement user search and filtering
- Manage user relationships and teams
- Handle user activity and statistics
- Implement user notifications and preferences

## 🔗 Base Endpoint

```
GET/POST/PUT/DELETE /api/users
```

## 📚 Available Endpoints

### User Management
- **[Get User Profile](#get-user-profile)** - Retrieve user profile information
- **[Update User Profile](#update-user-profile)** - Update user profile data
- **[Delete User Account](#delete-user-account)** - Remove user account
- **[List Users](#list-users)** - Get list of users (admin only)
- **[Search Users](#search-users)** - Search users by criteria

### Profile Operations
- **[Profile Picture](#profile-picture)** - Manage user avatar and images
- **[User Preferences](#user-preferences)** - Manage user settings
- **[User Settings](#user-settings)** - Configure user options
- **[User Metadata](#user-metadata)** - Handle custom user data

### Administrative Features
- **[User Roles](#user-roles)** - Manage user roles and permissions
- **[User Status](#user-status)** - Control user account status
- **[User Billing](#user-billing)** - Handle subscription management
- **[User Analytics](#user-analytics)** - View user statistics

### Advanced Features
- **[User Teams](#user-teams)** - Manage team memberships
- **[User Relationships](#user-relationships)** - Handle user connections
- **[User Activity](#user-activity)** - Track user behavior
- **[User Export](#user-export)** - Export user data

## 📊 Data Models

### User Profile Object
```typescript
interface UserProfile {
  id: string;                      // Unique user identifier
  username: string;                // Username (unique)
  email: string;                   // Email address (unique)
  firstName: string;               // First name
  lastName: string;                // Last name
  displayName: string;             // Display name
  avatar?: string;                 // Avatar image URL
  bio?: string;                    // User biography
  status: UserStatus;              // Account status
  role: UserRole;                  // User role
  permissions: Permission[];        // User permissions
  createdAt: string;               // Account creation timestamp
  updatedAt: string;               // Last update timestamp
  lastLoginAt?: string;            // Last login timestamp
  lastSeenAt?: string;             // Last activity timestamp
  emailVerified: boolean;          // Email verification status
  phoneVerified: boolean;          // Phone verification status
  twoFactorEnabled: boolean;       // 2FA status
  profile: ProfileDetails;          // Detailed profile information
  preferences: UserPreferences;    // User preferences
  settings: UserSettings;          // User settings
  metadata: UserMetadata;          // Additional user data
  statistics: UserStatistics;      // User statistics
  relationships: UserRelationships; // User relationships
}

interface ProfileDetails {
  title?: string;                  // Job title
  company?: string;                // Company name
  department?: string;             // Department
  location?: string;               // Physical location
  timezone: string;                // Timezone
  website?: string;                // Personal website
  phone?: string;                  // Phone number
  birthday?: string;               // Date of birth
  gender?: string;                 // Gender
  languages: string[];             // Spoken languages
  skills: Skill[];                 // User skills
  experience: Experience[];        // Work experience
  education: Education[];          // Education history
  certifications: Certification[]; // Professional certifications
  socialLinks: SocialLinks;        // Social media profiles
}

interface Skill {
  name: string;                    // Skill name
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;       // Years of experience
  category: string;                // Skill category
  verified: boolean;               // Skill verification status
  endorsements: number;            // Number of endorsements
}

interface Experience {
  id: string;                      // Experience identifier
  title: string;                   // Job title
  company: string;                 // Company name
  location?: string;               // Job location
  startDate: string;               // Start date
  endDate?: string;                // End date (null for current)
  description: string;             // Job description
  achievements: string[];          // Key achievements
  technologies: string[];          // Technologies used
  current: boolean;                // Current position
}

interface Education {
  id: string;                      // Education identifier
  degree: string;                  // Degree name
  field: string;                   // Field of study
  institution: string;             // Educational institution
  location?: string;               // Institution location
  startDate: string;               // Start date
  endDate?: string;                // End date
  gpa?: number;                    // Grade point average
  honors?: string[];               // Academic honors
  description?: string;            // Additional details
}

interface Certification {
  id: string;                      // Certification identifier
  name: string;                    // Certification name
  issuer: string;                  // Issuing organization
  issueDate: string;               // Issue date
  expiryDate?: string;             // Expiry date
  credentialId?: string;           // Credential identifier
  verificationUrl?: string;        // Verification URL
  description?: string;            // Certification description
}

interface UserPreferences {
  language: string;                // Preferred language
  timezone: string;                // Preferred timezone
  theme: 'light' | 'dark' | 'auto';
  dateFormat: string;              // Date format preference
  timeFormat: '12h' | '24h';       // Time format preference
  currency: string;                // Preferred currency
  units: 'metric' | 'imperial';    // Unit system preference
  notifications: NotificationSettings; // Notification preferences
  privacy: PrivacySettings;        // Privacy preferences
  accessibility: AccessibilitySettings; // Accessibility settings
  display: DisplaySettings;        // Display preferences
  communication: CommunicationSettings; // Communication preferences
}

interface NotificationSettings {
  email: boolean;                  // Email notifications
  push: boolean;                   // Push notifications
  sms: boolean;                    // SMS notifications
  inApp: boolean;                  // In-app notifications
  frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  categories: NotificationCategory[]; // Notification categories
  quietHours: QuietHours;          // Quiet hours settings
  channels: NotificationChannel[]; // Notification channels
}

interface NotificationCategory {
  type: string;                    // Category type
  enabled: boolean;                // Category enabled
  email: boolean;                  // Email for category
  push: boolean;                   // Push for category
  sms: boolean;                    // SMS for category
  inApp: boolean;                  // In-app for category
}

interface QuietHours {
  enabled: boolean;                // Quiet hours enabled
  startTime: string;               // Start time (HH:MM)
  endTime: string;                 // End time (HH:MM)
  timezone: string;                // Timezone for quiet hours
  days: string[];                  // Days of week
}

interface NotificationChannel {
  type: string;                    // Channel type
  enabled: boolean;                // Channel enabled
  config: Record<string, any>;     // Channel configuration
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends' | 'custom';
  emailVisibility: 'public' | 'private' | 'friends';
  phoneVisibility: 'public' | 'private' | 'friends';
  locationVisibility: 'public' | 'private' | 'friends';
  activityVisibility: 'public' | 'private' | 'friends';
  searchable: boolean;             // Appear in search results
  allowMessages: boolean;          // Allow direct messages
  allowFriendRequests: boolean;    // Allow friend requests
  dataCollection: boolean;         // Allow data collection
  analytics: boolean;              // Allow analytics
  marketing: boolean;              // Allow marketing
  thirdParty: boolean;             // Allow third-party services
  dataRetention: number;           // Data retention days
}

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrast: 'normal' | 'high' | 'inverted';
  animations: boolean;              // Enable animations
  screenReader: boolean;            // Screen reader support
  keyboardNavigation: boolean;      // Keyboard navigation
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  motionReduction: boolean;         // Reduce motion
  highContrast: boolean;            // High contrast mode
  focusIndicator: boolean;          // Focus indicators
}

interface DisplaySettings {
  compactMode: boolean;             // Compact display mode
  sidebarCollapsed: boolean;        // Sidebar collapsed by default
  showAvatars: boolean;             // Show user avatars
  showOnlineStatus: boolean;        // Show online status
  showTypingIndicators: boolean;    // Show typing indicators
  showReadReceipts: boolean;        // Show read receipts
  autoSave: boolean;                // Auto-save changes
  autoRefresh: boolean;             // Auto-refresh content
  showHelpTooltips: boolean;        // Show help tooltips
}

interface CommunicationSettings {
  autoReply: boolean;               // Enable auto-reply
  autoReplyMessage?: string;        // Auto-reply message
  awayMessage?: string;             // Away message
  doNotDisturb: boolean;            // Do not disturb mode
  allowMentions: boolean;           // Allow @mentions
  allowTags: boolean;               // Allow user tagging
  allowInvites: boolean;            // Allow invitations
  allowSharing: boolean;            // Allow content sharing
}

interface UserSettings {
  security: SecuritySettings;       // Security settings
  billing: BillingSettings;         // Billing settings
  integrations: IntegrationSettings; // Integration settings
  advanced: AdvancedSettings;       // Advanced settings
}

interface SecuritySettings {
  passwordPolicy: PasswordPolicy;   // Password requirements
  sessionTimeout: number;           // Session timeout (minutes)
  maxSessions: number;              // Maximum active sessions
  requireReauth: boolean;           // Require re-authentication
  loginNotifications: boolean;      // Login notifications
  suspiciousActivity: boolean;      // Suspicious activity alerts
  dataExport: boolean;              // Allow data export
  dataDeletion: boolean;            // Allow data deletion
}

interface PasswordPolicy {
  minLength: number;                // Minimum length
  requireUppercase: boolean;        // Require uppercase
  requireLowercase: boolean;        // Require lowercase
  requireNumbers: boolean;          // Require numbers
  requireSymbols: boolean;          // Require symbols
  preventCommon: boolean;           // Prevent common passwords
  preventReuse: boolean;            // Prevent password reuse
  expiryDays: number;               // Password expiry days
}

interface BillingSettings {
  autoRenew: boolean;               // Auto-renew subscription
  paymentMethod: PaymentMethod;     // Payment method
  billingAddress: Address;          // Billing address
  taxInformation: TaxInfo;          // Tax information
  invoices: InvoiceSettings;        // Invoice preferences
  usageAlerts: UsageAlert[];        // Usage alerts
}

interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  last4?: string;                   // Last 4 digits
  brand?: string;                    // Card brand
  expiryMonth?: number;             // Expiry month
  expiryYear?: number;              // Expiry year
  isDefault: boolean;               // Default payment method
}

interface Address {
  street: string;                   // Street address
  city: string;                     // City
  state: string;                    // State/province
  postalCode: string;               // Postal code
  country: string;                  // Country
  isDefault: boolean;               // Default address
}

interface TaxInfo {
  taxId?: string;                   // Tax identification number
  taxExempt: boolean;               // Tax exempt status
  taxExemptionReason?: string;      // Tax exemption reason
  vatNumber?: string;               // VAT number
}

interface InvoiceSettings {
  emailInvoices: boolean;           // Email invoices
  paperInvoices: boolean;           // Paper invoices
  autoPay: boolean;                 // Auto-pay invoices
  paymentTerms: number;             // Payment terms (days)
  currency: string;                 // Invoice currency
}

interface UsageAlert {
  type: string;                     // Alert type
  threshold: number;                // Threshold value
  enabled: boolean;                 // Alert enabled
  email: boolean;                   // Email alert
  push: boolean;                    // Push alert
}

interface IntegrationSettings {
  github?: GitHubIntegration;       // GitHub integration
  gitlab?: GitLabIntegration;       // GitLab integration
  slack?: SlackIntegration;         // Slack integration
  discord?: DiscordIntegration;     // Discord integration
  email?: EmailIntegration;         // Email integration
  calendar?: CalendarIntegration;   // Calendar integration
}

interface GitHubIntegration {
  enabled: boolean;                 // Integration enabled
  username?: string;                // GitHub username
  accessToken?: string;             // Access token
  repositories: string[];           // Connected repositories
  webhooks: boolean;                // Webhook integration
  notifications: boolean;            // GitHub notifications
}

interface UserMetadata {
  tags: string[];                   // User tags
  categories: string[];             // User categories
  interests: string[];              // User interests
  expertise: string[];              // Areas of expertise
  availability: Availability;       // Availability information
  preferences: Record<string, any>; // Custom preferences
  custom: Record<string, any>;      // Custom metadata
}

interface Availability {
  status: 'available' | 'busy' | 'away' | 'offline';
  message?: string;                 // Status message
  until?: string;                   // Available until
  timezone: string;                 // Timezone
  workingHours: WorkingHours[];     // Working hours
  exceptions: AvailabilityException[]; // Availability exceptions
}

interface WorkingHours {
  day: string;                      // Day of week
  startTime: string;                // Start time
  endTime: string;                  // End time
  available: boolean;               // Available on this day
}

interface AvailabilityException {
  date: string;                     // Exception date
  startTime: string;                // Start time
  endTime: string;                  // End time
  available: boolean;               // Available during exception
  reason?: string;                  // Exception reason
}

interface UserStatistics {
  profileViews: number;             // Profile view count
  lastProfileView?: string;         // Last profile view
  connections: number;              // Connection count
  followers: number;                // Follower count
  following: number;                // Following count
  projects: number;                 // Project count
  contributions: number;             // Contribution count
  activityScore: number;            // Activity score
  reputation: number;               // Reputation score
  badges: Badge[];                  // User badges
  achievements: Achievement[];       // User achievements
}

interface Badge {
  id: string;                       // Badge identifier
  name: string;                     // Badge name
  description: string;              // Badge description
  icon: string;                     // Badge icon
  category: string;                 // Badge category
  earnedAt: string;                 // Earned timestamp
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Achievement {
  id: string;                       // Achievement identifier
  name: string;                     // Achievement name
  description: string;              // Achievement description
  icon: string;                     // Achievement icon
  category: string;                 // Achievement category
  earnedAt: string;                 // Earned timestamp
  progress: number;                 // Progress percentage
  maxProgress: number;              // Maximum progress
}

interface UserRelationships {
  teams: TeamMembership[];          // Team memberships
  connections: Connection[];         // User connections
  followers: Follower[];            // User followers
  following: Following[];            // Users being followed
  mentors: Mentor[];                // User mentors
  mentees: Mentee[];                // User mentees
  collaborators: Collaborator[];     // Project collaborators
}

interface TeamMembership {
  teamId: string;                   // Team identifier
  teamName: string;                 // Team name
  role: TeamRole;                   // Team role
  joinedAt: string;                 // Joined timestamp
  permissions: TeamPermission[];     // Team permissions
}

enum TeamRole {
  'member' = 'member',
  'moderator' = 'moderator',
  'admin' = 'admin',
  'owner' = 'owner'
}

interface TeamPermission {
  resource: string;                 // Resource name
  action: string;                   // Action type
  conditions?: Record<string, any>; // Permission conditions
}

interface Connection {
  userId: string;                   // Connected user ID
  username: string;                 // Connected username
  displayName: string;              // Connected display name
  avatar?: string;                  // Connected user avatar
  connectedAt: string;              // Connection timestamp
  mutual: boolean;                  // Mutual connection
  tags: string[];                   // Connection tags
}

interface Follower {
  userId: string;                   // Follower user ID
  username: string;                 // Follower username
  displayName: string;              // Follower display name
  avatar?: string;                  // Follower avatar
  followedAt: string;               // Follow timestamp
  notifications: boolean;            // Follower notifications
}

interface Following {
  userId: string;                   // Following user ID
  username: string;                 // Following username
  displayName: string;              // Following display name
  avatar?: string;                  // Following avatar
  followedAt: string;               // Follow timestamp
  notifications: boolean;            // Following notifications
}

interface Mentor {
  userId: string;                   // Mentor user ID
  username: string;                 // Mentor username
  displayName: string;              // Mentor display name
  avatar?: string;                  // Mentor avatar
  expertise: string[];              // Mentor expertise
  startedAt: string;                // Mentorship start
  status: 'active' | 'completed' | 'paused';
}

interface Mentee {
  userId: string;                   // Mentee user ID
  username: string;                 // Mentee username
  displayName: string;              // Mentee display name
  avatar?: string;                  // Mentee avatar
  learningGoals: string[];          // Learning goals
  startedAt: string;                // Mentorship start
  status: 'active' | 'completed' | 'paused';
}

interface Collaborator {
  userId: string;                   // Collaborator user ID
  username: string;                 // Collaborator username
  displayName: string;              // Collaborator display name
  avatar?: string;                  // Collaborator avatar
  projectId: string;                // Project identifier
  projectName: string;              // Project name
  role: string;                     // Collaboration role
  joinedAt: string;                 // Joined timestamp
}
```

### User Request Objects
```typescript
interface UpdateProfileRequest {
  firstName?: string;               // Updated first name
  lastName?: string;                // Updated last name
  displayName?: string;             // Updated display name
  bio?: string;                     // Updated biography
  title?: string;                   // Updated job title
  company?: string;                 // Updated company
  location?: string;                // Updated location
  website?: string;                 // Updated website
  phone?: string;                   // Updated phone
  birthday?: string;                // Updated birthday
  gender?: string;                  // Updated gender
  languages?: string[];             // Updated languages
  skills?: Skill[];                 // Updated skills
  experience?: Experience[];        // Updated experience
  education?: Education[];          // Updated education
  certifications?: Certification[]; // Updated certifications
  socialLinks?: SocialLinks;        // Updated social links
}

interface UpdatePreferencesRequest {
  language?: string;                // Updated language
  timezone?: string;                // Updated timezone
  theme?: 'light' | 'dark' | 'auto';
  dateFormat?: string;              // Updated date format
  timeFormat?: '12h' | '24h';       // Updated time format
  currency?: string;                // Updated currency
  units?: 'metric' | 'imperial';    // Updated units
  notifications?: Partial<NotificationSettings>; // Updated notifications
  privacy?: Partial<PrivacySettings>; // Updated privacy
  accessibility?: Partial<AccessibilitySettings>; // Updated accessibility
  display?: Partial<DisplaySettings>; // Updated display
  communication?: Partial<CommunicationSettings>; // Updated communication
}

interface UserSearchRequest {
  query?: string;                   // Search query
  filters?: {
    role?: UserRole;                // Filter by role
    status?: UserStatus;            // Filter by status
    location?: string;              // Filter by location
    skills?: string[];              // Filter by skills
    expertise?: string[];           // Filter by expertise
    availability?: string;          // Filter by availability
    verified?: boolean;             // Filter by verification
    twoFactor?: boolean;            // Filter by 2FA status
  };
  options?: {
    includeInactive?: boolean;      // Include inactive users
    includeDeleted?: boolean;       // Include deleted users
    sortBy?: string;                // Sort field
    sortOrder?: 'asc' | 'desc';     // Sort order
    limit?: number;                 // Maximum results
    offset?: number;                // Results offset
  };
}
```

## 🚀 API Endpoints

### Get User Profile

Retrieve user profile information.

**Endpoint**: `GET /api/users/:userId`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Path Parameters**:
- `userId`: User identifier or 'me' for current user

**Query Parameters**:
- `includeRelationships` (optional): Include user relationships (default: false)
- `includeStatistics` (optional): Include user statistics (default: false)
- `includeMetadata` (optional): Include user metadata (default: true)

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/users/me?includeRelationships=true&includeStatistics=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "displayName": "John Doe",
    "avatar": "https://example.com/avatars/johndoe.jpg",
    "bio": "Full-stack developer passionate about AI and web technologies",
    "status": "active",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T23:00:00Z",
    "lastLoginAt": "2024-01-15T23:00:00Z",
    "emailVerified": true,
    "twoFactorEnabled": true,
    "profile": {
      "title": "Senior Software Developer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "timezone": "America/Los_Angeles",
      "website": "https://johndoe.dev",
      "skills": [
        {
          "name": "JavaScript",
          "level": "expert",
          "yearsOfExperience": 8,
          "category": "Programming",
          "verified": true,
          "endorsements": 45
        }
      ],
      "experience": [
        {
          "id": "exp-123",
          "title": "Senior Software Developer",
          "company": "Tech Corp",
          "startDate": "2022-01-01",
          "current": true,
          "description": "Leading development of AI-powered applications"
        }
      ]
    },
    "preferences": {
      "language": "en",
      "timezone": "America/Los_Angeles",
      "theme": "dark",
      "notifications": {
        "email": true,
        "push": true,
        "frequency": "immediate"
      }
    },
    "statistics": {
      "profileViews": 156,
      "connections": 23,
      "projects": 12,
      "activityScore": 87,
      "reputation": 1250
    },
    "relationships": {
      "teams": [
        {
          "teamId": "team-123",
          "teamName": "AI Development Team",
          "role": "member",
          "joinedAt": "2023-01-01T00:00:00Z"
        }
      ]
    }
  },
  "message": "User profile retrieved successfully"
}
```

### Update User Profile

Update user profile information.

**Endpoint**: `PUT /api/users/:userId`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)
- `Content-Type: application/json`

**Path Parameters**:
- `userId`: User identifier or 'me' for current user

**Request Body**: `UpdateProfileRequest`

**Request Example**:
```bash
curl -X PUT "http://localhost:3001/api/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio with new information",
    "title": "Lead Software Developer",
    "company": "New Tech Corp",
    "location": "San Francisco, CA",
    "skills": [
      {
        "name": "React",
        "level": "expert",
        "yearsOfExperience": 6,
        "category": "Frontend",
        "verified": true,
        "endorsements": 32
      }
    ]
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "updatedAt": "2024-01-15T23:30:00Z",
    "profile": {
      "bio": "Updated bio with new information",
      "title": "Lead Software Developer",
      "company": "New Tech Corp",
      "location": "San Francisco, CA",
      "skills": [
        {
          "name": "React",
          "level": "expert",
          "yearsOfExperience": 6,
          "category": "Frontend",
          "verified": true,
          "endorsements": 32
        }
      ]
    },
    "changes": [
      "Updated biography",
      "Updated job title",
      "Updated company",
      "Updated location",
      "Added React skill"
    ]
  },
  "message": "Profile updated successfully"
}
```

### Update User Preferences

Update user preferences and settings.

**Endpoint**: `PUT /api/users/:userId/preferences`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)
- `Content-Type: application/json`

**Path Parameters**:
- `userId`: User identifier or 'me' for current user

**Request Body**: `UpdatePreferencesRequest`

**Request Example**:
```bash
curl -X PUT "http://localhost:3001/api/users/me/preferences" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "notifications": {
      "frequency": "daily",
      "quietHours": {
        "enabled": true,
        "startTime": "22:00",
        "endTime": "08:00"
      }
    },
    "privacy": {
      "profileVisibility": "public",
      "searchable": true
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "updatedAt": "2024-01-15T23:35:00Z",
    "preferences": {
      "theme": "dark",
      "notifications": {
        "frequency": "daily",
        "quietHours": {
          "enabled": true,
          "startTime": "22:00",
          "endTime": "08:00"
        }
      },
      "privacy": {
        "profileVisibility": "public",
        "searchable": true
      }
    },
    "changes": [
      "Updated theme to dark",
      "Updated notification frequency to daily",
      "Enabled quiet hours",
      "Updated privacy settings"
    ]
  },
  "message": "Preferences updated successfully"
}
```

### List Users

Get list of users (admin only).

**Endpoint**: `GET /api/users`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required, admin role)

**Query Parameters**:
- `role` (optional): Filter by user role
- `status` (optional): Filter by user status
- `limit` (optional): Maximum results (default: 20)
- `offset` (optional): Results offset (default: 0)
- `sortBy` (optional): Sort field (default: 'createdAt')
- `sortOrder` (optional): Sort order (default: 'desc')

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/users?role=user&status=active&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-123",
        "username": "johndoe",
        "email": "john.doe@example.com",
        "displayName": "John Doe",
        "status": "active",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00Z",
        "lastLoginAt": "2024-01-15T23:00:00Z",
        "profile": {
          "title": "Lead Software Developer",
          "company": "New Tech Corp",
          "location": "San Francisco, CA"
        }
      }
    ],
    "pagination": {
      "total": 156,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  },
  "message": "Users retrieved successfully"
}
```

### Search Users

Search users by criteria.

**Endpoint**: `POST /api/users/search`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)
- `Content-Type: application/json`

**Request Body**: `UserSearchRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/users/search" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "React developer",
    "filters": {
      "skills": ["React", "JavaScript"],
      "location": "San Francisco",
      "availability": "available"
    },
    "options": {
      "limit": 20,
      "sortBy": "reputation",
      "sortOrder": "desc"
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "query": "React developer",
    "totalResults": 45,
    "results": [
      {
        "id": "user-123",
        "username": "johndoe",
        "displayName": "John Doe",
        "avatar": "https://example.com/avatars/johndoe.jpg",
        "profile": {
          "title": "Lead Software Developer",
          "company": "New Tech Corp",
          "location": "San Francisco, CA",
          "skills": [
            {
              "name": "React",
              "level": "expert",
              "verified": true
            }
          ]
        },
        "statistics": {
          "reputation": 1250,
          "activityScore": 87
        },
        "relevance": 0.95
      }
    ],
    "facets": {
      "skills": {
        "React": 23,
        "JavaScript": 45
      },
      "locations": {
        "San Francisco": 12,
        "New York": 8
      }
    }
  },
  "message": "User search completed successfully"
}
```

### Delete User Account

Remove user account.

**Endpoint**: `DELETE /api/users/:userId`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Path Parameters**:
- `userId`: User identifier or 'me' for current user

**Request Body**:
```json
{
  "reason": "User requested deletion",
  "exportData": true,
  "anonymizeData": false,
  "confirmPassword": "SecurePassword123!"
}
```

**Request Example**:
```bash
curl -X DELETE "http://localhost:3001/api/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "User requested deletion",
    "exportData": true,
    "anonymizeData": false,
    "confirmPassword": "SecurePassword123!"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "userId": "user-123",
    "deletedAt": "2024-01-15T23:40:00Z",
    "reason": "User requested deletion",
    "dataExported": true,
    "exportUrl": "https://example.com/exports/user-123-data.zip",
    "dataAnonymized": false,
    "message": "Account deleted successfully"
  },
  "message": "User account deleted successfully"
}
```

### Upload Profile Picture

Upload user profile picture.

**Endpoint**: `POST /api/users/:userId/avatar`

**Headers**:
- `Authorization: Bearer YOUR_TOKEN` (required)

**Path Parameters**:
- `userId`: User identifier or 'me' for current user

**Request Body**: `FormData` with image file

**Form Data Fields**:
- `avatar`: Image file (JPG, PNG, GIF)
- `cropData` (optional): Cropping information

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/users/me/avatar" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "avatar=@/path/to/profile-picture.jpg" \
  -F "cropData={\"x\":0,\"y\":0,\"width\":400,\"height\":400}"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "avatar": {
      "url": "https://example.com/avatars/user-123.jpg",
      "thumbnail": "https://example.com/avatars/user-123-thumb.jpg",
      "size": 102400,
      "dimensions": {
        "width": 400,
        "height": 400
      },
      "format": "jpg",
      "uploadedAt": "2024-01-15T23:45:00Z"
    },
    "message": "Profile picture uploaded successfully"
  },
  "message": "Avatar updated successfully"
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
- `USER_NOT_FOUND`: User not found
- `INSUFFICIENT_PERMISSIONS`: Insufficient permissions
- `PROFILE_UPDATE_FAILED`: Profile update failed
- `AVATAR_UPLOAD_FAILED`: Avatar upload failed
- `INVALID_IMAGE_FORMAT`: Invalid image format
- `IMAGE_TOO_LARGE`: Image file too large
- `INVALID_USER_DATA`: Invalid user data
- `USERNAME_TAKEN`: Username already exists
- `EMAIL_TAKEN`: Email already exists
- `ACCOUNT_DELETION_FAILED`: Account deletion failed
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded

## 🔐 Authentication & Authorization

### Required Headers
```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Permission Requirements
- **Own Profile**: Users can view and edit their own profile
- **Other Profiles**: Users can view public profiles of other users
- **User Management**: Admin role required for user management operations
- **User Search**: Authenticated users can search for other users

## 📈 Rate Limiting

### Rate Limits
- **Profile Updates**: 10 updates per minute per user
- **Avatar Uploads**: 5 uploads per hour per user
- **User Searches**: 50 searches per minute per user
- **Profile Views**: 100 views per minute per user

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
import { AICodingAssistantAPI } from '@ai-coding-assistant/sdk';

const api = new AICodingAssistantAPI({
  baseURL: 'http://localhost:3001',
  token: 'your-jwt-token'
});

// Get user profile
const profile = await api.users.getProfile('me', {
  includeRelationships: true,
  includeStatistics: true
});

// Update profile
await api.users.updateProfile('me', {
  bio: 'Updated bio',
  title: 'Senior Developer',
  company: 'Tech Corp'
});

// Update preferences
await api.users.updatePreferences('me', {
  theme: 'dark',
  notifications: {
    frequency: 'daily'
  }
});

// Search users
const searchResults = await api.users.search({
  query: 'React developer',
  filters: {
    skills: ['React', 'JavaScript']
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

# Get user profile
profile = api.users.get_profile("me", {
    "include_relationships": True,
    "include_statistics": True
})

# Update profile
api.users.update_profile("me", {
    "bio": "Updated bio",
    "title": "Senior Developer",
    "company": "Tech Corp"
})

# Update preferences
api.users.update_preferences("me", {
    "theme": "dark",
    "notifications": {
        "frequency": "daily"
    }
})

# Search users
search_results = api.users.search({
    "query": "React developer",
    "filters": {
        "skills": ["React", "JavaScript"]
    }
})
```

## 🧪 Testing

### Test Profile Retrieval
```bash
# Test getting own profile
curl -X GET "http://localhost:3001/api/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test getting other user profile
curl -X GET "http://localhost:3001/api/users/user-123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Profile Updates
```bash
# Test updating profile
curl -X PUT "http://localhost:3001/api/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Test bio update",
    "title": "Test Title"
  }'

# Test updating preferences
curl -X PUT "http://localhost:3001/api/users/me/preferences" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "light",
    "language": "en"
  }'
```

### Test User Search
```bash
# Test user search
curl -X POST "http://localhost:3001/api/users/search" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "developer",
    "filters": {
      "skills": ["JavaScript"]
    }
  }'
```

## 🔧 Configuration

### Environment Variables
```bash
# User management configuration
USER_AVATAR_MAX_SIZE=5242880
USER_AVATAR_ALLOWED_FORMATS=jpg,jpeg,png,gif
USER_AVATAR_MAX_DIMENSIONS=1024x1024
USER_PROFILE_MAX_BIO_LENGTH=1000
USER_SEARCH_MAX_RESULTS=100
USER_EXPORT_ENABLED=true
USER_DELETION_ENABLED=true
USER_ANONYMIZATION_ENABLED=true
```

### Server Configuration
```javascript
// User management configuration
const userConfig = {
  avatar: {
    maxSize: parseInt(process.env.USER_AVATAR_MAX_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedFormats: process.env.USER_AVATAR_ALLOWED_FORMATS?.split(',') || ['jpg', 'jpeg', 'png', 'gif'],
    maxDimensions: process.env.USER_AVATAR_MAX_DIMENSIONS || '1024x1024',
    storagePath: '/workspace/uploads/avatars',
    thumbnailSizes: [150, 300, 600]
  },
  profile: {
    maxBioLength: parseInt(process.env.USER_PROFILE_MAX_BIO_LENGTH) || 1000,
    maxSkills: 50,
    maxExperience: 20,
    maxEducation: 10
  },
  search: {
    maxResults: parseInt(process.env.USER_SEARCH_MAX_RESULTS) || 100,
    enableFuzzySearch: true,
    enableFacetedSearch: true
  },
  export: {
    enabled: process.env.USER_EXPORT_ENABLED === 'true',
    formats: ['json', 'csv', 'xml'],
    includeSensitiveData: false
  },
  deletion: {
    enabled: process.env.USER_DELETION_ENABLED === 'true',
    requirePassword: true,
    anonymizeData: process.env.USER_ANONYMIZATION_ENABLED === 'true'
  }
};
```

---

## 🎉 Ready to Use Users API!

You now have comprehensive information about the Users API. Start managing user profiles, preferences, and relationships with our powerful user management endpoints.

**Happy user managing! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This API documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*