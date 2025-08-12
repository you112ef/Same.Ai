'use client'

import { useState, useEffect } from 'react'

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose?: () => void
}

export function Notification({ type, title, message, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: '✅',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          titleColor: 'text-green-900',
          messageColor: 'text-green-700'
        }
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: '❌',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-900',
          messageColor: 'text-red-700'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: '⚠️',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-900',
          messageColor: 'text-yellow-700'
        }
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'ℹ️',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-900',
          messageColor: 'text-blue-700'
        }
    }
  }

  const styles = getTypeStyles()

  if (!isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${styles.bg} ${styles.border} border rounded-lg shadow-lg transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`${styles.iconBg} rounded-full p-2 flex-shrink-0`}>
            <span className="text-sm">{styles.icon}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${styles.titleColor} mb-1`}>
              {title}
            </h4>
            <p className={`text-sm ${styles.messageColor} leading-relaxed`}>
              {message}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose?.(), 300)
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<NotificationProps & { id: string }>>([])

  const addNotification = (notification: Omit<NotificationProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotifications(prev => [...prev, { ...notification, id, onClose: () => removeNotification(id) }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  )

  return {
    addNotification,
    removeNotification,
    NotificationContainer
  }
}
