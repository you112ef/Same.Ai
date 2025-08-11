'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { 
  PlusCircle, 
  Search, 
  Filter,
  MoreHorizontal,
  MessageSquare,
  Calendar,
  Bot,
  Trash2,
  Archive,
  Star,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Conversation, AIModel, MODEL_CONFIGS } from '@/shared/types'

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'شرح مفاهيم الذكاء الاصطناعي',
    userId: 'user1',
    model: AIModel.GPT4,
    createdAt: new Date('2024-08-11T10:30:00Z'),
    updatedAt: new Date('2024-08-11T10:30:00Z'),
    messages: [
      {
        id: '1',
        conversationId: '1',
        content: 'مرحبا، يمكنك شرح مفاهيم الذكاء الاصطناعي؟',
        role: 'USER' as any,
        createdAt: new Date('2024-08-11T10:30:00Z')
      }
    ]
  },
  {
    id: '2',
    title: 'مراجعة كود React',
    userId: 'user1',
    model: AIModel.CLAUDE3_SONNET,
    createdAt: new Date('2024-08-11T09:15:00Z'),
    updatedAt: new Date('2024-08-11T09:15:00Z'),
    messages: []
  },
  {
    id: '3',
    title: 'كتابة خطة عمل',
    userId: 'user1',
    model: AIModel.GEMINI_PRO,
    createdAt: new Date('2024-08-10T16:45:00Z'),
    updatedAt: new Date('2024-08-10T16:45:00Z'),
    messages: []
  },
  {
    id: '4',
    title: 'تحليل البيانات بـ Python',
    userId: 'user1',
    model: AIModel.GPT4,
    createdAt: new Date('2024-08-10T14:20:00Z'),
    updatedAt: new Date('2024-08-10T14:20:00Z'),
    messages: []
  },
  {
    id: '5',
    title: 'استراتيجية التسويق الرقمي',
    userId: 'user1',
    model: AIModel.CLAUDE3_OPUS,
    createdAt: new Date('2024-08-09T11:10:00Z'),
    updatedAt: new Date('2024-08-09T11:10:00Z'),
    messages: []
  }
]

const filterOptions = [
  { label: 'الكل', value: 'all' },
  { label: 'اليوم', value: 'today' },
  { label: 'هذا الأسبوع', value: 'week' },
  { label: 'هذا الشهر', value: 'month' }
]

const modelFilters = [
  { label: 'جميع النماذج', value: 'all' },
  { label: 'GPT-4', value: AIModel.GPT4 },
  { label: 'Claude', value: AIModel.CLAUDE3_OPUS },
  { label: 'Gemini', value: AIModel.GEMINI_PRO },
  { label: 'Llama', value: AIModel.LLAMA3 }
]

export default function ChatListPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [modelFilter, setModelFilter] = useState('all')
  const [selectedConversations, setSelectedConversations] = useState<string[]>([])

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'منذ قليل'
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`
    if (diffInHours < 48) return 'أمس'
    
    return new Intl.DateTimeFormat('ar-SA', {
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getLastMessage = (conversation: Conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'لا توجد رسائل'
    }
    const lastMessage = conversation.messages[conversation.messages.length - 1]
    return lastMessage.content.length > 50 
      ? lastMessage.content.substring(0, 50) + '...'
      : lastMessage.content
  }

  const filteredConversations = conversations.filter(conversation => {
    // Search filter
    if (searchQuery && !conversation.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Model filter
    if (modelFilter !== 'all' && conversation.model !== modelFilter) {
      return false
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const conversationDate = new Date(conversation.updatedAt)
      
      switch (dateFilter) {
        case 'today':
          return now.toDateString() === conversationDate.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return conversationDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return conversationDate >= monthAgo
        default:
          return true
      }
    }

    return true
  })

  const handleSelectConversation = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedConversations(prev => [...prev, id])
    } else {
      setSelectedConversations(prev => prev.filter(convId => convId !== id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on conversations:`, selectedConversations)
    // Implement bulk actions here
    setSelectedConversations([])
  }

  return (
    <DashboardLayout 
      title="المحادثات"
      subtitle={`${filteredConversations.length} محادثة`}
      actions={
        <Button asChild>
          <Link href="/chat/new">
            <PlusCircle className="w-4 h-4 ml-2" />
            محادثة جديدة
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="البحث في المحادثات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              {modelFilters.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk actions */}
        {selectedConversations.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-same-blue-50 rounded-lg">
            <span className="text-sm font-medium">
              {selectedConversations.length} محادثة محددة
            </span>
            <div className="flex gap-1 mr-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('archive')}
              >
                <Archive className="w-4 h-4 ml-1" />
                أرشف
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 ml-1" />
                احذف
              </Button>
            </div>
          </div>
        )}

        {/* Conversations list */}
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">لا توجد محادثات</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'لم يتم العثور على محادثات مطابقة للبحث' : 'ابدأ محادثتك الأولى مع الذكاء الاصطناعي'}
            </p>
            <Button asChild>
              <Link href="/chat/new">
                <PlusCircle className="w-4 h-4 ml-2" />
                محادثة جديدة
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => {
              const isSelected = selectedConversations.includes(conversation.id)
              const modelConfig = MODEL_CONFIGS[conversation.model]
              
              return (
                <Card key={conversation.id} className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-same-blue-600 bg-same-blue-50' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {/* Selection checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectConversation(conversation.id, e.target.checked)}
                        className="w-4 h-4 rounded"
                        onClick={(e) => e.stopPropagation()}
                      />

                      {/* Model indicator */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-same-blue-600 to-same-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>

                      {/* Content */}
                      <Link href={`/chat/${conversation.id}`} className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{conversation.title}</h3>
                              <span className="text-xs bg-muted px-2 py-1 rounded-full flex-shrink-0">
                                {modelConfig.displayName}
                              </span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground truncate">
                              {getLastMessage(conversation)}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {formatDate(new Date(conversation.updatedAt))}
                              </div>
                              
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="w-3 h-3" />
                                {conversation.messages?.length || 0} رسالة
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                // Handle star toggle
                              }}
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                // Handle more actions
                              }}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>

                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}