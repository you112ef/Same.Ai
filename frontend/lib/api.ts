import axios, { AxiosResponse } from 'axios'
import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  Conversation,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
  PaginatedResponse
} from '../../../shared/types'
import { getToken, getRefreshToken, setToken, clearTokens } from '@/hooks/use-auth'

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getRefreshToken()
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          )
          
          const { token } = response.data
          setToken(token)
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        clearTokens()
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = getRefreshToken()
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/refresh', {
      refreshToken
    })
    return response.data
  },

  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get('/auth/profile')
    return response.data
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response: AxiosResponse<User> = await api.put('/auth/profile', data)
    return response.data
  },
}

// Conversations API
export const conversationsApi = {
  getAll: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Conversation>> => {
    const response: AxiosResponse<PaginatedResponse<Conversation>> = await api.get('/conversations', {
      params
    })
    return response.data
  },

  getById: async (id: string): Promise<Conversation> => {
    const response: AxiosResponse<Conversation> = await api.get(`/conversations/${id}`)
    return response.data
  },

  create: async (data: CreateConversationRequest): Promise<Conversation> => {
    const response: AxiosResponse<Conversation> = await api.post('/conversations', data)
    return response.data
  },

  update: async (id: string, data: Partial<Conversation>): Promise<Conversation> => {
    const response: AxiosResponse<Conversation> = await api.put(`/conversations/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/conversations/${id}`)
  },
}

// Messages API
export const messagesApi = {
  getByConversation: async (
    conversationId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Message>> => {
    const response: AxiosResponse<PaginatedResponse<Message>> = await api.get(
      `/conversations/${conversationId}/messages`,
      { params }
    )
    return response.data
  },

  send: async (conversationId: string, data: SendMessageRequest): Promise<Message> => {
    const response: AxiosResponse<Message> = await api.post(
      `/conversations/${conversationId}/messages`,
      data
    )
    return response.data
  },

  delete: async (messageId: string): Promise<void> => {
    await api.delete(`/messages/${messageId}`)
  },
}

// Files API
export const filesApi = {
  upload: async (file: File, type?: string): Promise<{ id: string; url: string; name: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    if (type) formData.append('type', type)

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getAll: async (params?: { page?: number; limit?: number; type?: string }) => {
    const response = await api.get('/files', { params })
    return response.data
  },

  delete: async (fileId: string): Promise<void> => {
    await api.delete(`/files/${fileId}`)
  },
}

// AI API
export const aiApi = {
  chat: async (data: {
    message: string
    conversationId: string
    model: string
    history?: Message[]
  }) => {
    const response = await api.post('/ai/chat', data)
    return response.data
  },

  analyzeDocument: async (fileId: string) => {
    const response = await api.post('/ai/analyze-document', { fileId })
    return response.data
  },

  generateImage: async (prompt: string, options?: any) => {
    const response = await api.post('/ai/generate-image', { prompt, ...options })
    return response.data
  },

  reviewCode: async (code: string, language: string) => {
    const response = await api.post('/ai/code-review', { code, language })
    return response.data
  },
}

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health')
    return response.data
  },
}

export default api
