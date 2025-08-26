# Files API

The Files API provides comprehensive file management capabilities within AI Coding Assistant, including file operations, content management, and file system interactions.

## 📋 Overview

The Files API allows you to:
- Create, read, update, and delete files
- Manage file content and metadata
- Navigate project file structures
- Handle file uploads and downloads
- Manage file permissions and access control
- Perform file operations in batch
- Search and filter files
- Handle file conflicts and versioning

## 🔗 Base Endpoint

```
GET/POST/PUT/DELETE /api/files
```

## 📚 Available Endpoints

### Core File Operations
- **[List Files](#list-files)** - Get file listing for a project
- **[Get File](#get-file)** - Retrieve file content and metadata
- **[Create File](#create-file)** - Create a new file
- **[Update File](#update-file)** - Modify existing file content
- **[Delete File](#delete-file)** - Remove a file from the project
- **[Rename File](#rename-file)** - Change file name or path

### File Management
- **[File Info](#file-info)** - Get detailed file information
- **[File Stats](#file-stats)** - Get file statistics and metadata
- **[File Search](#file-search)** - Search files by content or metadata
- **[File Upload](#file-upload)** - Upload files to the project
- **[File Download](#file-download)** - Download files from the project

### Advanced Operations
- **[Batch Operations](#batch-operations)** - Perform multiple file operations
- **[File Templates](#file-templates)** - Create files from templates
- **[File Validation](#file-validation)** - Validate file content and structure
- **[File Backup](#file-backup)** - Create and manage file backups

## 📊 Data Models

### File Object
```typescript
interface FileObject {
  id: string;                    // Unique file identifier
  name: string;                  // File name
  path: string;                  // File path relative to project root
  fullPath: string;              // Absolute file path
  type: 'file' | 'directory';    // File type
  size: number;                  // File size in bytes
  content?: string;              // File content (for text files)
  mimeType: string;              // MIME type
  encoding: string;              // File encoding
  createdAt: string;             // Creation timestamp (ISO 8601)
  updatedAt: string;             // Last modification timestamp
  accessedAt: string;            // Last access timestamp
  permissions: FilePermissions;   // File permissions
  metadata: FileMetadata;        // Additional file metadata
  hash: string;                  // File content hash
  parentId?: string;             // Parent directory ID
  children?: FileObject[];        // Child files/directories
}

interface FilePermissions {
  read: boolean;                 // Read permission
  write: boolean;                // Write permission
  execute: boolean;              // Execute permission
  owner: string;                 // File owner
  group: string;                 // File group
}

interface FileMetadata {
  language?: string;             // Programming language
  framework?: string;            // Framework (if applicable)
  dependencies?: string[];       // File dependencies
  tags?: string[];               // File tags
  description?: string;          // File description
  author?: string;               // File author
  version?: string;              // File version
  license?: string;              // File license
  custom?: Record<string, any>;  // Custom metadata
}
```

### Create File Request
```typescript
interface CreateFileRequest {
  name: string;                  // File name
  path: string;                  // File path
  content?: string;              // File content
  type: 'file' | 'directory';    // File type
  mimeType?: string;             // MIME type
  encoding?: string;             // File encoding
  metadata?: FileMetadata;       // File metadata
  template?: string;             // Template to use
  overwrite?: boolean;           // Overwrite existing file
}
```

### Update File Request
```typescript
interface UpdateFileRequest {
  content?: string;              // New file content
  name?: string;                 // New file name
  path?: string;                 // New file path
  metadata?: FileMetadata;       // Updated metadata
  permissions?: FilePermissions; // Updated permissions
}
```

### File Search Request
```typescript
interface FileSearchRequest {
  query: string;                 // Search query
  projectId: string;             // Project ID to search in
  filters?: {
    type?: 'file' | 'directory'; // File type filter
    mimeType?: string;           // MIME type filter
    size?: {                     // Size range filter
      min?: number;
      max?: number;
    };
    date?: {                     // Date range filter
      from?: string;
      to?: string;
    };
    language?: string;            // Programming language filter
    tags?: string[];             // Tags filter
  };
  options?: {
    includeContent?: boolean;     // Include file content in results
    maxResults?: number;          // Maximum number of results
    sortBy?: 'name' | 'size' | 'date' | 'relevance';
    sortOrder?: 'asc' | 'desc';
  };
}
```

## 🚀 API Endpoints

### List Files

Get a list of files in a project directory.

**Endpoint**: `GET /api/files/list`

**Query Parameters**:
- `projectId` (required): Project identifier
- `path` (optional): Directory path to list (default: root)
- `recursive` (optional): Include subdirectories (default: false)
- `includeHidden` (optional): Include hidden files (default: false)
- `includeContent` (optional): Include file content (default: false)

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/files/list?projectId=project-123&path=src&recursive=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "file-123",
        "name": "App.jsx",
        "path": "src/App.jsx",
        "fullPath": "/workspace/projects/project-123/src/App.jsx",
        "type": "file",
        "size": 1024,
        "mimeType": "text/jsx",
        "encoding": "utf8",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T15:45:00Z",
        "accessedAt": "2024-01-15T16:00:00Z",
        "permissions": {
          "read": true,
          "write": true,
          "execute": false,
          "owner": "user-456",
          "group": "developers"
        },
        "metadata": {
          "language": "javascript",
          "framework": "react",
          "tags": ["component", "main"]
        },
        "hash": "sha256:abc123...",
        "parentId": "dir-456"
      }
    ],
    "directories": [
      {
        "id": "dir-456",
        "name": "src",
        "path": "src",
        "fullPath": "/workspace/projects/project-123/src",
        "type": "directory",
        "size": 0,
        "mimeType": "inode/directory",
        "encoding": "utf8",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z",
        "accessedAt": "2024-01-15T16:00:00Z",
        "permissions": {
          "read": true,
          "write": true,
          "execute": true,
          "owner": "user-456",
          "group": "developers"
        },
        "metadata": {
          "description": "Source code directory"
        },
        "hash": "sha256:def456...",
        "parentId": "root",
        "children": ["file-123"]
      }
    ],
    "total": 2,
    "totalSize": 1024
  },
  "message": "Files listed successfully"
}
```

### Get File

Retrieve file content and metadata.

**Endpoint**: `GET /api/files/:fileId`

**Path Parameters**:
- `fileId`: File identifier

**Query Parameters**:
- `includeContent` (optional): Include file content (default: true)
- `includeMetadata` (optional): Include file metadata (default: true)
- `encoding` (optional): File encoding (default: auto-detect)

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/files/file-123?includeContent=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "file-123",
    "name": "App.jsx",
    "path": "src/App.jsx",
    "fullPath": "/workspace/projects/project-123/src/App.jsx",
    "type": "file",
    "size": 1024,
    "content": "import React from 'react';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;",
    "mimeType": "text/jsx",
    "encoding": "utf8",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T15:45:00Z",
    "accessedAt": "2024-01-15T16:00:00Z",
    "permissions": {
      "read": true,
      "write": true,
      "execute": false,
      "owner": "user-456",
      "group": "developers"
    },
    "metadata": {
      "language": "javascript",
      "framework": "react",
      "tags": ["component", "main"],
      "dependencies": ["react"],
      "description": "Main application component"
    },
    "hash": "sha256:abc123..."
  },
  "message": "File retrieved successfully"
}
```

### Create File

Create a new file or directory.

**Endpoint**: `POST /api/files`

**Request Body**: `CreateFileRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/files" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TodoList.jsx",
    "path": "src/components/TodoList.jsx",
    "content": "import React from \'react\';\n\nfunction TodoList() {\n  return (\n    <div>\n      <h2>Todo List</h2>\n    </div>\n  );\n}\n\nexport default TodoList;",
    "type": "file",
    "mimeType": "text/jsx",
    "encoding": "utf8",
    "metadata": {
      "language": "javascript",
      "framework": "react",
      "tags": ["component", "todo"],
      "description": "Todo list component"
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "file-789",
    "name": "TodoList.jsx",
    "path": "src/components/TodoList.jsx",
    "fullPath": "/workspace/projects/project-123/src/components/TodoList.jsx",
    "type": "file",
    "size": 256,
    "content": "import React from 'react';\n\nfunction TodoList() {\n  return (\n    <div>\n      <h2>Todo List</h2>\n    </div>\n  );\n}\n\nexport default TodoList;",
    "mimeType": "text/jsx",
    "encoding": "utf8",
    "createdAt": "2024-01-15T16:30:00Z",
    "updatedAt": "2024-01-15T16:30:00Z",
    "accessedAt": "2024-01-15T16:30:00Z",
    "permissions": {
      "read": true,
      "write": true,
      "execute": false,
      "owner": "user-456",
      "group": "developers"
    },
    "metadata": {
      "language": "javascript",
      "framework": "react",
      "tags": ["component", "todo"],
      "description": "Todo list component"
    },
    "hash": "sha256:ghi789..."
  },
  "message": "File created successfully"
}
```

### Update File

Update file content or metadata.

**Endpoint**: `PUT /api/files/:fileId`

**Path Parameters**:
- `fileId`: File identifier

**Request Body**: `UpdateFileRequest`

**Request Example**:
```bash
curl -X PUT "http://localhost:3001/api/files/file-123" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "import React from \'react\';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n      <p>Welcome to my React app!</p>\n    </div>\n  );\n}\n\nexport default App;",
    "metadata": {
      "description": "Updated main application component with welcome message"
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "file-123",
    "name": "App.jsx",
    "path": "src/App.jsx",
    "fullPath": "/workspace/projects/project-123/src/App.jsx",
    "type": "file",
    "size": 1280,
    "content": "import React from 'react';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n      <p>Welcome to my React app!</p>\n    </div>\n  );\n}\n\nexport default App;",
    "mimeType": "text/jsx",
    "encoding": "utf8",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T17:00:00Z",
    "accessedAt": "2024-01-15T17:00:00Z",
    "permissions": {
      "read": true,
      "write": true,
      "execute": false,
      "owner": "user-456",
      "group": "developers"
    },
    "metadata": {
      "language": "javascript",
      "framework": "react",
      "tags": ["component", "main"],
      "description": "Updated main application component with welcome message"
    },
    "hash": "sha256:jkl012..."
  },
  "message": "File updated successfully"
}
```

### Delete File

Delete a file or directory.

**Endpoint**: `DELETE /api/files/:fileId`

**Path Parameters**:
- `fileId`: File identifier

**Query Parameters**:
- `recursive` (optional): Delete directory contents recursively (default: false)
- `force` (optional): Force deletion without confirmation (default: false)

**Request Example**:
```bash
curl -X DELETE "http://localhost:3001/api/files/file-789?recursive=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "deletedFiles": ["file-789"],
    "deletedDirectories": [],
    "totalDeleted": 1,
    "freedSpace": 256
  },
  "message": "File deleted successfully"
}
```

### Rename File

Rename a file or move it to a different location.

**Endpoint**: `PUT /api/files/:fileId/rename`

**Path Parameters**:
- `fileId`: File identifier

**Request Body**:
```json
{
  "newName": "NewApp.jsx",
  "newPath": "src/components/NewApp.jsx"
}
```

**Request Example**:
```bash
curl -X PUT "http://localhost:3001/api/files/file-123/rename" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newName": "NewApp.jsx",
    "newPath": "src/components/NewApp.jsx"
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "file-123",
    "oldName": "App.jsx",
    "newName": "NewApp.jsx",
    "oldPath": "src/App.jsx",
    "newPath": "src/components/NewApp.jsx",
    "fullPath": "/workspace/projects/project-123/src/components/NewApp.jsx",
    "type": "file",
    "size": 1280,
    "mimeType": "text/jsx",
    "encoding": "utf8",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T17:30:00Z",
    "accessedAt": "2024-01-15T17:30:00Z",
    "permissions": {
      "read": true,
      "write": true,
      "execute": false,
      "owner": "user-456",
      "group": "developers"
    },
    "metadata": {
      "language": "javascript",
      "framework": "react",
      "tags": ["component", "main"],
      "description": "Updated main application component with welcome message"
    },
    "hash": "sha256:jkl012..."
  },
  "message": "File renamed successfully"
}
```

### File Info

Get detailed file information without content.

**Endpoint**: `GET /api/files/:fileId/info`

**Path Parameters**:
- `fileId`: File identifier

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/files/file-123/info" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "file-123",
    "name": "NewApp.jsx",
    "path": "src/components/NewApp.jsx",
    "fullPath": "/workspace/projects/project-123/src/components/NewApp.jsx",
    "type": "file",
    "size": 1280,
    "mimeType": "text/jsx",
    "encoding": "utf8",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T17:30:00Z",
    "accessedAt": "2024-01-15T17:30:00Z",
    "permissions": {
      "read": true,
      "write": true,
      "execute": false,
      "owner": "user-456",
      "group": "developers"
    },
    "metadata": {
      "language": "javascript",
      "framework": "react",
      "tags": ["component", "main"],
      "description": "Updated main application component with welcome message"
    },
    "hash": "sha256:jkl012...",
    "parentId": "dir-789",
    "stats": {
      "lines": 15,
      "words": 45,
      "characters": 256,
      "complexity": 1
    }
  },
  "message": "File info retrieved successfully"
}
```

### File Stats

Get file statistics and analytics.

**Endpoint**: `GET /api/files/:fileId/stats`

**Path Parameters**:
- `fileId`: File identifier

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/files/file-123/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "fileId": "file-123",
    "name": "NewApp.jsx",
    "path": "src/components/NewApp.jsx",
    "basicStats": {
      "size": 1280,
      "lines": 15,
      "words": 45,
      "characters": 256,
      "emptyLines": 2
    },
    "codeStats": {
      "language": "javascript",
      "framework": "react",
      "imports": 1,
      "exports": 1,
      "functions": 1,
      "components": 1,
      "complexity": 1,
      "maintainability": 85
    },
    "gitStats": {
      "commits": 3,
      "lastCommit": "2024-01-15T17:30:00Z",
      "contributors": 1,
      "changes": 5
    },
    "usageStats": {
      "lastAccessed": "2024-01-15T17:30:00Z",
      "accessCount": 12,
      "editCount": 3,
      "viewTime": 1800
    }
  },
  "message": "File stats retrieved successfully"
}
```

### File Search

Search files by content or metadata.

**Endpoint**: `POST /api/files/search`

**Request Body**: `FileSearchRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/files/search" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "React component",
    "projectId": "project-123",
    "filters": {
      "type": "file",
      "language": "javascript",
      "tags": ["component"]
    },
    "options": {
      "includeContent": false,
      "maxResults": 10,
      "sortBy": "relevance",
      "sortOrder": "desc"
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "query": "React component",
    "totalResults": 2,
    "results": [
      {
        "id": "file-123",
        "name": "NewApp.jsx",
        "path": "src/components/NewApp.jsx",
        "type": "file",
        "size": 1280,
        "mimeType": "text/jsx",
        "relevance": 0.95,
        "matches": [
          {
            "line": 1,
            "content": "import React from 'react';",
            "highlight": "import **React** from 'react';"
          },
          {
            "line": 3,
            "content": "function App() {",
            "highlight": "function **App**() {"
          }
        ],
        "metadata": {
          "language": "javascript",
          "framework": "react",
          "tags": ["component", "main"]
        }
      },
      {
        "id": "file-789",
        "name": "TodoList.jsx",
        "path": "src/components/TodoList.jsx",
        "type": "file",
        "size": 256,
        "mimeType": "text/jsx",
        "relevance": 0.87,
        "matches": [
          {
            "line": 3,
            "content": "function TodoList() {",
            "highlight": "function **TodoList**() {"
          }
        ],
        "metadata": {
          "language": "javascript",
          "framework": "react",
          "tags": ["component", "todo"]
        }
      }
    ],
    "facets": {
      "languages": {
        "javascript": 2
      },
      "frameworks": {
        "react": 2
      },
      "tags": {
        "component": 2,
        "main": 1,
        "todo": 1
      }
    }
  },
  "message": "Search completed successfully"
}
```

### File Upload

Upload files to a project.

**Endpoint**: `POST /api/files/upload`

**Request Body**: `FormData` with files and metadata

**Form Data Fields**:
- `files`: File(s) to upload
- `projectId`: Project identifier
- `path`: Destination path (optional)
- `overwrite`: Overwrite existing files (optional)
- `metadata`: JSON string with file metadata (optional)

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/files/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@/path/to/local/file.js" \
  -F "projectId=project-123" \
  -F "path=src/components" \
  -F "overwrite=true" \
  -F "metadata={\"language\":\"javascript\",\"tags\":[\"component\"]}"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "uploaded": [
      {
        "id": "file-999",
        "name": "file.js",
        "path": "src/components/file.js",
        "fullPath": "/workspace/projects/project-123/src/components/file.js",
        "type": "file",
        "size": 512,
        "mimeType": "text/javascript",
        "encoding": "utf8",
        "createdAt": "2024-01-15T18:00:00Z",
        "updatedAt": "2024-01-15T18:00:00Z",
        "accessedAt": "2024-01-15T18:00:00Z",
        "permissions": {
          "read": true,
          "write": true,
          "execute": false,
          "owner": "user-456",
          "group": "developers"
        },
        "metadata": {
          "language": "javascript",
          "tags": ["component"]
        },
        "hash": "sha256:mno345..."
      }
    ],
    "skipped": [],
    "errors": [],
    "totalUploaded": 1,
    "totalSize": 512
  },
  "message": "Files uploaded successfully"
}
```

### File Download

Download files from a project.

**Endpoint**: `GET /api/files/:fileId/download`

**Path Parameters**:
- `fileId`: File identifier

**Query Parameters**:
- `format` (optional): Download format (default: original)
- `encoding` (optional): File encoding (default: auto-detect)

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/files/file-123/download" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output "downloaded-file.jsx"
```

**Response**: File content as binary data with appropriate headers

### Batch Operations

Perform multiple file operations in a single request.

**Endpoint**: `POST /api/files/batch`

**Request Body**:
```json
{
  "operations": [
    {
      "operation": "create",
      "data": {
        "name": "NewFile.js",
        "path": "src/NewFile.js",
        "content": "console.log('Hello World');"
      }
    },
    {
      "operation": "update",
      "fileId": "file-123",
      "data": {
        "content": "Updated content"
      }
    },
    {
      "operation": "delete",
      "fileId": "file-789"
    }
  ]
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/files/batch" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "operations": [
      {
        "operation": "create",
        "data": {
          "name": "NewFile.js",
          "path": "src/NewFile.js",
          "content": "console.log(\"Hello World\");"
        }
      },
      {
        "operation": "update",
        "fileId": "file-123",
        "data": {
          "content": "Updated content"
        }
      }
    ]
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "operation": "create",
        "success": true,
        "data": {
          "id": "file-888",
          "name": "NewFile.js",
          "path": "src/NewFile.js"
        }
      },
      {
        "operation": "update",
        "success": true,
        "data": {
          "id": "file-123",
          "updatedAt": "2024-01-15T18:30:00Z"
        }
      }
    ],
    "summary": {
      "total": 2,
      "successful": 2,
      "failed": 0
    }
  },
  "message": "Batch operations completed successfully"
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
- `FILE_NOT_FOUND`: File or directory not found
- `FILE_ACCESS_DENIED`: Insufficient permissions
- `FILE_ALREADY_EXISTS`: File or directory already exists
- `FILE_IN_USE`: File is currently in use
- `INVALID_FILE_PATH`: Invalid file path format
- `FILE_TOO_LARGE`: File size exceeds limits
- `UNSUPPORTED_FILE_TYPE`: File type not supported
- `QUOTA_EXCEEDED`: Storage quota exceeded
- `NETWORK_ERROR`: Network communication error
- `VALIDATION_ERROR`: Request validation failed

### Error Response Example
```json
{
  "success": false,
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "File 'src/nonexistent.js' not found",
    "details": {
      "path": "src/nonexistent.js",
      "projectId": "project-123"
    },
    "timestamp": "2024-01-15T18:45:00Z",
    "requestId": "req-abc123"
  }
}
```

## 🔐 Authentication & Authorization

### Required Headers
```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Permission Requirements
- **Read Operations**: User must have read access to the project
- **Write Operations**: User must have write access to the project
- **Delete Operations**: User must have write access to the project
- **Admin Operations**: User must have admin role in the project

### Session Validation
```javascript
// Check if user has access to file
const hasAccess = await checkFileAccess(fileId, userId, operation);

if (!hasAccess) {
  throw new Error('Access denied');
}
```

## 📈 Rate Limiting

### Rate Limits
- **Standard Users**: 100 requests per minute
- **Premium Users**: 500 requests per minute
- **Admin Users**: 1000 requests per minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642251600
```

### Rate Limit Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "details": {
      "limit": 100,
      "reset": 1642251600
    }
  }
}
```

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
import { AICodingAssistantAPI } from '@ai-coding-assistant/sdk';

const api = new AICodingAssistantAPI({
  baseURL: 'http://localhost:3001',
  token: 'your-jwt-token'
});

// List files
const files = await api.files.list({
  projectId: 'project-123',
  path: 'src',
  recursive: true
});

// Create file
const newFile = await api.files.create({
  name: 'NewComponent.jsx',
  path: 'src/components',
  content: 'import React from "react";',
  type: 'file'
});

// Update file
const updatedFile = await api.files.update('file-123', {
  content: 'Updated content'
});

// Delete file
await api.files.delete('file-123');
```

### Python
```python
from ai_coding_assistant import AICodingAssistantAPI

api = AICodingAssistantAPI(
    base_url="http://localhost:3001",
    token="your-jwt-token"
)

# List files
files = api.files.list(
    project_id="project-123",
    path="src",
    recursive=True
)

# Create file
new_file = api.files.create(
    name="NewComponent.jsx",
    path="src/components",
    content="import React from 'react';",
    type="file"
)

# Update file
updated_file = api.files.update("file-123", {
    "content": "Updated content"
})

# Delete file
api.files.delete("file-123")
```

## 🧪 Testing

### Test File Creation
```bash
# Test creating a simple file
curl -X POST "http://localhost:3001/api/files" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test.js",
    "path": "test.js",
    "content": "console.log(\"test\");",
    "type": "file"
  }'
```

### Test File Operations
```bash
# Test reading the created file
curl -X GET "http://localhost:3001/api/files/FILE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test updating the file
curl -X PUT "http://localhost:3001/api/files/FILE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "console.log(\"updated\");"}'

# Test deleting the file
curl -X DELETE "http://localhost:3001/api/files/FILE_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Configuration

### Environment Variables
```bash
# File system configuration
FILE_STORAGE_PATH=/workspace/projects
FILE_MAX_SIZE=104857600
FILE_ALLOWED_TYPES=js,jsx,ts,tsx,html,css,json,md,txt
FILE_BACKUP_ENABLED=true
FILE_BACKUP_RETENTION=30
```

### Server Configuration
```javascript
// File manager configuration
const fileManagerConfig = {
  storagePath: process.env.FILE_STORAGE_PATH || '/workspace/projects',
  maxFileSize: parseInt(process.env.FILE_MAX_SIZE) || 100 * 1024 * 1024, // 100MB
  allowedTypes: process.env.FILE_ALLOWED_TYPES?.split(',') || ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'md', 'txt'],
  backupEnabled: process.env.FILE_BACKUP_ENABLED === 'true',
  backupRetention: parseInt(process.env.FILE_BACKUP_RETENTION) || 30,
  tempDir: '/tmp/ai-coding-assistant',
  maxConcurrentUploads: 5
};
```

---

## 🎉 Ready to Use Files API!

You now have comprehensive information about the Files API. Start managing your project files with our powerful file management endpoints.

**Happy file management! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This API documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*