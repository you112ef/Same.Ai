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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5">
        {/* Logo - Exact same.new design */}
        <div className="flex items-center gap-2.5">
          {/* Window-like logo icon */}
          <div className="relative">
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Top windows */}
              <rect x="0" y="0" width="8" height="6" rx="1" fill="white"/>
              <rect x="10" y="0" width="8" height="6" rx="1" fill="white"/>
              {/* Bottom windows */}
              <rect x="0" y="8" width="8" height="6" rx="1" fill="white"/>
              <rect x="10" y="8" width="8" height="6" rx="1" fill="white"/>
              {/* Connection lines */}
              <rect x="8" y="2" width="2" height="1" fill="white"/>
              <rect x="8" y="11" width="2" height="1" fill="white"/>
            </svg>
          </div>
          <span className="text-xl font-medium">same</span>
        </div>
        
        {/* Header Icons */}
        <div className="flex items-center gap-5">
          {/* Monitor Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </button>
          
          {/* Database Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="m3 5 0 14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
              <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
            </svg>
          </button>
          
          {/* Document Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </button>
          
          {/* Grid Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="15" x2="21" y2="15"/>
              <line x1="3" y1="9" x2="5" y2="9"/>
              <line x1="3" y1="15" x2="5" y2="15"/>
            </svg>
          </button>
          
          {/* User Avatar */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
            X
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-8 pt-16">
        <div className="w-full max-w-4xl text-center">
          {/* Title Section */}
          <div className="mb-12">
            <h1 className="text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-5 text-white">
              Make anything
            </h1>
            <p className="text-xl text-gray-400 font-normal leading-relaxed">
              Build fullstack web apps by prompting
            </p>
          </div>

          {/* Input Form */}
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-2xl border border-gray-700 p-1.5 shadow-2xl">
                <div className="flex items-center gap-1">
                  {/* Attachment Button */}
                  <button
                    type="button"
                    className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"/>
                    </svg>
                  </button>
                  
                  {/* Input Field */}
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="make a collaborative whiteboard app wit..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 text-base py-3 px-3 border-none outline-none font-normal"
                  />
                  
                  {/* Right Section */}
                  <div className="flex items-center gap-3 pr-1.5">
                    {/* Model Badge */}
                    <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1.5 text-sm">
                      <span className="text-gray-200 font-medium">Agentic</span>
                      <span className="bg-gray-600 px-1.5 py-0.5 rounded text-xs text-gray-300 font-medium">max</span>
                    </div>
                    
                    {/* Send Button */}
                    <button
                      type="submit"
                      className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
