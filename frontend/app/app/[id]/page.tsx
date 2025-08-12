'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

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
  type: string
  language: string
}

export default function AppViewerPage() {
  const params = useParams()
  const appId = params.id as string
  const [app, setApp] = useState<GeneratedApp | null>(null)
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'files'>('preview')

  useEffect(() => {
    fetchApp()
  }, [appId])

  const fetchApp = async () => {
    try {
      const response = await fetch(`/api/generator/apps/${appId}`)
      const data = await response.json()
      
      if (data.success) {
        setApp(data.app)
        if (data.app.files.length > 0) {
          setSelectedFile(data.app.files[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch app:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/generator/apps/${appId}/download`)
      const data = await response.json()
      
      if (data.success) {
        window.open(data.download_url, '_blank')
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleDeploy = async () => {
    try {
      const response = await fetch(`/api/generator/apps/${appId}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: 'vercel' })
      })
      const data = await response.json()
      
      if (data.success) {
        window.open(data.deployment_url, '_blank')
      }
    } catch (error) {
      console.error('Deploy failed:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #000000',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading your app...</p>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', color: '#000000', marginBottom: '8px' }}>App Not Found</h1>
          <p style={{ color: '#6b7280' }}>The requested app could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        backgroundColor: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'black' }}>
                <g>
                  <rect x="0.5" y="0.5" width="7" height="7" rx="1.5" />
                  <rect x="9.5" y="0.5" width="7" height="7" rx="1.5" />
                  <rect x="18.5" y="0.5" width="1" height="7" rx="0.5" />
                  <rect x="0.5" y="9.5" width="7" height="7" rx="1.5" />
                  <rect x="9.5" y="9.5" width="7" height="7" rx="1.5" />
                  <rect x="18.5" y="9.5" width="1" height="7" rx="0.5" />
                  <rect x="0.5" y="18.5" width="7" height="1" rx="0.5" />
                  <rect x="9.5" y="18.5" width="7" height="1" rx="0.5" />
                  <rect x="18.5" y="18.5" width="1" height="1" rx="0.5" />
                </g>
              </svg>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#000000' }}>same</span>
            </div>
            <div style={{ height: '24px', width: '1px', backgroundColor: '#e5e7eb' }} />
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#000000', margin: 0 }}>{app.name}</h1>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{app.description}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={handleDownload}
              style={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                color: '#374151',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" x2="12" y1="15" y2="3"/>
              </svg>
              Download
            </button>
            <button 
              onClick={handleDeploy}
              style={{
                backgroundColor: '#000000',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
              </svg>
              Deploy
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div style={{ borderBottom: '1px solid #e5e7eb', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          {(['preview', 'code', 'files'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '16px 0',
                fontSize: '14px',
                fontWeight: '500',
                color: activeTab === tab ? '#000000' : '#6b7280',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid #000000' : '2px solid transparent',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', height: 'calc(100vh - 140px)' }}>
        {/* Sidebar for code/files view */}
        {(activeTab === 'code' || activeTab === 'files') && (
          <div style={{ 
            width: '300px', 
            borderRight: '1px solid #e5e7eb', 
            backgroundColor: '#f9fafb',
            overflow: 'auto'
          }}>
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#000000', margin: '0 0 12px 0' }}>
                Project Files
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {app.files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFile(file)}
                    style={{
                      background: selectedFile?.path === file.path ? '#e5e7eb' : 'transparent',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#374151',
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                    }}
                  >
                    {file.path}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'preview' && (
            <div style={{ padding: '24px', textAlign: 'center' }}>
              {app.preview_url ? (
                <iframe
                  src={app.preview_url}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  title="App Preview"
                />
              ) : (
                <div style={{
                  padding: '48px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{ fontSize: '18px', color: '#000000', marginBottom: '8px' }}>
                    Preview Coming Soon
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    Your app is being prepared for preview. This will be available shortly.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && selectedFile && (
            <div style={{ height: '100%' }}>
              <div style={{ 
                padding: '16px 24px', 
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#000000',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                  }}>
                    {selectedFile.path}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    backgroundColor: '#e5e7eb',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {selectedFile.language}
                  </span>
                </div>
              </div>
              <div style={{ padding: '24px' }}>
                <pre style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '16px',
                  overflow: 'auto',
                  fontSize: '13px',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  lineHeight: '1.5',
                  color: '#000000',
                  margin: 0
                }}>
                  {selectedFile.content}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {app.files.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedFile(file)
                      setActiveTab('code')
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#000000',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                      }}>
                        {file.path}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        backgroundColor: '#e5e7eb',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {file.type}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {file.content.split('\n')[0] || 'Empty file'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
