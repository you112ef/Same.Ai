// Shared constants used across frontend and backend

export const SUPPORTED_LANGUAGES = ['ar', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const PROJECT_TYPES = [
  'nextjs',
  'react',
  'vite',
  'vanilla',
  'nodejs',
  'express',
  'python',
  'django',
  'flask',
  'vue',
  'angular',
  'svelte',
  'nuxt',
  'gatsby',
  'general'
] as const;

export type ProjectType = typeof PROJECT_TYPES[number];

export const FILE_EXTENSIONS = {
  javascript: ['.js', '.jsx', '.mjs'],
  typescript: ['.ts', '.tsx'],
  python: ['.py', '.pyw'],
  html: ['.html', '.htm'],
  css: ['.css', '.scss', '.sass', '.less'],
  markdown: ['.md', '.markdown'],
  json: ['.json'],
  yaml: ['.yml', '.yaml'],
  text: ['.txt', '.log'],
  image: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
  video: ['.mp4', '.avi', '.mov', '.wmv', '.flv'],
  audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg'],
  archive: ['.zip', '.tar', '.gz', '.rar', '.7z'],
  document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']
} as const;

export const PRIORITY_LEVELS = ['low', 'medium', 'high'] as const;
export type PriorityLevel = typeof PRIORITY_LEVELS[number];

export const TODO_CATEGORIES = [
  'bug',
  'feature',
  'improvement',
  'task',
  'idea',
  'documentation',
  'testing',
  'deployment',
  'maintenance',
  'research',
  'design',
  'content',
  'performance',
  'security',
  'accessibility'
] as const;

export type TodoCategory = typeof TODO_CATEGORIES[number];

export const SOCKET_EVENTS = {
  // Session events
  CREATE_SESSION: 'create-session',
  SESSION_CREATED: 'session-created',
  UPDATE_SESSION: 'update-session',
  
  // Chat events
  USER_MESSAGE: 'user-message',
  AI_RESPONSE: 'ai-response',
  
  // File events
  GET_PROJECT_STRUCTURE: 'get-project-structure',
  FILES_LOADED: 'files-loaded',
  EDIT_FILE: 'edit-file',
  FILE_EDITED: 'file-edited',
  DELETE_FILE: 'delete-file',
  FILE_DELETED: 'file-deleted',
  READ_FILE: 'read-file',
  FILE_CONTENT_LOADED: 'file-content-loaded',
  
  // Version events
  CREATE_SNAPSHOT: 'create-snapshot',
  SNAPSHOT_CREATED: 'snapshot-created',
  GET_VERSIONS_LIST: 'get-versions-list',
  VERSIONS_LOADED: 'versions-loaded',
  RESTORE_VERSION: 'restore-version',
  VERSION_RESTORED: 'version-restored',
  DELETE_VERSION: 'delete-version',
  VERSION_DELETED: 'version-deleted',
  COMPARE_VERSIONS: 'compare-versions',
  VERSIONS_COMPARED: 'versions-compared',
  
  // Todo events
  GET_TODOS: 'get-todos',
  TODOS_LOADED: 'todos-loaded',
  ADD_TODO: 'add-todo',
  TODO_ADDED: 'todo-added',
  UPDATE_TODO: 'update-todo',
  TODO_UPDATED: 'todo-updated',
  DELETE_TODO: 'delete-todo',
  TODO_DELETED: 'todo-deleted',
  
  // Project events
  GET_PROJECT_INFO: 'get-project-info',
  PROJECT_INFO_LOADED: 'project-info-loaded',
  BUILD_PROJECT: 'build-project',
  PROJECT_BUILT: 'project-built',
  RUN_PROJECT: 'run-project',
  PROJECT_STARTED: 'project-started',
  STOP_PROJECT: 'stop-project',
  PROJECT_STOPPED: 'project-stopped',
  
  // Preview events
  GET_PREVIEW: 'get-preview',
  PREVIEW_UPDATED: 'preview-updated',
  
  // Error events
  ERROR: 'error'
} as const;

export const AI_ACTION_TYPES = {
  CREATE_PROJECT: 'create_project',
  EDIT_FILE: 'edit_file',
  RUN_COMMAND: 'run_command',
  CREATE_SNAPSHOT: 'create_snapshot'
} as const;

export type AIActionType = typeof AI_ACTION_TYPES[keyof typeof AI_ACTION_TYPES];

export const DEVICE_SIZES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  LAPTOP: 'laptop',
  DESKTOP: 'desktop'
} as const;

export type DeviceSize = typeof DEVICE_SIZES[keyof typeof DEVICE_SIZES];

export const DEVICE_DIMENSIONS = {
  [DEVICE_SIZES.MOBILE]: { width: '375px', height: '667px' },
  [DEVICE_SIZES.TABLET]: { width: '768px', height: '1024px' },
  [DEVICE_SIZES.LAPTOP]: { width: '1024px', height: '768px' },
  [DEVICE_SIZES.DESKTOP]: { width: '100%', height: '100%' }
} as const;

export const DEFAULT_SETTINGS = {
  AUTO_REFRESH: true,
  REFRESH_INTERVAL: 5000,
  SHOW_LINE_NUMBERS: true,
  THEME: 'light',
  LANGUAGE: 'en',
  FONT_SIZE: 14,
  TAB_SIZE: 2
} as const;

export const ERROR_MESSAGES = {
  SESSION_NOT_FOUND: 'Session not found',
  PROJECT_NOT_FOUND: 'Project not found',
  FILE_NOT_FOUND: 'File not found',
  PERMISSION_DENIED: 'Permission denied',
  INVALID_REQUEST: 'Invalid request',
  SERVER_ERROR: 'Internal server error',
  NETWORK_ERROR: 'Network error',
  TIMEOUT_ERROR: 'Request timeout',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  OPENAI_API_ERROR: 'OpenAI API error',
  FILE_TOO_LARGE: 'File too large',
  UNSUPPORTED_FILE_TYPE: 'Unsupported file type',
  INVALID_PROJECT_TYPE: 'Invalid project type',
  PROJECT_ALREADY_EXISTS: 'Project already exists',
  VERSION_NOT_FOUND: 'Version not found',
  TODO_NOT_FOUND: 'Todo not found'
} as const;

export const SUCCESS_MESSAGES = {
  SESSION_CREATED: 'Session created successfully',
  PROJECT_CREATED: 'Project created successfully',
  FILE_SAVED: 'File saved successfully',
  FILE_DELETED: 'File deleted successfully',
  SNAPSHOT_CREATED: 'Snapshot created successfully',
  VERSION_RESTORED: 'Version restored successfully',
  VERSION_DELETED: 'Version deleted successfully',
  TODO_ADDED: 'Todo added successfully',
  TODO_UPDATED: 'Todo updated successfully',
  TODO_DELETED: 'Todo deleted successfully',
  PROJECT_BUILT: 'Project built successfully',
  PROJECT_STARTED: 'Project started successfully',
  PROJECT_STOPPED: 'Project stopped successfully'
} as const;

export const VALIDATION_RULES = {
  MIN_PROJECT_NAME_LENGTH: 3,
  MAX_PROJECT_NAME_LENGTH: 50,
  MIN_FILE_NAME_LENGTH: 1,
  MAX_FILE_NAME_LENGTH: 255,
  MIN_TODO_TITLE_LENGTH: 1,
  MAX_TODO_TITLE_LENGTH: 200,
  MIN_TODO_DESCRIPTION_LENGTH: 0,
  MAX_TODO_DESCRIPTION_LENGTH: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_PROJECT_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_VERSIONS_PER_PROJECT: 50,
  MAX_TODOS_PER_PROJECT: 1000,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24 hours
} as const;

export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
  TOOLBAR_HEIGHT: 56,
  FOOTER_HEIGHT: 48,
  CARD_MIN_WIDTH: 300,
  CARD_MAX_WIDTH: 600,
  DIALOG_MIN_WIDTH: 400,
  DIALOG_MAX_WIDTH: 800,
  SNACKBAR_DURATION: 4000,
  LOADING_DELAY: 300,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100
} as const;