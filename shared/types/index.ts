// Shared types between frontend and backend

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum AIModel {
  GPT4 = 'GPT4',
  GPT35 = 'GPT35',
  CLAUDE3_OPUS = 'CLAUDE3_OPUS',
  CLAUDE3_SONNET = 'CLAUDE3_SONNET',
  CLAUDE3_HAIKU = 'CLAUDE3_HAIKU',
  GEMINI_PRO = 'GEMINI_PRO',
  GEMINI_ULTRA = 'GEMINI_ULTRA',
  LLAMA2 = 'LLAMA2',
  LLAMA3 = 'LLAMA3'
}

export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM'
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM'
}

export enum FileType {
  DOCUMENT = 'DOCUMENT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  OTHER = 'OTHER'
}

// User interfaces
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface UserSettings {
  id: string
  userId: string
  defaultModel: AIModel
  theme: Theme
  language: string
  preferences: Record<string, unknown>
}

// Conversation interfaces
export interface Conversation {
  id: string
  title: string
  userId: string
  model: AIModel
  createdAt: Date
  updatedAt: Date
  messages?: Message[]
  files?: File[]
}

export interface Message {
  id: string
  conversationId: string
  content: string
  role: MessageRole
  model?: AIModel
  tokens?: number
  metadata?: Record<string, unknown>
  createdAt: Date
}

export interface File {
  id: string
  name: string
  type: FileType
  mimeType: string
  size: number
  url: string
  userId: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

// API Request/Response interfaces
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface CreateConversationRequest {
  title: string
  model: AIModel
}

export interface SendMessageRequest {
  content: string
  role: MessageRole
  model?: AIModel
}

export interface AIResponse {
  id: string
  content: string
  model: AIModel
  tokens: number
  finishReason: 'stop' | 'length' | 'function_call' | 'content_filter'
}

export interface FileUploadRequest {
  file: File
  type?: FileType
}

export interface DocumentAnalysisResponse {
  summary: string
  keyPoints: string[]
  questions: string[]
  metadata: Record<string, unknown>
}

// Socket.io event interfaces
export interface SocketEvents {
  // Client to Server
  'join-conversation': (conversationId: string) => void
  'send-message': (data: SendMessageRequest) => void
  'typing-start': (conversationId: string) => void
  'typing-stop': (conversationId: string) => void
  
  // Server to Client
  'message-received': (message: Message) => void
  'ai-response-start': (conversationId: string) => void
  'ai-response-chunk': (data: { content: string; tokens: number }) => void
  'ai-response-end': (response: AIResponse) => void
  'user-typing': (data: { userId: string; conversationId: string }) => void
  'error': (error: { message: string; code: string }) => void
}

// Error interfaces
export interface APIError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, unknown>
}

// Pagination interfaces
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

// AI Model configurations
export interface ModelConfig {
  name: string
  displayName: string
  provider: 'openai' | 'anthropic' | 'google' | 'meta'
  maxTokens: number
  costPer1kTokens: number
  capabilities: string[]
  description: string
}

export const MODEL_CONFIGS: Record<AIModel, ModelConfig> = {
  [AIModel.GPT4]: {
    name: 'gpt-4',
    displayName: 'GPT-4',
    provider: 'openai',
    maxTokens: 8192,
    costPer1kTokens: 0.03,
    capabilities: ['text', 'code', 'analysis'],
    description: 'النموذج الأكثر تقدماً من OpenAI'
  },
  [AIModel.GPT35]: {
    name: 'gpt-3.5-turbo',
    displayName: 'GPT-3.5 Turbo',
    provider: 'openai',
    maxTokens: 4096,
    costPer1kTokens: 0.002,
    capabilities: ['text', 'code'],
    description: 'نموذج سريع وفعال من حيث التكلفة'
  },
  [AIModel.CLAUDE3_OPUS]: {
    name: 'claude-3-opus-20240229',
    displayName: 'Claude 3 Opus',
    provider: 'anthropic',
    maxTokens: 200000,
    costPer1kTokens: 0.015,
    capabilities: ['text', 'code', 'analysis', 'long-context'],
    description: 'النموذج الأكثر قوة من Anthropic'
  },
  [AIModel.CLAUDE3_SONNET]: {
    name: 'claude-3-sonnet-20240229',
    displayName: 'Claude 3 Sonnet',
    provider: 'anthropic',
    maxTokens: 200000,
    costPer1kTokens: 0.003,
    capabilities: ['text', 'code', 'analysis'],
    description: 'متوازن بين الأداء والتكلفة'
  },
  [AIModel.CLAUDE3_HAIKU]: {
    name: 'claude-3-haiku-20240307',
    displayName: 'Claude 3 Haiku',
    provider: 'anthropic',
    maxTokens: 200000,
    costPer1kTokens: 0.00025,
    capabilities: ['text', 'code'],
    description: 'الأسرع والأكثر كفاءة من حيث التكلفة'
  },
  [AIModel.GEMINI_PRO]: {
    name: 'gemini-pro',
    displayName: 'Gemini Pro',
    provider: 'google',
    maxTokens: 32768,
    costPer1kTokens: 0.0005,
    capabilities: ['text', 'code', 'multimodal'],
    description: 'نموذج متعدد الوسائط من Google'
  },
  [AIModel.GEMINI_ULTRA]: {
    name: 'gemini-ultra',
    displayName: 'Gemini Ultra',
    provider: 'google',
    maxTokens: 32768,
    costPer1kTokens: 0.002,
    capabilities: ['text', 'code', 'multimodal', 'reasoning'],
    description: 'النموذج الأكثر تقدماً من Google'
  },
  [AIModel.LLAMA2]: {
    name: 'llama-2-70b-chat',
    displayName: 'Llama 2 70B',
    provider: 'meta',
    maxTokens: 4096,
    costPer1kTokens: 0.0007,
    capabilities: ['text', 'code'],
    description: 'نموذج مفتوح المصدر من Meta'
  },
  [AIModel.LLAMA3]: {
    name: 'llama-3-70b-instruct',
    displayName: 'Llama 3 70B',
    provider: 'meta',
    maxTokens: 8192,
    costPer1kTokens: 0.0009,
    capabilities: ['text', 'code', 'reasoning'],
    description: 'أحدث نموذج مفتوح المصدر من Meta'
  }
}