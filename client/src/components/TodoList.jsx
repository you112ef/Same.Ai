import React, { useState, useEffect } from 'react'
import './TodoList.css'

const TodoList = ({ sessionId, language }) => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, completed

  useEffect(() => {
    if (sessionId) {
      loadTodos()
    }
  }, [sessionId])

  const loadTodos = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/todos/list?sessionId=${sessionId}`)
      const data = await response.json()
      
      if (data.success) {
        setTodos(data.todos)
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في تحميل المهام' : 'Error loading todos'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/todos/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          text: newTodo,
          priority: 'medium'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setNewTodo('')
        await loadTodos()
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في إضافة المهمة' : 'Error adding todo'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTodo = async (todoId) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/todos/toggle', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          todoId: todoId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadTodos()
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في تحديث المهمة' : 'Error updating todo'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTodo = async (todoId) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/todos/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          todoId: todoId
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadTodos()
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في حذف المهمة' : 'Error deleting todo'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const updateTodoText = async (todoId, newText) => {
    if (!newText.trim()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/todos/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId,
          todoId: todoId,
          text: newText
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadTodos()
      } else {
        setError(data.error || (language === 'ar' ? 'خطأ في تحديث المهمة' : 'Error updating todo'))
      }
    } catch (err) {
      setError(language === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredTodos = () => {
    switch (filter) {
      case 'pending':
        return todos.filter(todo => !todo.completed)
      case 'completed':
        return todos.filter(todo => todo.completed)
      default:
        return todos
    }
  }

  const getProgressStats = () => {
    const total = todos.length
    const completed = todos.filter(todo => todo.completed).length
    const pending = total - completed
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { total, completed, pending, percentage }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const stats = getProgressStats()
  const filteredTodos = getFilteredTodos()

  return (
    <div className="todo-list">
      {/* Header */}
      <div className="todo-header">
        <h2>{language === 'ar' ? 'قائمة المهام' : 'Todo List'}</h2>
        
        <div className="todo-stats">
          <div className="stat-item">
            <span className="stat-label">{language === 'ar' ? 'المكتملة:' : 'Completed:'}</span>
            <span className="stat-value completed">{stats.completed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{language === 'ar' ? 'المعلقة:' : 'Pending:'}</span>
            <span className="stat-value pending">{stats.pending}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{language === 'ar' ? 'النسبة:' : 'Progress:'}</span>
            <span className="stat-value percentage">{stats.percentage}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${stats.percentage}%` }}
          ></div>
        </div>
        <span className="progress-text">
          {stats.completed} / {stats.total} {language === 'ar' ? 'مكتملة' : 'completed'}
        </span>
      </div>

      {/* Add Todo */}
      <div className="add-todo">
        <div className="input-group">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              language === 'ar' 
                ? 'أضف مهمة جديدة...'
                : 'Add a new task...'
            }
            disabled={isLoading}
          />
          <button 
            className="add-btn"
            onClick={addTodo}
            disabled={!newTodo.trim() || isLoading}
          >
            ➕
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="todo-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {language === 'ar' ? 'الكل' : 'All'} ({stats.total})
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          {language === 'ar' ? 'المعلقة' : 'Pending'} ({stats.pending})
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          {language === 'ar' ? 'المكتملة' : 'Completed'} ({stats.completed})
        </button>
      </div>

      {/* Todo List */}
      <div className="todos-container">
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
        ) : filteredTodos.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✅</span>
            <span>
              {filter === 'all' 
                ? (language === 'ar' ? 'لا توجد مهام' : 'No todos found')
                : filter === 'pending'
                ? (language === 'ar' ? 'لا توجد مهام معلقة' : 'No pending todos')
                : (language === 'ar' ? 'لا توجد مهام مكتملة' : 'No completed todos')
              }
            </span>
            {filter === 'all' && (
              <p>
                {language === 'ar' 
                  ? 'أضف مهمة جديدة للبدء'
                  : 'Add a new task to get started'
                }
              </p>
            )}
          </div>
        ) : (
          <div className="todos-list">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodoText}
                language={language}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {todos.length > 0 && (
        <div className="quick-actions">
          <button 
            className="action-btn"
            onClick={async () => {
              // تحديد جميع المهام كمكتملة
              const pendingTodos = todos.filter(todo => !todo.completed)
              for (const todo of pendingTodos) {
                await toggleTodo(todo.id)
              }
            }}
            disabled={isLoading}
          >
            ✅ {language === 'ar' ? 'تحديد الكل كمكتمل' : 'Mark All Complete'}
          </button>
          <button 
            className="action-btn"
            onClick={async () => {
              // حذف جميع المهام المكتملة
              const completedTodos = todos.filter(todo => todo.completed)
              for (const todo of completedTodos) {
                await deleteTodo(todo.id)
              }
            }}
            disabled={isLoading}
          >
            🗑️ {language === 'ar' ? 'حذف المكتملة' : 'Delete Completed'}
          </button>
        </div>
      )}
    </div>
  )
}

// Todo Item Component
const TodoItem = ({ todo, onToggle, onDelete, onUpdate, language, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    setIsEditing(true)
    setEditText(todo.text)
  }

  const handleSave = () => {
    if (editText.trim() && editText !== todo.text) {
      onUpdate(todo.id, editText)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <button 
          className="todo-checkbox"
          onClick={() => onToggle(todo.id)}
          disabled={isLoading}
        >
          {todo.completed ? '✅' : '⭕'}
        </button>
        
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleSave}
            autoFocus
            className="edit-input"
          />
        ) : (
          <span 
            className="todo-text"
            onDoubleClick={handleEdit}
          >
            {todo.text}
          </span>
        )}
      </div>
      
      <div className="todo-actions">
        <button 
          className="action-btn edit-btn"
          onClick={handleEdit}
          disabled={isLoading}
          title={language === 'ar' ? 'تعديل' : 'Edit'}
        >
          ✏️
        </button>
        <button 
          className="action-btn delete-btn"
          onClick={() => onDelete(todo.id)}
          disabled={isLoading}
          title={language === 'ar' ? 'حذف' : 'Delete'}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default TodoList