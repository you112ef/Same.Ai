'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sparkles, Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { isValidEmail } from '@/lib/utils'

export default function RegisterPage() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*]/.test(password)

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    }
  }

  const passwordValidation = validatePassword(formData.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('يرجى ملء جميع الحقول')
      return
    }

    if (!isValidEmail(formData.email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح')
      return
    }

    if (!passwordValidation.isValid) {
      setError('كلمة المرور لا تستوفي المتطلبات')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }

    setIsLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      // Navigation is handled in the auth context
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء إنشاء الحساب')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-same-blue-600 to-same-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">Same.Ai</span>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">إنشاء حساب جديد</CardTitle>
            <CardDescription>
              انضم إلى منصة الذكاء الاصطناعي الموحدة
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="الاسم الكامل"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pr-10"
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pr-10"
                    disabled={isLoading}
                    autoComplete="email"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pr-10 pl-10"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password requirements */}
                {formData.password && (
                  <div className="space-y-2 p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium text-muted-foreground">متطلبات كلمة المرور:</p>
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <CheckCircle className={`w-3 h-3 ${passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'}`} />
                        8 أحرف على الأقل
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.hasUpper ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <CheckCircle className={`w-3 h-3 ${passwordValidation.hasUpper ? 'text-green-600' : 'text-muted-foreground'}`} />
                        حرف كبير واحد على الأقل
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.hasLower ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <CheckCircle className={`w-3 h-3 ${passwordValidation.hasLower ? 'text-green-600' : 'text-muted-foreground'}`} />
                        حرف صغير واحد على الأقل
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <CheckCircle className={`w-3 h-3 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`} />
                        رقم واحد على الأقل
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-muted-foreground'}`}>
                        <CheckCircle className={`w-3 h-3 ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-muted-foreground'}`} />
                        رمز خاص واحد على الأقل (!@#$%^&*)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="تأكيد كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pr-10 pl-10"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-600">كلمات المرور غير متطابقة</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="gradient"
                disabled={isLoading || !passwordValidation.isValid}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner w-4 h-4"></div>
                    جاري إنشاء الحساب...
                  </div>
                ) : (
                  'إنشاء الحساب'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                لديك حساب بالفعل؟{' '}
                <Link
                  href="/auth/login"
                  className="text-same-blue-600 hover:text-same-blue-700 font-medium transition-colors"
                >
                  سجّل الدخول
                </Link>
              </p>
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              بإنشاء حساب، فإنك توافق على{' '}
              <Link href="/terms" className="text-same-blue-600 hover:text-same-blue-700">
                شروط الخدمة
              </Link>{' '}
              و{' '}
              <Link href="/privacy" className="text-same-blue-600 hover:text-same-blue-700">
                سياسة الخصوصية
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}