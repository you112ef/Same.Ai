'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface GeneratedApp {
  id: string
  name: string
  description: string
  prompt: string
  model: string
  files: GeneratedFile[]
  dependencies: string[]
  scripts: Record<string, string>
  preview_url?: string
  created_at: string
  updated_at: string
}

interface GeneratedFile {
  path: string
  content: string
  type: 'component' | 'page' | 'api' | 'config' | 'style' | 'other'
  language: string
}

export default function AppPreviewPage() {
  const params = useParams()
  const appId = params?.id as string
  const [app, setApp] = useState<GeneratedApp | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('preview')

  useEffect(() => {
    if (appId) {
      fetchApp(appId)
    }
  }, [appId])

  const fetchApp = async (id: string) => {
    try {
      const response = await fetch(`/api/generator/apps/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setApp(data.app)
        if (data.app.files && data.app.files.length > 0) {
          setSelectedFile(data.app.files[0])
        }
      }
    } catch (error) {
      console.error('Error fetching app:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadApp = async () => {
    try {
      const response = await fetch(`/api/generator/apps/${appId}/download`)
      const data = await response.json()
      
      if (data.success && data.download_url) {
        window.open(data.download_url, '_blank')
      }
    } catch (error) {
      console.error('Error downloading app:', error)
    }
  }

  const deployApp = async () => {
    try {
      const response = await fetch(`/api/generator/apps/${appId}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: 'vercel' })
      })
      const data = await response.json()
      
      if (data.success && data.deployment_url) {
        window.open(data.deployment_url, '_blank')
      }
    } catch (error) {
      console.error('Error deploying app:', error)
    }
  }

  const getFileIcon = (file: GeneratedFile) => {
    switch (file.type) {
      case 'component': return '🧩'
      case 'page': return '📄'
      case 'api': return '🔗'
      case 'config': return '⚙️'
      case 'style': return '🎨'
      default: return '📁'
    }
  }

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'typescript': return 'bg-blue-100 text-blue-800'
      case 'javascript': return 'bg-yellow-100 text-yellow-800'
      case 'css': return 'bg-green-100 text-green-800'
      case 'json': return 'bg-gray-100 text-gray-800'
      default: return 'bg-purple-100 text-purple-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل التطبيق...</p>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">التطبيق غير موجود</h1>
          <p className="text-gray-600 mb-6">لم يتم العثور على التطبيق المطلوب</p>
          <Link href="/" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{app.name}</h1>
                <p className="text-sm text-gray-600">{app.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('preview')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    previewMode === 'preview' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  معاينة
                </button>
                <button
                  onClick={() => setPreviewMode('code')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    previewMode === 'code' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  الكود
                </button>
              </div>
              
              <button
                onClick={downloadApp}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                تحميل
              </button>
              
              <button
                onClick={deployApp}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
                </svg>
                نشر
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - File Tree */}
          {previewMode === 'code' && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  ملفات المشروع
                </h3>
                <div className="space-y-1">
                  {app.files.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-right p-2 rounded-lg transition-colors ${
                        selectedFile?.path === file.path
                          ? 'bg-blue-50 text-blue-900 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getFileIcon(file)}</span>
                          <span className="text-sm font-medium truncate">{file.path}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getLanguageColor(file.language)}`}>
                          {file.language}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={previewMode === 'code' ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {previewMode === 'preview' ? (
              /* Preview Mode */
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-600">{app.preview_url || 'http://localhost:3000'}</span>
                  </div>
                  <button className="text-gray-600 hover:text-gray-900">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15,3 21,3 21,9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </button>
                </div>
                
                <div className="p-8 min-h-[600px] bg-gradient-to-br from-blue-50 to-purple-50">
                  {/* Mock Preview Content */}
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                        <h1 className="text-2xl font-bold mb-2">{app.name}</h1>
                        <p className="opacity-90">{app.description}</p>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🚀</div>
                            <h3 className="font-semibold">سريع</h3>
                            <p className="text-sm text-gray-600">أداء محسن</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🎨</div>
                            <h3 className="font-semibold">جميل</h3>
                            <p className="text-sm text-gray-600">تصميم عصري</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">📱</div>
                            <h3 className="font-semibold">متجاوب</h3>
                            <p className="text-sm text-gray-600">يعمل على جميع الأجهزة</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                            ابدأ الاستخدام
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Code Mode */
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {selectedFile && (
                  <>
                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getFileIcon(selectedFile)}</span>
                        <span className="font-medium text-gray-900">{selectedFile.path}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getLanguageColor(selectedFile.language)}`}>
                          {selectedFile.language}
                        </span>
                      </div>
                      <button className="text-gray-600 hover:text-gray-900">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                          <path d="m4 16 4-4 4 4"/>
                          <path d="m16 4 4 4-4 4"/>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="p-0">
                      <pre className="bg-gray-900 text-gray-100 p-6 overflow-x-auto text-sm leading-relaxed" dir="ltr">
                        <code>{selectedFile.content}</code>
                      </pre>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* App Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">معلومات التطبيق</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">النموذج المستخدم:</span>
                <span className="block font-medium">{app.model}</span>
              </div>
              <div>
                <span className="text-sm text-gray-600">تاريخ الإنشاء:</span>
                <span className="block font-medium">
                  {new Date(app.created_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">عدد الملفات:</span>
                <span className="block font-medium">{app.files?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">التقنيات المستخدمة</h3>
            <div className="flex flex-wrap gap-2">
              {app.dependencies?.slice(0, 6).map((dep, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {dep}
                </span>
              ))}
              {app.dependencies?.length > 6 && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  +{app.dependencies.length - 6} أخرى
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">الطلب الأصلي</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {app.prompt}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
