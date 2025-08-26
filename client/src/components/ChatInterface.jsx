import React, { useState, useEffect, useRef } from 'react'
import './ChatInterface.css'

const ChatInterface = ({ socket, sessionId, language }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!socket) return

    // استماع للردود من المساعد الذكي
    socket.on('ai-response', (data) => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: data.response.content,
        suggestions: data.response.suggestions || [],
        timestamp: new Date().toISOString()
      }])
    })

    // استماع للأخطاء
    socket.on('error', (error) => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        content: error.message || (language === 'ar' ? 'حدث خطأ' : 'An error occurred'),
        timestamp: new Date().toISOString()
      }])
    })

    return () => {
      socket.off('ai-response')
      socket.off('error')
    }
  }, [socket, language])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !socket || !sessionId) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // إرسال الرسالة للخادم
    socket.emit('chat-message', {
      message: inputMessage,
      sessionId: sessionId
    })
  }

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (content) => {
    // تنسيق الكود في الرسائل
    return content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="code-block ${lang || ''}"><code>${code}</code></pre>`
    })
  }

  const getMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="chat-interface">
      {/* Header */}
      <div className="chat-header">
        <h2>{language === 'ar' ? 'المحادثة مع المساعد الذكي' : 'Chat with AI Assistant'}</h2>
        <div className="chat-status">
          {isTyping && (
            <div className="typing-indicator">
              <span>{language === 'ar' ? 'المساعد يكتب...' : 'AI is typing...'}</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h3>{language === 'ar' ? 'مرحباً بك!' : 'Welcome!'}</h3>
            <p>
              {language === 'ar' 
                ? 'ابدأ المحادثة مع المساعد الذكي لإنشاء مشروعك'
                : 'Start chatting with the AI assistant to create your project'
              }
            </p>
            <div className="example-messages">
              <button 
                className="example-btn"
                onClick={() => setInputMessage(language === 'ar' ? 'أنشئ مشروع Next.js جديد' : 'Create a new Next.js project')}
              >
                {language === 'ar' ? 'أنشئ مشروع Next.js جديد' : 'Create a new Next.js project'}
              </button>
              <button 
                className="example-btn"
                onClick={() => setInputMessage(language === 'ar' ? 'أضف صفحة جديدة' : 'Add a new page')}
              >
                {language === 'ar' ? 'أضف صفحة جديدة' : 'Add a new page'}
              </button>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'user' ? '👤' : message.type === 'ai' ? '🤖' : '⚠️'}
                </div>
                <div className="message-content">
                  <div 
                    className="message-text"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                  <div className="message-time">
                    {getMessageTime(message.timestamp)}
                  </div>
                  
                  {/* اقتراحات المساعد */}
                  {message.type === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                    <div className="message-suggestions">
                      <span className="suggestions-label">
                        {language === 'ar' ? 'اقتراحات:' : 'Suggestions:'}
                      </span>
                      <div className="suggestions-list">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="suggestion-btn"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <div className="input-wrapper">
          <textarea
            className="chat-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              language === 'ar' 
                ? 'اكتب رسالتك هنا... (اضغط Enter للإرسال)'
                : 'Type your message here... (Press Enter to send)'
            }
            rows="1"
            disabled={isTyping}
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
          >
            <span className="send-icon">📤</span>
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="quick-action-btn"
            onClick={() => setInputMessage(language === 'ar' ? 'فحص الكود' : 'Check code')}
            disabled={isTyping}
          >
            🔍 {language === 'ar' ? 'فحص الكود' : 'Check Code'}
          </button>
          <button 
            className="quick-action-btn"
            onClick={() => setInputMessage(language === 'ar' ? 'نشر المشروع' : 'Deploy project')}
            disabled={isTyping}
          >
            🚀 {language === 'ar' ? 'نشر المشروع' : 'Deploy'}
          </button>
          <button 
            className="quick-action-btn"
            onClick={() => setInputMessage(language === 'ar' ? 'عرض الملفات' : 'Show files')}
            disabled={isTyping}
          >
            📁 {language === 'ar' ? 'عرض الملفات' : 'Show Files'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface