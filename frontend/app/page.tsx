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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 relative z-10">
        {/* Logo - Exact match from image */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Window-like icon from same.new */}
            <div className="relative">
              <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                <rect x="1" y="2" width="9" height="7" rx="1" fill="white"/>
                <rect x="12" y="2" width="9" height="7" rx="1" fill="white"/>
                <rect x="1" y="11" width="9" height="7" rx="1" fill="white"/>
                <rect x="12" y="11" width="9" height="7" rx="1" fill="white"/>
              </svg>
            </div>
            <span className="text-2xl font-medium">same</span>
          </div>
        </div>
        
        {/* Header Icons - Exact match */}
        <div className="flex items-center gap-5">
          {/* Monitor/Screen Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </button>
          
          {/* Database Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="m3 5 0 14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
              <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
            </svg>
          </button>
          
          {/* Document Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </button>
          
          {/* Sidebar/Menu Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/>
            </svg>
          </button>
          
          {/* User Avatar - Blue X */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
            X
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-8 pt-20">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Main Heading - Exact Typography */}
          <div className="space-y-6">
            <h1 className="text-8xl font-bold tracking-tight leading-tight text-white">
              Make anything
            </h1>
            <p className="text-2xl text-gray-400 font-light">
              Build fullstack web apps by prompting
            </p>
          </div>

          {/* Input Form - Exact Design */}
          <div className="w-full max-w-4xl mx-auto pt-8">
            <form onSubmit={handleSubmit}>
              <div className="relative bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
                <div className="flex items-center p-1">
                  {/* Attachment Icon */}
                  <button
                    type="button"
                    className="flex items-center justify-center w-12 h-12 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"/>
                    </svg>
                  </button>
                  
                  {/* Input Field */}
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 py-4 px-3 text-lg font-normal"
                  />
                  
                  {/* Right Section */}
                  <div className="flex items-center gap-3 pr-3">
                    {/* Model Selector - Exact Design */}
                    <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-200 font-medium">Agentic</span>
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded text-gray-300 font-medium">max</span>
                    </div>
                    
                    {/* Submit Button - Exact Design */}
                    <button
                      type="submit"
                      className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
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
