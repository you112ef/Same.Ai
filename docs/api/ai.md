# AI API

The AI API provides endpoints for interacting with AI-powered coding assistance, including chat, code generation, and analysis.

## 📋 Overview

The AI API allows you to:
- Send messages to AI for coding assistance
- Generate code based on descriptions
- Review and analyze existing code
- Get suggestions for improvements
- Debug code issues
- Generate documentation

## 🔗 Base Endpoint

```
POST /api/v1/ai
```

## 📚 Available Endpoints

### Core AI Features
- **[Chat Message](#chat-message)** - Send messages to AI
- **[Code Generation](#code-generation)** - Generate code from descriptions
- **[Code Review](#code-review)** - Review and analyze code
- **[Code Analysis](#code-analysis)** - Analyze code quality and structure
- **[Debugging](#debugging)** - Get help debugging issues
- **[Documentation](#documentation)** - Generate documentation

### Advanced AI Features
- **[Code Optimization](#code-optimization)** - Optimize code performance
- **[Refactoring](#refactoring)** - Refactor existing code
- **[Testing](#testing)** - Generate test cases
- **[Migration](#migration)** - Help with code migrations

## 📊 Data Models

### AI Message Request
```typescript
interface AIMessageRequest {
  message: string;               // User message (required)
  projectId?: string;            // Associated project ID
  context?: MessageContext;      // Additional context
  options?: AIOptions;           // AI behavior options
}

interface MessageContext {
  currentFile?: string;          // Current file being worked on
  cursorPosition?: Position;     // Cursor position in file
  selectedCode?: string;         // Selected code text
  fileContent?: string;          // Full file content
  projectStructure?: FileItem[]; // Project file structure
  language?: string;             // Programming language
  framework?: string;            // Framework being used
}

interface Position {
  line: number;                  // Line number (1-based)
  column: number;                // Column number (1-based)
}

interface AIOptions {
  model?: string;                // AI model to use (default: gpt-4)
  temperature?: number;          // Creativity level (0.0-2.0)
  maxTokens?: number;            // Maximum response length
  includeCode?: boolean;         // Include code in response
  includeExplanation?: boolean;  // Include explanations
  format?: 'text' | 'markdown' | 'json';
}
```

### AI Response
```typescript
interface AIResponse {
  success: boolean;              // Request success status
  data: {
    message: string;             // AI response message
    actions?: AIAction[];        // Suggested actions
    code?: GeneratedCode[];      // Generated code blocks
    explanation?: string;        // Detailed explanation
    suggestions?: string[];      // Improvement suggestions
    metadata: AIMetadata;        // Response metadata
  };
  usage?: APIUsage;              // API usage information
}

interface AIAction {
  type: ActionType;              // Action type
  description: string;           // Action description
  parameters: Record<string, any>; // Action parameters
  confidence: number;            // Confidence level (0-1)
}

enum ActionType {
  'create_file' = 'create_file',
  'edit_file' = 'edit_file',
  'delete_file' = 'delete_file',
  'run_command' = 'run_command',
  'create_snapshot' = 'create_snapshot',
  'suggest_next' = 'suggest_next'
}

interface GeneratedCode {
  language: string;              // Programming language
  content: string;               // Code content
  filename?: string;             // Suggested filename
  description: string;           // Code description
  dependencies?: string[];       // Required dependencies
}

interface AIMetadata {
  model: string;                 // AI model used
  processingTime: number;        // Processing time in ms
  tokensUsed: number;            // Tokens consumed
  confidence: number;            // Response confidence
  suggestions: string[];         // Additional suggestions
}
```

## 🚀 API Endpoints

### Chat Message

Send a message to AI and get a response with coding assistance.

```http
POST /api/v1/ai/chat
```

#### Request Body
```json
{
  "message": "Create a React component for a todo list",
  "projectId": "project-123",
  "context": {
    "currentFile": "src/components/TodoList.jsx",
    "language": "javascript",
    "framework": "react"
  },
  "options": {
    "includeCode": true,
    "includeExplanation": true,
    "format": "markdown"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "message": "I'll create a React component for a todo list. Here's a complete implementation:",
    "actions": [
      {
        "type": "edit_file",
        "description": "Update the TodoList component with the new implementation",
        "parameters": {
          "file": "src/components/TodoList.jsx",
          "content": "// New component content"
        },
        "confidence": 0.95
      }
    ],
    "code": [
      {
        "language": "jsx",
        "content": "import React, { useState } from 'react';\n\nconst TodoList = () => {\n  const [todos, setTodos] = useState([]);\n  const [input, setInput] = useState('');\n\n  const addTodo = () => {\n    if (input.trim()) {\n      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);\n      setInput('');\n    }\n  };\n\n  const toggleTodo = (id) => {\n    setTodos(todos.map(todo => \n      todo.id === id ? { ...todo, completed: !todo.completed } : todo\n    ));\n  };\n\n  return (\n    <div className=\"todo-list\">\n      <h2>Todo List</h2>\n      <div className=\"add-todo\">\n        <input\n          value={input}\n          onChange={(e) => setInput(e.target.value)}\n          placeholder=\"Add a new todo\"\n        />\n        <button onClick={addTodo}>Add</button>\n      </div>\n      <ul>\n        {todos.map(todo => (\n          <li key={todo.id} onClick={() => toggleTodo(todo.id)}>\n            <span className={todo.completed ? 'completed' : ''}>\n              {todo.text}\n            </span>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n};\n\nexport default TodoList;",
        "filename": "src/components/TodoList.jsx",
        "description": "A complete React todo list component with add, toggle, and display functionality",
        "dependencies": ["react"]
      }
    ],
    "explanation": "This component implements a todo list with the following features:\n- State management using React hooks\n- Add new todos with input validation\n- Toggle todo completion status\n- Clean, reusable component structure\n- Proper event handling and state updates",
    "suggestions": [
      "Add CSS styling for better visual appearance",
      "Implement todo deletion functionality",
      "Add local storage persistence",
      "Include todo editing capabilities"
    ],
    "metadata": {
      "model": "gpt-4",
      "processingTime": 1250,
      "tokensUsed": 450,
      "confidence": 0.95,
      "suggestions": [
        "Consider adding PropTypes for type checking",
        "Implement error boundaries for production use"
      ]
    }
  },
  "usage": {
    "promptTokens": 150,
    "completionTokens": 300,
    "totalTokens": 450
  }
}
```

#### Example
```bash
curl -X POST \
  -H "Cookie: session=your-session-id" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a React component for a todo list",
    "projectId": "project-123",
    "context": {
      "language": "javascript",
      "framework": "react"
    }
  }' \
  "http://localhost:3001/api/v1/ai/chat"
```

### Code Generation

Generate code based on a description or specification.

```http
POST /api/v1/ai/generate
```

#### Request Body
```json
{
  "description": "A function that validates email addresses using regex",
  "language": "javascript",
  "context": {
    "projectId": "project-123",
    "framework": "vanilla"
  },
  "options": {
    "includeTests": true,
    "includeDocumentation": true,
    "format": "markdown"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Here's a robust email validation function with tests and documentation:",
    "code": [
      {
        "language": "javascript",
        "content": "/**\n * Validates an email address using regex pattern\n * @param {string} email - The email address to validate\n * @returns {boolean} - True if email is valid, false otherwise\n */\nfunction validateEmail(email) {\n  // RFC 5322 compliant email regex\n  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;\n  \n  return emailRegex.test(email);\n}",
        "filename": "utils/validation.js",
        "description": "Email validation function with RFC 5322 compliant regex",
        "dependencies": []
      },
      {
        "language": "javascript",
        "content": "// Test cases for email validation\nfunction testEmailValidation() {\n  const testCases = [\n    { email: 'test@example.com', expected: true },\n    { email: 'user.name@domain.co.uk', expected: true },\n    { email: 'invalid-email', expected: false },\n    { email: '@domain.com', expected: false },\n    { email: 'user@', expected: false },\n    { email: '', expected: false }\n  ];\n\n  testCases.forEach(({ email, expected }) => {\n    const result = validateEmail(email);\n    console.log(`Email: ${email} | Expected: ${expected} | Got: ${result} | ${result === expected ? 'PASS' : 'FAIL'}`);\n  });\n}",
        "filename": "tests/validation.test.js",
        "description": "Comprehensive test cases for email validation",
        "dependencies": []
      }
    ],
    "explanation": "The email validation function uses a comprehensive regex pattern that follows RFC 5322 standards. It handles various email formats including international domains and special characters.",
    "suggestions": [
      "Add input sanitization for security",
      "Implement rate limiting for validation calls",
      "Add support for internationalized email addresses",
      "Consider using a validation library for production use"
    ],
    "metadata": {
      "model": "gpt-4",
      "processingTime": 980,
      "tokensUsed": 320,
      "confidence": 0.92
    }
  }
}
```

#### Example
```bash
curl -X POST \
  -H "Cookie: session=your-session-id" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "A function that validates email addresses using regex",
    "language": "javascript",
    "options": {
      "includeTests": true,
      "includeDocumentation": true
    }
  }' \
  "http://localhost:3001/api/v1/ai/generate"
```

### Code Review

Get AI-powered code review and suggestions for improvements.

```http
POST /api/v1/ai/review
```

#### Request Body
```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript",
  "context": {
    "projectId": "project-123",
    "currentFile": "src/utils/math.js"
  },
  "options": {
    "reviewType": "comprehensive",
    "includeSuggestions": true,
    "includeSecurity": true
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Here's my review of your code with suggestions for improvement:",
    "analysis": {
      "quality": {
        "score": 6,
        "maxScore": 10,
        "issues": [
          "Missing input validation",
          "No error handling",
          "Limited functionality"
        ]
      },
      "security": {
        "score": 8,
        "maxScore": 10,
        "issues": [
          "Potential type coercion issues"
        ]
      },
      "performance": {
        "score": 9,
        "maxScore": 10,
        "issues": []
      },
      "maintainability": {
        "score": 5,
        "maxScore": 10,
        "issues": [
          "No documentation",
          "No tests"
        ]
      }
    },
    "suggestions": [
      "Add input validation for numbers",
      "Include error handling for edge cases",
      "Add JSDoc documentation",
      "Write unit tests",
      "Consider supporting more mathematical operations"
    ],
    "improvedCode": {
      "language": "javascript",
      "content": "/**\n * Adds two numbers together\n * @param {number} a - First number\n * @param {number} b - Second number\n * @returns {number} - Sum of the two numbers\n * @throws {TypeError} - If inputs are not numbers\n */\nfunction add(a, b) {\n  // Input validation\n  if (typeof a !== 'number' || typeof b !== 'number') {\n    throw new TypeError('Both arguments must be numbers');\n  }\n  \n  // Handle edge cases\n  if (!isFinite(a) || !isFinite(b)) {\n    throw new Error('Arguments must be finite numbers');\n  }\n  \n  return a + b;\n}",
      "filename": "src/utils/math.js",
      "description": "Improved add function with validation, error handling, and documentation"
    },
    "metadata": {
      "model": "gpt-4",
      "processingTime": 750,
      "tokensUsed": 280,
      "confidence": 0.89
    }
  }
}
```

#### Example
```bash
curl -X POST \
  -H "Cookie: session=your-session-id" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function add(a, b) { return a + b; }",
    "language": "javascript",
    "options": {
      "reviewType": "comprehensive"
    }
  }' \
  "http://localhost:3001/api/v1/ai/review"
```

### Code Analysis

Analyze code structure, complexity, and quality metrics.

```http
POST /api/v1/ai/analyze
```

#### Request Body
```json
{
  "code": "// Your code here",
  "language": "javascript",
  "context": {
    "projectId": "project-123",
    "currentFile": "src/components/App.jsx"
  },
  "options": {
    "includeMetrics": true,
    "includeComplexity": true,
    "includeSuggestions": true
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Here's a comprehensive analysis of your code:",
    "analysis": {
      "metrics": {
        "linesOfCode": 45,
        "statements": 12,
        "functions": 3,
        "classes": 1,
        "comments": 8,
        "commentRatio": 0.18
      },
      "complexity": {
        "cyclomaticComplexity": 4,
        "cognitiveComplexity": 6,
        "nestingDepth": 3,
        "maxLineLength": 120
      },
      "quality": {
        "maintainabilityIndex": 75,
        "technicalDebt": "2 days",
        "codeSmells": 2,
        "duplications": 0
      },
      "structure": {
        "imports": 5,
        "exports": 2,
        "dependencies": ["react", "react-dom"],
        "fileSize": "2.1 KB"
      }
    },
    "suggestions": [
      "Consider breaking down the main component into smaller components",
      "Add PropTypes for better type safety",
      "Extract complex logic into custom hooks",
      "Add error boundaries for better error handling"
    ],
    "metadata": {
      "model": "gpt-4",
      "processingTime": 1200,
      "tokensUsed": 380,
      "confidence": 0.91
    }
  }
}
```

#### Example
```bash
curl -X POST \
  -H "Cookie: session=your-session-id" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "// Your code here",
    "language": "javascript",
    "options": {
      "includeMetrics": true,
      "includeComplexity": true
    }
  }' \
  "http://localhost:3001/api/v1/ai/analyze"
```

### Debugging

Get AI assistance with debugging code issues.

```http
POST /api/v1/ai/debug
```

#### Request Body
```json
{
  "code": "function processData(data) {\n  const result = data.map(item => item.value);\n  return result.filter(val => val > 0);\n}",
  "error": "TypeError: Cannot read property 'map' of undefined",
  "language": "javascript",
  "context": {
    "projectId": "project-123",
    "currentFile": "src/utils/dataProcessor.js"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "message": "I found the issue! The error occurs because `data` is undefined when the function is called.",
    "diagnosis": {
      "errorType": "TypeError",
      "rootCause": "data parameter is undefined",
      "lineNumber": 2,
      "suggestion": "Add input validation and provide a default value"
    },
    "fixedCode": {
      "language": "javascript",
      "content": "function processData(data) {\n  // Input validation\n  if (!data || !Array.isArray(data)) {\n    console.warn('processData: data must be an array');\n    return [];\n  }\n  \n  const result = data.map(item => item.value);\n  return result.filter(val => val > 0);\n}",
      "filename": "src/utils/dataProcessor.js",
      "description": "Fixed function with input validation and error handling"
    },
    "explanation": "The original function assumes `data` is always an array, but when it's undefined, calling `.map()` throws an error. The fix adds validation to ensure data is an array before processing.",
    "prevention": [
      "Always validate function parameters",
      "Use TypeScript for better type safety",
      "Add unit tests for edge cases",
      "Consider using default parameters"
    ],
    "metadata": {
      "model": "gpt-4",
      "processingTime": 650,
      "tokensUsed": 250,
      "confidence": 0.94
    }
  }
}
```

#### Example
```bash
curl -X POST \
  -H "Cookie: session=your-session-id" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function processData(data) { const result = data.map(item => item.value); return result.filter(val => val > 0); }",
    "error": "TypeError: Cannot read property 'map' of undefined",
    "language": "javascript"
  }' \
  "http://localhost:3001/api/v1/ai/debug"
```

### Documentation Generation

Generate documentation for code, functions, or entire projects.

```http
POST /api/v1/ai/document
```

#### Request Body
```json
{
  "code": "// Your code here",
  "language": "javascript",
  "context": {
    "projectId": "project-123",
    "currentFile": "src/utils/helpers.js"
  },
  "options": {
    "format": "markdown",
    "includeExamples": true,
    "includeTests": true
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "message": "Here's comprehensive documentation for your code:",
    "documentation": {
      "format": "markdown",
      "content": "# Helper Functions\n\nThis module provides utility functions for common operations.\n\n## Functions\n\n### `formatDate(date, format)`\n\nFormats a date according to the specified format.\n\n**Parameters:**\n- `date` (Date): The date to format\n- `format` (string): The format string (default: 'YYYY-MM-DD')\n\n**Returns:**\n- `string`: Formatted date string\n\n**Example:**\n```javascript\nconst formatted = formatDate(new Date(), 'MM/DD/YYYY');\nconsole.log(formatted); // Output: 01/15/2024\n```\n\n### `validateEmail(email)`\n\nValidates an email address format.\n\n**Parameters:**\n- `email` (string): The email address to validate\n\n**Returns:**\n- `boolean`: True if valid, false otherwise\n\n**Example:**\n```javascript\nconst isValid = validateEmail('user@example.com');\nconsole.log(isValid); // Output: true\n```",
      "filename": "docs/helpers.md",
      "description": "Comprehensive documentation for helper functions"
    },
    "examples": [
      {
        "language": "javascript",
        "content": "// Example usage of helper functions\nimport { formatDate, validateEmail } from './utils/helpers.js';\n\n// Format dates\nconst today = new Date();\nconsole.log(formatDate(today)); // 2024-01-15\nconsole.log(formatDate(today, 'MM/DD/YYYY')); // 01/15/2024\n\n// Validate emails\nconsole.log(validateEmail('user@example.com')); // true\nconsole.log(validateEmail('invalid-email')); // false",
        "filename": "examples/helpers-usage.js",
        "description": "Usage examples for helper functions"
      }
    ],
    "tests": [
      {
        "language": "javascript",
        "content": "// Tests for helper functions\nimport { formatDate, validateEmail } from '../utils/helpers.js';\n\ndescribe('Helper Functions', () => {\n  describe('formatDate', () => {\n    it('should format date with default format', () => {\n      const date = new Date('2024-01-15');\n      expect(formatDate(date)).toBe('2024-01-15');\n    });\n    \n    it('should format date with custom format', () => {\n      const date = new Date('2024-01-15');\n      expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/15/2024');\n    });\n  });\n  \n  describe('validateEmail', () => {\n    it('should validate correct email', () => {\n      expect(validateEmail('user@example.com')).toBe(true);\n    });\n    \n    it('should reject invalid email', () => {\n      expect(validateEmail('invalid-email')).toBe(false);\n    });\n  });\n});",
        "filename": "tests/helpers.test.js",
        "description": "Unit tests for helper functions"
      }
    ],
    "metadata": {
      "model": "gpt-4",
      "processingTime": 1400,
      "tokensUsed": 420,
      "confidence": 0.93
    }
  }
}
```

#### Example
```bash
curl -X POST \
  -H "Cookie: session=your-session-id" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "// Your code here",
    "language": "javascript",
    "options": {
      "format": "markdown",
      "includeExamples": true
    }
  }' \
  "http://localhost:3001/api/v1/ai/document"
```

## 🛡️ Error Handling

### Common Error Responses

#### Invalid Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Message is required",
    "details": {
      "field": "message",
      "value": "",
      "constraint": "required"
    }
  },
  "timestamp": "2024-01-15T16:00:00Z"
}
```

#### AI Service Error
```json
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "AI service temporarily unavailable",
    "details": {
      "service": "openai",
      "retryAfter": 30
    }
  },
  "timestamp": "2024-01-15T16:00:00Z"
}
```

#### Rate Limit Exceeded
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many AI requests",
    "details": {
      "limit": 10,
      "window": "1 minute",
      "retryAfter": 60
    }
  },
  "timestamp": "2024-01-15T16:00:00Z"
}
```

## 📊 Rate Limiting

- **Chat messages**: 10 requests per minute
- **Code generation**: 5 requests per minute
- **Code review**: 8 requests per minute
- **Code analysis**: 6 requests per minute
- **Debugging**: 8 requests per minute
- **Documentation**: 4 requests per minute

## 🔐 Authentication

All endpoints require valid session authentication. Include the session cookie in your requests:

```bash
curl -H "Cookie: session=your-session-id" \
  "http://localhost:3001/api/v1/ai/chat"
```

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
import { AICodingAssistant } from '@ai-coding-assistant/sdk';

const client = new AICodingAssistant({
  baseURL: 'http://localhost:3001',
  sessionId: 'your-session-id'
});

// Send a chat message
const response = await client.ai.chat({
  message: 'Create a React component for a todo list',
  projectId: 'project-123',
  context: {
    language: 'javascript',
    framework: 'react'
  }
});

// Generate code
const code = await client.ai.generate({
  description: 'A function that validates email addresses',
  language: 'javascript',
  options: {
    includeTests: true,
    includeDocumentation: true
  }
});

// Review code
const review = await client.ai.review({
  code: 'function add(a, b) { return a + b; }',
  language: 'javascript',
  options: {
    reviewType: 'comprehensive'
  }
});
```

### Python
```python
from ai_coding_assistant import AICodingAssistant

client = AICodingAssistant(
    base_url="http://localhost:3001",
    session_id="your-session-id"
)

# Send a chat message
response = client.ai.chat(
    message="Create a React component for a todo list",
    project_id="project-123",
    context={
        "language": "javascript",
        "framework": "react"
    }
)

# Generate code
code = client.ai.generate(
    description="A function that validates email addresses",
    language="javascript",
    options={
        "include_tests": True,
        "include_documentation": True
    }
)

# Review code
review = client.ai.review(
    code="function add(a, b) { return a + b; }",
    language="javascript",
    options={
        "review_type": "comprehensive"
    }
)
```

## 🧪 Testing

### Test Endpoints
```bash
# Test AI chat
npm run test:api -- --grep "ai chat"

# Test code generation
npm run test:api -- --grep "ai generate"

# Test code review
npm run test:api -- --grep "ai review"

# Test code analysis
npm run test:api -- --grep "ai analyze"
```

### Test Data
```bash
# Test chat message
curl -X POST \
  -H "Cookie: session=test-session" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, can you help me with coding?",
    "projectId": "test-project"
  }' \
  "http://localhost:3001/api/v1/ai/chat"
```

## 🔧 Configuration

### AI Model Options
- **gpt-4**: Most capable model (default)
- **gpt-3.5-turbo**: Faster, more cost-effective
- **claude-3**: Alternative AI model
- **custom**: Custom fine-tuned models

### Response Formatting
- **text**: Plain text response
- **markdown**: Markdown formatted response
- **json**: Structured JSON response
- **html**: HTML formatted response

### Context Options
- **includeFileContent**: Include current file content
- **includeProjectStructure**: Include project file structure
- **includeDependencies**: Include project dependencies
- **includeRecentChanges**: Include recent file changes

---

## 🎉 Ready to Use AI API!

You now have comprehensive information about the AI API. Start building intelligent coding assistance features with our powerful AI endpoints.

**Happy coding with AI! 🚀**

---

**Last Updated**: January 2024  
**Next Review**: April 2024

---

*This API documentation is maintained by the AI Coding Assistant community. We welcome your feedback and contributions! 📚*