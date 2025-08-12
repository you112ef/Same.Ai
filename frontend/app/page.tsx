'use client'

import { useState } from 'react'

export default function HomePage() {
  const [prompt, setPrompt] = useState('make a customer support ticket system with live chat')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      window.location.href = `/chat/new?prompt=${encodeURIComponent(prompt)}`
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ width: '100%', padding: '16px 24px', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '24px', height: '24px', color: 'black' }}>
                <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }} fill="currentColor">
                  <rect x="2" y="2" width="6" height="6" rx="1"/>
                  <rect x="10" y="2" width="6" height="6" rx="1"/>
                  <rect x="18" y="2" width="4" height="6" rx="1"/>
                  <rect x="2" y="10" width="6" height="6" rx="1"/>
                  <rect x="10" y="10" width="6" height="6" rx="1"/>
                  <rect x="18" y="10" width="4" height="6" rx="1"/>
                  <rect x="2" y="18" width="6" height="4" rx="1"/>
                  <rect x="10" y="18" width="6" height="4" rx="1"/>
                  <rect x="18" y="18" width="4" height="4" rx="1"/>
                </svg>
              </div>
              <span style={{ fontSize: '20px', fontWeight: '600', color: 'black' }}>same</span>
            </div>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              padding: '4px', 
              cursor: 'pointer',
              borderRadius: '4px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="m4 16 4 4 4-4"/>
                <path d="m16 4 4 4-4 4"/>
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: '#374151', 
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 13 6-6-6-6"/>
                <path d="M14 6h6"/>
              </svg>
              Careers
            </button>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: '#374151', 
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Docs
            </button>
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: '#374151', 
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Log in
            </button>
            <button style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        {/* Hero Title */}
        <div style={{ marginBottom: '64px', maxWidth: '800px' }}>
          <h1 style={{ 
            fontSize: '72px', 
            fontWeight: 'bold', 
            color: 'black', 
            marginBottom: '24px',
            lineHeight: '1.1',
            margin: '0 0 24px 0'
          }}>
            Make anything
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#6b7280', 
            maxWidth: '400px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Build fullstack web apps by prompting
          </p>
        </div>

        {/* Prompt Input */}
        <div style={{ width: '100%', maxWidth: '600px', marginBottom: '32px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ 
              position: 'relative', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '16px', 
              overflow: 'hidden'
            }}>
              {/* Input Field */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                padding: '24px', 
                paddingBottom: '80px'
              }}>
                <button type="button" style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: '8px', 
                  marginRight: '12px', 
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.42 16.4a2 2 0 0 1-2.83-2.83l7.07-7.07"/>
                  </svg>
                </button>
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="make a customer support ticket system with live chat"
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    fontSize: '18px',
                    outline: 'none',
                    color: 'black'
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
                padding: '24px', 
                backgroundColor: '#f3f4f6'
              }}>
                {/* Model Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    claude-4-sonnet
                  </span>
                  <button type="button" style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: '4px',
                    cursor: 'pointer'
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
                    padding: '12px',
                    cursor: prompt.trim() ? 'pointer' : 'not-allowed',
                    opacity: prompt.trim() ? 1 : 0.5
                  }}
                  disabled={!prompt.trim()}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12 14-7-7 14-2-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tab indicator */}
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          <span style={{ 
            backgroundColor: '#e5e7eb', 
            padding: '4px 12px', 
            borderRadius: '4px', 
            fontSize: '12px', 
            fontWeight: '500'
          }}>
            tab
          </span>
        </div>
      </main>
    </div>
  )
}
