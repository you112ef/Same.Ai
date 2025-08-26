import React, { useState, useEffect } from 'react'
import './FileExplorer.css'

const FileExplorer = ({ sessionId, language }) => {
  const [files, setFiles] = useState([])
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (sessionId) {
      loadFiles(currentPath)
    }
  }, [sessionId, currentPath])

  const loadFiles = async (path) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/files/list?path=${encodeURIComponent(path)}&sessionId=${sessionId}`)
      const data = await response.json()
      
      if (data.success) {
        setFiles(data.files)
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في تحميل الملفات' : 'Error loading files'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileClick = async (file) => {
    if (file.type === 'directory') {
      setCurrentPath(file.path)
      setSelectedFile(null)
      setFileContent('')
    } else {
      setSelectedFile(file)
      await loadFileContent(file.path)
    }
  }

  const loadFileContent = async (filePath) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/files/read?path=${encodeURIComponent(filePath)}&sessionId=${sessionId}`)
      const data = await response.json()
      
      if (data.success) {
        setFileContent(data.content)
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في قراءة الملف' : 'Error reading file'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackClick = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/'
    setCurrentPath(parentPath)
  }

  const getFileIcon = (file) => {
    if (file.type === 'directory') return '📁'
    
    const extension = file.name.split('.').pop()?.toLowerCase()
    const iconMap = {
      js: '📄',
      jsx: '⚛️',
      ts: '📄',
      tsx: '⚛️',
      json: '📋',
      css: '🎨',
      scss: '🎨',
      html: '🌐',
      md: '📝',
      txt: '📄',
      png: '🖼️',
      jpg: '🖼️',
      jpeg: '🖼️',
      gif: '🖼️',
      svg: '🖼️'
    }
    
    return iconMap[extension] || '📄'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')
  }

  return (
    <div className="file-explorer">
      {/* Header */}
      <div className="file-explorer-header">
        <h2>{language === 'ar' ? 'مستكشف الملفات' : 'File Explorer'}</h2>
        <div className="path-navigation">
          <button 
            className="back-button"
            onClick={handleBackClick}
            disabled={currentPath === '/'}
          >
            ← {language === 'ar' ? 'رجوع' : 'Back'}
          </button>
          <span className="current-path">{currentPath}</span>
        </div>
      </div>

      <div className="file-explorer-content">
        {/* File List */}
        <div className="file-list">
          <div className="file-list-header">
            <span className="header-name">
              {language === 'ar' ? 'الاسم' : 'Name'}
            </span>
            <span className="header-size">
              {language === 'ar' ? 'الحجم' : 'Size'}
            </span>
            <span className="header-date">
              {language === 'ar' ? 'التاريخ' : 'Date'}
            </span>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
            </div>
          ) : files.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📁</span>
              <span>{language === 'ar' ? 'لا توجد ملفات' : 'No files found'}</span>
            </div>
          ) : (
            <div className="files-container">
              {files.map((file) => (
                <div
                  key={file.path}
                  className={`file-item ${selectedFile?.path === file.path ? 'selected' : ''}`}
                  onClick={() => handleFileClick(file)}
                >
                  <div className="file-info">
                    <span className="file-icon">{getFileIcon(file)}</span>
                    <span className="file-name">{file.name}</span>
                  </div>
                  <span className="file-size">
                    {file.type === 'directory' ? '-' : formatFileSize(file.size)}
                  </span>
                  <span className="file-date">
                    {formatDate(file.modified)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Content */}
        {selectedFile && (
          <div className="file-content">
            <div className="file-content-header">
              <h3>{selectedFile.name}</h3>
              <div className="file-actions">
                <button className="action-btn">
                  📝 {language === 'ar' ? 'تعديل' : 'Edit'}
                </button>
                <button className="action-btn">
                  💾 {language === 'ar' ? 'حفظ' : 'Save'}
                </button>
                <button className="action-btn">
                  📋 {language === 'ar' ? 'نسخ' : 'Copy'}
                </button>
              </div>
            </div>
            
            <div className="content-viewer">
              {isLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <span>{language === 'ar' ? 'جاري تحميل المحتوى...' : 'Loading content...'}</span>
                </div>
              ) : (
                <pre className="file-content-text">{fileContent}</pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileExplorer