'use client'

import { useState } from 'react'

export default function HomePage() {
  const [prompt, setPrompt] = useState('make a collaborative whiteboard app wit...')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      window.location.href = `/chat/new?prompt=${encodeURIComponent(prompt)}`
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
          <span className="text-2xl font-medium">same</span>
        </div>
        
        {/* Header Icons */}
        <div className="flex items-center gap-6">
          {/* Monitor Icon */}
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="12" rx="2" ry="2"/>
              <path d="M8 21h8"/>
              <path d="M12 17v4"/>
            </svg>
          </button>
          
          {/* Database Icon */}
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
              <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
            </svg>
          </button>
          
          {/* Document Icon */}
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </button>
          
          {/* Sidebar Icon */}
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="15" x2="21" y2="15"/>
              <line x1="3" y1="9" x2="5" y2="9"/>
              <line x1="3" y1="15" x2="5" y2="15"/>
            </svg>
          </button>
          
          {/* User Avatar */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
            X
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-8 mt-32">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-7xl font-bold tracking-tight leading-none">
              Make anything
            </h1>
            <p className="text-2xl text-gray-400 font-light">
              Build fullstack web apps by prompting
            </p>
          </div>

          {/* Input Form */}
          <div className="w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="flex items-center">
                  {/* Attachment Icon */}
                  <button
                    type="button"
                    className="flex items-center justify-center w-14 h-14 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  
                  {/* Input Field */}
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 py-4 px-2 text-lg"
                    placeholder="make a collaborative whiteboard app wit..."
                  />
                  
                  {/* Right Section */}
                  <div className="flex items-center gap-4 pr-4">
                    {/* Model Selector */}
                    <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-4 py-2">
                      <span className="text-sm text-gray-300 font-medium">Agentic</span>
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded text-gray-400">max</span>
                    </div>
                    
                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
