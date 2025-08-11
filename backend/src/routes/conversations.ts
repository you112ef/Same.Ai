import express from 'express'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, CustomError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { CreateConversationRequest, PaginatedResponse, Conversation } from '../../../shared/types'
import { validatePaginationParams, sanitizeInput } from '../utils/validation'

const router = express.Router()
const prisma = new PrismaClient()

// Get user conversations with pagination
router.get('/', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { page, limit } = validatePaginationParams(
    req.query.page as string,
    req.query.limit as string
  )
  
  const { search, model, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query
  
  const skip = (page - 1) * limit
  
  // Build where clause
  const where: any = {
    userId: req.user!.id
  }
  
  if (search) {
    where.title = {
      contains: sanitizeInput(search as string),
      mode: 'insensitive'
    }
  }
  
  if (model) {
    where.model = model
  }
  
  // Build orderBy clause
  const orderBy: any = {}
  orderBy[sortBy as string] = sortOrder
  
  try {
    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              content: true,
              role: true,
              createdAt: true
            }
          },
          _count: {
            select: { messages: true }
          }
        }
      }),
      prisma.conversation.count({ where })
    ])
    
    const response: PaginatedResponse<Conversation> = {
      data: conversations.map(conv => ({
        ...conv,
        messages: conv.messages
      })) as Conversation[],
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
    console.error('Error fetching conversations:', error)
    throw new CustomError('Failed to fetch conversations', 500, 'FETCH_CONVERSATIONS_ERROR')
  }
}))

// Get specific conversation with messages
router.get('/:id', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  
  const conversation = await prisma.conversation.findFirst({
    where: {
      id,
      userId: req.user!.id
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
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
      }
    }
  })
  
  if (!conversation) {
    throw new CustomError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND')
  }
  
  res.json(conversation)
}))

// Create new conversation
router.post('/', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { title, model }: CreateConversationRequest = req.body
  
  if (!title || !model) {
    throw new CustomError('Title and model are required', 400, 'MISSING_REQUIRED_FIELDS')
  }
  
  const sanitizedTitle = sanitizeInput(title)
  
  if (sanitizedTitle.length < 1 || sanitizedTitle.length > 200) {
    throw new CustomError('Title must be between 1 and 200 characters', 400, 'INVALID_TITLE_LENGTH')
  }
  
  // Validate model exists in our supported models
  const validModels = ['GPT4', 'GPT35', 'CLAUDE3_OPUS', 'CLAUDE3_SONNET', 'CLAUDE3_HAIKU', 'GEMINI_PRO', 'GEMINI_ULTRA', 'LLAMA2', 'LLAMA3']
  if (!validModels.includes(model)) {
    throw new CustomError('Invalid AI model', 400, 'INVALID_MODEL')
  }
  
  try {
    const conversation = await prisma.conversation.create({
      data: {
        title: sanitizedTitle,
        model,
        userId: req.user!.id
      },
      include: {
        messages: true
      }
    })
    
    res.status(201).json(conversation)
  } catch (error) {
    console.error('Error creating conversation:', error)
    throw new CustomError('Failed to create conversation', 500, 'CREATE_CONVERSATION_ERROR')
  }
}))

// Update conversation
router.put('/:id', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  const { title, model } = req.body
  
  // Check if conversation exists and belongs to user
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      id,
      userId: req.user!.id
    }
  })
  
  if (!existingConversation) {
    throw new CustomError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND')
  }
  
  const updateData: any = {}
  
  if (title) {
    const sanitizedTitle = sanitizeInput(title)
    if (sanitizedTitle.length < 1 || sanitizedTitle.length > 200) {
      throw new CustomError('Title must be between 1 and 200 characters', 400, 'INVALID_TITLE_LENGTH')
    }
    updateData.title = sanitizedTitle
  }
  
  if (model) {
    const validModels = ['GPT4', 'GPT35', 'CLAUDE3_OPUS', 'CLAUDE3_SONNET', 'CLAUDE3_HAIKU', 'GEMINI_PRO', 'GEMINI_ULTRA', 'LLAMA2', 'LLAMA3']
    if (!validModels.includes(model)) {
      throw new CustomError('Invalid AI model', 400, 'INVALID_MODEL')
    }
    updateData.model = model
  }
  
  try {
    const updatedConversation = await prisma.conversation.update({
      where: { id },
      data: updateData,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    
    res.json(updatedConversation)
  } catch (error) {
    console.error('Error updating conversation:', error)
    throw new CustomError('Failed to update conversation', 500, 'UPDATE_CONVERSATION_ERROR')
  }
}))

// Delete conversation
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  
  // Check if conversation exists and belongs to user
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      id,
      userId: req.user!.id
    }
  })
  
  if (!existingConversation) {
    throw new CustomError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND')
  }
  
  try {
    // Delete conversation (messages will be deleted due to cascade)
    await prisma.conversation.delete({
      where: { id }
    })
    
    res.json({ message: 'Conversation deleted successfully' })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    throw new CustomError('Failed to delete conversation', 500, 'DELETE_CONVERSATION_ERROR')
  }
}))

// Archive/unarchive conversation
router.patch('/:id/archive', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  const { archived = true } = req.body
  
  // Check if conversation exists and belongs to user
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      id,
      userId: req.user!.id
    }
  })
  
  if (!existingConversation) {
    throw new CustomError('Conversation not found', 404, 'CONVERSATION_NOT_FOUND')
  }
  
  try {
    const updatedConversation = await prisma.conversation.update({
      where: { id },
      data: { archived: !!archived }
    })
    
    res.json(updatedConversation)
  } catch (error) {
    console.error('Error archiving conversation:', error)
    throw new CustomError('Failed to archive conversation', 500, 'ARCHIVE_CONVERSATION_ERROR')
  }
}))

// Bulk operations
router.post('/bulk', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { action, conversationIds } = req.body
  
  if (!action || !conversationIds || !Array.isArray(conversationIds)) {
    throw new CustomError('Action and conversation IDs are required', 400, 'MISSING_BULK_PARAMS')
  }
  
  if (conversationIds.length === 0) {
    throw new CustomError('At least one conversation ID is required', 400, 'EMPTY_CONVERSATION_IDS')
  }
  
  // Verify all conversations belong to the user
  const userConversations = await prisma.conversation.findMany({
    where: {
      id: { in: conversationIds },
      userId: req.user!.id
    },
    select: { id: true }
  })
  
  if (userConversations.length !== conversationIds.length) {
    throw new CustomError('Some conversations not found or not accessible', 403, 'INVALID_CONVERSATION_ACCESS')
  }
  
  try {
    let result
    
    switch (action) {
      case 'delete':
        result = await prisma.conversation.deleteMany({
          where: {
            id: { in: conversationIds },
            userId: req.user!.id
          }
        })
        break
      
      case 'archive':
        result = await prisma.conversation.updateMany({
          where: {
            id: { in: conversationIds },
            userId: req.user!.id
          },
          data: { archived: true }
        })
        break
      
      case 'unarchive':
        result = await prisma.conversation.updateMany({
          where: {
            id: { in: conversationIds },
            userId: req.user!.id
          },
          data: { archived: false }
        })
        break
      
      default:
        throw new CustomError('Invalid bulk action', 400, 'INVALID_BULK_ACTION')
    }
    
    res.json({ 
      message: `Successfully ${action}d ${result.count} conversations`,
      count: result.count
    })
  } catch (error) {
    console.error('Error performing bulk operation:', error)
    throw new CustomError('Failed to perform bulk operation', 500, 'BULK_OPERATION_ERROR')
  }
}))

export default router