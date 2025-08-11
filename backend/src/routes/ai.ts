import express from 'express'
import { asyncHandler, CustomError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { AIService } from '../services/aiService'
import { AIModel, Message, MessageRole } from '../../../shared/types'

const router = express.Router()
const aiService = new AIService()

// Generate AI response (non-streaming)
router.post('/generate', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { messages, model = AIModel.GPT4 } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new CustomError('Messages array is required', 400, 'MISSING_MESSAGES')
  }

  // Validate model
  const validModels = Object.values(AIModel)
  if (!validModels.includes(model)) {
    throw new CustomError('Invalid AI model', 400, 'INVALID_MODEL')
  }

  // Validate messages format
  for (const message of messages) {
    if (!message.content || !message.role) {
      throw new CustomError('Each message must have content and role', 400, 'INVALID_MESSAGE_FORMAT')
    }
  }

  try {
    const response = await aiService.generateSingleResponse(messages, model)
    
    res.json({
      content: response,
      model,
      tokens: Math.ceil(response.length / 4), // Estimate tokens
      finishReason: 'stop'
    })
  } catch (error) {
    console.error('Error generating AI response:', error)
    throw new CustomError('Failed to generate AI response', 500, 'AI_GENERATION_ERROR')
  }
}))

// Analyze document
router.post('/analyze-document', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { content, model = AIModel.GPT4 } = req.body

  if (!content || typeof content !== 'string') {
    throw new CustomError('Document content is required', 400, 'MISSING_CONTENT')
  }

  if (content.length > 50000) {
    throw new CustomError('Document too large (max 50,000 characters)', 400, 'CONTENT_TOO_LARGE')
  }

  // Validate model
  const validModels = Object.values(AIModel)
  if (!validModels.includes(model)) {
    throw new CustomError('Invalid AI model', 400, 'INVALID_MODEL')
  }

  try {
    const analysis = await aiService.analyzeDocument(content, model)
    
    res.json({
      analysis,
      model,
      processingTime: Date.now(),
      metadata: {
        contentLength: content.length,
        estimatedTokens: Math.ceil(content.length / 4)
      }
    })
  } catch (error) {
    console.error('Error analyzing document:', error)
    throw new CustomError('Failed to analyze document', 500, 'DOCUMENT_ANALYSIS_ERROR')
  }
}))

// Review code
router.post('/review-code', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { code, language, model = AIModel.GPT4 } = req.body

  if (!code || typeof code !== 'string') {
    throw new CustomError('Code content is required', 400, 'MISSING_CODE')
  }

  if (!language || typeof language !== 'string') {
    throw new CustomError('Programming language is required', 400, 'MISSING_LANGUAGE')
  }

  if (code.length > 20000) {
    throw new CustomError('Code too large (max 20,000 characters)', 400, 'CODE_TOO_LARGE')
  }

  // Validate model
  const validModels = Object.values(AIModel)
  if (!validModels.includes(model)) {
    throw new CustomError('Invalid AI model', 400, 'INVALID_MODEL')
  }

  // Validate programming language
  const supportedLanguages = [
    'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'c',
    'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'sql'
  ]
  
  if (!supportedLanguages.includes(language.toLowerCase())) {
    throw new CustomError(`Unsupported programming language: ${language}`, 400, 'UNSUPPORTED_LANGUAGE')
  }

  try {
    const review = await aiService.reviewCode(code, language, model)
    
    res.json({
      review,
      model,
      language,
      processingTime: Date.now(),
      metadata: {
        codeLength: code.length,
        estimatedTokens: Math.ceil(code.length / 4)
      }
    })
  } catch (error) {
    console.error('Error reviewing code:', error)
    throw new CustomError('Failed to review code', 500, 'CODE_REVIEW_ERROR')
  }
}))

// Get supported models
router.get('/models', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const models = Object.entries(AIModel).map(([key, value]) => ({
    id: value,
    name: key,
    displayName: key.replace(/_/g, ' '),
    provider: getProviderForModel(value),
    capabilities: getCapabilitiesForModel(value)
  }))

  res.json({ models })
}))

// Chat completion with conversation context
router.post('/chat', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { message, conversationId, model = AIModel.GPT4, context } = req.body

  if (!message || typeof message !== 'string') {
    throw new CustomError('Message is required', 400, 'MISSING_MESSAGE')
  }

  // Validate model
  const validModels = Object.values(AIModel)
  if (!validModels.includes(model)) {
    throw new CustomError('Invalid AI model', 400, 'INVALID_MODEL')
  }

  try {
    let messages: Message[] = []

    // If conversation context is provided, use it
    if (context && Array.isArray(context)) {
      messages = context
    }

    // Add the new user message
    const userMessage: Message = {
      id: 'temp-user',
      conversationId: conversationId || 'temp',
      content: message,
      role: MessageRole.USER,
      createdAt: new Date()
    }
    
    messages.push(userMessage)

    const response = await aiService.generateSingleResponse(messages, model)
    
    res.json({
      message: response,
      model,
      tokens: Math.ceil(response.length / 4),
      finishReason: 'stop',
      conversationId
    })
  } catch (error) {
    console.error('Error in chat completion:', error)
    throw new CustomError('Failed to generate chat response', 500, 'CHAT_COMPLETION_ERROR')
  }
}))

// Generate title for conversation
router.post('/generate-title', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { messages, model = AIModel.GPT4 } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new CustomError('Messages array is required', 400, 'MISSING_MESSAGES')
  }

  try {
    // Create a prompt to generate title based on conversation
    const titlePrompt = `
قم بإنشاء عنوان قصير ووصفي للمحادثة التالية (لا يزيد عن 50 حرف):

${messages.slice(0, 3).map((msg: Message) => `${msg.role === MessageRole.USER ? 'المستخدم' : 'المساعد'}: ${msg.content.substring(0, 100)}`).join('\n')}

العنوان فقط (بدون علامات تنصيص أو شرح):
`

    const titleMessages: Message[] = [{
      id: 'temp',
      conversationId: 'temp',
      content: titlePrompt,
      role: MessageRole.USER,
      createdAt: new Date()
    }]

    const title = await aiService.generateSingleResponse(titleMessages, model)
    
    res.json({
      title: title.trim().substring(0, 100), // Limit title length
      model
    })
  } catch (error) {
    console.error('Error generating title:', error)
    throw new CustomError('Failed to generate title', 500, 'TITLE_GENERATION_ERROR')
  }
}))

// Helper functions
function getProviderForModel(model: AIModel): string {
  if (model.startsWith('GPT')) return 'openai'
  if (model.startsWith('CLAUDE')) return 'anthropic'
  if (model.startsWith('GEMINI')) return 'google'
  if (model.startsWith('LLAMA')) return 'meta'
  return 'unknown'
}

function getCapabilitiesForModel(model: AIModel): string[] {
  const capabilities = ['text', 'conversation']
  
  // Add specific capabilities based on model
  if (model === AIModel.GPT4 || model.startsWith('CLAUDE3')) {
    capabilities.push('code', 'analysis', 'reasoning')
  }
  
  if (model.startsWith('GEMINI')) {
    capabilities.push('multimodal', 'code')
  }
  
  if (model.startsWith('LLAMA')) {
    capabilities.push('code', 'open-source')
  }
  
  return capabilities
}

export default router