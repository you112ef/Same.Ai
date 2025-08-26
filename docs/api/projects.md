# Projects API

The Projects API provides endpoints for creating, managing, and operating on projects within AI Coding Assistant.

## 📋 Overview

The Projects API allows you to:
- Create new projects with different templates
- List and search existing projects
- Get detailed project information
- Update project metadata
- Delete projects
- Manage project files and structure

## 🔗 Base Endpoint

```
GET/POST/PUT/DELETE /api/v1/projects
```

## 📚 Available Endpoints

### Project Management
- **[List Projects](#list-projects)** - Get all projects
- **[Get Project](#get-project)** - Get project details
- **[Create Project](#create-project)** - Create new project
- **[Update Project](#update-project)** - Update project metadata
- **[Delete Project](#delete-project)** - Remove project

### Project Operations
- **[Get Project Structure](#get-project-structure)** - Get file structure
- **[Get Project Stats](#get-project-stats)** - Get project statistics
- **[Export Project](#export-project)** - Download project as archive
- **[Clone Project](#clone-project)** - Duplicate existing project

## 📊 Data Models

### Project Object
```typescript
interface Project {
  id: string;                    // Unique project identifier
  name: string;                  // Project name
  type: ProjectType;            // Project template type
  description?: string;          // Project description
  createdAt: string;            // Creation timestamp (ISO 8601)
  updatedAt: string;            // Last update timestamp
  lastActivity: string;         // Last activity timestamp
  fileCount: number;            // Total number of files
  size: number;                 // Project size in bytes
  status: ProjectStatus;        // Current project status
  metadata: ProjectMetadata;    // Additional project data
}

enum ProjectType {
  'react' = 'react',
  'nextjs' = 'nextjs',
  'vite' = 'vite',
  'vanilla' = 'vanilla'
}

enum ProjectStatus {
  'active' = 'active',
  'archived' = 'archived',
  'deleted' = 'deleted'
}

interface ProjectMetadata {
  framework?: string;            // Framework version
  dependencies?: string[];       // Project dependencies
  scripts?: Record<string, string>; // Available scripts
  config?: Record<string, any>; // Configuration data
}
```

### Create Project Request
```typescript
interface CreateProjectRequest {
  name: string;                  // Project name (required)
  type: ProjectType;            // Project type (required)
  description?: string;          // Project description
  template?: string;             // Custom template name
  options?: ProjectOptions;      // Template-specific options
}

interface ProjectOptions {
  typescript?: boolean;          // Use TypeScript
  testing?: boolean;             // Include testing setup
  linting?: boolean;             // Include linting setup
  styling?: 'css' | 'scss' | 'styled-components';
  routing?: boolean;             // Include routing
  state?: 'local' | 'redux' | 'context';
}
```

## 🚀 API Endpoints

### List Projects

Get all projects for the current user.

```http
GET /api/v1/projects
```

#### Query Parameters
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `type` (string): Filter by project type
- `status` (string): Filter by project status
- `search` (string): Search in project names and descriptions
- `sort` (string): Sort field (name, createdAt, updatedAt, lastActivity)
- `order` (string): Sort order (asc, desc)

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "project-123",
      "name": "my-react-app",
      "type": "react",
      "description": "A simple React application",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T15:45:00Z",
      "lastActivity": "2024-01-15T15:45:00Z",
      "fileCount": 15,
      "size": 1024000,
      "status": "active",
      "metadata": {
        "framework": "react@18.2.0",
        "dependencies": ["react", "react-dom"],
        "scripts": {
          "start": "react-scripts start",
          "build": "react-scripts build"
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### Example
```bash
# Get all projects
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects"

# Get React projects with pagination
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects?type=react&page=1&limit=5"

# Search projects
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects?search=react&sort=createdAt&order=desc"
```

### Get Project

Get detailed information about a specific project.

```http
GET /api/v1/projects/{projectId}
```

#### Path Parameters
- `projectId` (string): Unique project identifier

#### Response
```json
{
  "success": true,
  "data": {
    "id": "project-123",
    "name": "my-react-app",
    "type": "react",
    "description": "A simple React application",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T15:45:00Z",
    "lastActivity": "2024-01-15T15:45:00Z",
    "fileCount": 15,
    "size": 1024000,
    "status": "active",
    "metadata": {
      "framework": "react@18.2.0",
      "dependencies": ["react", "react-dom"],
      "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build"
      },
      "config": {
        "typescript": true,
        "testing": true,
        "linting": true
      }
    }
  }
}
```

#### Example
```bash
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects/project-123"
```

### Create Project

Create a new project with the specified template and options.

```http
POST /api/v1/projects
```

#### Request Body
```json
{
  "name": "my-new-project",
  "type": "react",
  "description": "A new React application",
  "options": {
    "typescript": true,
    "testing": true,
    "linting": true,
    "styling": "styled-components",
    "routing": true,
    "state": "context"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "project-456",
    "name": "my-new-project",
    "type": "react",
    "description": "A new React application",
    "createdAt": "2024-01-15T16:00:00Z",
    "updatedAt": "2024-01-15T16:00:00Z",
    "lastActivity": "2024-01-15T16:00:00Z",
    "fileCount": 20,
    "size": 2048000,
    "status": "active",
    "metadata": {
      "framework": "react@18.2.0",
      "dependencies": ["react", "react-dom", "typescript"],
      "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test"
      },
      "config": {
        "typescript": true,
        "testing": true,
        "linting": true,
        "styling": "styled-components",
        "routing": true,
        "state": "context"
      }
    }
  },
  "message": "Project created successfully"
}
```

#### Example
```bash
curl -X POST \
  -H "Cookie: session=your-session-id" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-new-project",
    "type": "react",
    "description": "A new React application",
    "options": {
      "typescript": true,
      "testing": true,
      "linting": true
    }
  }' \
  "http://localhost:3001/api/v1/projects"
```

### Update Project

Update project metadata and settings.

```http
PUT /api/v1/projects/{projectId}
```

#### Path Parameters
- `projectId` (string): Unique project identifier

#### Request Body
```json
{
  "name": "updated-project-name",
  "description": "Updated project description",
  "status": "active"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "project-123",
    "name": "updated-project-name",
    "type": "react",
    "description": "Updated project description",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T16:15:00Z",
    "lastActivity": "2024-01-15T16:15:00Z",
    "fileCount": 15,
    "size": 1024000,
    "status": "active",
    "metadata": {
      "framework": "react@18.2.0",
      "dependencies": ["react", "react-dom"],
      "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build"
      }
    }
  },
  "message": "Project updated successfully"
}
```

#### Example
```bash
curl -X PUT \
  -H "Cookie: session=your-session-id" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated-project-name",
    "description": "Updated project description"
  }' \
  "http://localhost:3001/api/v1/projects/project-123"
```

### Delete Project

Delete a project and all its files.

```http
DELETE /api/v1/projects/{projectId}
```

#### Path Parameters
- `projectId` (string): Unique project identifier

#### Query Parameters
- `force` (boolean): Force deletion without confirmation (default: false)

#### Response
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": {
    "id": "project-123",
    "name": "deleted-project",
    "deletedAt": "2024-01-15T16:30:00Z"
  }
}
```

#### Example
```bash
# Soft delete (default)
curl -X DELETE \
  -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects/project-123"

# Force delete
curl -X DELETE \
  -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects/project-123?force=true"
```

### Get Project Structure

Get the file structure and organization of a project.

```http
GET /api/v1/projects/{projectId}/structure
```

#### Path Parameters
- `projectId` (string): Unique project identifier

#### Query Parameters
- `depth` (number): Maximum directory depth (default: 3, max: 10)
- `includeHidden` (boolean): Include hidden files (default: false)

#### Response
```json
{
  "success": true,
  "data": {
    "projectId": "project-123",
    "structure": [
      {
        "name": "src",
        "type": "directory",
        "path": "src",
        "size": 0,
        "children": [
          {
            "name": "components",
            "type": "directory",
            "path": "src/components",
            "size": 0,
            "children": [
              {
                "name": "App.jsx",
                "type": "file",
                "path": "src/components/App.jsx",
                "size": 2048,
                "extension": "jsx"
              }
            ]
          },
          {
            "name": "index.js",
            "type": "file",
            "path": "src/index.js",
            "size": 1024,
            "extension": "js"
          }
        ]
      },
      {
        "name": "package.json",
        "type": "file",
        "path": "package.json",
        "size": 1024,
        "extension": "json"
      }
    ],
    "totalFiles": 15,
    "totalDirectories": 8,
    "totalSize": 1024000
  }
}
```

#### Example
```bash
# Get basic structure
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects/project-123/structure"

# Get deep structure
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects/project-123/structure?depth=5"

# Include hidden files
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects/project-123/structure?includeHidden=true"
```

### Get Project Stats

Get detailed statistics about a project.

```http
GET /api/v1/projects/{projectId}/stats
```

#### Path Parameters
- `projectId` (string): Unique project identifier

#### Response
```json
{
  "success": true,
  "data": {
    "projectId": "project-123",
    "name": "my-react-app",
    "stats": {
      "files": {
        "total": 15,
        "byType": {
          "js": 5,
          "jsx": 3,
          "ts": 2,
          "tsx": 2,
          "css": 2,
          "json": 1
        },
        "bySize": {
          "small": 8,    // < 1KB
          "medium": 5,   // 1KB - 10KB
          "large": 2     // > 10KB
        }
      },
      "directories": {
        "total": 8,
        "depth": 4,
        "largest": "src/components"
      },
      "code": {
        "lines": 1250,
        "characters": 45600,
        "complexity": "medium"
      },
      "dependencies": {
        "total": 12,
        "devDependencies": 8,
        "peerDependencies": 2
      },
      "activity": {
        "lastModified": "2024-01-15T15:45:00Z",
        "modificationsToday": 5,
        "modificationsThisWeek": 15
      }
    }
  }
}
```

#### Example
```bash
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects/project-123/stats"
```

### Export Project

Download a project as a compressed archive.

```http
GET /api/v1/projects/{projectId}/export
```

#### Path Parameters
- `projectId` (string): Unique project identifier

#### Query Parameters
- `format` (string): Archive format (zip, tar.gz) (default: zip)
- `includeNodeModules` (boolean): Include node_modules (default: false)
- `includeGit` (boolean): Include .git directory (default: false)

#### Response
Returns a file download with the project archive.

#### Example
```bash
# Download as ZIP
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects/project-123/export" \
  -o "my-project.zip"

# Download as TAR.GZ
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects/project-123/export?format=tar.gz" \
  -o "my-project.tar.gz"

# Include dependencies
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects/project-123/export?includeNodeModules=true" \
  -o "my-project-with-deps.zip"
```

### Clone Project

Create a copy of an existing project.

```http
POST /api/v1/projects/{projectId}/clone
```

#### Path Parameters
- `projectId` (string): Unique project identifier

#### Request Body
```json
{
  "name": "cloned-project",
  "description": "A copy of the original project"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "project-789",
    "name": "cloned-project",
    "type": "react",
    "description": "A copy of the original project",
    "createdAt": "2024-01-15T17:00:00Z",
    "updatedAt": "2024-01-15T17:00:00Z",
    "lastActivity": "2024-01-15T17:00:00Z",
    "fileCount": 15,
    "size": 1024000,
    "status": "active",
    "metadata": {
      "framework": "react@18.2.0",
      "dependencies": ["react", "react-dom"],
      "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build"
      },
      "clonedFrom": "project-123"
    }
  },
  "message": "Project cloned successfully"
}
```

#### Example
```bash
curl -X POST \
  -H "Cookie: session=your-session-id" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "cloned-project",
    "description": "A copy of the original project"
  }' \
  "http://localhost:3001/api/v1/projects/project-123/clone"
```

## 🛡️ Error Handling

### Common Error Responses

#### Project Not Found
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Project not found",
    "details": {
      "projectId": "invalid-project-id"
    }
  },
  "timestamp": "2024-01-15T16:00:00Z"
}
```

#### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Project name is required",
    "details": {
      "field": "name",
      "value": "",
      "constraint": "required"
    }
  },
  "timestamp": "2024-01-15T16:00:00Z"
}
```

#### Permission Denied
```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "You don't have permission to access this project",
    "details": {
      "projectId": "project-123",
      "requiredPermission": "read"
    }
  },
  "timestamp": "2024-01-15T16:00:00Z"
}
```

## 📊 Rate Limiting

- **List/Get operations**: 100 requests per 15 minutes
- **Create/Update/Delete operations**: 50 requests per 15 minutes
- **Export operations**: 10 requests per 15 minutes
- **Clone operations**: 20 requests per 15 minutes

## 🔐 Authentication

All endpoints require valid session authentication. Include the session cookie in your requests:

```bash
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/projects"
```

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
import { AICodingAssistant } from '@ai-coding-assistant/sdk';

const client = new AICodingAssistant({
  baseURL: 'http://localhost:3001',
  sessionId: 'your-session-id'
});

// Create a new project
const project = await client.projects.create({
  name: 'my-new-project',
  type: 'react',
  description: 'A new React application',
  options: {
    typescript: true,
    testing: true,
    linting: true
  }
});

// Get project structure
const structure = await client.projects.getStructure(project.id, {
  depth: 5,
  includeHidden: false
});

// Export project
const archive = await client.projects.export(project.id, {
  format: 'zip',
  includeNodeModules: false
});
```

### Python
```python
from ai_coding_assistant import AICodingAssistant

client = AICodingAssistant(
    base_url="http://localhost:3001",
    session_id="your-session-id"
)

# Create a new project
project = client.projects.create(
    name="my-new-project",
    type="react",
    description="A new React application",
    options={
        "typescript": True,
        "testing": True,
        "linting": True
    }
)

# Get project structure
structure = client.projects.get_structure(
    project.id,
    depth=5,
    include_hidden=False
)

# Export project
archive = client.projects.export(
    project.id,
    format="zip",
    include_node_modules=False
)
```

## 🧪 Testing

### Test Endpoints
```bash
# Test project creation
npm run test:api -- --grep "projects create"

# Test project retrieval
npm run test:api -- --grep "projects get"

# Test project updates
npm run test:api -- --grep "projects update"

# Test project deletion
npm run test:api -- --grep "projects delete"
```

### Test Data
```bash
# Create test project
curl -X POST \
  -H "Cookie: session=test-session" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-project",
    "type": "react",
    "description": "Test project for API testing"
  }' \
  "http://localhost:3001/api/v1/projects"
```

---

## 🎉 Ready to Use Projects API!

You now have comprehensive information about the Projects API. Start creating, managing, and operating on projects with our powerful API endpoints.

**Happy coding! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This API documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*