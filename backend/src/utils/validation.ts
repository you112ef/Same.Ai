export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export interface PasswordValidation {
  minLength: boolean
  hasUpper: boolean
  hasLower: boolean
  hasNumber: boolean
  hasSpecial: boolean
  isValid: boolean
}

export const validatePassword = (password: string): PasswordValidation => {
  const minLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  const isValid = minLength && hasUpper && hasLower && hasNumber && hasSpecial

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    isValid
  }
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export const validateFileSize = (size: number, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return size <= maxSizeBytes
}

export const validateFileType = (mimeType: string, allowedTypes: string[] = []): boolean => {
  if (allowedTypes.length === 0) return true
  return allowedTypes.includes(mimeType)
}

export const validatePaginationParams = (page?: string, limit?: string) => {
  const pageNum = page ? parseInt(page, 10) : 1
  const limitNum = limit ? parseInt(limit, 10) : 20

  if (isNaN(pageNum) || pageNum < 1) {
    throw new Error('Page must be a positive integer')
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new Error('Limit must be between 1 and 100')
  }

  return { page: pageNum, limit: limitNum }
}