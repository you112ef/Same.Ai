'use client'

import { useAuth } from '@/hooks/use-auth'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  MessageSquare, 
  PlusCircle, 
  Clock, 
  TrendingUp,
  Sparkles,
  Zap,
  Users,
  FileText,
  Activity,
  Brain,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { MODEL_CONFIGS, AIModel } from '@/shared/types'

const quickActions = [
  {
    title: 'محادثة جديدة',
    description: 'ابدأ محادثة مع أي نموذج ذكاء اصطناعي',
    icon: PlusCircle,
    href: '/chat/new',
    variant: 'gradient' as const
  },
  {
    title: 'تحليل ملف',
    description: 'ارفع ملف واحصل على تحليل ذكي',
    icon: FileText,
    href: '/dashboard/files/upload',
    variant: 'outline' as const
  },
  {
    title: 'مراجعة الكود',
    description: 'احصل على مراجعة وتحسينات للكود',
    icon: Brain,
    href: '/chat/new?mode=code',
    variant: 'outline' as const
  }
]

const stats = [
  {
    title: 'المحادثات',
    value: '24',
    change: '+12%',
    icon: MessageSquare,
    color: 'text-blue-600'
  },
  {
    title: 'الرموز المستخدمة',
    value: '1,250',
    change: '+8%',
    icon: Zap,
    color: 'text-purple-600'
  },
  {
    title: 'الملفات',
    value: '8',
    change: '+3',
    icon: FileText,
    color: 'text-green-600'
  },
  {
    title: 'وقت الاستجابة',
    value: '0.8s',
    change: '-15%',
    icon: Activity,
    color: 'text-orange-600'
  }
]

const recentConversations = [
  {
    id: '1',
    title: 'شرح مفاهيم الذكاء الاصطناعي',
    model: AIModel.GPT4,
    lastMessage: 'شكراً لك على الشرح الوافي...',
    updatedAt: '2024-08-11T10:30:00Z',
    messagesCount: 12
  },
  {
    id: '2',
    title: 'مراجعة كود React',
    model: AIModel.CLAUDE3_SONNET,
    lastMessage: 'يمكن تحسين الأداء عبر استخدام useMemo...',
    updatedAt: '2024-08-11T09:15:00Z',
    messagesCount: 8
  },
  {
    id: '3',
    title: 'كتابة خطة عمل',
    model: AIModel.GEMINI_PRO,
    lastMessage: 'الخطة تبدو شاملة ومدروسة...',
    updatedAt: '2024-08-10T16:45:00Z',
    messagesCount: 15
  }
]

export default function DashboardPage() {
  const { user } = useAuth()

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'منذ قليل'
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`
    return `منذ ${Math.floor(diffInHours / 24)} يوم`
  }

  return (
    <DashboardLayout 
      title={`مرحباً، ${user?.name?.split(' ')[0] || 'المستخدم'}`}
      subtitle="ما الذي تريد إنجازه اليوم؟"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4">الإجراءات السريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Card key={action.title} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Link href={action.href}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Icon className="w-6 h-6 text-muted-foreground" />
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-lg font-semibold mb-4">إحصائيات سريعة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-green-600">{stat.change}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Conversations */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">المحادثات الأخيرة</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/chat">
                  عرض الكل
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Link>
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentConversations.map((conversation, index) => (
                    <div key={conversation.id}>
                      <Link href={`/chat/${conversation.id}`}>
                        <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium truncate">{conversation.title}</h3>
                                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                  {MODEL_CONFIGS[conversation.model].displayName}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{formatTimeAgo(conversation.updatedAt)}</span>
                                <span>{conversation.messagesCount} رسالة</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                          </div>
                        </div>
                      </Link>
                      {index < recentConversations.length - 1 && <div className="border-b" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* AI Models */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">نماذج الذكاء الاصطناعي</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/chat/new">
                  جرّب الآن
                  <Sparkles className="w-4 h-4 mr-2" />
                </Link>
              </Button>
            </div>

            <div className="space-y-3">
              {[AIModel.GPT4, AIModel.CLAUDE3_OPUS, AIModel.GEMINI_PRO, AIModel.LLAMA3].map((model) => {
                const config = MODEL_CONFIGS[model]
                return (
                  <Card key={model} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <Link href={`/chat/new?model=${model}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{config.displayName}</h3>
                              <span className="text-xs bg-gradient-to-r from-same-blue-100 to-same-purple-100 text-same-blue-700 px-2 py-1 rounded-full">
                                {config.provider}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {config.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{config.maxTokens.toLocaleString()} رمز</span>
                              <span>${config.costPer1kTokens}/1K</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        </div>

        {/* Tips */}
        <section>
          <Card className="bg-gradient-to-r from-same-blue-50 to-same-purple-50 border-same-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-same-blue-700">
                <Sparkles className="w-5 h-5" />
                نصيحة اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-same-blue-600">
                استخدم النماذج المختلفة للمهام المختلفة: GPT-4 للتحليل العميق، Claude للنصوص الطويلة، Gemini للمحتوى متعدد الوسائط.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  )
}