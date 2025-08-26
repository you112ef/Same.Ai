import React, { useState, useEffect } from 'react'
import './VersionControl.css'

const VersionControl = ({ sessionId, language }) => {
  const [versions, setVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newVersionDescription, setNewVersionDescription] = useState('')

  useEffect(() => {
    if (sessionId) {
      loadVersions()
    }
  }, [sessionId])

  const loadVersions = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/versions/list?sessionId=${sessionId}`)
      const data = await response.json()
      
      if (data.success) {
        setVersions(data.versions)
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في تحميل الإصدارات' : 'Error loading versions'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const createVersion = async () => {
    if (!newVersionDescription.trim()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/versions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          description: newVersionDescription
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setNewVersionDescription('')
        setShowCreateModal(false)
        await loadVersions()
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في إنشاء الإصدار' : 'Error creating version'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const restoreVersion = async (versionId) => {
    if (!confirm(language === 'ar' ? 'هل تريد استعادة هذا الإصدار؟' : 'Do you want to restore this version?')) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/versions/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          versionId: versionId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(language === 'ar' ? 'تم استعادة الإصدار بنجاح' : 'Version restored successfully')
        await loadVersions()
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في استعادة الإصدار' : 'Error restoring version'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteVersion = async (versionId) => {
    if (!confirm(language === 'ar' ? 'هل تريد حذف هذا الإصدار؟' : 'Do you want to delete this version?')) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/versions/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          versionId: versionId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadVersions()
        if (selectedVersion?.id === versionId) {
          setSelectedVersion(null)
        }
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في حذف الإصدار' : 'Error deleting version'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="version-control">
      {/* Header */}
      <div className="version-header">
        <h2>{language === 'ar' ? 'إدارة الإصدارات' : 'Version Control'}</h2>
        
        <div className="version-actions">
          <button 
            className="create-version-btn"
            onClick={() => setShowCreateModal(true)}
            disabled={isLoading}
          >
            📋 {language === 'ar' ? 'إنشاء إصدار جديد' : 'Create New Version'}
          </button>
          <button 
            className="refresh-btn"
            onClick={loadVersions}
            disabled={isLoading}
          >
            🔄 {language === 'ar' ? 'تحديث' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="version-content">
        {/* Versions List */}
        <div className="versions-list">
          <div className="list-header">
            <h3>{language === 'ar' ? 'الإصدارات' : 'Versions'}</h3>
            <span className="version-count">
              {versions.length} {language === 'ar' ? 'إصدار' : 'versions'}
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
          ) : versions.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <span>{language === 'ar' ? 'لا توجد إصدارات' : 'No versions found'}</span>
              <p>
                {language === 'ar' 
                  ? 'أنشئ إصداراً جديداً لحفظ حالة المشروع الحالية'
                  : 'Create a new version to save the current project state'
                }
              </p>
            </div>
          ) : (
            <div className="versions-container">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className={`version-item ${selectedVersion?.id === version.id ? 'selected' : ''}`}
                  onClick={() => setSelectedVersion(version)}
                >
                  <div className="version-info">
                    <div className="version-header-info">
                      <span className="version-icon">📋</span>
                      <span className="version-description">
                        {version.description || (language === 'ar' ? 'إصدار بدون وصف' : 'Version without description')}
                      </span>
                    </div>
                    <div className="version-meta">
                      <span className="version-date">{formatDate(version.timestamp)}</span>
                      <span className="version-size">{formatFileSize(version.size)}</span>
                      <span className="version-files">{version.fileCount} {language === 'ar' ? 'ملف' : 'files'}</span>
                    </div>
                  </div>
                  
                  <div className="version-actions">
                    <button 
                      className="action-btn restore-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        restoreVersion(version.id)
                      }}
                      title={language === 'ar' ? 'استعادة الإصدار' : 'Restore version'}
                    >
                      🔄
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteVersion(version.id)
                      }}
                      title={language === 'ar' ? 'حذف الإصدار' : 'Delete version'}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Version Details */}
        {selectedVersion && (
          <div className="version-details">
            <div className="details-header">
              <h3>{language === 'ar' ? 'تفاصيل الإصدار' : 'Version Details'}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedVersion(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="details-content">
              <div className="detail-item">
                <span className="detail-label">
                  {language === 'ar' ? 'الوصف:' : 'Description:'}
                </span>
                <span className="detail-value">
                  {selectedVersion.description || (language === 'ar' ? 'لا يوجد وصف' : 'No description')}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">
                  {language === 'ar' ? 'تاريخ الإنشاء:' : 'Created:'}
                </span>
                <span className="detail-value">
                  {formatDate(selectedVersion.timestamp)}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">
                  {language === 'ar' ? 'الحجم:' : 'Size:'}
                </span>
                <span className="detail-value">
                  {formatFileSize(selectedVersion.size)}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">
                  {language === 'ar' ? 'عدد الملفات:' : 'Files:'}
                </span>
                <span className="detail-value">
                  {selectedVersion.fileCount}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">
                  {language === 'ar' ? 'معرف الإصدار:' : 'Version ID:'}
                </span>
                <span className="detail-value version-id">
                  {selectedVersion.id}
                </span>
              </div>
            </div>
            
            <div className="details-actions">
              <button 
                className="restore-version-btn"
                onClick={() => restoreVersion(selectedVersion.id)}
                disabled={isLoading}
              >
                🔄 {language === 'ar' ? 'استعادة هذا الإصدار' : 'Restore This Version'}
              </button>
              <button 
                className="export-version-btn"
                onClick={() => {
                  // تصدير الإصدار
                  alert(language === 'ar' ? 'ميزة التصدير قيد التطوير' : 'Export feature coming soon')
                }}
              >
                📦 {language === 'ar' ? 'تصدير الإصدار' : 'Export Version'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Version Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{language === 'ar' ? 'إنشاء إصدار جديد' : 'Create New Version'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <label>
                {language === 'ar' ? 'وصف الإصدار:' : 'Version Description:'}
              </label>
              <textarea
                value={newVersionDescription}
                onChange={(e) => setNewVersionDescription(e.target.value)}
                placeholder={
                  language === 'ar' 
                    ? 'أدخل وصفاً للإصدار الجديد...'
                    : 'Enter a description for the new version...'
                }
                rows="3"
              />
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                className="create-btn"
                onClick={createVersion}
                disabled={!newVersionDescription.trim() || isLoading}
              >
                {language === 'ar' ? 'إنشاء' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VersionControl