# AI Coding Assistant API Documentation

Welcome to the comprehensive API documentation for AI Coding Assistant. This documentation provides detailed information about all available APIs, endpoints, data models, and integration examples.

## 🚀 Quick Start

### Base URL
```
http://localhost:3001/api
```

### Authentication
All API requests require authentication using JWT tokens:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Response Format
All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

## 📚 Available APIs

### Core APIs
- **[Projects API](./projects.md)** - Project management and operations
- **[Files API](./files.md)** - File system operations and management
- **[Versions API](./versions.md)** - Version control and snapshots
- **[WebSocket API](./websocket.md)** - Real-time communication

### User & Management APIs
- **[Users API](./users.md)** - User management and authentication
- **[Notifications API](./notifications.md)** - Notification system
- **[Analytics API](./analytics.md)** - Usage analytics and reporting

### AI & Development APIs
- **[AI Chat API](./ai-chat.md)** - AI conversation and assistance
- **[Code Generation API](./code-generation.md)** - AI-powered code generation
- **[Code Analysis API](./code-analysis.md)** - Code quality and analysis

## 🔐 Authentication

### Getting Started
1. **Register/Login**: Use the authentication endpoints to get your JWT token
2. **Include Token**: Add the token to all subsequent requests
3. **Token Expiry**: Tokens expire after 24 hours, refresh as needed

### Example Authentication Flow
```javascript
// 1. Login to get token
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();

// 2. Use token in subsequent requests
const projects = await fetch('/api/projects', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📊 Data Models

### Common Objects
All APIs use consistent data models for common entities:

- **User Object**: User information and preferences
- **Project Object**: Project details and metadata
- **File Object**: File information and content
- **Version Object**: Version snapshots and history
- **Notification Object**: Notification data and delivery

### Standard Fields
Most objects include these standard fields:
- `id`: Unique identifier
- `createdAt`: Creation timestamp (ISO 8601)
- `updatedAt`: Last update timestamp
- `metadata`: Additional custom data

## 🛡️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... },
    "timestamp": "2024-01-15T23:00:00Z",
    "requestId": "req-abc123"
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Authentication required or invalid
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## 📈 Rate Limiting

### Rate Limits by User Type
- **Standard Users**: 100 requests per minute
- **Premium Users**: 500 requests per minute
- **Admin Users**: 1000 requests per minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642251600
```

## 🔧 SDKs & Libraries

### Official SDKs
- **[JavaScript/Node.js SDK](./sdk/javascript.md)** - Full-featured Node.js client
- **[Python SDK](./sdk/python.md)** - Python client library
- **[REST API Client](./sdk/rest.md)** - Generic REST client examples

### Community Libraries
- **Go Client** - Community-maintained Go library
- **PHP Client** - Community-maintained PHP library
- **Ruby Client** - Community-maintained Ruby library

## 🧪 Testing

### Test Environment
- **Base URL**: `http://localhost:3001/api`
- **Test Users**: Available in test environment
- **Mock Data**: Pre-populated test projects and files

### Testing Tools
- **Postman Collection**: Import our Postman collection
- **cURL Examples**: All endpoints include cURL examples
- **Test Scripts**: Automated testing scripts available

### Example Test Request
```bash
# Test project creation
curl -X POST "http://localhost:3001/api/projects" \
  -H "Authorization: Bearer YOUR_TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "A test project for API testing"
  }'
```

## 📱 WebSocket Integration

### Real-time Features
- **Live Updates**: Real-time project and file updates
- **Collaboration**: Multi-user collaboration features
- **AI Chat**: Real-time AI conversation
- **Notifications**: Instant notification delivery

### Connection Example
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('connect', () => {
  console.log('Connected to AI Coding Assistant');
});

socket.on('project:updated', (data) => {
  console.log('Project updated:', data);
});
```

## 🔒 Security

### Best Practices
- **HTTPS Only**: Always use HTTPS in production
- **Token Security**: Store tokens securely, never expose in client code
- **Input Validation**: Validate all input data
- **Rate Limiting**: Respect rate limits and implement backoff

### Security Headers
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## 📋 API Versioning

### Current Version
- **Version**: v1.0.0
- **Status**: Stable
- **Deprecation Policy**: 12 months notice for breaking changes

### Versioning Strategy
- **URL Versioning**: `/api/v1/projects`
- **Header Versioning**: `Accept: application/vnd.aicodingassistant.v1+json`
- **Backward Compatibility**: Maintained within major versions

## 🆘 Support & Community

### Getting Help
- **Documentation**: This comprehensive guide
- **API Reference**: Interactive API explorer
- **Community Forum**: Ask questions and share solutions
- **GitHub Issues**: Report bugs and request features

### Community Resources
- **Discord Server**: Join our developer community
- **Blog**: Latest updates and tutorials
- **Examples**: Code examples and use cases
- **Tutorials**: Step-by-step integration guides

## 📈 Performance & Monitoring

### Performance Metrics
- **Response Time**: Average < 200ms
- **Uptime**: 99.9% availability
- **Throughput**: 10,000+ requests per second

### Monitoring
- **Health Checks**: `/api/health` endpoint
- **Status Page**: Real-time service status
- **Metrics**: Performance and usage metrics
- **Alerts**: Proactive issue notifications

## 🔄 Changelog

### Recent Updates
- **v1.0.0** (January 2024): Initial API release
- **v1.1.0** (February 2024): Enhanced AI features
- **v1.2.0** (March 2024): Real-time collaboration

### Upcoming Features
- **v1.3.0**: Advanced analytics and reporting
- **v1.4.0**: Mobile app APIs
- **v2.0.0**: GraphQL support

## 📄 License

This API is provided under the MIT License. See the [LICENSE](../LICENSE) file for details.

## 🤝 Contributing

We welcome contributions to improve our API documentation and examples:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Submit** a pull request

### Documentation Standards
- Use clear, concise language
- Include practical examples
- Maintain consistent formatting
- Test all code examples

---

## 🎉 Ready to Get Started?

Choose an API from the list above to begin integrating with AI Coding Assistant. Each API includes:

- **Complete endpoint documentation**
- **Request/response examples**
- **SDK integration code**
- **Testing examples**
- **Best practices**

**Happy coding! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*