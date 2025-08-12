'use client'

import { useState } from 'react'
import { Message, MessageRole, MODEL_CONFIGS } from '../../../../shared/types'
import { Button } from '@/components/ui/button'
import { 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  User, 
  Bot,
  Check,
  MoreHorizontal
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)
  const { toast } = useToast()

  const isUser = message.role === MessageRole.USER
  const isAssistant = message.role === MessageRole.ASSISTANT

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      toast({
        title: 'تم النسخ',
        description: 'تم نسخ الرسالة إلى الحافظة'
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في نسخ الرسالة',
        variant: 'destructive'
      })
    }
  }

  const handleFeedback = (isPositive: boolean) => {
    setLiked(isPositive)
    toast({
      title: 'شكراً لك',
      description: `تم إرسال ${isPositive ? 'الإعجاب' : 'عدم الإعجاب'}`
    })
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const renderContent = () => {
    // Simple markdown-like rendering
    let content = message.content

    // Code blocks
    content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-muted p-3 rounded-lg overflow-x-auto my-2"><code class="text-sm">${code.trim()}</code></pre>`
    })

    // Inline code
    content = content.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')

    // Bold text
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // Italic text
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>')

    // Line breaks
    content = content.replace(/\n/g, '<br>')

    return { __html: content }
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 bg-gradient-to-r from-same-blue-600 to-same-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Message content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : ''}`}>
        {/* Message header */}
        <div className="flex items-center gap-2 mb-1">
          {isUser ? (
            <>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(message.createdAt)}
              </span>
              <span className="text-sm font-medium">أنت</span>
            </>
          ) : (
            <>
              <span className="text-sm font-medium">
                {message.model ? MODEL_CONFIGS[message.model]?.displayName : 'المساعد'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(message.createdAt)}
              </span>
              {message.tokens && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {message.tokens} رمز
                </span>
              )}
              {isStreaming && (
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600">يكتب...</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Message bubble */}
        <div className={`
          rounded-lg p-3 
          ${isUser 
            ? 'bg-gradient-to-r from-same-blue-600 to-same-purple-600 text-white ml-auto'
            : 'bg-muted'
          }
        `}>
          <div 
            className={`prose prose-sm max-w-none ${
              isUser ? 'prose-invert' : ''
            }`}
            dangerouslySetInnerHTML={renderContent()}
          />
        </div>

        {/* Message actions */}
        {isAssistant && !isStreaming && (
          <div className="flex items-center gap-1 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback(true)}
              className={`h-7 px-2 ${
                liked === true ? 'text-green-600 bg-green-50' : ''
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback(false)}
              className={`h-7 px-2 ${
                liked === false ? 'text-red-600 bg-red-50' : ''
              }`}
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
