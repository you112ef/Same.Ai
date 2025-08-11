import express from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, CustomError } from '../middleware/errorHandler'
import { AuthRequest, requireRole } from '../middleware/auth'
import { validateEmail, sanitizeInput, validatePassword } from '../utils/validation'
import { AIModel, Theme } from '../../../shared/types'

const router = express.Router()
const prisma = new PrismaClient()

// Get current user profile
router.get('/profile', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
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
      },
      _count: {
        select: {
          conversations: true,
          messages: true,
          files: true
        }
      }
    }
  })
  
  if (!user) {
    throw new CustomError('User not found', 404, 'USER_NOT_FOUND')
  }
  
  res.json(user)
}))

// Update user profile
router.put('/profile', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { name, avatar } = req.body
  
  const updateData: any = {}
  
  if (name) {
    const sanitizedName = sanitizeInput(name)
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      throw new CustomError('Name must be between 2 and 100 characters', 400, 'INVALID_NAME_LENGTH')
    }
    updateData.name = sanitizedName
  }
  
  if (avatar) {
    if (typeof avatar !== 'string' || avatar.length > 500) {
      throw new CustomError('Invalid avatar URL', 400, 'INVALID_AVATAR')
    }
    updateData.avatar = avatar
  }
  
  if (Object.keys(updateData).length === 0) {
    throw new CustomError('No valid fields to update', 400, 'NO_UPDATE_DATA')
  }
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: updateData,
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
    
    res.json(updatedUser)
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new CustomError('Failed to update profile', 500, 'UPDATE_PROFILE_ERROR')
  }
}))

// Get user settings
router.get('/settings', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const settings = await prisma.userSettings.findUnique({
    where: { userId: req.user!.id }
  })
  
  if (!settings) {
    // Create default settings if they don't exist
    const defaultSettings = await prisma.userSettings.create({
      data: {
        userId: req.user!.id,
        defaultModel: AIModel.GPT4,
        theme: Theme.SYSTEM,
        language: 'ar',
        preferences: {}
      }
    })
    
    return res.json(defaultSettings)
  }
  
  res.json(settings)
}))

// Update user settings
router.put('/settings', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { defaultModel, theme, language, preferences } = req.body
  
  const updateData: any = {}
  
  if (defaultModel) {
    const validModels = Object.values(AIModel)
    if (!validModels.includes(defaultModel)) {
      throw new CustomError('Invalid default model', 400, 'INVALID_DEFAULT_MODEL')
    }
    updateData.defaultModel = defaultModel
  }
  
  if (theme) {
    const validThemes = Object.values(Theme)
    if (!validThemes.includes(theme)) {
      throw new CustomError('Invalid theme', 400, 'INVALID_THEME')
    }
    updateData.theme = theme
  }
  
  if (language) {
    const supportedLanguages = ['ar', 'en']
    if (!supportedLanguages.includes(language)) {
      throw new CustomError('Unsupported language', 400, 'UNSUPPORTED_LANGUAGE')
    }
    updateData.language = language
  }
  
  if (preferences && typeof preferences === 'object') {
    updateData.preferences = preferences
  }
  
  if (Object.keys(updateData).length === 0) {
    throw new CustomError('No valid settings to update', 400, 'NO_UPDATE_DATA')
  }
  
  try {
    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: req.user!.id },
      update: updateData,
      create: {
        userId: req.user!.id,
        defaultModel: defaultModel || AIModel.GPT4,
        theme: theme || Theme.SYSTEM,
        language: language || 'ar',
        preferences: preferences || {}
      }
    })
    
    res.json(updatedSettings)
  } catch (error) {
    console.error('Error updating user settings:', error)
    throw new CustomError('Failed to update settings', 500, 'UPDATE_SETTINGS_ERROR')
  }
}))

// Change password
router.post('/change-password', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { currentPassword, newPassword } = req.body
  
  if (!currentPassword || !newPassword) {
    throw new CustomError('Current password and new password are required', 400, 'MISSING_PASSWORDS')
  }
  
  if (currentPassword === newPassword) {
    throw new CustomError('New password must be different from current password', 400, 'SAME_PASSWORD')
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
  
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    })
    
    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    throw new CustomError('Failed to change password', 500, 'CHANGE_PASSWORD_ERROR')
  }
}))

// Get user statistics
router.get('/stats', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  try {
    const [conversations, messages, files, tokensUsed] = await Promise.all([
      prisma.conversation.count({
        where: { userId: req.user!.id }
      }),
      prisma.message.count({
        where: {
          conversation: {
            userId: req.user!.id
          }
        }
      }),
      prisma.file.count({
        where: { userId: req.user!.id }
      }),
      prisma.message.aggregate({
        where: {
          conversation: {
            userId: req.user!.id
          },
          role: 'ASSISTANT'
        },
        _sum: {
          tokens: true
        }
      })
    ])
    
    // Get conversations by model
    const conversationsByModel = await prisma.conversation.groupBy({
      by: ['model'],
      where: { userId: req.user!.id },
      _count: {
        id: true
      }
    })
    
    // Get recent activity (messages in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentMessages = await prisma.message.count({
      where: {
        conversation: {
          userId: req.user!.id
        },
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })
    
    res.json({
      conversations,
      messages,
      files,
      tokensUsed: tokensUsed._sum.tokens || 0,
      recentMessages,
      conversationsByModel: conversationsByModel.map(item => ({
        model: item.model,
        count: item._count.id
      }))
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    throw new CustomError('Failed to fetch user statistics', 500, 'FETCH_STATS_ERROR')
  }
}))

// Delete user account
router.delete('/account', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { password, confirmation } = req.body
  
  if (!password) {
    throw new CustomError('Password is required to delete account', 400, 'MISSING_PASSWORD')
  }
  
  if (confirmation !== 'DELETE') {
    throw new CustomError('Please type DELETE to confirm account deletion', 400, 'INVALID_CONFIRMATION')
  }
  
  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, password: true }
  })
  
  if (!user) {
    throw new CustomError('User not found', 404, 'USER_NOT_FOUND')
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new CustomError('Incorrect password', 401, 'INVALID_PASSWORD')
  }
  
  try {
    // Delete user and all related data (cascade will handle related records)
    await prisma.user.delete({
      where: { id: user.id }
    })
    
    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Error deleting user account:', error)
    throw new CustomError('Failed to delete account', 500, 'DELETE_ACCOUNT_ERROR')
  }
}))

// Admin only routes
// Get all users (admin only)
router.get('/', requireRole(['ADMIN']), asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { page = '1', limit = '20', search, role } = req.query
  
  const pageNum = parseInt(page as string, 10)
  const limitNum = Math.min(parseInt(limit as string, 10), 100) // Max 100 users per page
  const skip = (pageNum - 1) * limitNum
  
  const where: any = {}
  
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { email: { contains: search as string, mode: 'insensitive' } }
    ]
  }
  
  if (role) {
    where.role = role
  }
  
  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              conversations: true,
              messages: true,
              files: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])
    
    res.json({
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrevious: pageNum > 1
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new CustomError('Failed to fetch users', 500, 'FETCH_USERS_ERROR')
  }
}))

// Update user role (admin only)
router.patch('/:userId/role', requireRole(['ADMIN']), asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { userId } = req.params
  const { role } = req.body
  
  if (!role || !['USER', 'ADMIN'].includes(role)) {
    throw new CustomError('Valid role (USER or ADMIN) is required', 400, 'INVALID_ROLE')
  }
  
  if (userId === req.user!.id) {
    throw new CustomError('Cannot change your own role', 403, 'CANNOT_CHANGE_OWN_ROLE')
  }
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    })
    
    res.json(updatedUser)
  } catch (error) {
    console.error('Error updating user role:', error)
    throw new CustomError('Failed to update user role', 500, 'UPDATE_ROLE_ERROR')
  }
}))

export default router