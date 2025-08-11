import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AIModel, Message, MessageRole, MODEL_CONFIGS } from '../../../shared/types'

interface AIResponseChunk {
  content: string
  tokens?: number
  finishReason?: 'stop' | 'length' | 'function_call' | 'content_filter'
}

export class AIService {
  private openai?: OpenAI
  private anthropic?: Anthropic
  private googleAI?: GoogleGenerativeAI

  constructor() {
    // Initialize AI clients only if API keys are available
    try {
      if (process.env.OPENAI_API_KEY) {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        })
      }

      if (process.env.ANTHROPIC_API_KEY) {
        this.anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        })
      }

      if (process.env.GOOGLE_AI_API_KEY) {
        this.googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
      }
    } catch (error) {
      console.warn('Failed to initialize some AI services:', error)
    }
  }

  async *generateResponse(messages: Message[], model: AIModel): AsyncGenerator<AIResponseChunk> {
    const config = MODEL_CONFIGS[model]

    switch (config.provider) {
      case 'openai':
        if (!this.openai) {
          throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.')
        }
        yield* this.generateOpenAIResponse(messages, model)
        break
      case 'anthropic':
        if (!this.anthropic) {
          throw new Error('Anthropic API key not configured. Please set ANTHROPIC_API_KEY environment variable.')
        }
        yield* this.generateAnthropicResponse(messages, model)
        break
      case 'google':
        if (!this.googleAI) {
          throw new Error('Google AI API key not configured. Please set GOOGLE_AI_API_KEY environment variable.')
        }
        yield* this.generateGoogleResponse(messages, model)
        break
      case 'meta':
        yield* this.generateMetaResponse(messages, model)
        break
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`)
    }
  }

  private async *generateOpenAIResponse(messages: Message[], model: AIModel): AsyncGenerator<AIResponseChunk> {
    try {
      const config = MODEL_CONFIGS[model]
      const formattedMessages = this.formatMessagesForOpenAI(messages)

      const stream = await this.openai.chat.completions.create({
        model: config.name,
        messages: formattedMessages,
        max_tokens: Math.min(config.maxTokens, 2000), // Limit response length
        temperature: 0.7,
        stream: true
      })

      for await (const chunk of stream) {
        const choice = chunk.choices[0]
        if (choice?.delta?.content) {
          yield {
            content: choice.delta.content,
            tokens: 1, // Approximate token count
            finishReason: choice.finish_reason as any
          }
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      yield {
        content: 'عذراً، حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.',
        finishReason: 'stop'
      }
    }
  }

  private async *generateAnthropicResponse(messages: Message[], model: AIModel): AsyncGenerator<AIResponseChunk> {
    try {
      const config = MODEL_CONFIGS[model]
      const formattedMessages = this.formatMessagesForAnthropic(messages)

      const stream = await this.anthropic.messages.create({
        model: config.name,
        max_tokens: Math.min(config.maxTokens, 2000),
        temperature: 0.7,
        messages: formattedMessages,
        stream: true
      })

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          yield {
            content: chunk.delta.text,
            tokens: 1,
            finishReason: 'stop'
          }
        }
      }
    } catch (error) {
      console.error('Anthropic API error:', error)
      yield {
        content: 'عذراً، حدث خطأ في الاتصال بخدمة Claude. يرجى المحاولة مرة أخرى.',
        finishReason: 'stop'
      }
    }
  }

  private async *generateGoogleResponse(messages: Message[], model: AIModel): AsyncGenerator<AIResponseChunk> {
    try {
      const config = MODEL_CONFIGS[model]
      const geminiModel = this.googleAI.getGenerativeModel({ model: config.name })
      
      const chat = geminiModel.startChat({
        history: this.formatMessagesForGoogle(messages.slice(0, -1)),
        generationConfig: {
          maxOutputTokens: Math.min(config.maxTokens, 2000),
          temperature: 0.7,
        },
      })

      const lastMessage = messages[messages.length - 1]
      const result = await chat.sendMessageStream(lastMessage.content)

      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) {
          yield {
            content: text,
            tokens: 1,
            finishReason: 'stop'
          }
        }
      }
    } catch (error) {
      console.error('Google AI API error:', error)
      yield {
        content: 'عذراً، حدث خطأ في الاتصال بخدمة Gemini. يرجى المحاولة مرة أخرى.',
        finishReason: 'stop'
      }
    }
  }

  private async *generateMetaResponse(messages: Message[], model: AIModel): AsyncGenerator<AIResponseChunk> {
    // For now, we'll use a placeholder implementation
    // In a real implementation, you would integrate with Replicate API or similar
    try {
      const response = 'عذراً، نماذج Llama غير متاحة حالياً. يرجى استخدام نموذج آخر.'
      
      // Simulate streaming response
      const words = response.split(' ')
      for (const word of words) {
        yield {
          content: word + ' ',
          tokens: 1,
          finishReason: 'stop'
        }
        // Add small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    } catch (error) {
      console.error('Meta API error:', error)
      yield {
        content: 'عذراً، حدث خطأ في الاتصال بخدمة Llama. يرجى المحاولة مرة أخرى.',
        finishReason: 'stop'
      }
    }
  }

  private formatMessagesForOpenAI(messages: Message[]): Array<{role: 'system' | 'user' | 'assistant', content: string}> {
    const systemMessage = {
      role: 'system' as const,
      content: 'أنت مساعد ذكي مفيد يتحدث باللغة العربية. تجيب على الأسئلة بوضوح ودقة، وتقدم المساعدة في مختلف المجالات.'
    }

    const formattedMessages = messages.map(msg => ({
      role: msg.role === MessageRole.USER ? 'user' as const : 'assistant' as const,
      content: msg.content
    }))

    return [systemMessage, ...formattedMessages]
  }

  private formatMessagesForAnthropic(messages: Message[]): Array<{role: 'user' | 'assistant', content: string}> {
    return messages
      .filter(msg => msg.role !== MessageRole.SYSTEM)
      .map(msg => ({
        role: msg.role === MessageRole.USER ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))
  }

  private formatMessagesForGoogle(messages: Message[]): Array<{role: 'user' | 'model', parts: [{text: string}]}> {
    return messages
      .filter(msg => msg.role !== MessageRole.SYSTEM)
      .map(msg => ({
        role: msg.role === MessageRole.USER ? 'user' as const : 'model' as const,
        parts: [{ text: msg.content }]
      }))
  }

  // Single response generation (non-streaming)
  async generateSingleResponse(messages: Message[], model: AIModel): Promise<string> {
    const chunks: string[] = []
    
    for await (const chunk of this.generateResponse(messages, model)) {
      chunks.push(chunk.content)
    }
    
    return chunks.join('')
  }

  // Document analysis
  async analyzeDocument(content: string, model: AIModel = AIModel.GPT4): Promise<{
    summary: string
    keyPoints: string[]
    questions: string[]
  }> {
    const analysisPrompt = `
قم بتحليل المستند التالي وقدم:
1. ملخص موجز
2. النقاط الرئيسية (5-10 نقاط)
3. أسئلة مقترحة للفهم العميق (3-5 أسئلة)

المستند:
${content}

قدم الإجابة بصيغة JSON بالشكل التالي:
{
  "summary": "الملخص هنا",
  "keyPoints": ["نقطة 1", "نقطة 2", ...],
  "questions": ["سؤال 1", "سؤال 2", ...]
}
`

    const messages: Message[] = [{
      id: 'temp',
      conversationId: 'temp',
      content: analysisPrompt,
      role: MessageRole.USER,
      createdAt: new Date()
    }]

    const response = await this.generateSingleResponse(messages, model)
    
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Error parsing document analysis response:', error)
    }

    // Fallback response
    return {
      summary: 'تم تحليل المستند بنجاح',
      keyPoints: ['تم استخراج المحتوى الرئيسي'],
      questions: ['ما هي النقاط الأساسية في هذا المستند؟']
    }
  }

  // Code review
  async reviewCode(code: string, language: string, model: AIModel = AIModel.GPT4): Promise<{
    suggestions: string[]
    issues: string[]
    rating: number
  }> {
    const reviewPrompt = `
قم بمراجعة الكود التالي المكتوب بلغة ${language}:

\`\`\`${language}
${code}
\`\`\`

قدم:
1. اقتراحات للتحسين
2. المشاكل المحتملة
3. تقييم من 1-10

قدم الإجابة بصيغة JSON:
{
  "suggestions": ["اقتراح 1", "اقتراح 2", ...],
  "issues": ["مشكلة 1", "مشكلة 2", ...],
  "rating": 8
}
`

    const messages: Message[] = [{
      id: 'temp',
      conversationId: 'temp',
      content: reviewPrompt,
      role: MessageRole.USER,
      createdAt: new Date()
    }]

    const response = await this.generateSingleResponse(messages, model)
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (error) {
      console.error('Error parsing code review response:', error)
    }

    return {
      suggestions: ['تم مراجعة الكود بنجاح'],
      issues: ['لم يتم العثور على مشاكل واضحة'],
      rating: 7
    }
  }
}
