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
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      margin: 0,
      padding: 0
    }}>
      {/* Header */}
      <header style={{ 
        width: '100%', 
        padding: '0 24px', 
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: 'none'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Exact same.new logo */}
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
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#000000',
              letterSpacing: '-0.025em'
            }}>
              same
            </span>
          </div>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            padding: '4px', 
            cursor: 'pointer',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="m4 16 4-4 4 4"/>
              <path d="m16 4 4 4-4 4"/>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6b7280', 
            fontSize: '14px',
            fontWeight: '400',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: 0
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            Careers
          </button>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6b7280', 
            fontSize: '14px',
            fontWeight: '400',
            cursor: 'pointer',
            padding: 0
          }}>
            Docs
          </button>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6b7280', 
            fontSize: '14px',
            fontWeight: '400',
            cursor: 'pointer',
            padding: 0
          }}>
            Log in
          </button>
          <button style={{
            backgroundColor: '#000000',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            fontSize: '14px',
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
        padding: '140px 24px 80px',
        textAlign: 'center'
      }}>
        {/* Hero Title */}
        <div style={{ marginBottom: '64px', maxWidth: '900px' }}>
          <h1 style={{ 
            fontSize: '80px', 
            fontWeight: '700', 
            color: '#000000', 
            marginBottom: '24px',
            lineHeight: '1',
            margin: '0 0 24px 0',
            letterSpacing: '-0.025em'
          }}>
            Make anything
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#6b7280', 
            maxWidth: '500px', 
            margin: '0 auto',
            lineHeight: '1.4',
            fontWeight: '400'
          }}>
            Build fullstack web apps by prompting
          </p>
        </div>

        {/* Prompt Input */}
        <div style={{ width: '100%', maxWidth: '672px', marginBottom: '32px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ 
              position: 'relative', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '16px', 
              border: 'none',
              overflow: 'hidden'
            }}>
              {/* Input Field */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                padding: '20px', 
                paddingBottom: '60px'
              }}>
                <button type="button" style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: '0', 
                  marginRight: '12px', 
                  marginTop: '2px',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    fontSize: '16px',
                    outline: 'none',
                    color: '#000000',
                    resize: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    overflow: 'hidden'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
                
                {/* Tab indicator */}
                <div style={{
                  backgroundColor: '#e5e7eb',
                  color: '#6b7280',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: '500',
                  marginLeft: '12px',
                  marginTop: '2px'
                }}>
                  tab
                </div>
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
                padding: '14px 20px', 
                backgroundColor: '#f5f5f5'
              }}>
                {/* Model Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: '#374151' 
                  }}>
                    claude-4-sonnet
                  </span>
                  <button type="button" style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: '2px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#000000',
                    color: 'white',
                    borderRadius: '50%',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    cursor: prompt.trim() ? 'pointer' : 'not-allowed',
                    opacity: prompt.trim() ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  disabled={!prompt.trim()}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12 14-7-7 14-2-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
