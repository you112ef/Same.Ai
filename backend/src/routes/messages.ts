import express from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, CustomError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { SendMessageRequest, Message, PaginatedResponse } from '../../../shared/types'
import { validatePaginationParams, sanitizeInput } from '../utils/validation'

const router = express.Router()
const prisma = new PrismaClient()

// Get messages for a conversation
router.get('/conversation/:conversationId', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { conversationId } = req.params
  const { page, limit } = validatePaginationParams(
    req.query.page as string,
    req.query.limit as string
  )
  
  const skip = (page - 1) * limit
  
  // Verify conversation belongs to user
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId: req.user!.id
    }
  })
  
  if (!conversation) {
    throw new CustomError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND')
  }
  
  try {
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { conversationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          files: {
            select: {
              id: true,
              name: true,
              type: true,
              size: true,
              url: true
            }
          }
        }
      }),
      prisma.message.count({ where: { conversationId } })
    ])
    
    const response: PaginatedResponse<Message> = {
      data: messages.reverse() as Message[], // Reverse to get chronological order
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1
      }
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw new CustomError('Failed to fetch messages', 500, 'FETCH_MESSAGES_ERROR')
  }
}))

// Get specific message
router.get('/:id', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  
  const message = await prisma.message.findFirst({
    where: { id },
    include: {
      conversation: {
        select: { userId: true }
      },
      files: {
        select: {
          id: true,
          name: true,
          type: true,
          size: true,
          url: true
        }
      }
    }
  })
  
  if (!message) {
    throw new CustomError('Message not found', 404, 'MESSAGE_NOT_FOUND')
  }
  
  // Verify message belongs to user's conversation
  if (message.conversation.userId !== req.user!.id) {
    throw new CustomError('Access denied', 403, 'ACCESS_DENIED')
  }
  
  // Remove conversation data from response
  const { conversation, ...messageWithoutConversation } = message
  
  res.json(messageWithoutConversation)
}))

// Create new message
router.post('/', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { conversationId, content, role, model, metadata }: SendMessageRequest & { conversationId: string, metadata?: Record<string, unknown> } = req.body
  
  if (!conversationId || !content || !role) {
    throw new CustomError('Conversation ID, content, and role are required', 400, 'MISSING_REQUIRED_FIELDS')
  }
  
  // Verify conversation belongs to user
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId: req.user!.id
    }
  })
  
  if (!conversation) {
    throw new CustomError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND')
  }
  
  const sanitizedContent = sanitizeInput(content)
  
  if (sanitizedContent.length === 0) {
    throw new CustomError('Message content cannot be empty', 400, 'EMPTY_CONTENT')
  }
  
  if (sanitizedContent.length > 10000) {
    throw new CustomError('Message content too long (max 10000 characters)', 400, 'CONTENT_TOO_LONG')
  }
  
  // Validate role
  const validRoles = ['USER', 'ASSISTANT', 'SYSTEM']
  if (!validRoles.includes(role)) {
    throw new CustomError('Invalid message role', 400, 'INVALID_ROLE')
  }
  
  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        content: sanitizedContent,
        role,
        model: model || conversation.model,
        metadata: metadata || {},
        tokens: estimateTokens(sanitizedContent) // Simple token estimation
      },
      include: {
        files: {
          select: {
            id: true,
            name: true,
            type: true,
            size: true,
            url: true
          }
        }
      }
    })
    
    // Update conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    })
    
    res.status(201).json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    throw new CustomError('Failed to create message', 500, 'CREATE_MESSAGE_ERROR')
  }
}))

// Update message
router.put('/:id', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  const { content, metadata } = req.body
  
  if (!content && !metadata) {
    throw new CustomError('Content or metadata is required', 400, 'MISSING_UPDATE_DATA')
  }
  
  // Find message and verify ownership
  const existingMessage = await prisma.message.findFirst({
    where: { id },
    include: {
      conversation: {
        select: { userId: true }
      }
    }
  })
  
  if (!existingMessage) {
    throw new CustomError('Message not found', 404, 'MESSAGE_NOT_FOUND')
  }
  
  if (existingMessage.conversation.userId !== req.user!.id) {
    throw new CustomError('Access denied', 403, 'ACCESS_DENIED')
  }
  
  // Only allow updating user messages
  if (existingMessage.role !== 'USER') {
    throw new CustomError('Only user messages can be edited', 403, 'EDIT_NOT_ALLOWED')
  }
  
  const updateData: any = {}
  
  if (content) {
    const sanitizedContent = sanitizeInput(content)
    if (sanitizedContent.length === 0) {
      throw new CustomError('Message content cannot be empty', 400, 'EMPTY_CONTENT')
    }
    if (sanitizedContent.length > 10000) {
      throw new CustomError('Message content too long (max 10000 characters)', 400, 'CONTENT_TOO_LONG')
    }
    updateData.content = sanitizedContent
    updateData.tokens = estimateTokens(sanitizedContent)
  }
  
  if (metadata) {
    updateData.metadata = metadata
  }
  
  try {
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: updateData,
      include: {
        files: {
          select: {
            id: true,
            name: true,
            type: true,
            size: true,
            url: true
          }
        }
      }
    })
    
    res.json(updatedMessage)
  } catch (error) {
    console.error('Error updating message:', error)
    throw new CustomError('Failed to update message', 500, 'UPDATE_MESSAGE_ERROR')
  }
}))

// Delete message
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  
  // Find message and verify ownership
  const existingMessage = await prisma.message.findFirst({
    where: { id },
    include: {
      conversation: {
        select: { userId: true }
      }
    }
  })
  
  if (!existingMessage) {
    throw new CustomError('Message not found', 404, 'MESSAGE_NOT_FOUND')
  }
  
  if (existingMessage.conversation.userId !== req.user!.id) {
    throw new CustomError('Access denied', 403, 'ACCESS_DENIED')
  }
  
  try {
    await prisma.message.delete({
      where: { id }
    })
    
    res.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Error deleting message:', error)
    throw new CustomError('Failed to delete message', 500, 'DELETE_MESSAGE_ERROR')
  }
}))

// Add feedback to message (like/dislike)
router.post('/:id/feedback', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  const { type, comment } = req.body
  
  if (!type || !['like', 'dislike'].includes(type)) {
    throw new CustomError('Valid feedback type (like/dislike) is required', 400, 'INVALID_FEEDBACK_TYPE')
  }
  
  // Find message and verify ownership
  const message = await prisma.message.findFirst({
    where: { id },
    include: {
      conversation: {
        select: { userId: true }
      }
    }
  })
  
  if (!message) {
    throw new CustomError('Message not found', 404, 'MESSAGE_NOT_FOUND')
  }
  
  if (message.conversation.userId !== req.user!.id) {
    throw new CustomError('Access denied', 403, 'ACCESS_DENIED')
  }
  
  // Only allow feedback on AI messages
  if (message.role === 'USER') {
    throw new CustomError('Cannot add feedback to user messages', 400, 'INVALID_FEEDBACK_TARGET')
  }
  
  try {
    // Create or update feedback
    const feedback = await prisma.messageFeedback.upsert({
      where: {
        messageId_userId: {
          messageId: id,
          userId: req.user!.id
        }
      },
      update: {
        type,
        comment: comment || null
      },
      create: {
        messageId: id,
        userId: req.user!.id,
        type,
        comment: comment || null
      }
    })
    
    res.json(feedback)
  } catch (error) {
    console.error('Error adding feedback:', error)
    throw new CustomError('Failed to add feedback', 500, 'ADD_FEEDBACK_ERROR')
  }
}))

// Simple token estimation function
function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token for English/Arabic text
  return Math.ceil(text.length / 4)
}

export default router