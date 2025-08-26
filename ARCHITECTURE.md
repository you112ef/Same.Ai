# System Architecture

This document provides a comprehensive overview of the AI Coding Assistant system architecture, including design principles, component structure, data flow, and technical decisions.

## Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Security Architecture](#security-architecture)
- [Scalability Design](#scalability-design)
- [Deployment Architecture](#deployment-architecture)
- [Monitoring & Observability](#monitoring--observability)
- [Performance Considerations](#performance-considerations)
- [Future Architecture](#future-architecture)

## Overview

The AI Coding Assistant is built as a modern, scalable web application following microservices principles while maintaining a monolithic structure for simplicity. The system is designed to be highly available, secure, and performant.

### System Goals

- **High Performance**: Fast response times and efficient resource utilization
- **Scalability**: Handle growing user base and workload
- **Security**: Protect user data and prevent unauthorized access
- **Reliability**: High availability and fault tolerance
- **Maintainability**: Clean, well-documented, and testable code
- **Extensibility**: Easy to add new features and integrations

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • Chat UI       │    │ • API Server    │    │ • OpenAI API    │
│ • File Explorer │    │ • Socket.IO     │    │ • Redis         │
│ • Live Preview  │    │ • AI Manager    │    │ • PostgreSQL    │
│ • Version Ctrl  │    │ • File Manager  │    │ • Monitoring    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Architecture Principles

### 1. **Separation of Concerns**
- Clear separation between frontend, backend, and shared modules
- Each component has a single, well-defined responsibility
- Loose coupling between components

### 2. **Layered Architecture**
- **Presentation Layer**: React frontend with Material-UI
- **Business Logic Layer**: Node.js backend with managers
- **Data Access Layer**: File system and database operations
- **Infrastructure Layer**: Docker, monitoring, and deployment

### 3. **Event-Driven Design**
- Socket.IO for real-time communication
- Asynchronous processing for AI operations
- Event-based logging and monitoring

### 4. **API-First Approach**
- RESTful API design
- Consistent error handling and response formats
- Comprehensive API documentation

### 5. **Security by Design**
- Input validation and sanitization
- Rate limiting and authentication
- Secure file operations and project isolation

## System Components

### Frontend Layer

#### **React Application Structure**
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChatInterface    # AI chat interface
│   │   ├── FileExplorer     # File management UI
│   │   ├── LivePreview      # Project preview
│   │   ├── VersionControl   # Version management
│   │   ├── TodoList         # Task management
│   │   └── Sidebar          # Navigation sidebar
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   └── App.tsx              # Main application component
├── public/                  # Static assets
└── package.json             # Dependencies and scripts
```

#### **Component Architecture**
- **Functional Components**: Modern React with hooks
- **State Management**: Local state with React hooks
- **Styling**: Material-UI with custom theme support
- **Internationalization**: RTL support for Arabic/English
- **Responsive Design**: Mobile-first approach

### Backend Layer

#### **Express.js Server Structure**
```
server/
├── index.js                 # Main server entry point
├── managers/                # Business logic managers
│   ├── AIManager.js         # AI integration and processing
│   ├── FileManager.js       # File operations and project management
│   └── VersionManager.js    # Version control and snapshots
├── middleware/              # Express middleware
├── routes/                  # API route definitions
├── utils/                   # Utility functions
└── config/                  # Configuration files
```

#### **Manager Pattern**
Each manager handles a specific domain:

- **AIManager**: OpenAI API integration, message processing, response parsing
- **FileManager**: Project creation, file operations, directory management
- **VersionManager**: Snapshot creation, version comparison, restoration

#### **Socket.IO Integration**
- Real-time chat communication
- Live project updates
- File change notifications
- User presence tracking

### Shared Layer

#### **Common Modules**
```
shared/
├── types.ts                 # TypeScript interfaces
├── constants.ts             # Shared constants
└── index.ts                 # Module exports
```

#### **Type Safety**
- Common interfaces for data structures
- Consistent data validation
- Shared constants for configuration
- Cross-platform compatibility

### Infrastructure Layer

#### **Containerization**
```
docker-compose.yml           # Multi-service orchestration
Dockerfile                  # Application container
.dockerignore               # Build optimization
```

#### **Services**
- **AI Coding Assistant**: Main application
- **Redis**: Session storage and caching
- **PostgreSQL**: Optional persistent storage
- **Prometheus**: Metrics collection
- **Grafana**: Visualization and monitoring

## Data Flow

### 1. **User Authentication Flow**
```
User → Frontend → Backend → Session Creation → Redis Storage
```

### 2. **AI Chat Flow**
```
User Message → Frontend → Socket.IO → Backend → AI Manager → OpenAI API → Response Processing → Frontend Update
```

### 3. **File Operation Flow**
```
User Action → Frontend → Backend → File Manager → File System → Response → Frontend Update
```

### 4. **Version Control Flow**
```
User Request → Frontend → Backend → Version Manager → File System → Archive Creation → Response → Frontend Update
```

### 5. **Real-time Updates Flow**
```
Backend Event → Socket.IO → Connected Clients → Frontend Update
```

## Technology Stack

### Frontend Technologies

#### **Core Framework**
- **React 18**: Modern React with concurrent features
- **TypeScript**: Type-safe development
- **Material-UI**: Professional UI components
- **Socket.IO Client**: Real-time communication

#### **Build Tools**
- **Create React App**: Zero-configuration setup
- **npm**: Package management
- **TypeScript Compiler**: Type checking and compilation

### Backend Technologies

#### **Runtime & Framework**
- **Node.js 18+**: JavaScript runtime
- **Express.js**: Web application framework
- **Socket.IO**: Real-time bidirectional communication

#### **AI Integration**
- **OpenAI API**: GPT-4 integration
- **Custom Prompts**: Specialized coding assistance
- **Response Parsing**: Structured AI response handling

#### **Data Storage**
- **File System**: Project and version storage
- **Redis**: Session management and caching
- **PostgreSQL**: Optional persistent storage

### Infrastructure Technologies

#### **Containerization**
- **Docker**: Application containerization
- **Docker Compose**: Multi-service orchestration
- **Multi-stage Builds**: Optimized image creation

#### **Monitoring & Observability**
- **Prometheus**: Metrics collection and storage
- **Grafana**: Data visualization and dashboards
- **Winston**: Structured logging
- **Custom Metrics**: Application-specific monitoring

#### **Development Tools**
- **nodemon**: Development server with auto-restart
- **concurrently**: Parallel process execution
- **ESLint**: Code quality and consistency

## Security Architecture

### 1. **Input Validation & Sanitization**
```javascript
// Path traversal protection
const safePath = path.resolve(process.cwd(), 'projects', projectId);
if (!safePath.startsWith(process.cwd())) {
  throw new Error('Invalid path');
}

// File type validation
const allowedExtensions = ['.js', '.ts', '.jsx', '.tsx', '.html', '.css'];
if (!allowedExtensions.includes(path.extname(filename))) {
  throw new Error('File type not allowed');
}
```

### 2. **Rate Limiting**
```javascript
// General rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// AI-specific rate limiting
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 AI requests per minute
});
```

### 3. **Security Headers**
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "https:"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));
```

### 4. **Project Isolation**
- Each project runs in isolated directories
- File access restricted to project boundaries
- Session-based access control
- Secure file operations

### 5. **API Security**
- CORS configuration
- Request size limits
- Input length restrictions
- Secure session management

## Scalability Design

### 1. **Horizontal Scaling**
```yaml
# docker-compose.yml with scaling
services:
  ai-coding-assistant:
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### 2. **Load Balancing**
- Multiple application instances
- Redis for session sharing
- Stateless application design
- Health check endpoints

### 3. **Caching Strategy**
```javascript
// Redis caching implementation
const cacheKey = `project:${projectId}:${filePath}`;
const cachedContent = await redis.get(cacheKey);

if (cachedContent) {
  return JSON.parse(cachedContent);
}

// Cache miss - fetch from file system
const content = await fs.readFile(filePath, 'utf8');
await redis.setex(cacheKey, 3600, JSON.stringify(content));
```

### 4. **Database Optimization**
- Connection pooling
- Query optimization
- Indexing strategies
- Read replicas for scaling

### 5. **Microservices Preparation**
- Modular architecture
- Service boundaries
- API contracts
- Event-driven communication

## Deployment Architecture

### 1. **Development Environment**
```
Local Machine → Docker Compose → Local Services
```

### 2. **Production Environment**
```
Load Balancer → Multiple App Instances → Shared Services
```

### 3. **Container Orchestration**
```yaml
# Kubernetes deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-coding-assistant
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-coding-assistant
  template:
    metadata:
      labels:
        app: ai-coding-assistant
    spec:
      containers:
      - name: ai-coding-assistant
        image: ai-coding-assistant:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
```

### 4. **CI/CD Pipeline**
```
Code Push → GitHub Actions → Build → Test → Deploy → Monitor
```

## Monitoring & Observability

### 1. **Application Metrics**
```javascript
// Custom metrics collection
const requestCounter = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const responseTimeHistogram = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route']
});
```

### 2. **Health Checks**
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check Redis connection
    await redis.ping();
    
    // Check file system access
    await fs.access(process.cwd());
    
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});
```

### 3. **Logging Strategy**
```javascript
// Structured logging with Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### 4. **Alerting System**
- Prometheus alerting rules
- Grafana notification channels
- Custom alert thresholds
- Escalation procedures

## Performance Considerations

### 1. **Frontend Performance**
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Service worker caching

### 2. **Backend Performance**
- Database query optimization
- Caching strategies
- Async processing
- Connection pooling

### 3. **Network Performance**
- HTTP/2 support
- Gzip compression
- CDN integration
- Load balancing

### 4. **Resource Management**
- Memory usage optimization
- CPU utilization monitoring
- Disk I/O optimization
- Network bandwidth management

## Future Architecture

### 1. **Microservices Migration**
```
Current: Monolithic → Future: Microservices
├── User Service
├── Project Service
├── AI Service
├── File Service
└── Notification Service
```

### 2. **Event-Driven Architecture**
```
Events → Event Bus → Event Handlers → Services
```

### 3. **API Gateway**
```
Client → API Gateway → Service Discovery → Services
```

### 4. **Service Mesh**
```
Services → Service Mesh → Traffic Management → Observability
```

### 5. **Cloud-Native Features**
- Auto-scaling
- Serverless functions
- Managed services
- Multi-region deployment

---

## Architecture Decisions

### 1. **Why Monolithic First?**
- **Simplicity**: Easier to develop and deploy
- **Team Size**: Small team can manage effectively
- **Iteration Speed**: Faster development cycles
- **Future Migration**: Can evolve to microservices

### 2. **Why File System Storage?**
- **Simplicity**: No database setup required
- **Performance**: Direct file access
- **Version Control**: Natural fit for snapshots
- **Portability**: Easy to backup and migrate

### 3. **Why Socket.IO?**
- **Real-time**: Immediate updates and notifications
- **Bidirectional**: Server can push to clients
- **Fallback**: Automatic fallback to polling
- **Room Support**: Project-specific communication

### 4. **Why Docker?**
- **Consistency**: Same environment everywhere
- **Isolation**: Clean separation of concerns
- **Scalability**: Easy horizontal scaling
- **DevOps**: Simplified deployment and operations

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This architecture document is a living document that evolves with the system. We welcome feedback and suggestions for architectural improvements! 🏗️*