'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles, Zap, Shield, Users } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-same-blue-600 to-same-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Same.Ai</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">تسجيل الدخول</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="gradient">ابدأ مجاناً</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">منصة الذكاء الاصطناعي</span>
            <br />
            الموحدة للجميع
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            تفاعل مع نماذج الذكاء الاصطناعي المتعددة في مكان واحد. GPT، Claude، Gemini وأكثر - كل ما تحتاجه لإنجاز مهامك بفعالية.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auth/register">
              <Button size="xl" variant="gradient" className="w-full sm:w-auto">
                ابدأ الآن مجاناً
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                اكتشف المزيد
              </Button>
            </Link>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative mx-auto max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden border shadow-2xl">
              <div className="bg-gradient-to-r from-same-blue-50 to-same-purple-50 dark:from-same-blue-950 dark:to-same-purple-950 p-8">
                {/* Mock Chat Interface */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground mr-4">Same.Ai</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mr-12 shadow-sm">
                      <p className="text-sm">ما هي أفضل الممارسات في تطوير React؟</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-same-blue-100 to-same-purple-100 dark:from-same-blue-900 dark:to-same-purple-900 rounded-lg p-4 ml-12 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-medium">GPT-4</span>
                      </div>
                      <p className="text-sm">إليك أهم الممارسات في تطوير React:</p>
                      <ul className="text-xs mt-2 space-y-1">
                        <li>• استخدام Hooks بدلاً من Class Components</li>
                        <li>• تطبيق مبدأ Component Composition</li>
                        <li>• إدارة الحالة بفعالية مع Context أو Zustand</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            لماذا تختار <span className="gradient-text">Same.Ai</span>؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            منصة شاملة تجمع أفضل نماذج الذكاء الاصطناعي في مكان واحد
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="text-center p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-same-blue-500 to-same-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">نماذج متعددة</h3>
            <p className="text-muted-foreground text-sm">
              وصول إلى GPT-4، Claude 3، Gemini Pro وأكثر في واجهة واحدة
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-same-purple-500 to-same-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">سرعة فائقة</h3>
            <p className="text-muted-foreground text-sm">
              استجابة سريعة وواجهة محسنة لأفضل تجربة مستخدم
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">أمان عالي</h3>
            <p className="text-muted-foreground text-sm">
              حماية متقدمة لبياناتك وخصوصية كاملة لمحادثاتك
            </p>
          </div>

          {/* Feature 4 */}
          <div className="text-center p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">تعاون الفرق</h3>
            <p className="text-muted-foreground text-sm">
              مشاركة المحادثات والعمل الجماعي مع فريقك
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-same-blue-600 to-same-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            جاهز لتجربة المستقبل؟
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف المستخدمين الذين يستخدمون Same.Ai لتسريع إنتاجيتهم
          </p>
          <Link href="/auth/register">
            <Button size="xl" variant="secondary" className="bg-white text-same-blue-600 hover:bg-gray-100">
              ابدأ مجاناً الآن
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-same-blue-600 to-same-purple-600 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Same.Ai</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              شروط الاستخدام
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              اتصل بنا
            </Link>
          </div>
        </div>
        
        <div className="text-center mt-6 pt-6 border-t text-sm text-muted-foreground">
          © 2024 Same.Ai. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  )
}