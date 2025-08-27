// Common types used across frontend and backend

export interface Session {
  id: string;
  language: 'ar' | 'en';
  projectType: string;
  history: string[];
  todos: Todo[];
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  estimatedTime: number;
  actualTime: number;
  notes: string;
}

export interface FileItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  size?: number;
  modified?: string;
  extension?: string;
  content?: string;
}

export interface Version {
  id: string;
  name: string;
  description: string;
  timestamp: string;
  size: number;
  fileCount: number;
  projectType: string;
  tags: string[];
  isCurrent: boolean;
  files: FileItem[];
}

export interface DiffResult {
  added: string[];
  removed: string[];
  unchanged: string[];
  totalChanges: number;
}

export interface AIResponse {
  message: string;
  actions: AIAction[];
  suggestions: string[];
  nextSteps: string[];
}

export interface AIAction {
  type: 'create_project' | 'edit_file' | 'run_command' | 'create_snapshot';
  data: any;
  description: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  type: string;
  files: FileItem[];
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  metadata?: any;
}

export interface SocketEvents {
  // Session events
  'create-session': { language: string; projectType: string };
  'session-created': { sessionId: string; session: Session };
  'update-session': { sessionId: string; updates: Partial<Session> };
  
  // Chat events
  'user-message': { sessionId: string; message: string };
  'ai-response': { sessionId: string; response: AIResponse };
  
  // File events
  'get-project-structure': { sessionId: string; path: string };
  'files-loaded': { files: FileItem[]; path: string };
  'edit-file': { sessionId: string; path: string; content: string };
  'file-edited': { file: FileItem; path: string };
  'delete-file': { sessionId: string; path: string };
  'file-deleted': { path: string };
  'read-file': { sessionId: string; path: string };
  'file-content-loaded': { content: string; file: string };
  
  // Version events
  'create-snapshot': { sessionId: string; name: string; description: string };
  'snapshot-created': { success: boolean; message: string };
  'get-versions-list': { sessionId: string };
  'versions-loaded': { versions: Version[] };
  'restore-version': { sessionId: string; versionId: string };
  'version-restored': { success: boolean; message: string };
  'delete-version': { sessionId: string; versionId: string };
  'version-deleted': { success: boolean; message: string };
  'compare-versions': { sessionId: string; versionIds: string[] };
  'versions-compared': { diff: DiffResult };
  
  // Todo events
  'get-todos': { sessionId: string };
  'todos-loaded': { todos: Todo[] };
  'add-todo': { sessionId: string; todo: Partial<Todo> };
  'todo-added': { success: boolean; message: string };
  'update-todo': { sessionId: string; todo: Todo };
  'todo-updated': { success: boolean; message: string };
  'delete-todo': { sessionId: string; todoId: string };
  'todo-deleted': { success: boolean; message: string };
  
  // Project events
  'get-project-info': { sessionId: string };
  'project-info-loaded': { project: string; files: string[] };
  'build-project': { sessionId: string };
  'project-built': { success: boolean; message: string };
  'run-project': { sessionId: string };
  'project-started': { success: boolean; message: string };
  'stop-project': { sessionId: string };
  'project-stopped': { success: boolean; message: string };
  
  // Preview events
  'get-preview': { sessionId: string; file: string };
  'preview-updated': { content: string; file: string };
  
  // Error events
  'error': { message: string };
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  openaiApiKey: string;
  openaiModel: string;
  openaiMaxTokens: number;
  openaiTemperature: number;
  sessionSecret: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  projectsDir: string;
  versionsDir: string;
  uploadsDir: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  dockerEnabled: boolean;
  dockerImage: string;
  dockerTimeout: number;
  logLevel: string;
  logFile: string;
  redisUrl: string;
  redisEnabled: boolean;
  frontendUrl: string;
  corsOrigin: string;
}

export interface LanguageStrings {
  ar: Record<string, string>;
  en: Record<string, string>;
}