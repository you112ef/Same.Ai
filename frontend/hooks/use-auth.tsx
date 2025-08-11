'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/shared/types'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  // Check if user is authenticated
  const { data: userData, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getProfile,
    enabled: isInitialized && !!getToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      setToken(data.token)
      setRefreshToken(data.refreshToken)
      setUser(data.user)
      queryClient.setQueryData(['auth', 'me'], data.user)
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: `مرحباً ${data.user.name}`,
      })
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message || 'تحقق من بيانات الدخول',
        variant: 'destructive',
      })
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: AuthResponse) => {
      setToken(data.token)
      setRefreshToken(data.refreshToken)
      setUser(data.user)
      queryClient.setQueryData(['auth', 'me'], data.user)
      toast({
        title: 'تم التسجيل بنجاح',
        description: `مرحباً ${data.user.name}`,
      })
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في التسجيل',
        description: error.message || 'حدث خطأ أثناء التسجيل',
        variant: 'destructive',
      })
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearTokens()
      setUser(null)
      queryClient.clear()
      toast({
        title: 'تم تسجيل الخروج',
        description: 'نراك قريباً',
      })
      router.push('/auth/login')
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      clearTokens()
      setUser(null)
      queryClient.clear()
      router.push('/auth/login')
    },
  })

  // Refresh token mutation
  const refreshMutation = useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data: AuthResponse) => {
      setToken(data.token)
      setRefreshToken(data.refreshToken)
      setUser(data.user)
      queryClient.setQueryData(['auth', 'me'], data.user)
    },
    onError: () => {
      // Refresh failed, logout user
      clearTokens()
      setUser(null)
      queryClient.clear()
      router.push('/auth/login')
    },
  })

  // Initialize auth state
  useEffect(() => {
    const token = getToken()
    if (token) {
      // Token exists, will trigger profile fetch
      setIsInitialized(true)
    } else {
      setIsInitialized(true)
    }
  }, [])

  // Update user state when userData changes
  useEffect(() => {
    if (userData) {
      setUser(userData)
    }
  }, [userData])

  // Auto-refresh token before expiry
  useEffect(() => {
    const token = getToken()
    if (!token) return

    // Try to refresh token every 23 hours (tokens expire in 24h)
    const interval = setInterval(() => {
      refreshMutation.mutate()
    }, 23 * 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [refreshMutation])

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials)
  }

  const register = async (data: RegisterRequest) => {
    await registerMutation.mutateAsync(data)
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  const refreshToken = async () => {
    await refreshMutation.mutateAsync()
  }

  const isAuthenticated = !!user && !!getToken()
  const combinedLoading = isLoading || !isInitialized

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: combinedLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Token management helpers
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth_token', token)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refresh_token')
}

export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('refresh_token', token)
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
}