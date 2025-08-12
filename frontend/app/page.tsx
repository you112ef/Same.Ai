'use client'

import { useState, useRef, useEffect } from 'react'
import { ModelSelectorDropdown } from '@/components/ui/model-selector-dropdown'

interface AppExample {
  id: string
  title: string
  description: string
  prompt: string
  icon: string
  category: string
  features: string[]
}

const appExamples: AppExample[] = [
  {
    id: 'booking',
    title: 'نظام حجز المواعيد',
    description: 'منصة لحجز المواعيد مع تكامل التقويم',
    prompt: 'create a booking system for appointments with calendar integration, user authentication, and email notifications',
    icon: '📅',
    category: 'business',
    features: ['تقويم تفاعلي', 'إدارة المواعيد', 'إشعارات', 'مصادقة المستخدمين']
  },
  {
    id: 'ecommerce',
    title: 'متجر إلكتروني',
    description: 'متجر كامل مع سلة تسوق ومدفوعات',
    prompt: 'create an e-commerce store with shopping cart, product catalog, payment integration, and user accounts',
    icon: '🛒',
    category: 'ecommerce',
    features: ['كتالوج المنتجات', 'سلة التسوق', 'المدفوعات', 'إدارة المخزون']
  },
  {
    id: 'dashboard',
    title: 'لوحة تحكم تحليلية',
    description: 'لوحة تحكم مع مخططات وإحصائيات',
    prompt: 'create an analytics dashboard with charts, data visualization, user management, and real-time updates',
    icon: '📊',
    category: 'analytics',
    features: ['مخططات تفاعلية', 'تحليلات فورية', 'تصدير البيانات', 'تقارير']
  },
  {
    id: 'blog',
    title: 'منصة تدوين',
    description: 'منصة تدوين مع محرر ومشاركة',
    prompt: 'create a blogging platform with rich text editor, comment system, user profiles, and social sharing',
    icon: '✍️',
    category: 'content',
    features: ['محرر نصوص', 'نظام تعليقات', 'مشاركة اجتماعية', 'إدارة المحتوى']
  },
  {
    id: 'chat',
    title: 'تطبيق دردشة',
    description: 'تطبيق دردشة فورية مع غرف',
    prompt: 'create a real-time chat application with rooms, file sharing, emoji support, and user presence',
    icon: '💬',
    category: 'communication',
    features: ['دردشة فورية', 'غرف الدردشة', 'مشاركة الملفات', 'رموز تعبيرية']
  },
  {
    id: 'todo',
    title: 'إدارة المهام',
    description: 'تطبيق لإدارة المهام والمشاريع',
    prompt: 'create a task management app with projects, deadlines, team collaboration, and progress tracking',
    icon: '✅',
    category: 'productivity',
    features: ['إدار�� المشاريع', 'تتبع التقدم', 'تعاون الفريق', 'تذكيرات']
  }
]

const modelOptions = [
  { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', description: 'متوازن وسريع', icon: '🤖' },
  { id: 'gpt-4', name: 'GPT-4', description: 'قوي ومتطور', icon: '⚡' },
  { id: 'gemini-pro', name: 'Gemini Pro', description: 'متعدد الوسائط', icon: '✨' },
  { id: 'llama-3', name: 'Llama 3', description: 'مفتوح المصدر', icon: '🦙' }
]

export default function HomePage() {
  const [prompt, setPrompt] = useState('create a booking system for appointments with calendar integration')
  const [selectedModel, setSelectedModel] = useState('claude-4-sonnet')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedApp, setGeneratedApp] = useState<any>(null)
  const [showExamples, setShowExamples] = useState(true)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [prompt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    setShowExamples(false)
    setGenerationProgress(0)
    setCurrentStep('بدء إنشاء التطبيق...')

    // Simulate progress steps
    const steps = [
      'تحليل الطلب...',
      'اختيار التقنيات المناسبة...',
      'إنشاء هيكل المشروع...',
      'توليد المكونات...',
      'إعداد قاعدة البيانات...',
      'تطبيق التصميم...',
      'إضافة الوظائف...',
      'اختبار التطبيق...',
      'تجهيز المعاينة...'
    ]

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(steps[i])
      setGenerationProgress((i + 1) / steps.length * 100)
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    try {
      const response = await fetch('/api/generator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: selectedModel
        })
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedApp(data.app)
        setCurrentStep('تم إنشاء التطبيق بنجاح!')
        // Redirect to the generated app
        setTimeout(() => {
          window.location.href = `/app/${data.app.id}`
        }, 1500)
      } else {
        console.error('Generation failed:', data.message)
        setCurrentStep('فشل في إنشاء التطبيق')
      }
    } catch (error) {
      console.error('Error generating app:', error)
      setCurrentStep('حدث خطأ أثناء إنشاء التطبيق')
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationProgress(0)
        setShowExamples(true)
      }, 3000)
    }
  }

  const selectExample = (example: AppExample) => {
    setPrompt(example.prompt)
    setShowExamples(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full px-6 h-16 flex items-center justify-between border-b border-gray-100">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black">
              <rect x="3" y="3" width="6" height="6" rx="2" />
              <rect x="15" y="3" width="6" height="6" rx="2" />
              <rect x="3" y="15" width="6" height="6" rx="2" />
              <rect x="15" y="15" width="6" height="6" rx="2" />
            </svg>
            <span className="text-xl font-bold text-black tracking-tight">same</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            معرض التطبيقات
          </button>
          <button className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            الدعم
          </button>
          <button className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            تسجيل الدخول
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            إنشاء حساب
          </button>
        </div>
      </header>

      <main className="flex flex-col items-center px-6 py-12">
        {!isGenerating ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16 max-w-4xl">
              <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 leading-tight">
                اصنع أي شيء
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                ابن تطبيقات ويب كاملة بالذكاء الاصطناعي من خلال وصف بسيط
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl mb-2">⚡</span>
                  <span className="text-sm font-medium text-gray-700">إنشاء سريع</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl mb-2">🎨</span>
                  <span className="text-sm font-medium text-gray-700">تصميم حديث</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl mb-2">📱</span>
                  <span className="text-sm font-medium text-gray-700">متجاوب</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl mb-2">🚀</span>
                  <span className="text-sm font-medium text-gray-700">جاهز للنشر</span>
                </div>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="w-full max-w-3xl mb-8">
              <form onSubmit={handleSubmit}>
                <div className="relative bg-gray-50 rounded-2xl border-2 border-transparent focus-within:border-black transition-colors">
                  <div className="flex items-start p-6 pb-20">
                    <button type="button" className="mr-3 mt-1 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.42 16.4a2 2 0 0 1-2.83-2.83l7.07-7.07"/>
                      </svg>
                    </button>
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="اكتب وصف التطبيق الذي تريد إنشاءه..."
                      className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 placeholder-gray-500 resize-none min-h-[2rem] max-h-32"
                      disabled={isGenerating}
                      style={{ fontFamily: 'inherit' }}
                    />
                    <div className="mr-3 mt-1 bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      Tab
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-gray-50 rounded-b-2xl">
                    {/* Model Selector */}
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        {modelOptions.map(model => (
                          <option key={model.id} value={model.id}>
                            {model.icon} {model.name}
                          </option>
                        ))}
                      </select>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!prompt.trim() || isGenerating}
                      className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m5 12 14-7-7 14-2-7z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Examples Section */}
            {showExamples && (
              <div className="w-full max-w-6xl">
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
                  أو جرب أحد هذه الأمثلة
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appExamples.map((example) => (
                    <div
                      key={example.id}
                      onClick={() => selectExample(example)}
                      className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-black hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{example.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black">
                          {example.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {example.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {example.features.map((feature, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Generation Progress */
          <div className="text-center max-w-lg mx-auto">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#000000"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${generationProgress * 2.51} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">
                    {Math.round(generationProgress)}%
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              جاري إنشاء تطبيقك
            </h2>
            <p className="text-gray-600 mb-6">
              {currentStep}
            </p>

            <div className="bg-gray-50 rounded-xl p-6 text-right">
              <h3 className="font-semibold text-gray-900 mb-3">ما يتم إنشاؤه:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  تطبيق Next.js كامل
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  قاعدة بيانات مُعدة
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  تصميم متجاوب
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  معاينة مباشرة
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
