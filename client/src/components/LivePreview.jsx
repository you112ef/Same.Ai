import React, { useState, useEffect } from 'react'
import './LivePreview.css'

const LivePreview = ({ sessionId, language }) => {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [previewStatus, setPreviewStatus] = useState('stopped')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (sessionId) {
      startPreview()
    }
  }, [sessionId])

  const startPreview = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/preview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setPreviewUrl(data.url)
        setPreviewStatus('running')
        // انتظار قليل لبدء الخادم
        setTimeout(() => {
          setRefreshKey(prev => prev + 1)
        }, 3000)
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في بدء المعاينة' : 'Error starting preview'))
        setPreviewStatus('error')
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
      setPreviewStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const stopPreview = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/preview/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setPreviewUrl(null)
        setPreviewStatus('stopped')
      }
    } catch (err) {
      console.error('Error stopping preview:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const restartPreview = async () => {
    await stopPreview()
    setTimeout(() => {
      startPreview()
    }, 1000)
  }

  const refreshPreview = () => {
    setRefreshKey(prev => prev + 1)
  }

  const getStatusText = () => {
    switch (previewStatus) {
      case 'running':
        return language === 'ar' ? 'قيد التشغيل' : 'Running'
      case 'stopped':
        return language === 'ar' ? 'متوقف' : 'Stopped'
      case 'error':
        return language === 'ar' ? 'خطأ' : 'Error'
      default:
        return language === 'ar' ? 'غير معروف' : 'Unknown'
    }
  }

  const getStatusColor = () => {
    switch (previewStatus) {
      case 'running':
        return '#28a745'
      case 'stopped':
        return '#6c757d'
      case 'error':
        return '#dc3545'
      default:
        return '#6c757d'
    }
  }

  return (
    <div className="live-preview">
      {/* Header */}
      <div className="preview-header">
        <h2>{language === 'ar' ? 'المعاينة الحية' : 'Live Preview'}</h2>
        
        <div className="preview-controls">
          <div className="status-indicator">
            <span 
              className="status-dot"
              style={{ backgroundColor: getStatusColor() }}
            ></span>
            <span className="status-text">{getStatusText()}</span>
          </div>
          
          <div className="control-buttons">
            {previewStatus === 'stopped' ? (
              <button 
                className="control-btn start-btn"
                onClick={startPreview}
                disabled={isLoading}
              >
                ▶️ {language === 'ar' ? 'تشغيل' : 'Start'}
              </button>
            ) : (
              <>
                <button 
                  className="control-btn stop-btn"
                  onClick={stopPreview}
                  disabled={isLoading}
                >
                  ⏹️ {language === 'ar' ? 'إيقاف' : 'Stop'}
                </button>
                <button 
                  className="control-btn restart-btn"
                  onClick={restartPreview}
                  disabled={isLoading}
                >
                  🔄 {language === 'ar' ? 'إعادة تشغيل' : 'Restart'}
                </button>
                <button 
                  className="control-btn refresh-btn"
                  onClick={refreshPreview}
                  disabled={isLoading}
                >
                  🔄 {language === 'ar' ? 'تحديث' : 'Refresh'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="preview-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <span>
              {previewStatus === 'stopped' 
                ? (language === 'ar' ? 'جاري بدء المعاينة...' : 'Starting preview...')
                : (language === 'ar' ? 'جاري التحميل...' : 'Loading...')
              }
            </span>
          </div>
        ) : error ? (
          <div className="error-state">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button 
              className="retry-btn"
              onClick={startPreview}
            >
              {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        ) : previewUrl ? (
          <div className="preview-frame-container">
            <div className="preview-toolbar">
              <div className="preview-url">
                <span className="url-label">
                  {language === 'ar' ? 'الرابط:' : 'URL:'}
                </span>
                <span className="url-value">{previewUrl}</span>
                <button 
                  className="copy-url-btn"
                  onClick={() => navigator.clipboard.writeText(previewUrl)}
                >
                  📋
                </button>
              </div>
              
              <div className="preview-actions">
                <button 
                  className="action-btn"
                  onClick={() => window.open(previewUrl, '_blank')}
                >
                  🔗 {language === 'ar' ? 'فتح في نافذة جديدة' : 'Open in new tab'}
                </button>
                <button 
                  className="action-btn"
                  onClick={refreshPreview}
                >
                  🔄 {language === 'ar' ? 'تحديث' : 'Refresh'}
                </button>
              </div>
            </div>
            
            <div className="preview-frame-wrapper">
              <iframe
                key={refreshKey}
                src={previewUrl}
                className="preview-frame"
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👁️</div>
            <h3>{language === 'ar' ? 'لا توجد معاينة نشطة' : 'No active preview'}</h3>
            <p>
              {language === 'ar' 
                ? 'اضغط على زر التشغيل لبدء المعاينة الحية'
                : 'Click the start button to begin live preview'
              }
            </p>
            <button 
              className="start-preview-btn"
              onClick={startPreview}
              disabled={isLoading}
            >
              ▶️ {language === 'ar' ? 'بدء المعاينة' : 'Start Preview'}
            </button>
          </div>
        )}
      </div>

      {/* Preview Info */}
      {previewStatus === 'running' && (
        <div className="preview-info">
          <div className="info-item">
            <span className="info-label">
              {language === 'ar' ? 'الحالة:' : 'Status:'}
            </span>
            <span className="info-value running">🟢 {language === 'ar' ? 'نشط' : 'Active'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">
              {language === 'ar' ? 'المنفذ:' : 'Port:'}
            </span>
            <span className="info-value">
              {previewUrl ? new URL(previewUrl).port : 'N/A'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">
              {language === 'ar' ? 'آخر تحديث:' : 'Last updated:'}
            </span>
            <span className="info-value">
              {new Date().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default LivePreview