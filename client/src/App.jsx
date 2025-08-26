import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import ChatInterface from './components/ChatInterface'
import FileExplorer from './components/FileExplorer'
import LivePreview from './components/LivePreview'
import VersionControl from './components/VersionControl'
import TodoList from './components/TodoList'
import './App.css'

function App() {
  const [socket, setSocket] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [session, setSession] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [language, setLanguage] = useState('ar')

  useEffect(() => {
    // إنشاء اتصال Socket
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
      
      // إنشاء جلسة جديدة
      newSocket.emit('create-session', {
        language: language,
        projectType: 'nextjs'
      })
    })

    newSocket.on('session-created', (data) => {
      console.log('Session created:', data)
      setSessionId(data.sessionId)
      setSession(data.session)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    setSocket(newSocket)

    // تنظيف عند إغلاق التطبيق
    return () => {
      newSocket.close()
    }
  }, [language])

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    // إعادة إنشاء الجلسة باللغة الجديدة
    if (socket && isConnected) {
      socket.emit('create-session', {
        language: newLanguage,
        projectType: 'nextjs'
      })
    }
  }

  const tabs = [
    { id: 'chat', label: language === 'ar' ? 'المحادثة' : 'Chat', icon: '💬' },
    { id: 'files', label: language === 'ar' ? 'الملفات' : 'Files', icon: '📁' },
    { id: 'preview', label: language === 'ar' ? 'المعاينة' : 'Preview', icon: '👁️' },
    { id: 'versions', label: language === 'ar' ? 'الإصدارات' : 'Versions', icon: '📋' },
    { id: 'todos', label: language === 'ar' ? 'المهام' : 'Todos', icon: '✅' }
  ]

  if (!isConnected) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>{language === 'ar' ? 'جاري الاتصال بالخادم...' : 'Connecting to server...'}</p>
      </div>
    )
  }

  return (
    <div className="app" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">
            {language === 'ar' ? 'مساعد البرمجة الذكي' : 'AI Coding Assistant'}
          </h1>
          <div className="connection-status">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
            {isConnected ? 
              (language === 'ar' ? 'متصل' : 'Connected') : 
              (language === 'ar' ? 'غير متصل' : 'Disconnected')
            }
          </div>
        </div>
        
        <div className="header-right">
          <div className="language-selector">
            <button 
              className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('ar')}
            >
              العربية
            </button>
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('en')}
            >
              English
            </button>
          </div>
          
          {sessionId && (
            <div className="session-info">
              <span className="session-id">
                {language === 'ar' ? 'الجلسة:' : 'Session:'} {sessionId.substring(0, 8)}...
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Sidebar */}
        <aside className="app-sidebar">
          <nav className="tab-navigation">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="app-content">
          {activeTab === 'chat' && (
            <ChatInterface 
              socket={socket}
              sessionId={sessionId}
              language={language}
            />
          )}
          
          {activeTab === 'files' && (
            <FileExplorer 
              sessionId={sessionId}
              language={language}
            />
          )}
          
          {activeTab === 'preview' && (
            <LivePreview 
              sessionId={sessionId}
              language={language}
            />
          )}
          
          {activeTab === 'versions' && (
            <VersionControl 
              sessionId={sessionId}
              language={language}
            />
          )}
          
          {activeTab === 'todos' && (
            <TodoList 
              sessionId={sessionId}
              language={language}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <span className="footer-text">
            {language === 'ar' ? 'مساعد البرمجة الذكي - بدون تسجيل دخول' : 'AI Coding Assistant - No Registration Required'}
          </span>
          <span className="footer-version">v1.0.0</span>
        </div>
      </footer>
    </div>
  )
}

export default App