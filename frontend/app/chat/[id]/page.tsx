'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ChatInterface } from '@/components/chat/chat-interface'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Share2, 
  Archive, 
  Trash2, 
  MoreHorizontal,
  Star,
  Download
} from 'lucide-react'
import Link from 'next/link'
import { Conversation, Message, MessageRole, AIModel, MODEL_CONFIGS } from '@/shared/types'

// Mock conversation data
const mockConversations: Record<string, Conversation> = {
  '1': {
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
        role: MessageRole.USER,
        createdAt: new Date('2024-08-11T10:30:00Z')
      },
      {
        id: '2',
        conversationId: '1',
        content: `الذكاء الاصطناعي (AI) هو مجال واسع في علوم الحاسوب يهدف إلى إنشاء أنظمة قادرة على أداء مهام تتطلب عادة ذكاء بشري. إليك أهم المفاهيم:

## المفاهيم الأساسية:

**1. التعلم الآلي (Machine Learning)**
- هو طريقة لتعليم الحاسوب من البيانات دون برمجة صريحة
- يتضمن خوارزميات تتحسن مع الخبرة

**2. التعلم العميق (Deep Learning)**
- شبكات عصبية معقدة تحاكي عمل الدماغ البشري
- مفيدة للمهام المعقدة مثل معالجة الصور والكلام

**3. معالجة اللغة الطبيعية (NLP)**
- تمكن الحاسوب من فهم وإنتاج اللغة البشرية
- مثل ما أفعله الآن في محادثتنا!

هل تريد التعمق في أي من هذه المفاهيم؟`,
        role: MessageRole.ASSISTANT,
        model: AIModel.GPT4,
        tokens: 245,
        createdAt: new Date('2024-08-11T10:31:00Z')
      },
      {
        id: '3',
        conversationId: '1',
        content: 'ممتاز! أريد أن أعرف أكثر عن التعلم العميق',
        role: MessageRole.USER,
        createdAt: new Date('2024-08-11T10:32:00Z')
      },
      {
        id: '4',
        conversationId: '1',
        content: `ممتاز! التعلم العميق موضوع شيق جداً. دعني أشرحه بطريقة مبسطة:

## ما هو التعلم العميق؟

التعلم العميق هو نوع متقدم من التعلم الآلي يستخدم **الشبكات العصبية الاصطناعية** التي تحاكي طريقة عمل الدماغ البشري.

### لماذا يُسمى "عميق"؟
- لأنه يستخدم شبكات بطبقات متعددة (عادة 3+ طبقات)
- كل طبقة تستخرج ميزات أكثر تعقيداً من السابقة

### كيف يعمل؟
1. **طبقة الإدخال**: تستقبل البيانات الخام (صورة، صوت، نص)
2. **الطبقات المخفية**: تعالج وتحلل البيانات تدريجياً
3. **طبقة الإخراج**: تعطي النتيجة النهائية

### أمثلة عملية:
- **التعرف على الصور**: تمييز القطط من الكلاب
- **الترجمة الآلية**: ترجمة النصوص بين اللغات
- **المساعدات الصوتية**: مثل Siri و Alexa
- **السيارات ذاتية القيادة**: تحليل الطريق والعوائق

### ما يجعله قوياً:
- **التعلم التلقائي للميزات**: لا نحتاج لتحديد ما يجب أن يبحث عنه
- **التعامل مع البيانات المعقدة**: صور، صوت، فيديو
- **تحسن مستمر**: كلما زادت البيانات، تحسن الأداء

هل تريد أن نتحدث عن تطبيق معين أو تقنية محددة في التعلم العميق؟`,
        role: MessageRole.ASSISTANT,
        model: AIModel.GPT4,
        tokens: 387,
        createdAt: new Date('2024-08-11T10:33:00Z')
      }
    ]
  }
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string
  
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading conversation
    const timer = setTimeout(() => {
      const foundConversation = mockConversations[conversationId]
      setConversation(foundConversation || null)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [conversationId])

  const handleAction = (action: string) => {
    switch (action) {
      case 'archive':
        console.log('Archive conversation')
        break
      case 'delete':
        console.log('Delete conversation')
        router.push('/chat')
        break
      case 'share':
        console.log('Share conversation')
        break
      case 'download':
        console.log('Download conversation')
        break
      case 'star':
        console.log('Toggle star')
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل المحادثة...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!conversation) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">المحادثة غير موجودة</h2>
            <p className="text-muted-foreground mb-4">
              لم يتم العثور على هذه المحادثة
            </p>
            <Button asChild>
              <Link href="/chat">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة إلى المحادثات
              </Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const modelConfig = MODEL_CONFIGS[conversation.model]

  return (
    <DashboardLayout 
      title={conversation.title}
      subtitle={`مع ${modelConfig.displayName} • ${conversation.messages?.length || 0} رسالة`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/chat">
              <ArrowLeft className="w-4 h-4 ml-2" />
              المحادثات
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('star')}
          >
            <Star className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('share')}
          >
            <Share2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('download')}
          >
            <Download className="w-4 h-4" />
          </Button>

          <div className="relative group">
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            
            {/* Dropdown menu */}
            <div className="absolute left-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="py-1">
                <button
                  onClick={() => handleAction('archive')}
                  className="w-full px-3 py-2 text-right text-sm hover:bg-muted transition-colors"
                >
                  <Archive className="w-4 h-4 ml-2 inline" />
                  أرشفة
                </button>
                <button
                  onClick={() => handleAction('delete')}
                  className="w-full px-3 py-2 text-right text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 ml-2 inline" />
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="h-full">
        <ChatInterface
          conversationId={conversation.id}
          initialModel={conversation.model}
          initialMessages={conversation.messages || []}
        />
      </div>
    </DashboardLayout>
  )
}