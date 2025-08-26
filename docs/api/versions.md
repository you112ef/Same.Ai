# Versions API

The Versions API provides comprehensive version control capabilities within AI Coding Assistant, including snapshot creation, version management, and project history tracking.

## 📋 Overview

The Versions API allows you to:
- Create snapshots of project states
- Manage version history and rollbacks
- Compare different versions of files
- Track project evolution over time
- Export and import project versions
- Manage version metadata and descriptions
- Handle version conflicts and merges
- Archive and restore project states

## 🔗 Base Endpoint

```
GET/POST/PUT/DELETE /api/versions
```

## 📚 Available Endpoints

### Core Version Operations
- **[List Versions](#list-versions)** - Get version history for a project
- **[Get Version](#get-version)** - Retrieve version details and content
- **[Create Version](#create-version)** - Create a new project snapshot
- **[Update Version](#update-version)** - Modify version metadata
- **[Delete Version](#delete-version)** - Remove a version from history
- **[Restore Version](#restore-version)** - Restore project to a specific version

### Version Management
- **[Version Info](#version-info)** - Get detailed version information
- **[Version Stats](#version-stats)** - Get version statistics and analytics
- **[Version Compare](#version-compare)** - Compare two versions
- **[Version Export](#version-export)** - Export version as archive
- **[Version Import](#version-import)** - Import version from archive

### Advanced Operations
- **[Batch Operations](#batch-operations)** - Perform multiple version operations
- **[Version Tags](#version-tags)** - Manage version tags and labels
- **[Version Branches](#version-branches)** - Create and manage version branches
- **[Version Merge](#version-merge)** - Merge different versions

## 📊 Data Models

### Version Object
```typescript
interface VersionObject {
  id: string;                      // Unique version identifier
  projectId: string;               // Associated project ID
  name: string;                    // Version name/title
  description?: string;            // Version description
  tag: string;                     // Version tag (e.g., "v1.0.0")
  type: 'snapshot' | 'release' | 'backup' | 'milestone';
  status: 'active' | 'archived' | 'deprecated';
  createdAt: string;               // Creation timestamp (ISO 8601)
  createdBy: string;               // User who created the version
  parentVersionId?: string;        // Parent version ID
  childVersionIds: string[];       // Child version IDs
  metadata: VersionMetadata;       // Version metadata
  files: VersionFile[];            // Files in this version
  stats: VersionStats;             // Version statistics
  checksum: string;                // Version content checksum
  size: number;                    // Total version size in bytes
  compressionRatio: number;        // Compression ratio
}

interface VersionMetadata {
  message?: string;                // Commit message
  author: string;                  // Version author
  email?: string;                  // Author email
  branch?: string;                 // Git branch (if applicable)
  commitHash?: string;             // Git commit hash (if applicable)
  environment?: string;            // Environment (dev, staging, prod)
  dependencies?: {                 // Dependency versions
    [key: string]: string;
  };
  buildInfo?: {                    // Build information
    buildNumber: string;
    buildDate: string;
    buildEnvironment: string;
  };
  custom?: Record<string, any>;    // Custom metadata
}

interface VersionFile {
  id: string;                      // File identifier
  path: string;                    // File path
  name: string;                    // File name
  content: string;                 // File content
  size: number;                    // File size in bytes
  mimeType: string;                // MIME type
  encoding: string;                // File encoding
  hash: string;                    // File content hash
  lastModified: string;            // Last modification timestamp
  permissions: FilePermissions;    // File permissions
  metadata: FileMetadata;          // File metadata
}

interface VersionStats {
  totalFiles: number;              // Total number of files
  totalSize: number;               // Total size in bytes
  fileTypes: {                     // File type distribution
    [key: string]: number;
  };
  languages: {                     // Programming language distribution
    [key: string]: number;
  };
  frameworks: {                    // Framework distribution
    [key: string]: number;
  };
  complexity: {                    // Code complexity metrics
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    technicalDebt: number;
  };
  quality: {                       // Code quality metrics
    codeCoverage: number;
    testCount: number;
    lintScore: number;
  };
}
```

### Create Version Request
```typescript
interface CreateVersionRequest {
  projectId: string;               // Project identifier
  name: string;                    // Version name
  description?: string;            // Version description
  tag: string;                     // Version tag
  type: 'snapshot' | 'release' | 'backup' | 'milestone';
  message?: string;                // Commit message
  includeFiles: boolean;           // Include file contents
  includeMetadata: boolean;        // Include metadata
  compression: 'none' | 'gzip' | 'zip';
  parentVersionId?: string;        // Parent version ID
  metadata?: Partial<VersionMetadata>;
  options?: {
    excludePatterns?: string[];    // File patterns to exclude
    includeHidden?: boolean;       // Include hidden files
    maxFileSize?: number;          // Maximum file size to include
    validateContent?: boolean;     // Validate file content
  };
}
```

### Update Version Request
```typescript
interface UpdateVersionRequest {
  name?: string;                   // New version name
  description?: string;            // New description
  tag?: string;                    // New version tag
  status?: 'active' | 'archived' | 'deprecated';
  metadata?: Partial<VersionMetadata>;
}
```

### Version Compare Request
```typescript
interface VersionCompareRequest {
  sourceVersionId: string;         // Source version ID
  targetVersionId: string;         // Target version ID
  options?: {
    includeContent?: boolean;       // Include file content differences
    includeMetadata?: boolean;      // Include metadata differences
    includeStats?: boolean;         // Include statistics differences
    format?: 'diff' | 'summary' | 'detailed';
    maxFileSize?: number;          // Maximum file size for content comparison
  };
}
```

## 🚀 API Endpoints

### List Versions

Get version history for a project.

**Endpoint**: `GET /api/versions`

**Query Parameters**:
- `projectId` (required): Project identifier
- `type` (optional): Filter by version type
- `status` (optional): Filter by version status
- `tag` (optional): Filter by version tag
- `author` (optional): Filter by author
- `dateFrom` (optional): Filter by creation date (from)
- `dateTo` (optional): Filter by creation date (to)
- `limit` (optional): Maximum number of versions to return (default: 50)
- `offset` (optional): Number of versions to skip (default: 0)
- `sortBy` (optional): Sort field (default: 'createdAt')
- `sortOrder` (optional): Sort order (default: 'desc')

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/versions?projectId=project-123&type=snapshot&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "versions": [
      {
        "id": "version-123",
        "projectId": "project-123",
        "name": "Initial Release",
        "description": "First stable version of the project",
        "tag": "v1.0.0",
        "type": "release",
        "status": "active",
        "createdAt": "2024-01-15T10:00:00Z",
        "createdBy": "user-456",
        "parentVersionId": null,
        "childVersionIds": ["version-456"],
        "metadata": {
          "message": "Initial release with core features",
          "author": "John Doe",
          "email": "john@example.com",
          "environment": "production",
          "dependencies": {
            "react": "18.2.0",
            "node": "18.0.0"
          }
        },
        "stats": {
          "totalFiles": 25,
          "totalSize": 1024000,
          "fileTypes": {
            "js": 10,
            "jsx": 8,
            "css": 5,
            "html": 2
          },
          "languages": {
            "javascript": 18,
            "css": 5,
            "html": 2
          },
          "frameworks": {
            "react": 18
          }
        },
        "checksum": "sha256:abc123...",
        "size": 512000,
        "compressionRatio": 0.5
      }
    ],
    "pagination": {
      "total": 15,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  },
  "message": "Versions retrieved successfully"
}
```

### Get Version

Retrieve version details and content.

**Endpoint**: `GET /api/versions/:versionId`

**Path Parameters**:
- `versionId`: Version identifier

**Query Parameters**:
- `includeFiles` (optional): Include file contents (default: false)
- `includeMetadata` (optional): Include metadata (default: true)
- `includeStats` (optional): Include statistics (default: true)
- `filePath` (optional): Filter files by path

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/versions/version-123?includeFiles=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "version-123",
    "projectId": "project-123",
    "name": "Initial Release",
    "description": "First stable version of the project",
    "tag": "v1.0.0",
    "type": "release",
    "status": "active",
    "createdAt": "2024-01-15T10:00:00Z",
    "createdBy": "user-456",
    "parentVersionId": null,
    "childVersionIds": ["version-456"],
    "metadata": {
      "message": "Initial release with core features",
      "author": "John Doe",
      "email": "john@example.com",
      "environment": "production",
      "dependencies": {
        "react": "18.2.0",
        "node": "18.0.0"
      }
    },
    "files": [
      {
        "id": "file-123",
        "path": "src/App.jsx",
        "name": "App.jsx",
        "content": "import React from 'react';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;",
        "size": 1024,
        "mimeType": "text/jsx",
        "encoding": "utf8",
        "hash": "sha256:def456...",
        "lastModified": "2024-01-15T09:30:00Z",
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
        }
      }
    ],
    "stats": {
      "totalFiles": 25,
      "totalSize": 1024000,
      "fileTypes": {
        "js": 10,
        "jsx": 8,
        "css": 5,
        "html": 2
      },
      "languages": {
        "javascript": 18,
        "css": 5,
        "html": 2
      },
      "frameworks": {
        "react": 18
      },
      "complexity": {
        "cyclomaticComplexity": 15,
        "maintainabilityIndex": 85,
        "technicalDebt": 2.5
      },
      "quality": {
        "codeCoverage": 78,
        "testCount": 12,
        "lintScore": 92
      }
    },
    "checksum": "sha256:abc123...",
    "size": 512000,
    "compressionRatio": 0.5
  },
  "message": "Version retrieved successfully"
}
```

### Create Version

Create a new project snapshot.

**Endpoint**: `POST /api/versions`

**Request Body**: `CreateVersionRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/versions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "project-123",
    "name": "Feature Update",
    "description": "Added new todo functionality",
    "tag": "v1.1.0",
    "type": "snapshot",
    "message": "Add todo list feature",
    "includeFiles": true,
    "includeMetadata": true,
    "compression": "gzip",
    "parentVersionId": "version-123",
    "metadata": {
      "author": "Jane Smith",
      "email": "jane@example.com",
      "environment": "development",
      "dependencies": {
        "react": "18.2.0",
        "node": "18.0.0"
      }
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "version-456",
    "projectId": "project-123",
    "name": "Feature Update",
    "description": "Added new todo functionality",
    "tag": "v1.1.0",
    "type": "snapshot",
    "status": "active",
    "createdAt": "2024-01-15T16:00:00Z",
    "createdBy": "user-789",
    "parentVersionId": "version-123",
    "childVersionIds": [],
    "metadata": {
      "message": "Add todo list feature",
      "author": "Jane Smith",
      "email": "jane@example.com",
      "environment": "development",
      "dependencies": {
        "react": "18.2.0",
        "node": "18.0.0"
      }
    },
    "stats": {
      "totalFiles": 28,
      "totalSize": 1152000,
      "fileTypes": {
        "js": 12,
        "jsx": 10,
        "css": 5,
        "html": 1
      },
      "languages": {
        "javascript": 22,
        "css": 5,
        "html": 1
      },
      "frameworks": {
        "react": 22
      }
    },
    "checksum": "sha256:ghi789...",
    "size": 576000,
    "compressionRatio": 0.5
  },
  "message": "Version created successfully"
}
```

### Update Version

Modify version metadata.

**Endpoint**: `PUT /api/versions/:versionId`

**Path Parameters**:
- `versionId`: Version identifier

**Request Body**: `UpdateVersionRequest`

**Request Example**:
```bash
curl -X PUT "http://localhost:3001/api/versions/version-456" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Todo Feature Update",
    "description": "Enhanced todo functionality with better UI",
    "tag": "v1.1.1",
    "status": "active",
    "metadata": {
      "message": "Enhanced todo functionality with better UI",
      "environment": "staging"
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "version-456",
    "projectId": "project-123",
    "name": "Todo Feature Update",
    "description": "Enhanced todo functionality with better UI",
    "tag": "v1.1.1",
    "type": "snapshot",
    "status": "active",
    "createdAt": "2024-01-15T16:00:00Z",
    "createdBy": "user-789",
    "parentVersionId": "version-123",
    "childVersionIds": [],
    "metadata": {
      "message": "Enhanced todo functionality with better UI",
      "author": "Jane Smith",
      "email": "jane@example.com",
      "environment": "staging",
      "dependencies": {
        "react": "18.2.0",
        "node": "18.0.0"
      }
    },
    "stats": {
      "totalFiles": 28,
      "totalSize": 1152000,
      "fileTypes": {
        "js": 12,
        "jsx": 10,
        "css": 5,
        "html": 1
      },
      "languages": {
        "javascript": 22,
        "css": 5,
        "html": 1
      },
      "frameworks": {
        "react": 22
      }
    },
    "checksum": "sha256:ghi789...",
    "size": 576000,
    "compressionRatio": 0.5,
    "updatedAt": "2024-01-15T17:00:00Z"
  },
  "message": "Version updated successfully"
}
```

### Delete Version

Remove a version from history.

**Endpoint**: `DELETE /api/versions/:versionId`

**Path Parameters**:
- `versionId`: Version identifier

**Query Parameters**:
- `force` (optional): Force deletion without validation (default: false)
- `cascade` (optional): Delete child versions (default: false)

**Request Example**:
```bash
curl -X DELETE "http://localhost:3001/api/versions/version-456?cascade=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "deletedVersions": ["version-456"],
    "deletedFiles": 28,
    "freedSpace": 576000,
    "totalDeleted": 1
  },
  "message": "Version deleted successfully"
}
```

### Restore Version

Restore project to a specific version.

**Endpoint**: `POST /api/versions/:versionId/restore`

**Path Parameters**:
- `versionId`: Version identifier to restore from

**Request Body**:
```json
{
  "options": {
    "overwrite": true,             // Overwrite existing files
    "createBackup": true,          // Create backup before restore
    "includeMetadata": true,       // Include version metadata
    "validateContent": true,       // Validate file content
    "notifyUsers": true            // Notify project users
  }
}
```

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/versions/version-123/restore" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "options": {
      "overwrite": true,
      "createBackup": true,
      "includeMetadata": true,
      "validateContent": true,
      "notifyUsers": true
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "restoredVersion": "version-123",
    "restoredFiles": 25,
    "restoredSize": 1024000,
    "backupCreated": "version-backup-789",
    "restoreTimestamp": "2024-01-15T18:00:00Z",
    "restoredBy": "user-456",
    "summary": {
      "filesCreated": 5,
      "filesUpdated": 20,
      "filesDeleted": 3,
      "conflictsResolved": 2
    }
  },
  "message": "Version restored successfully"
}
```

### Version Info

Get detailed version information without content.

**Endpoint**: `GET /api/versions/:versionId/info`

**Path Parameters**:
- `versionId`: Version identifier

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/versions/version-123/info" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "id": "version-123",
    "projectId": "project-123",
    "name": "Initial Release",
    "description": "First stable version of the project",
    "tag": "v1.0.0",
    "type": "release",
    "status": "active",
    "createdAt": "2024-01-15T10:00:00Z",
    "createdBy": "user-456",
    "parentVersionId": null,
    "childVersionIds": ["version-456"],
    "metadata": {
      "message": "Initial release with core features",
      "author": "John Doe",
      "email": "john@example.com",
      "environment": "production",
      "dependencies": {
        "react": "18.2.0",
        "node": "18.0.0"
      }
    },
    "stats": {
      "totalFiles": 25,
      "totalSize": 1024000,
      "fileTypes": {
        "js": 10,
        "jsx": 8,
        "css": 5,
        "html": 2
      },
      "languages": {
        "javascript": 18,
        "css": 5,
        "html": 2
      },
      "frameworks": {
        "react": 18
      }
    },
    "checksum": "sha256:abc123...",
    "size": 512000,
    "compressionRatio": 0.5,
    "fileList": [
      {
        "path": "src/App.jsx",
        "name": "App.jsx",
        "size": 1024,
        "hash": "sha256:def456..."
      }
    ]
  },
  "message": "Version info retrieved successfully"
}
```

### Version Stats

Get version statistics and analytics.

**Endpoint**: `GET /api/versions/:versionId/stats`

**Path Parameters**:
- `versionId`: Version identifier

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/versions/version-123/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "versionId": "version-123",
    "name": "Initial Release",
    "tag": "v1.0.0",
    "basicStats": {
      "totalFiles": 25,
      "totalSize": 1024000,
      "compressedSize": 512000,
      "compressionRatio": 0.5
    },
    "fileTypeStats": {
      "js": {
        "count": 10,
        "size": 409600,
        "avgSize": 40960
      },
      "jsx": {
        "count": 8,
        "size": 327680,
        "avgSize": 40960
      },
      "css": {
        "count": 5,
        "size": 204800,
        "avgSize": 40960
      },
      "html": {
        "count": 2,
        "size": 81920,
        "avgSize": 40960
      }
    },
    "languageStats": {
      "javascript": {
        "count": 18,
        "size": 737280,
        "percentage": 72
      },
      "css": {
        "count": 5,
        "size": 204800,
        "percentage": 20
      },
      "html": {
        "count": 2,
        "size": 81920,
        "percentage": 8
      }
    },
    "complexityStats": {
      "cyclomaticComplexity": {
        "min": 1,
        "max": 15,
        "average": 8,
        "total": 200
      },
      "maintainabilityIndex": {
        "min": 65,
        "max": 95,
        "average": 85,
        "total": 2125
      },
      "technicalDebt": {
        "min": 0.5,
        "max": 5.0,
        "average": 2.5,
        "total": 62.5
      }
    },
    "qualityStats": {
      "codeCoverage": {
        "percentage": 78,
        "coveredLines": 156,
        "totalLines": 200
      },
      "testCount": 12,
      "lintScore": {
        "score": 92,
        "issues": 8,
        "critical": 0,
        "warnings": 5,
        "info": 3
      }
    },
    "trends": {
      "fileGrowth": 0.15,
      "complexityChange": -0.1,
      "qualityImprovement": 0.05
    }
  },
  "message": "Version stats retrieved successfully"
}
```

### Version Compare

Compare two versions.

**Endpoint**: `POST /api/versions/compare`

**Request Body**: `VersionCompareRequest`

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/versions/compare" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceVersionId": "version-123",
    "targetVersionId": "version-456",
    "options": {
      "includeContent": true,
      "includeMetadata": true,
      "includeStats": true,
      "format": "detailed",
      "maxFileSize": 1048576
    }
  }'
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "sourceVersion": {
      "id": "version-123",
      "name": "Initial Release",
      "tag": "v1.0.0",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    "targetVersion": {
      "id": "version-456",
      "name": "Feature Update",
      "tag": "v1.1.0",
      "createdAt": "2024-01-15T16:00:00Z"
    },
    "summary": {
      "filesAdded": 3,
      "filesModified": 5,
      "filesDeleted": 0,
      "filesUnchanged": 22,
      "totalChanges": 8,
      "sizeChange": 128000,
      "sizeChangePercentage": 12.5
    },
    "fileChanges": [
      {
        "path": "src/components/TodoList.jsx",
        "status": "added",
        "size": 256,
        "content": "import React from 'react';\n\nfunction TodoList() {\n  return (\n    <div>\n      <h2>Todo List</h2>\n    </div>\n  );\n}\n\nexport default TodoList;"
      },
      {
        "path": "src/App.jsx",
        "status": "modified",
        "oldSize": 1024,
        "newSize": 1280,
        "sizeChange": 256,
        "changes": [
          {
            "type": "addition",
            "line": 6,
            "content": "      <TodoList />"
          }
        ]
      }
    ],
    "metadataChanges": {
      "dependencies": {
        "added": {},
        "removed": {},
        "modified": {}
      },
      "environment": {
        "from": "production",
        "to": "development"
      }
    },
    "statsChanges": {
      "totalFiles": {
        "from": 25,
        "to": 28,
        "change": 3
      },
      "totalSize": {
        "from": 1024000,
        "to": 1152000,
        "change": 128000
      },
      "complexity": {
        "cyclomaticComplexity": {
          "from": 15,
          "to": 18,
          "change": 3
        }
      }
    }
  },
  "message": "Version comparison completed successfully"
}
```

### Version Export

Export version as archive.

**Endpoint**: `GET /api/versions/:versionId/export`

**Path Parameters**:
- `versionId`: Version identifier

**Query Parameters**:
- `format` (optional): Export format (default: 'zip')
- `includeMetadata` (optional): Include metadata (default: true)
- `compression` (optional): Compression level (default: 'normal')

**Request Example**:
```bash
curl -X GET "http://localhost:3001/api/versions/version-123/export?format=zip&compression=high" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output "version-v1.0.0.zip"
```

**Response**: Archive file with appropriate headers

### Version Import

Import version from archive.

**Endpoint**: `POST /api/versions/import`

**Request Body**: `FormData` with archive and metadata

**Form Data Fields**:
- `archive`: Version archive file
- `projectId`: Target project identifier
- `overwrite` (optional): Overwrite existing version
- `validate` (optional): Validate archive contents

**Request Example**:
```bash
curl -X POST "http://localhost:3001/api/versions/import" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "archive=@/path/to/version-v1.0.0.zip" \
  -F "projectId=project-123" \
  -F "overwrite=true" \
  -F "validate=true"
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "importedVersion": {
      "id": "version-imported-789",
      "name": "Imported Version",
      "tag": "v1.0.0",
      "type": "snapshot",
      "status": "active"
    },
    "importedFiles": 25,
    "importedSize": 1024000,
    "validationResults": {
      "valid": true,
      "warnings": [],
      "errors": []
    }
  },
  "message": "Version imported successfully"
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
- `VERSION_NOT_FOUND`: Version not found
- `VERSION_ACCESS_DENIED`: Insufficient permissions
- `VERSION_IN_USE`: Version is currently in use
- `INVALID_VERSION_DATA`: Invalid version data
- `VERSION_CONFLICT`: Version conflict detected
- `STORAGE_QUOTA_EXCEEDED`: Storage quota exceeded
- `COMPRESSION_ERROR`: Compression/decompression error
- `VALIDATION_ERROR`: Validation failed
- `RESTORE_CONFLICT`: Restore operation conflict
- `EXPORT_ERROR`: Export operation failed

### Error Response Example
```json
{
  "success": false,
  "error": {
    "code": "VERSION_NOT_FOUND",
    "message": "Version 'v2.0.0' not found",
    "details": {
      "versionId": "version-999",
      "projectId": "project-123"
    },
    "timestamp": "2024-01-15T19:00:00Z",
    "requestId": "req-def456"
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
- **Delete Operations**: User must have admin role in the project
- **Restore Operations**: User must have admin role in the project

### Session Validation
```javascript
// Check if user has access to version
const hasAccess = await checkVersionAccess(versionId, userId, operation);

if (!hasAccess) {
  throw new Error('Access denied');
}
```

## 📈 Rate Limiting

### Rate Limits
- **Standard Users**: 50 requests per minute
- **Premium Users**: 200 requests per minute
- **Admin Users**: 500 requests per minute

### Rate Limit Headers
```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642251600
```

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
import { AICodingAssistantAPI } from '@ai-coding-assistant/sdk';

const api = new AICodingAssistantAPI({
  baseURL: 'http://localhost:3001',
  token: 'your-jwt-token'
});

// List versions
const versions = await api.versions.list({
  projectId: 'project-123',
  type: 'snapshot',
  limit: 20
});

// Create version
const newVersion = await api.versions.create({
  projectId: 'project-123',
  name: 'Feature Update',
  tag: 'v1.1.0',
  type: 'snapshot',
  includeFiles: true
});

// Compare versions
const comparison = await api.versions.compare({
  sourceVersionId: 'version-123',
  targetVersionId: 'version-456'
});

// Restore version
await api.versions.restore('version-123', {
  overwrite: true,
  createBackup: true
});
```

### Python
```python
from ai_coding_assistant import AICodingAssistantAPI

api = AICodingAssistantAPI(
    base_url="http://localhost:3001",
    token="your-jwt-token"
)

# List versions
versions = api.versions.list(
    project_id="project-123",
    type="snapshot",
    limit=20
)

# Create version
new_version = api.versions.create(
    project_id="project-123",
    name="Feature Update",
    tag="v1.1.0",
    type="snapshot",
    include_files=True
)

# Compare versions
comparison = api.versions.compare(
    source_version_id="version-123",
    target_version_id="version-456"
)

# Restore version
api.versions.restore("version-123", {
    "overwrite": True,
    "create_backup": True
})
```

## 🧪 Testing

### Test Version Creation
```bash
# Test creating a version
curl -X POST "http://localhost:3001/api/versions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "project-123",
    "name": "Test Version",
    "tag": "v1.0.0-test",
    "type": "snapshot",
    "includeFiles": true
  }'
```

### Test Version Operations
```bash
# Test listing versions
curl -X GET "http://localhost:3001/api/versions?projectId=project-123" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test getting version details
curl -X GET "http://localhost:3001/api/versions/VERSION_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test comparing versions
curl -X POST "http://localhost:3001/api/versions/compare" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceVersionId": "VERSION_ID_1",
    "targetVersionId": "VERSION_ID_2"
  }'
```

## 🔧 Configuration

### Environment Variables
```bash
# Version control configuration
VERSION_STORAGE_PATH=/workspace/versions
VERSION_MAX_SIZE=1073741824
VERSION_COMPRESSION=gzip
VERSION_BACKUP_ENABLED=true
VERSION_BACKUP_RETENTION=90
VERSION_MAX_HISTORY=100
```

### Server Configuration
```javascript
// Version manager configuration
const versionManagerConfig = {
  storagePath: process.env.VERSION_STORAGE_PATH || '/workspace/versions',
  maxVersionSize: parseInt(process.env.VERSION_MAX_SIZE) || 1024 * 1024 * 1024, // 1GB
  compression: process.env.VERSION_COMPRESSION || 'gzip',
  backupEnabled: process.env.VERSION_BACKUP_ENABLED === 'true',
  backupRetention: parseInt(process.env.VERSION_BACKUP_RETENTION) || 90,
  maxHistory: parseInt(process.env.VERSION_MAX_HISTORY) || 100,
  tempDir: '/tmp/ai-coding-assistant/versions',
  maxConcurrentOperations: 3
};
```

---

## 🎉 Ready to Use Versions API!

You now have comprehensive information about the Versions API. Start managing your project versions with our powerful version control endpoints.

**Happy versioning! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This API documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*