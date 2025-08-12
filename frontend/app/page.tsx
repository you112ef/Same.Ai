'use client'

import { useState } from 'react'

export default function HomePage() {
  const [prompt, setPrompt] = useState('create a booking system for appointments with calendar integration')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      window.location.href = `/chat/new?prompt=${encodeURIComponent(prompt)}`
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        width: '100%', 
        padding: '0 32px', 
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Same.new logo - exact replica */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="1" width="8" height="8" rx="2" fill="currentColor"/>
              <rect x="11" y="1" width="8" height="8" rx="2" fill="currentColor"/>
              <rect x="21" y="1" width="2" height="8" rx="1" fill="currentColor"/>
              <rect x="1" y="11" width="8" height="8" rx="2" fill="currentColor"/>
              <rect x="11" y="11" width="8" height="8" rx="2" fill="currentColor"/>
              <rect x="21" y="11" width="2" height="8" rx="1" fill="currentColor"/>
              <rect x="1" y="21" width="8" height="2" rx="1" fill="currentColor"/>
              <rect x="11" y="21" width="8" height="2" rx="1" fill="currentColor"/>
              <rect x="21" y="21" width="2" height="2" rx="1" fill="currentColor"/>
            </svg>
            <span style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: 'black',
              letterSpacing: '-0.02em'
            }}>
              same
            </span>
          </div>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            padding: '6px', 
            cursor: 'pointer',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="m4 16 4-4 4 4"/>
              <path d="m16 4 4 4-4 4"/>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6b7280', 
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: 0
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            Careers
          </button>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6b7280', 
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: 0
          }}>
            Docs
          </button>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6b7280', 
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: 0
          }}>
            Log in
          </button>
          <button style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '24px',
            border: 'none',
            fontSize: '15px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '120px 32px 80px',
        textAlign: 'center'
      }}>
        {/* Hero Title */}
        <div style={{ marginBottom: '80px', maxWidth: '1000px' }}>
          <h1 style={{ 
            fontSize: '96px', 
            fontWeight: 'bold', 
            color: 'black', 
            marginBottom: '32px',
            lineHeight: '0.9',
            margin: '0 0 32px 0',
            letterSpacing: '-0.02em'
          }}>
            Make anything
          </h1>
          <p style={{ 
            fontSize: '24px', 
            color: '#6b7280', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.5',
            fontWeight: '400'
          }}>
            Build fullstack web apps by prompting
          </p>
        </div>

        {/* Prompt Input */}
        <div style={{ width: '100%', maxWidth: '720px', marginBottom: '24px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ 
              position: 'relative', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '24px', 
              border: '1px solid #e9ecef',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              overflow: 'hidden'
            }}>
              {/* Input Field */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                padding: '20px 24px', 
                paddingBottom: '72px'
              }}>
                <button type="button" style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: '8px', 
                  marginRight: '12px', 
                  color: '#9ca3af',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.42 16.4a2 2 0 0 1-2.83-2.83l7.07-7.07"/>
                  </svg>
                </button>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="create a booking system for appointments with calendar integration"
                  rows={1}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    fontSize: '18px',
                    outline: 'none',
                    color: 'black',
                    resize: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.4',
                    overflow: 'hidden'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>

              {/* Bottom Bar */}
              <div style={{ 
                position: 'absolute', 
                bottom: '0', 
                left: '0', 
                right: '0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px 24px', 
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e9ecef'
              }}>
                {/* Model Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151' 
                  }}>
                    claude-4-sonnet
                  </span>
                  <button type="button" style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  style={{
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '50%',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    cursor: prompt.trim() ? 'pointer' : 'not-allowed',
                    opacity: prompt.trim() ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  disabled={!prompt.trim()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12 14-7-7 14-2-7z"/>
                  </svg>
                </button>
              </div>
              
              {/* Tab indicator */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '24px',
                backgroundColor: '#e5e7eb',
                color: '#6b7280',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                tab
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
