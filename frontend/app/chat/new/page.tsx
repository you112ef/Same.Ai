'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ChatInterface } from '@/components/chat/chat-interface'
import { AIModel } from '../../../../shared/types'

export default function NewChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [initialModel, setInitialModel] = useState<AIModel>(AIModel.GPT4)

  useEffect(() => {
    // Get model from URL params if specified
    const modelParam = searchParams.get('model') as AIModel
    if (modelParam && Object.values(AIModel).includes(modelParam)) {
      setInitialModel(modelParam)
    }
  }, [searchParams])

  const handleNewConversation = (conversationId: string) => {
    // Navigate to the new conversation
    router.push(`/chat/${conversationId}`)
  }

  return (
    <DashboardLayout 
      title="محادثة جديدة"
      subtitle="ابدأ محادثة مع أي نموذج ذكاء اصطناعي"
    >
      <div className="h-full flex flex-col">
        <ChatInterface
          initialModel={initialModel}
          onNewConversation={handleNewConversation}
        />
      </div>
    </DashboardLayout>
  )
}
