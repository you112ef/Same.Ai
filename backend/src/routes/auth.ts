import express from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, CustomError } from '../middleware/errorHandler'
import { generateTokens, verifyRefreshToken, authenticate, AuthRequest } from '../middleware/auth'
import { LoginRequest, RegisterRequest, AuthResponse } from '../../../shared/types'
import { validateEmail, validatePassword } from '../utils/validation'

const router = express.Router()
const prisma = new PrismaClient()

// Register
router.post('/register', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { email, password, name }: RegisterRequest = req.body

  // Validation
  if (!email || !password || !name) {
    throw new CustomError('All fields are required', 400, 'MISSING_FIELDS')
  }

  if (!validateEmail(email)) {
    throw new CustomError('Invalid email format', 400, 'INVALID_EMAIL')
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    throw new CustomError('Password does not meet requirements', 400, 'INVALID_PASSWORD', {
      requirements: passwordValidation
    })
  }

  if (name.length < 2 || name.length > 100) {
    throw new CustomError('Name must be between 2 and 100 characters', 400, 'INVALID_NAME')
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (existingUser) {
    throw new CustomError('User with this email already exists', 409, 'USER_EXISTS')
  }

  // Hash password
  const saltRounds = 12
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      role: 'USER'
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })

  // Create default user settings
  await prisma.userSettings.create({
    data: {
      userId: user.id,
      defaultModel: 'GPT4',
      theme: 'SYSTEM',
      language: 'ar',
      preferences: {}
    }
  })

  // Generate tokens
  const { token, refreshToken } = generateTokens(user as any)

  const response: AuthResponse = {
    user: user as any,
    token,
    refreshToken
  }

  res.status(201).json(response)
}))

// Login
router.post('/login', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { email, password }: LoginRequest = req.body

  // Validation
  if (!email || !password) {
    throw new CustomError('Email and password are required', 400, 'MISSING_CREDENTIALS')
  }

  if (!validateEmail(email)) {
    throw new CustomError('Invalid email format', 400, 'INVALID_EMAIL')
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      password: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (!user) {
    throw new CustomError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new CustomError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
  }

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user

  // Generate tokens
  const { token, refreshToken } = generateTokens(userWithoutPassword as any)

  const response: AuthResponse = {
    user: userWithoutPassword as any,
    token,
    refreshToken
  }

  res.json(response)
}))

// Refresh token
router.post('/refresh', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    throw new CustomError('Refresh token is required', 400, 'MISSING_REFRESH_TOKEN')
  }

  try {
    const decoded = verifyRefreshToken(refreshToken)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      throw new CustomError('User not found', 404, 'USER_NOT_FOUND')
    }

    // Generate new tokens
    const tokens = generateTokens(user as any)

    const response: AuthResponse = {
      user: user as any,
      token: tokens.token,
      refreshToken: tokens.refreshToken
    }

    res.json(response)
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new CustomError('Refresh token expired', 401, 'REFRESH_TOKEN_EXPIRED')
    } else if (error.name === 'JsonWebTokenError') {
      throw new CustomError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN')
    }
    throw error
  }
}))

// Get current user
router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  if (!req.user) {
    throw new CustomError('User not authenticated', 401, 'NOT_AUTHENTICATED')
  }

  // Get user with settings
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      settings: {
        select: {
          defaultModel: true,
          theme: true,
          language: true,
          preferences: true
        }
      }
    }
  })

  if (!user) {
    throw new CustomError('User not found', 404, 'USER_NOT_FOUND')
  }

  res.json(user)
}))

// Logout
router.post('/logout', authenticate, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  // In a more sophisticated implementation, you might want to blacklist the token
  // For now, we'll just return a success response
  res.json({ message: 'Logged out successfully' })
}))

// Change password
router.post('/change-password', authenticate, asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw new CustomError('Current password and new password are required', 400, 'MISSING_PASSWORDS')
  }

  const passwordValidation = validatePassword(newPassword)
  if (!passwordValidation.isValid) {
    throw new CustomError('New password does not meet requirements', 400, 'INVALID_NEW_PASSWORD', {
      requirements: passwordValidation
    })
  }

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, password: true }
  })

  if (!user) {
    throw new CustomError('User not found', 404, 'USER_NOT_FOUND')
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
  if (!isCurrentPasswordValid) {
    throw new CustomError('Current password is incorrect', 401, 'INVALID_CURRENT_PASSWORD')
  }

  // Hash new password
  const saltRounds = 12
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword }
  })

  res.json({ message: 'Password updated successfully' })
}))

export default router