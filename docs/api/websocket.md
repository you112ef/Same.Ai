# WebSocket API

The WebSocket API provides real-time, bidirectional communication for AI Coding Assistant, enabling live updates, collaborative features, and instant notifications.

## 📋 Overview

The WebSocket API allows you to:
- Receive real-time updates about projects and files
- Send and receive AI chat messages instantly
- Collaborate with other users in real-time
- Get live notifications about system events
- Monitor project changes and updates
- Participate in interactive coding sessions

## 🔗 Connection

### WebSocket URL
```
ws://localhost:3001 (Development)
wss://your-domain.com (Production)
```

### Connection Options
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling'], // Fallback to polling if WebSocket fails
  autoConnect: true,                     // Automatically connect
  reconnection: true,                    // Enable reconnection
  reconnectionAttempts: 5,               // Max reconnection attempts
  reconnectionDelay: 1000,               // Delay between attempts
  timeout: 20000,                        // Connection timeout
  forceNew: false                        // Reuse existing connection
});
```

## 📚 Available Events

### Connection Events
- **[Connection](#connection-events)** - Socket connection management
- **[Authentication](#authentication-events)** - User authentication and sessions
- **[Error Handling](#error-events)** - Connection and authentication errors

### Project Events
- **[Project Updates](#project-events)** - Project creation, updates, and deletion
- **[File Operations](#file-events)** - File changes and operations
- **[Version Control](#version-events)** - Snapshot and version management

### AI Events
- **[AI Chat](#ai-events)** - Real-time AI conversations
- **[Code Generation](#code-generation-events)** - Live code generation updates
- **[AI Processing](#ai-processing-events)** - AI operation status updates

### User Events
- **[User Presence](#user-events)** - User online/offline status
- **[Collaboration](#collaboration-events)** - Multi-user collaboration
- **[Notifications](#notification-events)** - System and user notifications

## 📊 Event Structure

### Event Format
```typescript
interface SocketEvent {
  event: string;                    // Event name
  data: any;                       // Event data
  timestamp: string;               // Event timestamp (ISO 8601)
  userId?: string;                 // User ID (if applicable)
  projectId?: string;              // Project ID (if applicable)
  metadata?: EventMetadata;        // Additional event information
}

interface EventMetadata {
  source: string;                  // Event source
  priority: 'low' | 'medium' | 'high';
  tags?: string[];                 // Event tags
  correlationId?: string;          // Correlation ID for tracking
}
```

### Event Types
```typescript
enum EventType {
  // Connection events
  'connect' = 'connect',
  'disconnect' = 'disconnect',
  'reconnect' = 'reconnect',
  
  // Authentication events
  'auth:login' = 'auth:login',
  'auth:logout' = 'auth:logout',
  'auth:session' = 'auth:session',
  
  // Project events
  'project:created' = 'project:created',
  'project:updated' = 'project:updated',
  'project:deleted' = 'project:deleted',
  
  // File events
  'file:created' = 'file:created',
  'file:updated' = 'file:updated',
  'file:deleted' = 'file:deleted',
  
  // AI events
  'ai:message' = 'ai:message',
  'ai:response' = 'ai:response',
  'ai:processing' = 'ai:processing',
  
  // User events
  'user:joined' = 'user:joined',
  'user:left' = 'user:left',
  'user:typing' = 'user:typing'
}
```

## 🚀 Event Handlers

### Connection Events

#### Connect
Emitted when the socket successfully connects to the server.

```javascript
socket.on('connect', () => {
  console.log('Connected to server');
  console.log('Socket ID:', socket.id);
  
  // Join project rooms
  socket.emit('project:join', { projectId: 'project-123' });
});
```

#### Disconnect
Emitted when the socket disconnects from the server.

```javascript
socket.on('disconnect', (reason) => {
  console.log('Disconnected from server:', reason);
  
  if (reason === 'io server disconnect') {
    // Server initiated disconnect, reconnect manually
    socket.connect();
  }
});
```

#### Reconnect
Emitted when the socket successfully reconnects after a disconnection.

```javascript
socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
  
  // Rejoin rooms and restore state
  socket.emit('project:join', { projectId: 'project-123' });
});
```

### Authentication Events

#### Login
Emitted when a user successfully logs in.

```javascript
socket.on('auth:login', (data) => {
  console.log('User logged in:', data.user);
  
  // Update UI state
  updateUserStatus(data.user);
  
  // Join user-specific rooms
  socket.emit('user:join', { userId: data.user.id });
});
```

#### Logout
Emitted when a user logs out.

```javascript
socket.on('auth:logout', (data) => {
  console.log('User logged out:', data.userId);
  
  // Update UI state
  clearUserSession();
  
  // Leave user-specific rooms
  socket.emit('user:leave', { userId: data.userId });
});
```

#### Session Update
Emitted when the user session is updated.

```javascript
socket.on('auth:session', (data) => {
  console.log('Session updated:', data.session);
  
  // Update session information
  updateSessionInfo(data.session);
});
```

### Project Events

#### Project Created
Emitted when a new project is created.

```javascript
socket.on('project:created', (data) => {
  console.log('New project created:', data.project);
  
  // Add project to UI
  addProjectToList(data.project);
  
  // Show notification
  showNotification(`Project "${data.project.name}" created successfully`);
});
```

#### Project Updated
Emitted when a project is updated.

```javascript
socket.on('project:updated', (data) => {
  console.log('Project updated:', data.project);
  
  // Update project in UI
  updateProjectInList(data.project);
  
  // Show notification
  showNotification(`Project "${data.project.name}" updated`);
});
```

#### Project Deleted
Emitted when a project is deleted.

```javascript
socket.on('project:deleted', (data) => {
  console.log('Project deleted:', data.projectId);
  
  // Remove project from UI
  removeProjectFromList(data.projectId);
  
  // Show notification
  showNotification('Project deleted successfully');
});
```

### File Events

#### File Created
Emitted when a new file is created.

```javascript
socket.on('file:created', (data) => {
  console.log('New file created:', data.file);
  
  // Add file to file explorer
  addFileToExplorer(data.file);
  
  // Show notification
  showNotification(`File "${data.file.name}" created`);
});
```

#### File Updated
Emitted when a file is updated.

```javascript
socket.on('file:updated', (data) => {
  console.log('File updated:', data.file);
  
  // Update file in UI
  updateFileInUI(data.file);
  
  // Show notification if file is currently open
  if (isFileOpen(data.file.path)) {
    showNotification(`File "${data.file.name}" updated`);
  }
});
```

#### File Deleted
Emitted when a file is deleted.

```javascript
socket.on('file:deleted', (data) => {
  console.log('File deleted:', data.filePath);
  
  // Remove file from UI
  removeFileFromUI(data.filePath);
  
  // Show notification
  showNotification('File deleted successfully');
});
```

### AI Events

#### AI Message
Emitted when a user sends a message to AI.

```javascript
socket.on('ai:message', (data) => {
  console.log('AI message received:', data.message);
  
  // Add message to chat
  addMessageToChat(data.message, 'user');
  
  // Show typing indicator
  showAITypingIndicator();
});
```

#### AI Response
Emitted when AI responds to a message.

```javascript
socket.on('ai:response', (data) => {
  console.log('AI response received:', data.response);
  
  // Hide typing indicator
  hideAITypingIndicator();
  
  // Add AI response to chat
  addMessageToChat(data.response, 'ai');
  
  // Process any actions
  if (data.response.actions) {
    processAIActions(data.response.actions);
  }
});
```

#### AI Processing
Emitted when AI is processing a request.

```javascript
socket.on('ai:processing', (data) => {
  console.log('AI processing:', data.status);
  
  switch (data.status) {
    case 'started':
      showAITypingIndicator();
      break;
    case 'progress':
      updateAIProgress(data.progress);
      break;
    case 'completed':
      hideAITypingIndicator();
      break;
    case 'error':
      hideAITypingIndicator();
      showAIError(data.error);
      break;
  }
});
```

### User Events

#### User Joined
Emitted when a user joins a project or room.

```javascript
socket.on('user:joined', (data) => {
  console.log('User joined:', data.user);
  
  // Add user to online users list
  addUserToOnlineList(data.user);
  
  // Show notification
  showNotification(`${data.user.name} joined the project`);
});
```

#### User Left
Emitted when a user leaves a project or room.

```javascript
socket.on('user:left', (data) => {
  console.log('User left:', data.user);
  
  // Remove user from online users list
  removeUserFromOnlineList(data.user.id);
  
  // Show notification
  showNotification(`${data.user.name} left the project`);
});
```

#### User Typing
Emitted when a user is typing in a chat or collaborative area.

```javascript
socket.on('user:typing', (data) => {
  console.log('User typing:', data.user);
  
  // Show typing indicator
  showUserTypingIndicator(data.user.id);
  
  // Clear typing indicator after delay
  setTimeout(() => {
    hideUserTypingIndicator(data.user.id);
  }, 3000);
});
```

## 📡 Emitting Events

### Project Operations

#### Join Project
Join a project room to receive project-specific updates.

```javascript
socket.emit('project:join', {
  projectId: 'project-123',
  userId: 'user-456'
});
```

#### Leave Project
Leave a project room to stop receiving updates.

```javascript
socket.emit('project:leave', {
  projectId: 'project-123',
  userId: 'user-456'
});
```

#### Project Update
Notify other users about project updates.

```javascript
socket.emit('project:update', {
  projectId: 'project-123',
  userId: 'user-456',
  update: {
    type: 'description',
    value: 'Updated project description'
  }
});
```

### File Operations

#### File Change
Notify other users about file changes.

```javascript
socket.emit('file:change', {
  projectId: 'project-123',
  userId: 'user-456',
  file: {
    path: 'src/components/App.jsx',
    action: 'updated',
    timestamp: new Date().toISOString()
  }
});
```

#### File Lock
Lock a file for editing to prevent conflicts.

```javascript
socket.emit('file:lock', {
  projectId: 'project-123',
  userId: 'user-456',
  filePath: 'src/components/App.jsx',
  lockType: 'exclusive'
});
```

#### File Unlock
Release a file lock.

```javascript
socket.emit('file:unlock', {
  projectId: 'project-123',
  userId: 'user-456',
  filePath: 'src/components/App.jsx'
});
```

### AI Operations

#### Send AI Message
Send a message to AI for processing.

```javascript
socket.emit('ai:message', {
  message: 'Create a React component for a todo list',
  projectId: 'project-123',
  userId: 'user-456',
  context: {
    currentFile: 'src/components/TodoList.jsx',
    language: 'javascript',
    framework: 'react'
  }
});
```

#### AI Processing Status
Update AI processing status.

```javascript
socket.emit('ai:status', {
  status: 'processing',
  progress: 50,
  message: 'Generating component structure...'
});
```

### User Operations

#### User Presence
Update user presence status.

```javascript
socket.emit('user:presence', {
  userId: 'user-456',
  status: 'online',
  activity: 'editing App.jsx',
  timestamp: new Date().toISOString()
});
```

#### User Typing
Indicate that a user is typing.

```javascript
socket.emit('user:typing', {
  userId: 'user-456',
  projectId: 'project-123',
  isTyping: true
});
```

## 🛡️ Error Handling

### Connection Errors
```javascript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  
  // Show user-friendly error message
  showConnectionError('Unable to connect to server. Please check your internet connection.');
  
  // Attempt reconnection
  setTimeout(() => {
    socket.connect();
  }, 5000);
});
```

### Authentication Errors
```javascript
socket.on('auth:error', (error) => {
  console.error('Authentication error:', error);
  
  // Redirect to login page
  if (error.code === 'UNAUTHORIZED') {
    window.location.href = '/login';
  }
  
  // Show error message
  showAuthError(error.message);
});
```

### General Errors
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
  
  // Show generic error message
  showError('An error occurred. Please try again.');
});
```

## 📊 Room Management

### Joining Rooms
```javascript
// Join project room
socket.emit('room:join', {
  room: `project:${projectId}`,
  userId: userId
});

// Join user room
socket.emit('room:join', {
  room: `user:${userId}`,
  userId: userId
});

// Join notification room
socket.emit('room:join', {
  room: 'notifications',
  userId: userId
});
```

### Leaving Rooms
```javascript
// Leave project room
socket.emit('room:leave', {
  room: `project:${projectId}`,
  userId: userId
});

// Leave all rooms
socket.emit('room:leaveAll', {
  userId: userId
});
```

### Room Events
```javascript
// Listen for room-specific events
socket.on('room:joined', (data) => {
  console.log('Joined room:', data.room);
});

socket.on('room:left', (data) => {
  console.log('Left room:', data.room);
});

socket.on('room:error', (data) => {
  console.error('Room error:', data.error);
});
```

## 🔐 Authentication

### Authentication Flow
```javascript
// 1. Connect to socket
const socket = io('http://localhost:3001');

// 2. Authenticate with session
socket.emit('auth:session', {
  sessionId: getSessionId()
});

// 3. Listen for authentication response
socket.on('auth:success', (data) => {
  console.log('Authenticated as:', data.user);
  
  // Join user-specific rooms
  socket.emit('user:join', { userId: data.user.id });
});

socket.on('auth:error', (error) => {
  console.error('Authentication failed:', error);
  
  // Redirect to login
  window.location.href = '/login';
});
```

### Session Management
```javascript
// Check authentication status
socket.emit('auth:check');

// Refresh session
socket.emit('auth:refresh');

// Logout
socket.emit('auth:logout');
```

## 📈 Performance Optimization

### Connection Management
```javascript
// Optimize connection
const socket = io('http://localhost:3001', {
  transports: ['websocket'],           // Prefer WebSocket
  upgrade: true,                       // Allow transport upgrade
  rememberUpgrade: true,               // Remember transport choice
  maxReconnectionAttempts: 5,          // Limit reconnection attempts
  reconnectionDelay: 1000,             // Start with 1 second delay
  reconnectionDelayMax: 5000,          // Max 5 second delay
  timeout: 20000,                      // 20 second timeout
  autoConnect: false                   // Manual connection
});

// Connect when needed
function connectSocket() {
  if (!socket.connected) {
    socket.connect();
  }
}

// Disconnect when not needed
function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}
```

### Event Optimization
```javascript
// Debounce frequent events
const debouncedTyping = debounce((isTyping) => {
  socket.emit('user:typing', { isTyping });
}, 300);

// Batch multiple updates
let updateQueue = [];
const batchUpdate = debounce(() => {
  if (updateQueue.length > 0) {
    socket.emit('batch:update', { updates: updateQueue });
    updateQueue = [];
  }
}, 1000);

// Add update to queue
function queueUpdate(update) {
  updateQueue.push(update);
  batchUpdate();
}
```

## 🧪 Testing

### Test Connection
```javascript
// Test basic connection
socket.on('connect', () => {
  console.log('✅ Connected successfully');
  socket.emit('test:ping');
});

socket.on('test:pong', () => {
  console.log('✅ Ping-pong test passed');
});
```

### Test Events
```javascript
// Test event emission
socket.emit('test:event', { message: 'Hello Server' });

socket.on('test:response', (data) => {
  console.log('✅ Event test passed:', data);
});
```

### Test Rooms
```javascript
// Test room functionality
socket.emit('room:join', { room: 'test-room' });

socket.on('room:joined', (data) => {
  console.log('✅ Room test passed:', data);
  
  // Leave test room
  socket.emit('room:leave', { room: 'test-room' });
});
```

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
import { AICodingAssistantSocket } from '@ai-coding-assistant/sdk';

const socket = new AICodingAssistantSocket({
  baseURL: 'http://localhost:3001',
  sessionId: 'your-session-id'
});

// Connect and authenticate
await socket.connect();

// Join project
await socket.joinProject('project-123');

// Send AI message
const response = await socket.sendAIMessage({
  message: 'Create a React component',
  projectId: 'project-123'
});

// Listen for updates
socket.on('project:updated', (data) => {
  console.log('Project updated:', data);
});
```

### Python
```python
from ai_coding_assistant import AICodingAssistantSocket

socket = AICodingAssistantSocket(
    base_url="http://localhost:3001",
    session_id="your-session-id"
)

# Connect and authenticate
socket.connect()

# Join project
socket.join_project("project-123")

# Send AI message
response = socket.send_ai_message(
    message="Create a React component",
    project_id="project-123"
)

# Listen for updates
@socket.on('project:updated')
def handle_project_update(data):
    print("Project updated:", data)
```

## 🔧 Configuration

### Environment Variables
```bash
# WebSocket configuration
SOCKET_CORS_ORIGIN=http://localhost:3000
SOCKET_MAX_CONNECTIONS=1000
SOCKET_PING_TIMEOUT=60000
SOCKET_PING_INTERVAL=25000
SOCKET_UPGRADE_TIMEOUT=10000
```

### Server Configuration
```javascript
// Socket.IO server configuration
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN,
    credentials: true
  },
  maxHttpBufferSize: 1e8,        // 100 MB
  pingTimeout: 60000,            // 60 seconds
  pingInterval: 25000,           // 25 seconds
  upgradeTimeout: 10000,         // 10 seconds
  allowUpgrades: true,
  transports: ['websocket', 'polling']
});
```

---

## 🎉 Ready to Use WebSocket API!

You now have comprehensive information about the WebSocket API. Start building real-time, collaborative features with our powerful WebSocket endpoints.

**Happy real-time coding! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This API documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*